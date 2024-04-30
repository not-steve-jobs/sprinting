import path from 'path';
import fs from 'fs';
import {EntitySchema} from 'typeorm';

export function importClassesFromDirectories(directory: string, formats = ['.js', '.ts']): Function[] {
  function loadFileClasses(exported: any, allLoaded: Function[]) {
    if (typeof exported === 'function' || exported instanceof EntitySchema) {
      allLoaded.push(exported);
    } else if (Array.isArray(exported)) {
      exported.forEach((i: any) => loadFileClasses(i, allLoaded));
    } else if (typeof exported === 'object' && exported !== null) {
      Object.keys(exported).forEach((key) => loadFileClasses(exported[key], allLoaded));
    }
    return allLoaded;
  }

  const allFiles: string[] = fs.readdirSync(path.normalize(directory));

  const dirs = allFiles
    .filter((file) => {
      const dtsExtension = file.substring(file.length - 5, file.length);
      return formats.indexOf(path.extname(file)) !== -1 && dtsExtension !== '.d.ts';
    })
    .map((file) => require(path.resolve(directory + file)));

  return loadFileClasses(dirs, []);
}
