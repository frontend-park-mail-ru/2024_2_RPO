import * as ts from "typescript";
import * as fs from "fs";
import path from "path";

const cwd = ".";

type CompilationResult = SuccessCompilationResult | ErrorCompilationResult;

interface SuccessCompilationResult {
  status: "ok";
  result: string;
}

interface ErrorCompilationResult {
  status: "error";
  errors: string[];
}

export function compileTs(tsFileToCompile: string): CompilationResult {
  const configPath = ts.findConfigFile(
    "src",
    ts.sys.fileExists,
    "tsconfig.json"
  );

  if (!configPath) {
    throw new Error("Не найден файл tsconfig.json в текущей директории.");
  }

  const configFile = ts.readConfigFile(configPath, ts.sys.readFile);
  if (configFile.error) {
    const errorMessage = ts.flattenDiagnosticMessageText(
      configFile.error.messageText,
      "\n"
    );
    throw new Error(`Ошибка при чтении tsconfig.json: ${errorMessage}`);
  }

  const parsedCommandLine = ts.parseJsonConfigFileContent(
    configFile.config,
    ts.sys,
    path.dirname(configPath)
  );

  if (parsedCommandLine.errors.length > 0) {
    const errorMessages = parsedCommandLine.errors
      .map((diag) => ts.flattenDiagnosticMessageText(diag.messageText, "\n"))
      .join("\n");
    throw new Error(`Ошибки при парсинге tsconfig.json:\n${errorMessages}`);
  }

  const compilerOptions = parsedCommandLine.options;

  const host: ts.CompilerHost = {
    getSourceFile: (fileName, languageVersion) => {
      const fullPath = path.resolve(cwd, fileName);
      if (!fs.existsSync(fullPath)) {
        return undefined;
      }
      const sourceText = fs.readFileSync(fullPath, "utf8");
      return ts.createSourceFile(fullPath, sourceText, languageVersion);
    },
    writeFile: () => {
      /* Не требуется, так как будем хранить в памяти */
    },
    getDefaultLibFileName: (options) => ts.getDefaultLibFilePath(options),
    useCaseSensitiveFileNames: () => ts.sys.useCaseSensitiveFileNames,
    getCanonicalFileName: (fileName) =>
      ts.sys.useCaseSensitiveFileNames ? fileName : fileName.toLowerCase(),
    getCurrentDirectory: () => cwd,
    getNewLine: () => ts.sys.newLine,
    fileExists: ts.sys.fileExists,
    readFile: ts.sys.readFile,
    directoryExists: ts.sys.directoryExists,
    getDirectories: ts.sys.getDirectories,
  };

  const program = ts.createProgram([tsFileToCompile], compilerOptions, host);
  const emitResult = program.emit();

  const allDiagnostics = ts
    .getPreEmitDiagnostics(program)
    .concat(emitResult.diagnostics);

  if (allDiagnostics.length > 0) {
    const errorMessages = allDiagnostics
      .map((diagnostic) => {
        if (diagnostic.file) {
          const { line, character } =
            diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start!);
          const message = ts.flattenDiagnosticMessageText(
            diagnostic.messageText,
            "\n"
          );
          return `${diagnostic.file.fileName} (${line + 1},${
            character + 1
          }): ${message}`;
        } else {
          return ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n");
        }
      })
      .join("\n");
    throw new Error(`Ошибка при компиляции:\n${errorMessages}`);
  }

  const sourceFile = program.getSourceFile(tsFileToCompile);
  if (!sourceFile) {
    throw new Error(`Не удалось найти исходный файл: ${tsFileToCompile}`);
  }

  const output: { [fileName: string]: string } = {};

  const emitHost: ts.CompilerHost = {
    ...host,
    writeFile: (fileName, contents) => {
      output[fileName] = contents;
    },
  };

  program.emit(undefined, (fileName, contents) => {
    output[fileName] = contents;
  });

  const jsFileName = tsFileToCompile
    .replace(/\.ts$/, ".js")
    .replace("\\", "/")
    .replace("\\", "/")
    .replace("\\", "/")
    .replace("\\", "/")
    .replace("\\", "/")
    .replace("\\", "/")
    .replace("\\", "/"); //TODO убрать это позорище

  const compiledJs = output[jsFileName];

  if (!compiledJs) {
    return {
      status: "error",
      errors: ["Internal error #4343"], // Компилятор не писал в файл, в который должен был
    };
  }

  return { status: "ok", result: compiledJs };
}
