import type { NativeStackNavigationOptions } from '@react-navigation/native-stack';
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
    .replace(/\b\w/g, (char) => char.toUpperCase()) ?? name;
}

import * as ScreenModule1 from '../screens/HomeScreen';

const screenEntries: ScreenEntry[] = [
  { name: "HomeScreen", module: ScreenModule1 },
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
