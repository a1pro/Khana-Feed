import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import {
  View,
  SafeAreaView,
  Image,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { RootStackParamList } from '../../types';
import styles from './style';
import IMAGES from '../../assets/images';
import { CustomText } from '../../components/CustomText';
import COLORS from '../../utils/Colors';
import { responsiveFontSize, verticalScale } from '../../utils/Metrics';
import { KeyboardAvoidingContainer } from '../../components/KeyboardAvoidingComponent';
import CustomButton from '../../components/CustomButton';

type Props = NativeStackScreenProps<RootStackParamList, 'HomeScreen'>;

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [startTime, setStartTime] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [endTime, setEndTime] = useState<Date>(new Date());

  const [showPicker, setShowPicker] = useState<{
    mode: 'date' | 'time';
    field: 'startDate' | 'startTime' | 'endDate' | 'endTime' | null;
  }>({ mode: 'date', field: null });

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowPicker({ mode: 'date', field: null });
    if (selectedDate) {
      switch (showPicker.field) {
        case 'startDate':
          setStartDate(selectedDate);
          break;
        case 'startTime':
          setStartTime(selectedDate);
          break;
        case 'endDate':
          setEndDate(selectedDate);
          break;
        case 'endTime':
          setEndTime(selectedDate);
          break;
      }
    }
  };

  const formatDate = (date: Date) =>
    `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  const formatTime = (date: Date) =>
    `${date.getHours().toString().padStart(2, '0')}:${date
      .getMinutes()
      .toString()
      .padStart(2, '0')}`;

  return (
    <KeyboardAvoidingContainer>
      <SafeAreaView style={styles.container}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text />
            <Image source={IMAGES.logo} style={styles.logo} />
            <TouchableOpacity onPress={()=>navigation.navigate('ProfileScreen')}>
              <Image source={IMAGES.avtar} style={styles.logo2} />
            </TouchableOpacity>
          </View>
          <ScrollView
            contentContainerStyle={{ flex: 1, paddingBottom: verticalScale(300) }}
          >
            <CustomText
              type="heading"
              color={COLORS.titleColor}
              style={{
                textAlign: 'center',
                marginTop: 50,
                fontSize: responsiveFontSize(22),
                marginBottom: verticalScale(30)
              }}
            >
              Tara Food and Health
            </CustomText>

            <Image source={IMAGES.avtar} style={styles.logo3} />

            <CustomText
              type="heading"
              color={COLORS.titleColor}
              style={{
                textAlign: 'center',
                fontSize: responsiveFontSize(22),
                marginBottom: verticalScale(30)
              }}
            >
              Paramjeet Singh
            </CustomText>

            <CustomText
              type="subTitle"
              color={COLORS.grey}
              style={{
                textAlign: 'center',
                fontSize: responsiveFontSize(22),
                marginBottom: verticalScale(10)
              }}
            >
              Salesman
            </CustomText>

            {/* Start Date/Time */}
            <View style={styles.view1}>
              <View style={{ flexDirection: 'column' }}>
                <CustomText
                  type="heading"
                  color={COLORS.titleColor}
                  style={{
                    textAlign: 'center',
                    fontSize: responsiveFontSize(22),
                    marginBottom: verticalScale(10)
                  }}
                >
                  Start Date:
                </CustomText>
                <TouchableOpacity
                  onPress={() => setShowPicker({ mode: 'date', field: 'startDate' })}
                >
                  <CustomText
                    type="subTitle"
                    style={{ textAlign: 'center', marginBottom: verticalScale(20) }}
                  >
                    {formatDate(startDate)}
                  </CustomText>
                </TouchableOpacity>
              </View>

              <View style={{ flexDirection: 'column' }}>
                <CustomText
                  type="heading"
                  color={COLORS.titleColor}
                  style={{
                    textAlign: 'center',
                    fontSize: responsiveFontSize(22),
                    marginBottom: verticalScale(10)
                  }}
                >
                  Start Time:
                </CustomText>
                <TouchableOpacity
                  onPress={() => setShowPicker({ mode: 'time', field: 'startTime' })}
                >
                  <CustomText
                    type="subTitle"
                    style={{ textAlign: 'center', marginBottom: verticalScale(20) }}
                  >
                    {formatTime(startTime)}
                  </CustomText>
                </TouchableOpacity>
              </View>
            </View>

            <CustomButton
              style={{ width: '90%', alignSelf: 'center' }}
              textSize="small"
              title="Start"
              onPress={() => Alert.alert('Time started')}
            />

            {/* End Date/Time */}
            <View style={styles.view1}>
              <View style={{ flexDirection: 'column' }}>
                <CustomText
                  type="heading"
                  color={COLORS.titleColor}
                  style={{
                    textAlign: 'center',
                    fontSize: responsiveFontSize(22),
                    marginBottom: verticalScale(10)
                  }}
                >
                  End Date:
                </CustomText>
                <TouchableOpacity
                  onPress={() => setShowPicker({ mode: 'date', field: 'endDate' })}
                >
                  <CustomText
                    type="subTitle"
                    style={{ textAlign: 'center', marginBottom: verticalScale(20) }}
                  >
                    {formatDate(endDate)}
                  </CustomText>
                </TouchableOpacity>
              </View>

              <View style={{ flexDirection: 'column' }}>
                <CustomText
                  type="heading"
                  color={COLORS.titleColor}
                  style={{
                    textAlign: 'center',
                    fontSize: responsiveFontSize(22),
                    marginBottom: verticalScale(10)
                  }}
                >
                  End Time:
                </CustomText>
                <TouchableOpacity
                  onPress={() => setShowPicker({ mode: 'time', field: 'endTime' })}
                >
                  <CustomText
                    type="subTitle"
                    style={{ textAlign: 'center', marginBottom: verticalScale(20) }}
                  >
                    {formatTime(endTime)}
                  </CustomText>
                </TouchableOpacity>
              </View>
            </View>

            <CustomButton
              style={{ width: '90%', alignSelf: 'center' }}
              textSize="small"
              title="End"
              onPress={() => Alert.alert('End time')}
            />
          </ScrollView>
        </View>

        {/* Show Date or Time Picker */}
        {showPicker.field && (
          <DateTimePicker
            mode={showPicker.mode}
            value={
              showPicker.field === 'startDate'
                ? startDate
                : showPicker.field === 'startTime'
                ? startTime
                : showPicker.field === 'endDate'
                ? endDate
                : endTime
            }
            is24Hour={true}
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handleDateChange}
          />
        )}
      </SafeAreaView>
    </KeyboardAvoidingContainer>
  );
};

export default HomeScreen;
