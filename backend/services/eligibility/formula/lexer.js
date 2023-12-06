async function getLexer() {
  const chevrotain = await import('chevrotain')

  const createToken = chevrotain.createToken;
  const Lexer = chevrotain.Lexer;


  const AdditionOperator = createToken({
    name: "AdditionOperator",
    pattern: Lexer.NA,
  });
  const Plus = createToken({
    name: "Plus",
    pattern: /\+/,
    categories: AdditionOperator,
  });
  const Minus = createToken({
    name: "Minus",
    pattern: /-/,
    categories: AdditionOperator,
  });

  const MultiplicationOperator = createToken({
    name: "MultiplicationOperator",
    pattern: Lexer.NA,
  });
  const Multi = createToken({
    name: "Multi",
    pattern: /\*/,
    categories: MultiplicationOperator,
  });
  const Div = createToken({
    name: "Div",
    pattern: /\//,
    categories: MultiplicationOperator,
  });

  const LParen = createToken({name: "LParen", pattern: /\(/});
  const RParen = createToken({name: "RParen", pattern: /\)/});
  const LSquare = createToken({ name: "LSquare", pattern: /\[/ });
  const RSquare = createToken({ name: "RSquare", pattern: /]/ });

  const NumberLiteral = createToken({
    name: "NumberLiteral",
    pattern: /[0-9]+[.]?[0-9]*([eE][+\-][0-9]+)?/,
  });

  const StringLiteral = createToken({
    name: 'StringLiteral',
    pattern: /"(\\"|[^"])*"/
  });

  const BooleanLiteral = createToken({
    name: 'BooleanLiteral',
    pattern: /true|false/
  });


  const Power = createToken({name: "PowerFunc", pattern: /\*\*/});
  const Comma = createToken({name: "Comma", pattern: /,/});

  const And = createToken({name: "And", pattern: /&&/});
  const Or = createToken({name: "Or", pattern: /\|\|/});

  const ComparisonOperator = createToken({
    name: "ComparisonOperator",
    pattern: Lexer.NA,
  });
  const Gt = createToken({name: 'GtOp', pattern: />/, categories: ComparisonOperator});
  const Eq = createToken({name: 'EqOp', pattern: /==/, categories: ComparisonOperator});
  const Lt = createToken({name: 'LtOp', pattern: /</, categories: ComparisonOperator});
  const Ne = createToken({name: 'NeqOp', pattern: /!=/, categories: ComparisonOperator});
  const Gte = createToken({name: 'GteOp', pattern: />=/, categories: ComparisonOperator});
  const Lte = createToken({name: 'LteOp', pattern: /<=/, categories: ComparisonOperator});

  const Function = createToken({
    name: 'Function',
    pattern: /[A-Za-z_]+[A-Za-z_0-9]*\(/
  });

  const Variable = createToken({
    name: 'Variable',
    pattern: /[a-zA-Z_][a-zA-Z0-9_.]*/,
  });

// marking WhiteSpace as 'SKIPPED' makes the lexer skip it.
  const WhiteSpace = createToken({
    name: "WhiteSpace",
    pattern: /\s+/,
    group: Lexer.SKIPPED,
  });


  const allTokens = {
    WhiteSpace, // whitespace is normally very common so it should be placed first to speed up the lexer's performance
    Plus,
    Minus,
    Multi,
    Div,
    Gte, Lte, Gt, Lt, Eq, Ne,
    LParen,
    RParen,
    LSquare,
    RSquare,
    NumberLiteral,
    StringLiteral,
    BooleanLiteral,
    AdditionOperator,
    MultiplicationOperator,
    ComparisonOperator,
    Power,
    Comma,
    And,
    Or,
    Function,
    Variable,
  };
  const FormulaLexer = new Lexer(Object.values(allTokens));
  return {allTokens, FormulaLexer, chevrotain};
}

module.exports = {
  getLexer
}