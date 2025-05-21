import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { RootStackParamList } from '../types';
import WelcomeScreen from '../screens/WelcomeScreen/WelcomeScreen';
import LoginScreen from '../screens/LoginScreen/LoginScreen';
import ProfileScreen from '../screens/ProfileScreen/ProfileScreen';
import BottomNavigator from './BottomNavigator';

import { getLocalStorageData } from '../utils/Storage';
import STORAGE_KEYS from '../utils/Constants';
import Toast from 'react-native-toast-message';

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  const [initialRoute, setInitialRoute] = useState<string | null>(null);

  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await getLocalStorageData(STORAGE_KEYS.token);
        setInitialRoute(token ? 'HomeScreen' : 'Welcome');
      } catch (error) {
        console.error('Error checking token:', error);
        setInitialRoute('Welcome');
      }
    };

    checkToken();
  }, []);

  if (!initialRoute) return null;

  return (
    <NavigationContainer>
      <SafeAreaProvider>
        <Stack.Navigator initialRouteName={initialRoute} screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="HomeScreen" component={BottomNavigator} />
          <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
        </Stack.Navigator>
        <Toast />
      </SafeAreaProvider>
    </NavigationContainer>
  );
};

export default AppNavigator;
