import type { BinaryOperator, LiteralValue, UnaryOperator } from "./ast";

export type Instruction =
  | { type: "Const"; value: LiteralValue | undefined }
  | { type: "Ident"; name: string }
  | { type: "LoadFormula"; name: string }
  | { type: "Member"; name: string }
  | { type: "Index" }
  | { type: "List"; count: number }
  | { type: "Unary"; operator: UnaryOperator }
  | { type: "Binary"; operator: BinaryOperator }
  | { type: "ToBool" }
  | { type: "CallGlobal"; name: string; argc: number }
  | { type: "CallMethod"; name: string; argc: number }
  | { type: "CallMethodLazy"; name: string; argPrograms: Instruction[][] }
  | { type: "Jump"; offset: number }
  | { type: "JumpIfFalse"; offset: number }
  | { type: "JumpIfTrue"; offset: number };
