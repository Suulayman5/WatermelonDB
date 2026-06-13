import { readdirSync, statSync, writeFileSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

const projectRoot = process.cwd();
const screensDir = join(projectRoot, 'screens');
const outputFile = join(projectRoot, 'navigation', 'generatedScreens.ts');

function walk(dir) {
  return readdirSync(dir).flatMap((entry) => {
    const absolutePath = join(dir, entry);
    const stats = statSync(absolutePath);

    if (stats.isDirectory()) {
      return walk(absolutePath);
    }

    if (!/\.(ts|tsx|js|jsx)$/.test(entry) || entry.endsWith('.d.ts')) {
      return [];
    }

    return [absolutePath];
  });
}

function toRouteName(filePath) {
  return relative(screensDir, filePath).replace(/\.(ts|tsx|js|jsx)$/, '').split(sep).join('/');
}

const screenFiles = walk(screensDir).sort((left, right) => left.localeCompare(right));

const imports = screenFiles
  .map((filePath, index) => {
    const importName = `ScreenModule${index + 1}`;
    const importPath = `../screens/${relative(screensDir, filePath).replace(/\.(ts|tsx|js|jsx)$/, '').split(sep).join('/')}`;
    return `import * as ${importName} from '${importPath}';`;
  })
  .join('\n');

const screenEntries = screenFiles
  .map((filePath, index) => {
    const importName = `ScreenModule${index + 1}`;
    const name = toRouteName(filePath);
    return `  { name: ${JSON.stringify(name)}, module: ${importName} },`;
  })
  .join('\n');

const fileContents = `import type { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import type { ComponentType } from 'react';

type ScreenModuleLike = {
  default: ComponentType<any>;
  options?: NativeStackNavigationOptions;
  routeName?: string;
  title?: string;
};

type RegisteredScreen = {
  name: string;
  component: ComponentType<any>;
  options?: NativeStackNavigationOptions;
};

type ScreenEntry = {
  name: string;
  module: ScreenModuleLike;
};

function humanizeRouteName(name: string) {
  return name
    .split('/')
    .pop()
    ?.replace(/[-_]/g, ' ')
    .replace(/\\b\\w/g, (char) => char.toUpperCase()) ?? name;
}

${imports}

const screenEntries: ScreenEntry[] = [
${screenEntries}
];

const resolvedScreens = screenEntries
  .map<RegisteredScreen | null>(({ name, module }) => {
    if (!module.default) {
      return null;
    }

    const routeName = module.routeName ?? name;
    const options = module.options ?? {
      title: module.title ?? humanizeRouteName(routeName),
    };

    return {
      name: routeName,
      component: module.default,
      options,
    };
  })
  .filter((screen): screen is RegisteredScreen => screen !== null);

export const registeredScreens = resolvedScreens.sort((left, right) => left.name.localeCompare(right.name));
`;

writeFileSync(outputFile, fileContents);
