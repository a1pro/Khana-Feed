import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { View, SafeAreaView, Alert } from 'react-native';
import { RootStackParamList } from '../../types';
import styles from './style';
import { CustomText } from '../../components/CustomText';
import COLORS from '../../utils/Colors';
import { responsiveFontSize, verticalScale } from '../../utils/Metrics';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ENDPOINTS from '../../APIService/endPoints';
import { postData } from '../../APIService/api';
import { ChangePasswordResponse } from '../../Typings/apiTypes';
import { deleteLocalStorageData } from '../../utils/Storage'; // Assuming this is your storage util

type Props = NativeStackScreenProps<RootStackParamList, 'ProfileScreen'>;

const ProfileScreen: React.FC<Props> = ({ navigation }) => {
  const [inputData, setInputData] = useState({
    password: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleInputChange = (fieldName: string, value: string) => {
    setInputData(prev => ({
      ...prev,
      [fieldName]: value,
    }));
  };

  const validateForm = () => {
    const { password, newPassword, confirmPassword } = inputData;

    if (!password || !newPassword || !confirmPassword) {
      Alert.alert('Error', 'All fields are required.');
      return false;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'New Password and Confirm Password do not match.');
      return false;
    }

    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) throw new Error('Token not found');

      const response = await postData<ChangePasswordResponse>(
        ENDPOINTS.updatePassword,
        {
          current_password: inputData.password,
          new_password: inputData.newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const { data } = response;
      if (data.success) {
        Alert.alert('Success', data.message);
        navigation.navigate('HomeScreen');
      } else {
        Alert.alert('Error', 'Something went wrong.');
      }
    } catch (error: any) {
      console.error(error);
      Alert.alert('Error', error.response?.data?.message || 'API request failed.');
    }
  };

  const handleLogout = async () => {
    try {
      await deleteLocalStorageData('token'); 
      navigation.replace('Login'); 
    } catch (error) {
      console.error('Logout error:', error);
      Alert.alert('Error', 'Failed to logout. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <CustomText
          type="subHeading"
          color={COLORS.textColor}
          fontWeight="bold"
          style={{
            textAlign: 'center',
            marginTop: 50,
            marginBottom: verticalScale(20),
            fontSize: responsiveFontSize(20),
          }}
        >
          Setup New Password
        </CustomText>
        <CustomText
          type="subHeading"
          color={COLORS.grey}
          fontWeight="bold"
          style={{
            textAlign: 'center',
            marginTop: 20,
            marginBottom: verticalScale(20),
            fontSize: responsiveFontSize(20),
          }}
        >
          Please, setup a new password {'\n'}for your account
        </CustomText>

        <View style={styles.inputContainer}>
          <CustomInput
            type="password"
            value={inputData.password}
            placeholder="Change Password"
            onChangeText={value => handleInputChange('password', value)}
          />

          <CustomInput
            type="password"
            value={inputData.newPassword}
            placeholder="New Password"
            onChangeText={value => handleInputChange('newPassword', value)}
          />

          <CustomInput
            type="password"
            value={inputData.confirmPassword}
            placeholder="Confirm Password"
            onChangeText={value => handleInputChange('confirmPassword', value)}
          />
        </View>

        <CustomButton
          style={{ width: '90%', alignSelf: 'center' }}
          textSize="small"
          title="Save"
          onPress={handleSave}
        />
        <CustomButton
          style={{
            width: '90%',
            alignSelf: 'center',
            backgroundColor: 'grey',
            marginTop: 20,
          }}
          textSize="small"
          title="Logout"
          onPress={handleLogout}
        />
      </View>
    </SafeAreaView>
  );
};

export default ProfileScreen;
