import type { Span } from "./tokens";

export enum DiagnosticSeverity {
  Error = "error",
  Warning = "warning",
  Info = "info",
}

export class CompilerError extends Error {
  public readonly span: Span;
  public readonly severity: DiagnosticSeverity;

  constructor(
    message: string,
    span: Span,
    severity: DiagnosticSeverity = DiagnosticSeverity.Error,
  ) {
    super(message);
    this.name = "CompilerError";
    this.span = span;
    this.severity = severity;
  }
}
