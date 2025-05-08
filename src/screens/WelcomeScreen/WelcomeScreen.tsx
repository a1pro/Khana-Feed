import React from 'react';
import {View, Text, Button, StyleSheet, ImageBackground, Image} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../types';

import {SafeAreaView} from 'react-native-safe-area-context';
import styles from './style';
import IMAGES from '../../assets/images';
import CustomButton from '../../components/CustomButton';
import { verticalScale } from '../../utils/Metrics';

type Props = NativeStackScreenProps<RootStackParamList, 'Welcome'>;

const WelcomeScreen: React.FC<Props> = ({navigation}) => (
  <SafeAreaView style={styles.container}>
    <View >
     <ImageBackground source={IMAGES.backgroundIMG} style={styles.backgroundimage}>

      <View style={styles.view1}>
     <Image source={IMAGES.logo}style={styles.logo}/>
     <CustomButton
          style={{width: "80%"}}
          textSize="small"
          title="Let's get started"
          onPress={() => navigation.navigate("Login")}
        />
      </View>

     </ImageBackground>
    </View>
  </SafeAreaView>
);

export default WelcomeScreen;
