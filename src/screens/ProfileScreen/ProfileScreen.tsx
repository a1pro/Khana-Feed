import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { View, SafeAreaView, Image, Alert } from 'react-native';
import { RootStackParamList } from '../../types';
import styles from './style';
import { CustomText } from '../../components/CustomText';
import COLORS from '../../utils/Colors';
import { responsiveFontSize, verticalScale } from '../../utils/Metrics';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';


type Props = NativeStackScreenProps<RootStackParamList, 'ProfileScreen'>;
const ProfileScreen: React.FC<Props> = ({ navigation }) => {
      const [inputData, setInputData] = useState({
        password: '',
        newPassword: '',
        confirmPassword:""
      });
      const handleInputChange = (fieldName: string, value: string) => {
        setInputData(prev => ({
          ...prev,
          [fieldName]: value,
        }));
      };
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.container}>
                <CustomText
                    type="subHeading"
                    color={COLORS.textColor}
                    fontWeight="bold"
                    style={{ textAlign: 'center', marginTop: 50, marginBottom: verticalScale(20), fontSize: responsiveFontSize(20) }}>
                    Setup New Password
                </CustomText>
                <CustomText
                    type="subHeading"
                    color={COLORS.grey}
                    fontWeight="bold"
                    style={{ textAlign: 'center', marginTop: 20, marginBottom: verticalScale(20), fontSize: responsiveFontSize(20) }}>
                    Please, setup a new password {'/n'}for your account
                </CustomText>
                <View style={styles.inputContainer}>
                <CustomInput
                    keyboardType="email-address"
                    value={inputData.password}
                    placeholder="Change Password"
                    onChangeText={value => handleInputChange('email', value)}
                />

                <CustomInput
                    keyboardType="email-address"
                    value={inputData.newPassword}
                    placeholder="New Password"
                    onChangeText={value => handleInputChange('email', value)}
                />
                  <CustomInput 
                keyboardType="email-address"
                value={inputData.confirmPassword}
                placeholder="Confirm Password"
                onChangeText={value => handleInputChange('email', value)}
              />
              </View>

              <CustomButton
          style={{width: "90%",alignSelf:"center"}}
          textSize="small"
          title="Save"
          onPress={() => Alert.alert("save password ")}
        />
        <CustomButton
          style={{width: "90%",alignSelf:"center",backgroundColor:"grey",marginTop:20}}
          textSize="small"
          title="Cancel"
          onPress={() => Alert.alert("Cancel password ")}
        />
            </View>
        </SafeAreaView>
    )
}
export default ProfileScreen;