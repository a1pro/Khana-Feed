import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { View } from 'react-native';

import { BottomTabParamList } from '../types';
import HomeScreen from '../screens/HomeScreen/HomeScreen';
import Meeting from '../screens/MeetingScreen/Meeting';
import OrderScreen from '../screens/OrderScreen/OrderScreen';
import COLORS from '../utils/Colors';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import Distribution from '../screens/Distribution/Distribution';

const Tab = createBottomTabNavigator<BottomTabParamList>();

const BottomNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarHideOnKeyboard: true,
        tabBarActiveTintColor: COLORS.appColor,
        tabBarInactiveTintColor: COLORS.grey,
        tabBarLabelStyle: {
          fontSize: 13,
          color: COLORS.black,
          marginTop: 5,
        },
        tabBarStyle: {
          backgroundColor: COLORS.inputBackground,
          borderTopWidth: 0,
          shadowRadius: 10,
          paddingTop: 15,
          paddingBottom: 5,
          height: 80,
        //   marginHorizontal: 10,
        },
        tabBarIcon: ({ focused, color }) => {
          let iconName: string;
          switch (route.name) {
            case 'HomeScreen':
              iconName = 'home';
              break;
            case 'Meeting':
              iconName = 'meeting-room';
              break;
            case 'OrderScreen':
              iconName = 'shopping-cart';
              break;
               case 'Distribution':
              iconName = 'app-registration';
              break;
            default:
              iconName = 'circle';
          }

          return (
            <View style={{
              backgroundColor: focused ? '#fff' : '#fff',
              borderRadius:20,
              width: 40,
              height: 40,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
              <MaterialIcons name={iconName} size={24} color={color} />
            </View>
          );
        },
      })}
    >
         <Tab.Screen name="HomeScreen" component={HomeScreen} options={{ headerShown: false }} />
          <Tab.Screen name="Meeting" component={Meeting} options={{ headerShown: false }} />
      <Tab.Screen name="OrderScreen" component={OrderScreen} options={{ headerShown: false }} />
     <Tab.Screen name="Distribution" component={Distribution} options={{ headerShown: false }} />
     
    </Tab.Navigator>
  );
};

export default BottomNavigator;
