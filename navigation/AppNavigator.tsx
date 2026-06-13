import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Text, View } from 'react-native';

import { getRegisteredScreens } from './screenRegistry';

const Stack = createNativeStackNavigator();

function EmptyState() {
  return (
    <View className="flex-1 items-center justify-center bg-white px-6">
      <Text className="text-center text-lg font-semibold text-slate-900">No screens found</Text>
      <Text className="mt-2 text-center text-sm text-slate-500">
        Add a default export to a file in the `screens/` folder and it will be registered automatically.
      </Text>
    </View>
  );
}

export function AppNavigator() {
  const screens = getRegisteredScreens();

  return (
    <NavigationContainer theme={DefaultTheme}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {screens.length === 0 ? (
          <Stack.Screen name="Empty" component={EmptyState} options={{ title: 'Screens' }} />
        ) : (
          screens.map((screen) => (
            <Stack.Screen key={screen.name} name={screen.name} component={screen.component} options={screen.options} />
          ))
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
