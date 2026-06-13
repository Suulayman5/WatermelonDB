import type { ComponentType } from 'react';
import type { NativeStackNavigationOptions } from '@react-navigation/native-stack';

import { registeredScreens } from './generatedScreens';

export type ScreenModuleLike = {
  default: ComponentType<any>;
  options?: NativeStackNavigationOptions;
  routeName?: string;
  title?: string;
};

export type RegisteredScreen = {
  name: string;
  component: ComponentType<any>;
  options?: NativeStackNavigationOptions;
};

export function getRegisteredScreens(): RegisteredScreen[] {
  return registeredScreens;
}
