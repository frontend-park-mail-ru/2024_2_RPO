import * as fs from 'fs';
import { execSync } from 'child_process';

const buildDir = 'build';
const sourceDir = 'src';

/** Скомпилировать ts
 * @returns true, если компиляция успешна, иначе false
 */
export function compileTs(): boolean {
  if (fs.existsSync(buildDir)) {
    fs.rmSync(buildDir, { recursive: true, force: true });
  }

  try {
    execSync(`tsc --outDir ../${buildDir}`, {
      stdio: 'inherit',
      cwd: sourceDir,
    });
  } catch {
    return false;
  }

  return true;
}
