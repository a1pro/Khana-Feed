import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  ActivityIndicator,
  Alert,
  SafeAreaView,
  FlatList,
} from 'react-native';
import axios from 'axios';
import COLORS from '../../utils/Colors';
import ENDPOINTS, { API_URL } from '../../APIService/endPoints';
import { CustomText } from '../../components/CustomText';
import { responsiveFontSize, verticalScale } from '../../utils/Metrics';
import { getLocalStorageData } from '../../utils/Storage';
import STORAGE_KEYS from '../../utils/Constants';

const IMAGE_BASE_URL = 'https://warehouse.a1professionals.net/';

const GetMeeting: React.FC = () => {
  const [meetings, setMeetings] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchMeetings();
  }, []);

  const fetchMeetings = async () => {
    setLoading(true);
    try {
      const token = await getLocalStorageData(STORAGE_KEYS.token);
      if (!token) {
        Alert.alert('Error', 'No token found');
        setLoading(false);
        return;
      }
      const response = await axios.get(
        `${API_URL}${ENDPOINTS.getMeeting}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        }
      );
      if (response.data && response.data.success) {
        setMeetings(response.data.data || []);
      } else {
        Alert.alert('Error', response.data.message || 'Failed to fetch meetings');
      }
    } catch (error: any) {
      Alert.alert(
        'Error',
        error?.response?.data?.message || error.message || 'Something went wrong'
      );
    } finally {
      setLoading(false);
    }
  };

  const renderMeeting = ({ item }: { item: any }) => (
    <View style={styles.meetingCard}>
      <View style={styles.rowBetween}>
        <CustomText type="title" color={COLORS.textColor} fontWeight="bold">
          {item.dealer}
        </CustomText>
        <Text style={styles.dateText}>{item.date}</Text>
      </View>
      <View style={styles.row}>
        <Image
          source={{ uri: IMAGE_BASE_URL + item.image }}
          style={styles.meetingImage}
          resizeMode="cover"
        />
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={styles.messageText}>
            {item.data ? item.data : <Text style={{color:'#aaa'}}>No message</Text>}
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={{ flex: 1 }}>
        <CustomText
          type="subHeading"
          color={COLORS.textColor}
          fontWeight="bold"
          style={{
            textAlign: 'center',
            marginTop: 30,
            marginBottom: verticalScale(20),
            fontSize: responsiveFontSize(20),
          }}
        >
          Dealer Meetings
        </CustomText>

        {loading ? (
          <ActivityIndicator size="large" color={COLORS.appColor} style={{ marginTop: 40 }} />
        ) : meetings.length === 0 ? (
          <Text style={{ textAlign: 'center', marginTop: 40, color: COLORS.textColor }}>
            No meetings found.
          </Text>
        ) : (
          <FlatList
            data={meetings}
            keyExtractor={item => item.id?.toString()}
            renderItem={renderMeeting}
            contentContainerStyle={{ padding: 16, paddingBottom: 30 }}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  meetingCard: {
    backgroundColor: '#f4f6fa',
    borderRadius: 12,
    marginBottom: 16,
    padding: 14,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  meetingImage: {
    width: 70,
    height: 70,
    borderRadius: 8,
    backgroundColor: '#e6e6e6',
  },
  messageText: {
    fontSize: 15,
    color: COLORS.textColor,
    lineHeight: 20,
    fontWeight: '500',
  },
  dateText: {
    fontSize: 13,
    color: COLORS.grey,
    fontWeight: 'bold',
  },
});

export default GetMeeting;
