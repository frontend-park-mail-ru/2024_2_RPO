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

export const compileTs = (
  fileName: string,
  options: ts.CompilerOptions
): CompilationResult => {
  const CompilerOptions: ts.CompilerOptions = {
    ...options,
  };

  console.log("FILE NAME: ", fileName);
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
  let program = ts.createProgram([fileName], options, host); // создаем экземпляр программы
  let emit_program = program.emit(); // генерирует Js и объявленные файлы, т.к. функция не принимает аргументы, то js генерится для всех файлов программы
  console.log("EMITTED PROGRAM: ", emit_program);

  let Diagnostics = ts
    .getPreEmitDiagnostics(program)
    .concat(emit_program.diagnostics); // getPreEmitDiagnostics - все диагностические сообщения до генерации js,
  // emit_programm.diagnostics - послу и все это конкатим в один массив

  Diagnostics.forEach((diagnostic) => {
    if (diagnostic.file) {
      let { line, character } = ts.getLineAndCharacterOfPosition(
        diagnostic.file,
        diagnostic.start!
      );
      let message = ts.flattenDiagnosticMessageText(
        diagnostic.messageText,
        "\n"
      );

      return {
        status: "error",
        result: [
          `${diagnostic.file.fileName} ${line + 1}, ${
            character + 1
          }: ${message}`,
        ],
      };
    } else {
      let message = ts.flattenDiagnosticMessageText(
        diagnostic.messageText,
        "\n"
      );
      console.log(`${message}`);
    }
  });
  const output: string[] = [];

  if (emit_program.emittedFiles.length > 0) {
    emit_program.emittedFiles.forEach((file) => {
      const content = fs.readFileSync(file, "utf-8");
      output.push(content);
    });
  }

  const compiledJsFile = fileName.replace(/\.ts$/, ".js");
  const compiledJs = output[0]; //TODO checkout

  if (!compiledJs) {
    throw new Error("Не удалось найти скомпилированный файл.");
  }

  return {
    status: "ok",
    result: compiledJs,
  };
};
