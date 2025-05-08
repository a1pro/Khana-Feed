import React from 'react';
import {View, Text} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../types';
import styles from './style';
import {SafeAreaView} from 'react-native-safe-area-context';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

const LoginScreen: React.FC<Props> = ({navigation}) => (
  <SafeAreaView style={styles.container}>
    <View>
      <Text>Login Screen</Text>
    </View>
  </SafeAreaView>
);

export default LoginScreen;
