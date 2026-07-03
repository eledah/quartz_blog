import { describe, it, expect } from "vitest";
import { compile, resolvePropertyValue } from "../src/compiler";

describe("compiler", () => {
  it("compiles simple expressions into expected instruction types", () => {
    const compiled = compile("1 + 2");
    const types = compiled.instructions.map((instruction) => instruction.type);
    expect(types).toEqual(["Const", "Const", "Binary"]);
  });

  it("emits short-circuit jumps for && and ||", () => {
    const andInstructions = compile("a && b").instructions;
    const andTypes = andInstructions.map((instruction) => instruction.type);
    expect(andTypes).toContain("JumpIfFalse");
    expect(andTypes).toContain("Jump");

    const orInstructions = compile("a || b").instructions;
    const orTypes = orInstructions.map((instruction) => instruction.type);
    expect(orTypes).toContain("JumpIfTrue");
    expect(orTypes).toContain("Jump");
  });

  it("compiles if() with conditional jumps", () => {
    const types = compile("if(a, 1, 2)").instructions.map((instruction) => instruction.type);
    expect(types).toContain("JumpIfFalse");
    expect(types).toContain("Jump");
  });

  it("compiles formula member access into LoadFormula", () => {
    const instructions = compile("formula.score").instructions;
    expect(instructions).toHaveLength(1);
    expect(instructions[0]).toEqual({ type: "LoadFormula", name: "score" });
  });

  it("compiles function calls into CallGlobal", () => {
    const instructions = compile('contains(tags, "foo")').instructions;
    const last = instructions[instructions.length - 1];
    expect(last).toEqual({ type: "CallGlobal", name: "contains", argc: 2 });
  });

  it("compiles method calls into CallMethod", () => {
    const instructions = compile("name.lower()").instructions;
    const last = instructions[instructions.length - 1];
    expect(last).toEqual({ type: "CallMethod", name: "lower", argc: 0 });
  });

  it("compiles lazy methods into CallMethodLazy with argPrograms", () => {
    const instructions = compile("[1, 2, 3].filter(value > 1)").instructions;
    const last = instructions[instructions.length - 1];
    expect(last).toHaveProperty("type", "CallMethodLazy");
    expect(last).toHaveProperty("name", "filter");
    expect(last).toHaveProperty("argPrograms");
    const lazy = last as { type: string; name: string; argPrograms: unknown[][] };
    expect(lazy.argPrograms).toHaveLength(1);
    expect(lazy.argPrograms[0]!.length).toBeGreaterThan(0);
  });

  it("compiles map as CallMethodLazy", () => {
    const instructions = compile("[1, 2].map(value * 2)").instructions;
    const last = instructions[instructions.length - 1];
    expect(last).toHaveProperty("type", "CallMethodLazy");
    expect(last).toHaveProperty("name", "map");
  });

  it("does not compile non-lazy methods as CallMethodLazy", () => {
    const instructions = compile("name.upper()").instructions;
    const last = instructions[instructions.length - 1];
    expect(last).toHaveProperty("type", "CallMethod");
    expect(last).not.toHaveProperty("argPrograms");
  });

  it("returns undefined for non-string property paths", () => {
    const ctx = {
      note: {},
      file: {
        name: "",
        basename: "",
        path: "",
        folder: "",
        ext: "",
        tags: [],
        links: [],
      },
      formula: {},
    };
    expect(resolvePropertyValue(42 as unknown as string, ctx)).toBeUndefined();
    expect(resolvePropertyValue({} as unknown as string, ctx)).toBeUndefined();
  });
});
