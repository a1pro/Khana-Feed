import React, { useCallback, useEffect, useState } from 'react';
import { View, Image, Text, Alert, BackHandler } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';
import styles from './style';
import { SafeAreaView } from 'react-native-safe-area-context';
import IMAGES from '../../assets/images';
import { CustomText } from '../../components/CustomText';
import COLORS from '../../utils/Colors';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import { KeyboardAvoidingContainer } from '../../components/KeyboardAvoidingComponent';
import { responsiveFontSize, verticalScale } from '../../utils/Metrics';
import ENDPOINTS from '../../APIService/endPoints';
import { postData } from '../../APIService/api';
import { storeLocalStorageData } from '../../utils/Storage';
import STORAGE_KEYS from '../../utils/Constants';
import { LoginResponse } from '../../Typings/apiTypes';
import Toast from 'react-native-toast-message';
import { useFocusEffect } from '@react-navigation/native';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [inputData, setInputData] = useState({ phone: '', password: '' });
  const [errors, setErrors] = useState({ phone: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (fieldName: string, value: string) => {
    setInputData(prev => ({ ...prev, [fieldName]: value }));
    setErrors(prev => ({ ...prev, [fieldName]: '' }));
  };

   useFocusEffect(
      useCallback(() => {
        const backAction = () => {
          Alert.alert('Hold on!', 'Do you want to quit the app?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Exit', onPress: () => BackHandler.exitApp() },
          ]);
          return true;
        };
  
        const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
  
        return () => backHandler.remove();
      }, [])
    );

  const validateForm = () => {
    let valid = true;
    let newErrors = { phone: '', password: '' };
    if (!inputData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
      valid = false;
    } else if (!/^\d{10}$/.test(inputData.phone)) {
      newErrors.phone = 'Phone number must be 10 digits';
      valid = false;
    }

    if (!inputData.password.trim()) {
      newErrors.password = 'Password is required';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;
  
    setIsLoading(true);
    try {
      const response = await postData<LoginResponse>(ENDPOINTS.login, {
        phone: inputData.phone,
        password: inputData.password,
      });
  
      if (response.data?.success) {
        console.log('Login Success:', response.data);
        const token = response.data?.access_token;
  
        if (token) {
          await storeLocalStorageData(STORAGE_KEYS.token, token);
          Alert.alert('Successfull ',"Login Successfull !")
          navigation.replace('HomeScreen');
        } else {
          console.log('Error: Invalid token response');
          Alert.alert('Login Failed', 'Invalid token response');
        }
      } else {
        console.log('Login Error:', response.data.message || 'Login failed');
        Alert.alert('Login Failed', response.data.message || 'Login failed');
      }
    } catch (error: any) {
      console.log('Login Exception:', error?.message || 'Login error');
      Alert.alert('Login Error', error?.message || 'Login error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingContainer>
      <SafeAreaView style={styles.container}>
        <View>
          
          <Image source={IMAGES.logo} style={styles.logo} />
          <CustomText
            type="heading"
            color={COLORS.textColor}
            fontWeight="bold"
            style={{
              textAlign: 'center',
              marginBottom: verticalScale(20),
              fontSize: responsiveFontSize(30),
            }}>
            Khanna Feed ltd.
          </CustomText>
          <CustomText
            type="heading"
            color={COLORS.textColor}
            fontWeight="bold"
            style={{
              textAlign: 'center',
              marginBottom: verticalScale(20),
              fontSize: responsiveFontSize(20),
            }}>
            Login
          </CustomText>

          <View style={styles.inputContainer}>
            <CustomInput
              keyboardType="phone-pad"
              value={inputData.phone}
              placeholder="Enter your mobile no."
              onChangeText={value => handleInputChange('phone', value)}
            />
            <Text style={styles.error}>{errors.phone}</Text>

            <CustomInput
              value={inputData.password}
              placeholder="Password"
              type="password"
              onChangeText={value => handleInputChange('password', value)}
            />
            <Text style={styles.error}>{errors.password}</Text>
          </View>

          <CustomButton
            style={{ width: '90%', alignSelf: 'center' }}
            textSize="small"
            title="Next"
            onPress={handleLogin}
            isLoading={isLoading}
          />
        </View>
      </SafeAreaView>
    </KeyboardAvoidingContainer>
  );
};

export default LoginScreen;
