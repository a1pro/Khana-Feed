import { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  SafeAreaView,
  Image,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
  ActivityIndicator,
  BackHandler,
  TextInput,
  PermissionsAndroid,
} from 'react-native';
import { launchCamera, launchImageLibrary, Asset } from 'react-native-image-picker';
import { BottomTabParamList, RootStackParamList } from '../../types';
import styles from './style';
import IMAGES from '../../assets/images';
import { CustomText } from '../../components/CustomText';
import COLORS from '../../utils/Colors';
import { responsiveFontSize, verticalScale } from '../../utils/Metrics';
import { KeyboardAvoidingContainer } from '../../components/KeyboardAvoidingComponent';
import CustomButton from '../../components/CustomButton';
import { AttendanceResponse, EmployeeProfileResponse } from '../../Typings/apiTypes';
import { getLocalStorageData, storeLocalStorageData } from '../../utils/Storage';
import STORAGE_KEYS from '../../utils/Constants';
import ENDPOINTS, { API_URL } from '../../APIService/endPoints';
import { fetchData } from '../../APIService/api';
import Geolocation from '@react-native-community/geolocation';
import axios from 'axios';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { NavigationProp, useFocusEffect, useNavigation } from '@react-navigation/native';

const API_KEY = "9313fcf6cb4945dfbf94b6cadfdae5ce";
const OPENCAGE_API_URL = `https://api.opencagedata.com/geocode/v1/json`;

type RootStackNavigation = NativeStackNavigationProp<RootStackParamList>;

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<RootStackNavigation>();
   const [step, setStep] = useState<number>(0);

  const [startDate] = useState<Date>(new Date());
  const [startTime] = useState<Date>(new Date());
  const [endDate] = useState<Date>(new Date());
  const [endTime] = useState<Date>(new Date());
  const [loading, setLoading] = useState<boolean>(true);
  const [employeeData, setEmployeeData] = useState<{
    username: string;
    company: string;
    designation: string;
  } | null>(null);

  const [startImage, setStartImage] = useState<Asset | null>(null);
  const [endImage, setEndImage] = useState<Asset | null>(null);
