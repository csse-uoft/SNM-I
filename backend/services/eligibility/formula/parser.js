const {getLexer} = require('./lexer');

async function getParser() {
  const {allTokens, FormulaLexer, chevrotain} = await getLexer();


// Note that this is a Pure grammar, it only describes the grammar
// Not any actions (semantics) to perform during parsing.
  class FormulaParser extends chevrotain.CstParser {
    constructor() {
      super(allTokens);

      const $ = this;

      $.RULE("expression", () => {
        $.SUBRULE($.logicalOrExpression);
      });

      // lowest precedence thus it is first in the rule chain
      $.RULE("logicalOrExpression", () => {
        $.SUBRULE($.logicalAndExpression, {LABEL: 'lhs'});
        $.MANY(() => {
          $.CONSUME(allTokens.Or);
          $.SUBRULE2($.logicalAndExpression, {LABEL: "rhs"});
        })
      });

      $.RULE("logicalAndExpression", () => {
        $.SUBRULE($.comparisonExpression, {LABEL: 'lhs'});
        $.MANY(() => {
          $.CONSUME(allTokens.And);
          $.SUBRULE2($.comparisonExpression, {LABEL: "rhs"});
        })
      });

      $.RULE("comparisonExpression", () => {
        $.SUBRULE($.additionExpression, {LABEL: 'lhs'});
        $.MANY(() => {
          $.CONSUME(allTokens.ComparisonOperator);
          $.SUBRULE2($.additionExpression, {LABEL: "rhs"});
        })
      });

      $.RULE("additionExpression", () => {
        $.SUBRULE($.multiplicationExpression, {LABEL: "lhs"});
        $.MANY(() => {
          // consuming 'AdditionOperator' will consume either Plus or Minus as they are subclasses of AdditionOperator
          $.CONSUME(allTokens.AdditionOperator);
          //  the index "2" in SUBRULE2 is needed to identify the unique position in the grammar during runtime
          $.SUBRULE2($.multiplicationExpression, {LABEL: "rhs"});
        });
      });

      $.RULE("multiplicationExpression", () => {
        $.SUBRULE($.powerExpression, {LABEL: "lhs"});
        $.MANY(() => {
          $.CONSUME(allTokens.MultiplicationOperator);
          //  the index "2" in SUBRULE2 is needed to identify the unique position in the grammar during runtime
          $.SUBRULE2($.powerExpression, {LABEL: "rhs"});
        });
      });

      $.RULE("powerExpression", () => {
        $.SUBRULE($.atomicExpression, {LABEL: "lhs"});
        $.MANY(() => {
          $.CONSUME(allTokens.Power);
          //  the index "2" in SUBRULE2 is needed to identify the unique position in the grammar during runtime
          $.SUBRULE2($.atomicExpression, {LABEL: "rhs"});
        });
      });

      $.RULE("atomicExpression", () =>
        $.OR([
          // parenthesisExpression has the highest precedence and thus it appears
          // in the "lowest" leaf in the expression ParseTree.
          {ALT: () => $.SUBRULE($.parenthesisExpression)},
          {ALT: () => $.CONSUME(allTokens.NumberLiteral)},
          {ALT: () => $.CONSUME(allTokens.Variable)},
          {ALT: () => $.SUBRULE($.functionExpression)},
        ])
      );

      $.RULE("parenthesisExpression", () => {
        $.CONSUME(allTokens.LParen);
        $.SUBRULE($.expression);
        $.CONSUME(allTokens.RParen);
      });

      $.RULE('functionExpression', () => {
        $.CONSUME(allTokens.Function, {LABEL: 'functionName'});
        // console.log('functionName', functionName);
        $.SUBRULE($.argumentsExpression, {LABEL: 'arguments'});
        $.CONSUME(allTokens.RParen);
      });

      $.RULE('argumentsExpression', () => {
        $.OPTION(() => {
          $.SUBRULE($.expression, {LABEL: 'lhs'});
          $.MANY(() => {
            $.CONSUME1(allTokens.Comma);
            $.SUBRULE2($.expression, {LABEL: 'rhs'});
          });
        });
      });


      // very important to call this after all the rules have been defined.
      // otherwise the parser may not work correctly as it will lack information
      // derived during the self analysis phase.
      this.performSelfAnalysis();
    }
  }

  return {allTokens, FormulaLexer, chevrotain, FormulaParser};
}

module.exports = {
  getParser,
}