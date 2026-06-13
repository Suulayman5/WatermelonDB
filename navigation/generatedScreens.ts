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

import * as ScreenModule1 from '../screens/DummyScreen';
import * as ScreenModule2 from '../screens/HomeScreen';

const screenEntries: ScreenEntry[] = [
  { name: "DummyScreen", module: ScreenModule1 },
  { name: "HomeScreen", module: ScreenModule2 },
];

const resolvedScreens = screenEntries
  .map<RegisteredScreen | null>(({ name, module }) => {
    if (!module.default) {
      return null;
    }

    const routeName = module.routeName ?? name;

    return {
      name: routeName,
      component: module.default,
      // options,
    };
  })
  .filter((screen): screen is RegisteredScreen => screen !== null);

export const registeredScreens = resolvedScreens.sort((left, right) => left.name.localeCompare(right.name));
