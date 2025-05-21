import React, { useEffect, useState } from 'react';
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
  SafeAreaView,
  Platform,
  PermissionsAndroid,
  ScrollView,
} from 'react-native';
import { launchCamera, launchImageLibrary, Asset } from 'react-native-image-picker';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import styles from './styles';
import { CustomText } from '../../components/CustomText';
import { responsiveFontSize } from '../../utils/Metrics';
import COLORS from '../../utils/Colors';
import IMAGES from '../../assets/images';
import DelearModal from '../../screens/MeetingScreen/DelearModal';
import Geolocation from '@react-native-community/geolocation';
import { getLocalStorageData } from '../../utils/Storage';
import STORAGE_KEYS from '../../utils/Constants';
import axios from 'axios';
import ENDPOINTS, { API_URL } from '../../APIService/endPoints';

// 1. Import your GetMeeting screen/component here:
import GetMeeting from './GetMeeting'; // <-- Adjust the path as needed

const API_KEY = "9313fcf6cb4945dfbf94b6cadfdae5ce";
const OPENCAGE_API_URL = `https://api.opencagedata.com/geocode/v1/json`;

type Props = BottomTabScreenProps<any, 'Meeting'>;

const Meeting: React.FC<Props> = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [selectedRole, setSelectedRole] = useState('Main Distributor');
  const [imageUri, setImageUri] = useState<Asset | null>(null);
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [textmessage, setTextMessage] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [username, setUsername] = useState<string | null>(null);

  // Tab state
  const [activeTab, setActiveTab] = useState<'meeting' | 'addMeeting'>('meeting');

  const roleOptions = ['Main Distributor', 'Sub Dealer', 'Farmer', 'Milk center', 'Retailer'];

  useEffect(() => {
    (async () => {
      const savedName = await getLocalStorageData(STORAGE_KEYS.username);
      setUsername(savedName);
    })();
  }, []);

  const handleSave = async () => {
    if (!longitude || !latitude || !textmessage || !selectedRole || !imageUri) {
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
      formData.append('dealer', selectedRole);
      formData.append('data', textmessage);

      const fileName = imageUri.fileName || `photo_${Date.now()}.jpg`;
      formData.append('image', {
        uri: Platform.OS === 'ios' ? imageUri.uri!.replace('file://', '') : imageUri.uri!,
        name: fileName,
        type: imageUri.type || 'image/jpeg',
      });

      const response = await axios.post(`${API_URL}${ENDPOINTS.addMeeting}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
          Accept: 'application/json',
        },
      });

      const res = response.data;
      if (res.success) {
        Alert.alert('Success', res.message || 'Your Meeting is added Successfully!');
        setSelectedRole('Main Distributor');
        setTextMessage('');
        setImageUri(null);
        fetchCurrentLocation();
      } else {
        Alert.alert('Error', res.message || 'Failed to add Meeting');
      }
    } catch (error: any) {
      console.error('Meeting API Error:', error);
      Alert.alert('Error', error?.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const requestLocationPermission = async (): Promise<boolean> => {
    if (Platform.OS !== 'android') return true;
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message: 'This app needs access to your location.',
          buttonPositive: ''
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn(err);
      return false;
    }
  };

  const fetchCurrentLocation = async () => {
    setLoading(true);
    if (Platform.OS === 'android') {
      const hasPermission = await requestLocationPermission();
      if (!hasPermission) {
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
          const response = await fetch(
            `${OPENCAGE_API_URL}?q=${lat}+${lng}&key=${API_KEY}`
          );
          const data = await response.json();
          if (data.results && data.results.length > 0) {
            setAddress(data.results[0].formatted);
          } else {
            setAddress('Address not found');
          }
        } catch (error) {
          setAddress('Failed to fetch address');
          console.error(error);
        }
        setLoading(false);
      },
      err => {
        Alert.alert('Error', 'Unable to fetch location');
        console.error(err);
        setLoading(false);
      },
      { enableHighAccuracy: false, timeout: 15000, maximumAge: 10000 }
    );
  };

  useEffect(() => {
    fetchCurrentLocation();
  }, []);

  const handleImagePick = () => {
    Alert.alert('Select Image', 'Choose an option', [
      {
        text: 'Camera',
        onPress: async () => {
          const result = await launchCamera({ mediaType: 'photo', quality: 0.7 });
          if (result.assets?.length) setImageUri(result.assets[0]);
        },
      },
      {
        text: 'Gallery',
        onPress: async () => {
          const result = await launchImageLibrary({ mediaType: 'photo', quality: 0.7 });
          if (result.assets?.length) setImageUri(result.assets[0]);
        },
      },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.navigate('HomeScreen')}>
            <Image source={IMAGES.back} style={styles.logo2} />
          </TouchableOpacity>
          <Image source={IMAGES.avtar} style={styles.logo} />
          <CustomText
            type="heading"
            color={COLORS.titleColor}
            style={{
              textAlign: 'center',
              fontWeight: 'bold',
              fontSize: responsiveFontSize(22),
            }}
          >
            {username}
          </CustomText>
        </View>

        {/* Tab Buttons */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === 'meeting' && styles.tabButtonActive,
            ]}
            onPress={() => setActiveTab('meeting')}
          >
            <Text
              style={[
                styles.tabButtonText,
                activeTab === 'meeting' && styles.tabButtonTextActive,
              ]}
            >
              Meeting
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === 'addMeeting' && styles.tabButtonActive,
            ]}
            onPress={() => setActiveTab('addMeeting')}
          >
            <Text
              style={[
                styles.tabButtonText,
                activeTab === 'addMeeting' && styles.tabButtonTextActive,
              ]}
            >
              Add Meeting
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tab Content */}
        {activeTab === 'meeting' ? (
          // 2. Show your GetMeeting screen/component here:
          <GetMeeting />
        ) : (
          <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            {/* Dropdown */}
            <View style={styles.dropdown}>
              <Text style={styles.dropdownText}>{selectedRole}</Text>
              <TouchableOpacity onPress={() => setDropdownVisible(true)}>
                <Image
                  source={IMAGES.arrow}
                  style={styles.dropdownIcon}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>

            {/* Text Input */}
            <TextInput
              placeholder="Enter text"
              value={textmessage}
              style={styles.textInput}
              placeholderTextColor="#aaa"
              onChangeText={setTextMessage}
            />

            {/* Upload Section */}
            <Text style={styles.uploadLabel}>Upload Image</Text>
            <TouchableOpacity onPress={handleImagePick} style={styles.uploadCircle}>
              {imageUri ? (
                <Image source={{ uri: imageUri.uri }} style={styles.uploadIcon2} />
              ) : (
                <Image source={IMAGES.profile} style={styles.uploadIcon} />
              )}
            </TouchableOpacity>

            {/* Save Button */}
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </ScrollView>
        )}

        {/* Custom Modal */}
        <DelearModal
          visible={dropdownVisible}
          options={roleOptions}
          selected={selectedRole}
          onSelect={(role: string) => {
            setSelectedRole(role);
            setDropdownVisible(false);
          }}
          onClose={() => setDropdownVisible(false)}
        />
      </View>
    </SafeAreaView>
  );
};

export default Meeting;
