import React, { useState } from 'react';
import {View, Text, Image} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../types';
import styles from './style';
import {SafeAreaView} from 'react-native-safe-area-context';
import IMAGES from '../../assets/images';
import { CustomText } from '../../components/CustomText';
import COLORS from '../../utils/Colors';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import { KeyboardAvoidingContainer } from '../../components/KeyboardAvoidingComponent';
import { responsiveFontSize, verticalScale } from '../../utils/Metrics';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

const LoginScreen: React.FC<Props> = ({navigation}) =>{
  const [inputData, setInputData] = useState({
    email: '',
    password: '',
  });
  const handleInputChange = (fieldName: string, value: string) => {
    setInputData(prev => ({
      ...prev,
      [fieldName]: value,
    }));
  };
  return(
    <KeyboardAvoidingContainer>
  <SafeAreaView style={styles.container}>
    <View>
    <Image source={IMAGES.logo}style={styles.logo}/>
    <CustomText
              type="heading"
              color={COLORS.textColor}
              fontWeight="bold"
              style={{textAlign: 'center', marginBottom: verticalScale(20),fontSize:responsiveFontSize(30)}}>
              Login
            </CustomText>

            <View style={styles.inputContainer}>
              <CustomInput 
                keyboardType="email-address"
                value={inputData.email}
                placeholder="Email"
                onChangeText={value => handleInputChange('email', value)}
              />
              <CustomInput
      
                value={inputData.password}
                placeholder="Password"
                type="password"
                onChangeText={value => handleInputChange('password', value)}
              />
            </View>
            <CustomButton
          style={{width: "90%",alignSelf:"center"}}
          textSize="small"
          title="Next"
          onPress={() => navigation.navigate("HomeScreen")}
        />
    </View>
  </SafeAreaView>
  </KeyboardAvoidingContainer>
);
}
export default LoginScreen;