const [isBreakStarted, setIsBreakStarted] = useState<boolean>(false);
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [textValueStart, setTextValueStart] = useState<string>('');
  const [textValueEnd, setTextValueEnd] = useState<string>('');
  const [address, setAddress] = useState<string>('');

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
  const requestLocationPermission = async (): Promise<boolean> => {
    if (Platform.OS !== 'android') return true;
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Location Permission',
        message: 'This app needs access to your location.',
        buttonPositive: ''
      }
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  };

  const fetchCurrentLocation = async () => {
    setLoading(true);
    if (Platform.OS === 'android') {
      const ok = await requestLocationPermission();
      if (!ok) {
        Alert.alert('Permission Denied', 'Location permission is required.');
        setLoading(false);
        return;
      }
    }
    Geolocation.getCurrentPosition(
      async pos => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setLatitude(lat);
        setLongitude(lng);
        try {
          const res = await fetch(
            `${OPENCAGE_API_URL}?q=${lat}+${lng}&key=${API_KEY}`
          );
          const json = await res.json();
          setAddress(
            json.results?.[0]?.formatted ?? 'Address not found'
          );
        } catch {
          setAddress('Failed to fetch address');
        }
        setLoading(false);
      },
      err => {
        Alert.alert('Error', 'Unable to fetch location');
        setLoading(false);
      },
      { enableHighAccuracy: false, timeout: 15000, maximumAge: 10000 }
    );
  };

  useEffect(() => {
    fetchCurrentLocation();
  }, []);
 useEffect(() => {
  (async () => {
    try {
      const token = await getLocalStorageData(STORAGE_KEYS.token);
      if (!token) return Alert.alert('Error', 'No token found');
      const resp = await fetchData<EmployeeProfileResponse>(
        ENDPOINTS.profile,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (resp.data.success) {
        const profile = resp.data.data;
        setEmployeeData(profile);

        // ← Save username to AsyncStorage
        await storeLocalStorageData(STORAGE_KEYS.username, profile?.username);
      } else {
        Alert.alert('Error', 'Failed to fetch profile');
      }
    } catch {
      Alert.alert('Error', 'Something went wrong while fetching profile');
    } finally {
      setLoading(false);
    }
  })();
}, []);

  // --- HANDLERS & ADVANCE STEP
  const handleStartImageUpload = () => {
    Alert.alert('Select Image', 'Choose an option', [
      {
        text: 'Camera', onPress: async () => {
          const res = await launchCamera({ mediaType: 'photo', quality: 0.7 });
          if (res.assets?.[0]) {
            setStartImage(res.assets[0]);
            setStep(1);
          }
        }
      },
      {
        text: 'Gallery', onPress: async () => {
          const res = await launchImageLibrary({ mediaType: 'photo', quality: 0.7 });
          if (res.assets?.[0]) {
            setStartImage(res.assets[0]);
            setStep(1);
          }
        }
      },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const handleAttendance = async () => {
    if (!longitude || !latitude || !textValueStart || !startImage) {
      Alert.alert('Missing Fields', 'Please fill all fields and upload an image.');
      return;
    }
    try {
      setLoading(true);
      const token = await getLocalStorageData(STORAGE_KEYS.token);
      if (!token) {
        Alert.alert('Error', 'No token found');
        setLoading(false);
        return;
      }
      const formData = new FormData();
      formData.append('longitude', longitude.toString());
      formData.append('latitude', latitude.toString());
      formData.append('meter_reading', textValueStart);
      if (startImage?.uri) {
        const fileName = startImage.fileName || `photo_${Date.now()}.jpg`;
        formData.append('meter_image', {
          uri: Platform.OS === 'ios' ? startImage.uri.replace('file://', '') : startImage.uri,
          name: fileName,
          type: startImage.type || 'image/jpeg',
        });
      }
      const response = await axios.post(`${API_URL}${ENDPOINTS.startAttendance}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
          Accept: 'application/json',
        },
      });

      const res = response.data;

      if (res.success) {
        Alert.alert('Success', res.message || 'Clock-in successful!');
        setStep(2)
        console.log('Attendance Data:', res.data);
      } else {
        Alert.alert('Error', res.message || 'Clock-in failed');
      }
    } catch (error: any) {
      console.error('Attendance API Error:', error);
      Alert.alert('Error', error?.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };


 const handleBreakStart = async () => {
    if (!longitude || !latitude) {
      Alert.alert('Turn On Location');
      return;
    }
    try {
      setLoading(true);
      const token = await getLocalStorageData(STORAGE_KEYS.token);
      if (!token) {
        Alert.alert('Error', 'No token found');
        setLoading(false);
        return;
      }
      const formData = new FormData();
      formData.append('longitude', longitude.toString());
      formData.append('latitude', latitude.toString());
      const response = await axios.post(`${API_URL}${ENDPOINTS.startBreak}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
          Accept: 'application/json',
        },
      });
      const res = response.data;

      if (res.success) {
        Alert.alert('Success', res.message || 'Break Start successful!');
        setIsBreakStarted(true)
        setStep(3)
        console.log('Attendance Data:', res.data);
      } else {
        Alert.alert('Error', res.message || 'Break Request failed');
      }
    } catch (error: any) {
      console.error("start break error:", error)
      Alert.alert('Error', error?.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }


const handleBreakEnd = async () => {
    if (!longitude || !latitude) {
      Alert.alert('Turn On Location');
      return;
    }
    try {
      setLoading(true);
      const token = await getLocalStorageData(STORAGE_KEYS.token);
      if (!token) {
        Alert.alert('Error', 'No token found');
        setLoading(false);
        return;
      }
      const formData = new FormData();
      formData.append('longitude', longitude.toString());
      formData.append('latitude', latitude.toString());
      const response = await axios.post(`${API_URL}${ENDPOINTS.endBreak}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
          Accept: 'application/json',
        },
      });
      const res = response.data;

      if (res.success) {
        Alert.alert('Success', res.message || 'Break ended!');
        setIsBreakStarted(false)
        setStep(4);
      } else {
        Alert.alert('Error', res.message || 'Break end failed');
      }
    } catch (error: any) {
      console.error("end break error:", error)
      Alert.alert('Error', error?.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

 const handleEndAttendance = async () => {
    if (!longitude || !latitude || !textValueEnd || !endImage) {
      Alert.alert('Missing Fields', 'Please fill all fields and upload an image.');
      return;
    }
    try {
      setLoading(true);
      const token = await getLocalStorageData(STORAGE_KEYS.token);
      if (!token) {
        Alert.alert('Error', 'No token found');
        setLoading(false);
        return;
      }
      const formData = new FormData();
      formData.append('longitude', longitude.toString());
      formData.append('latitude', latitude.toString());
      formData.append('meter_reading', textValueEnd);
      if (endImage?.uri) {
        const fileName = endImage.fileName || `photo_${Date.now()}.jpg`;
        formData.append('meter_image', {
          uri: Platform.OS === 'ios' ? endImage.uri.replace('file://', '') : endImage.uri,
          name: fileName,
          type: endImage.type || 'image/jpeg',
        });
      }
      const response = await axios.post(`${API_URL}${ENDPOINTS.endAttendance}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
          Accept: 'application/json',
        },
      });

      const res = response.data;

      if (res.success) {
        Alert.alert('Success', res.message || 'Clock-out successful!');
        console.log('Attendance end Data:', res.data);
      setStep(0);
        setStartImage(null);
        setTextValueStart('');
      } else {
        Alert.alert('Error', res.message || 'Clock-out failed');
      }
    } catch (error: any) {
      console.error('Attendance end API Error:', error);
      Alert.alert('Error', error?.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  // --- UPLOAD END IMAGE
  const handleEndImageUpload = () => {
    Alert.alert('Select Image', 'Choose an option', [
      {
        text: 'Camera', onPress: async () => {
          const res = await launchCamera({ mediaType: 'photo', quality: 0.7 });
          if (res.assets?.[0]) {
            setEndImage(res.assets[0]);
          }
        }
      },
      {
        text: 'Gallery', onPress: async () => {
          const res = await launchImageLibrary({ mediaType: 'photo', quality: 0.7 });
          if (res.assets?.[0]) {
            setEndImage(res.assets[0]);
          }
        }
      },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const opacityFor = (buttonStep: number) =>
    step === buttonStep ? 1 : 0.5;

  return (
    <KeyboardAvoidingContainer>
      <SafeAreaView style={styles.container}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text />
            <Image source={IMAGES.logo} style={styles.logo} />
            <TouchableOpacity onPress={() => navigation.navigate('ProfileScreen')}>
              <Image source={IMAGES.avtar} style={styles.logo2} />
            </TouchableOpacity>
          </View>

          {loading ? (
            <ActivityIndicator size="large" color={COLORS.backgroundColor} style={{ marginTop: 50 }} />
          ) : (
            <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: verticalScale(600) }}>
              {/* Company & Name */}
              <CustomText
                type="heading"
                color={COLORS.titleColor}
                style={{
                  textAlign: 'center',
                  marginTop: 50,
                  fontSize: responsiveFontSize(22),
                  marginBottom: verticalScale(30),
                }}
              >
                {employeeData?.company ?? 'Tara Food and Health'}
              </CustomText>

              <Image source={IMAGES.avtar} style={styles.logo3} />

              <CustomText
                type="heading"
                color={COLORS.titleColor}
                style={{
                  textAlign: 'center',
                  fontSize: responsiveFontSize(22),
                  marginBottom: verticalScale(30),
                }}
              >
                {employeeData?.username ?? 'Paramjeet Singh'}
              </CustomText>

              <CustomText type="subTitle" color={COLORS.grey} style={styles.txt}>
                {employeeData?.designation ?? 'Salesman'}
              </CustomText>

              {/* Start Section */}
              <View style={[styles.view1, { opacity: 1 }]}>
                <View>
                  <CustomText type="heading" color={COLORS.titleColor} style={styles.txt}>
                    Start Date:
                  </CustomText>
                  <CustomText type="subTitle">{`${startDate.getDate()}/${
                    startDate.getMonth()+1
                  }/${startDate.getFullYear()}`}</CustomText>
                </View>
                <View>
                  <CustomText type="heading" color={COLORS.titleColor} style={styles.txt}>
                    Start Time:
                  </CustomText>
                  <CustomText type="subTitle">
                    {`${startTime.getHours().toString().padStart(2,'0')}:${
                      startTime.getMinutes().toString().padStart(2,'0')
                    }`}
                  </CustomText>
                </View>
              </View>

              {/* 1) Upload Image */}
              <CustomButton
                style={{ width: '40%', alignSelf: 'center', marginBottom: 10, opacity: opacityFor(0) }}
                textSize="small"
                title="Upload Image"
                onPress={handleStartImageUpload}
                disabled={step !== 0}
              />

              {/* Preview & Input */}
              {startImage?.uri && (
                <View style={{ alignItems: 'center', marginBottom: 10 }}>
                  <Image
                    source={{ uri: startImage.uri }}
                    style={{ width: 200, height: 200, borderRadius: 10, marginBottom: 10 }}
                  />
                  <TextInput
                    placeholder="Details"
                    keyboardType="numeric"
                    value={textValueStart}
                    onChangeText={setTextValueStart}
                    style={{
                      width: 200,
                      borderWidth: 1,
                      borderColor: COLORS.grey,
                      borderRadius: 8,
                      padding: 10,
                      fontSize: 16,
                      opacity: opacityFor(1),
                    }}
                    editable={step === 1}
                  />
                </View>
              )}

              {/* 2) Start */}
              <CustomButton
                style={{ width: '90%', alignSelf: 'center', opacity: opacityFor(1) }}
                textSize="small"
                title="Start"
                onPress={handleAttendance}
                disabled={step !== 1}
              />


               {!isBreakStarted ? (
                <CustomButton
                    style={{
                  width: '90%',
                  marginTop: 20,
                  alignSelf: 'center',
                  backgroundColor: COLORS.appColor,
                  opacity: opacityFor(2),
                }}
                  textSize="small"
                  title="Start Break"
                  onPress={handleBreakStart}
                disabled={step !== 2}
                />
              ) : (
                <CustomButton
                     style={{
                  width: '90%',
                  marginTop: 20,
                  alignSelf: 'center',
                  backgroundColor: 'red',
                  opacity: opacityFor(3),
                }}
                  textSize="small"
                  title="End Break"
                   onPress={handleBreakEnd}
                disabled={step !== 3}
                />
              )}


              {/* 3) Start Break */}
              {/* <CustomButton
                style={{
                  width: '90%',
                  marginTop: 20,
                  alignSelf: 'center',
                  backgroundColor: COLORS.appColor,
                  opacity: opacityFor(2),
                }}
                textSize="small"
                title="Start Break"
                onPress={handleBreakStart}
                disabled={step !== 2}
              /> */}

              {/* 4) End Break */}
              {/* <CustomButton
                style={{
                  width: '90%',
                  marginTop: 20,
                  alignSelf: 'center',
                  backgroundColor: 'red',
                  opacity: opacityFor(3),
                }}
                textSize="small"
                title="End Break"
                onPress={handleBreakEnd}
                disabled={step !== 3}
              /> */}

              {/* End Section */}
              <View style={[styles.view1, { opacity: step >= 4 ? 1 : 0.5 }]}>
                <View>
                  <CustomText type="heading" color={COLORS.titleColor} style={styles.txt}>
                    End Date:
                  </CustomText>
                  <CustomText type="subTitle">{`${endDate.getDate()}/${
                    endDate.getMonth()+1
                  }/${endDate.getFullYear()}`}</CustomText>
                </View>
                <View>
                  <CustomText type="heading" color={COLORS.titleColor} style={styles.txt}>
                    End Time:
                  </CustomText>
                  <CustomText type="subTitle">
                    {`${endTime.getHours().toString().padStart(2,'0')}:${
                      endTime.getMinutes().toString().padStart(2,'0')
                    }`}
                  </CustomText>
                </View>
              </View>

              {/* 5) Upload End Image */}
              <CustomButton
                style={{ width: '40%', alignSelf: 'center', marginBottom: 10, opacity: opacityFor(4) }}
                textSize="small"
                title="Upload Image"
                onPress={handleEndImageUpload}
                disabled={step !== 4}
              />

              {endImage?.uri && (
                <View style={{ alignItems: 'center', marginBottom: 10 }}>
                  <Image
                    source={{ uri: endImage.uri }}
                    style={{ width: 200, height: 200, borderRadius: 10, marginBottom: 10 }}
                  />
                  <TextInput
                    placeholder="Details"
                    keyboardType="numeric"
                    value={textValueEnd}
                    onChangeText={setTextValueEnd}
                    style={{
                      width: 200,
                      borderWidth: 1,
                      borderColor: COLORS.grey,
                      borderRadius: 8,
                      padding: 10,
                      fontSize: 16,
                      opacity: opacityFor(4),
                    }}
                    editable={step === 4}
                  />
                </View>
              )}

              {/* 6) End */}
              <CustomButton
                style={{ width: '90%', alignSelf: 'center', backgroundColor: 'red', opacity: opacityFor(4) }}
                textSize="small"
                title="End"
                onPress={handleEndAttendance}
                disabled={step !== 4}
              />
            </ScrollView>
          )}
        </View>
      </SafeAreaView>
    </KeyboardAvoidingContainer>
  );
};

export default HomeScreen;