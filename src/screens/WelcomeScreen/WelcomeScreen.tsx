import React from 'react';
import {View, Text, Button, StyleSheet} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../types';

import {SafeAreaView} from 'react-native-safe-area-context';
import styles from './style';

type Props = NativeStackScreenProps<RootStackParamList, 'Welcome'>;

const WelcomeScreen: React.FC<Props> = ({navigation}) => (
  <SafeAreaView style={styles.container}>
    <View>
      <Text>Welcome</Text>
    </View>
  </SafeAreaView>
);

export default WelcomeScreen;
