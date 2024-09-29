import * as ts from "typescript";
import * as fs from "fs";
import path from "path";
import { execSync } from "child_process";

type CompilationResult = SuccessCompilationResult | ErrorCompilationResult;

interface SuccessCompilationResult {
  status: "ok";
}

interface ErrorCompilationResult {
  status: "error";
  errors: string[];
}

const buildDir = "build";
const sourceDir = "src";

/** Скомпилировать ts
 * @returns true, если компиляция успешна, иначе false
 */
export function compileTs(): boolean {
  if (fs.existsSync(buildDir))
    fs.rmSync(buildDir, { recursive: true, force: true });

  try {
    execSync(`tsc --outDir ../${buildDir}`, {
      stdio: "inherit",
      cwd: sourceDir,
    });
  } catch (error) {
    return false;
  }

  return true;
}
