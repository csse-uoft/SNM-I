const {getParser} = require("./parser");

// ----------------- Interpreter -----------------
async function getInterpreter() {
  const {FormulaParser, FormulaLexer, chevrotain, allTokens} = await getParser();

  const parser = new FormulaParser([]);
  const BaseCstVisitor = parser.getBaseCstVisitorConstructor();
  const tokenMatcher = chevrotain.tokenMatcher;

  class FormulaInterpreter extends BaseCstVisitor {
    /**
     * @param globals
     */
    constructor(globals) {
      super();
      // This helper will detect any missing or redundant methods on this visitor
      this.validateVisitor();

      // Stores variables and functions
      this.globals = globals || {};
    }

    expression(ctx) {
      return this.visit(ctx.logicalOrExpression);
    }

    logicalOrExpression(ctx) {
      let result = this.visit(ctx.lhs);

      // "rhs" key may be undefined as the grammar defines it as optional (MANY === zero or more).
      if (ctx.rhs) {
        ctx.rhs.forEach((rhsOperand, idx) => {
          // there will be one operator for each rhs operand
          let rhsValue = this.visit(rhsOperand);
          result = result || rhsValue;
        });
      }

      return result;
    }

    logicalAndExpression(ctx) {
      let result = this.visit(ctx.lhs);

      // "rhs" key may be undefined as the grammar defines it as optional (MANY === zero or more).
      if (ctx.rhs) {
        ctx.rhs.forEach((rhsOperand, idx) => {
          // there will be one operator for each rhs operand
          let rhsValue = this.visit(rhsOperand);
          result = result && rhsValue;
        });
      }

      return result;
    }

    comparisonExpression(ctx) {
      let result = this.visit(ctx.lhs);

      // "rhs" key may be undefined as the grammar defines it as optional (MANY === zero or more).
      if (ctx.rhs) {
        ctx.rhs.forEach((rhsOperand, idx) => {
          // there will be one operator for each rhs operand
          let rhsValue = this.visit(rhsOperand);
          let operator = ctx.ComparisonOperator[idx];

          if (tokenMatcher(operator, allTokens.Lt)) {
            result = result < rhsValue;
          } else if (tokenMatcher(operator, allTokens.Lte)) {
            result = result <= rhsValue;
          } else if (tokenMatcher(operator, allTokens.Gt)) {
            result = result > rhsValue;
          } else if (tokenMatcher(operator, allTokens.Gte)) {
            result = result >= rhsValue;
          } else if (tokenMatcher(operator, allTokens.Ne)) {
            result = result !== rhsValue;
          } else if (tokenMatcher(operator, allTokens.Eq)) {
            result = result === rhsValue;
          }
        });
      }

      return result;
    }

    additionExpression(ctx) {
      let result = this.visit(ctx.lhs);

      // "rhs" key may be undefined as the grammar defines it as optional (MANY === zero or more).
      if (ctx.rhs) {
        ctx.rhs.forEach((rhsOperand, idx) => {
          // there will be one operator for each rhs operand
          let rhsValue = this.visit(rhsOperand);
          let operator = ctx.AdditionOperator[idx];

          if (tokenMatcher(operator, allTokens.Plus)) {
            result += rhsValue;
          } else {
            // Minus
            result -= rhsValue;
          }
        });
      }

      return result;
    }

    multiplicationExpression(ctx) {
      let result = this.visit(ctx.lhs);

      // "rhs" key may be undefined as the grammar defines it as optional (MANY === zero or more).
      if (ctx.rhs) {
        ctx.rhs.forEach((rhsOperand, idx) => {
          // there will be one operator for each rhs operand
          let rhsValue = this.visit(rhsOperand);
          let operator = ctx.MultiplicationOperator[idx];

          if (tokenMatcher(operator, allTokens.Multi)) {
            result *= rhsValue;
          } else {
            // Division
            result /= rhsValue;
          }
        });
      }

      return result;
    }

    powerExpression(ctx) {
      let result = this.visit(ctx.lhs);

      // "rhs" key may be undefined as the grammar defines it as optional (MANY === zero or more).
      if (ctx.rhs) {
        ctx.rhs.forEach((rhsOperand, idx) => {
          // there will be one operator for each rhs operand
          let rhsValue = this.visit(rhsOperand);
          result = result ** rhsValue;
        });
      }

      return result;
    }

    atomicExpression(ctx) {
      if (ctx.parenthesisExpression) {
        // passing an array to "this.visit" is equivalent
        // to passing the array's first element
        return this.visit(ctx.parenthesisExpression);
      } else if (ctx.NumberLiteral) {
        // If a key exists on the ctx, at least one element is guaranteed
        return parseInt(ctx.NumberLiteral[0].image, 10);
      } else if (ctx.Variable) {
        return this.globals[ctx.Variable[0].image];
      } else if (ctx.functionExpression) {
        return this.visit(ctx.functionExpression);
      }
    }
    parenthesisExpression(ctx) {
      // The ctx will also contain the parenthesis tokens, but we don't care about those
      // in the context of calculating the result.
      return this.visit(ctx.expression);
    }

    functionExpression(ctx) {
      const functionName = ctx.functionName[0].image.slice(0, -1);
      const args = this.visit(ctx.arguments);
      if (this.globals[functionName] == null) {
        throw new Error(`Function '${functionName}' does not exist.`)
      }
      return this.globals[functionName](...args);
    }

    argumentsExpression(ctx) {
      let result = [this.visit(ctx.lhs)];

      // "rhs" key may be undefined as the grammar defines it as optional (MANY === zero or more).
      if (ctx.rhs) {
        ctx.rhs.forEach((rhsOperand) => {
          // there will be one operator for each rhs operand
          let rhsValue = this.visit(rhsOperand);
          result.push(rhsValue);
        });
      }
      return result;
    }

  }

  return {
    lexer: FormulaLexer,
    parser: FormulaParser,
    visitor: FormulaInterpreter,
  };
}


let lexer, parser, visitor;
async function getEligibilityFormulaEvaluator() {
  if (!visitor) {
    const intepretor = await getInterpreter();
    lexer = intepretor.lexer;
    parser = intepretor.parser;
    visitor = intepretor.visitor;
  }

  return class EligibilityFormulaEvaluator {

    constructor(globals) {
      this.parser = new parser([], { outputCst: true });
      this.visitor = new visitor(globals);
      this.globals = globals;

    }

    /**
     * @param {string} inputText
     */
    evaluateFormula(inputText) {
      const lexResult = lexer.tokenize(inputText);
      this.parser.input = lexResult.tokens;

      // Automatic CST created when parsing
      const cst = this.parser.expression();
      if (this.parser.errors.length > 0) {
        throw Error(
          "Sad sad panda, parsing errors detected!\n" +
          this.parser.errors[0].message,
        );
      }

      // Visit
      const ast = this.visitor.visit(cst);
      return ast;
    }

  }

}

// Usage
(async function() {
  const EligibilityFormulaEvaluator = await getEligibilityFormulaEvaluator();
  const evaluator = new EligibilityFormulaEvaluator({a: 123, ab: (a, b) => a * b});
  console.log(evaluator.evaluateFormula('a+1 + ab(1,2)'))
})();