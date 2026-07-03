import { FilterNode } from '../types.js';
import 'preact';
import '@quartz-community/types';

type Span = {
    start: number;
    end: number;
};

type LiteralValue = string | number | boolean | null;
type UnaryOperator = "!" | "-";
type BinaryOperator = "+" | "-" | "*" | "/" | "%" | "==" | "!=" | ">" | "<" | ">=" | "<=" | "&&" | "||";
type BaseNode = {
    type: string;
    span: Span;
};
type LiteralExpression = BaseNode & {
    type: "Literal";
    value: LiteralValue;
};
type IdentifierExpression = BaseNode & {
    type: "Identifier";
    name: string;
};
type UnaryExpression = BaseNode & {
    type: "Unary";
    operator: UnaryOperator;
    argument: Expression;
};
type BinaryExpression = BaseNode & {
    type: "Binary";
    operator: BinaryOperator;
    left: Expression;
    right: Expression;
};
type CallExpression = BaseNode & {
    type: "Call";
    callee: Expression;
    args: Expression[];
};
type MemberExpression = BaseNode & {
    type: "Member";
    object: Expression;
    property: string;
};
type IndexExpression = BaseNode & {
    type: "Index";
    object: Expression;
    index: Expression;
};
type ListExpression = BaseNode & {
    type: "List";
    elements: Expression[];
};
type Expression = LiteralExpression | IdentifierExpression | UnaryExpression | BinaryExpression | CallExpression | MemberExpression | IndexExpression | ListExpression;

type Instruction = {
    type: "Const";
    value: LiteralValue | undefined;
} | {
    type: "Ident";
    name: string;
} | {
    type: "LoadFormula";
    name: string;
} | {
    type: "Member";
    name: string;
} | {
    type: "Index";
} | {
    type: "List";
    count: number;
} | {
    type: "Unary";
    operator: UnaryOperator;
} | {
    type: "Binary";
    operator: BinaryOperator;
} | {
    type: "ToBool";
} | {
    type: "CallGlobal";
    name: string;
    argc: number;
} | {
    type: "CallMethod";
    name: string;
    argc: number;
} | {
    type: "CallMethodLazy";
    name: string;
    argPrograms: Instruction[][];
} | {
    type: "Jump";
    offset: number;
} | {
    type: "JumpIfFalse";
    offset: number;
} | {
    type: "JumpIfTrue";
    offset: number;
};

type EvalContext = {
    note: Record<string, unknown>;
    file: {
        name: string;
        basename: string;
        path: string;
        folder: string;
        ext: string;
        tags: string[];
        links: string[];
        embeds?: string[];
        properties?: Record<string, unknown>;
        created?: string | Date;
        modified?: string | Date;
        ctime?: Date;
        mtime?: Date;
        size?: number;
    };
    formula: Record<string, unknown>;
    self?: {
        file: {
            name: string;
            path: string;
            folder: string;
            ext: string;
        };
    };
    _lambdaValue?: unknown;
    _fileLookup?: Map<string, EvalContext["file"]>;
};
declare function resolvePropertyValue(path: string, context: EvalContext): unknown;

type CompiledExpression = {
    ast: Expression;
    instructions: Instruction[];
};

declare function compile(expression: string): CompiledExpression;
declare function evaluate(expression: string, context: EvalContext): unknown;
declare function evaluateFilter(node: FilterNode | undefined, context: EvalContext): boolean;

export { type CompiledExpression, type EvalContext, compile, evaluate, evaluateFilter, resolvePropertyValue };
