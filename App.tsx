import React, { useEffect } from 'react';
import { Platform, Alert } from 'react-native';
import { request, check, PERMISSIONS, RESULTS, PermissionStatus } from 'react-native-permissions';
import AppNavigator from './src/navigation/AppNavigator';

const permissionsToRequest = Platform.select({
  ios: [
    PERMISSIONS.IOS.CAMERA,
    PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
  ],
  android: [
    PERMISSIONS.ANDROID.CAMERA,
    PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
  ],
});

async function requestPermissions() {
  if (!permissionsToRequest) return;

  for (const permission of permissionsToRequest) {
    const status: PermissionStatus = await check(permission);
    if (status === RESULTS.DENIED || status === RESULTS.LIMITED) {
      const result = await request(permission);
      if (result !== RESULTS.GRANTED) {
        Alert.alert(
          'Permission required',
          `The app needs ${permission.includes('CAMERA') ? 'camera' : 'location'} access to function properly.`
        );
      }
    }
  }
}

export default function App() {
  useEffect(() => {
    requestPermissions();
  }, []);

  return <AppNavigator/>;
}
