import React, { useState } from 'react';
import { Image, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from './style';
import { BottomTabParamList } from '../../types';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CustomText } from '../../components/CustomText';
import COLORS from '../../utils/Colors';
import { responsiveFontSize, verticalScale } from '../../utils/Metrics';
import IMAGES from '../../assets/images';
import DelearModal from '../MeetingScreen/DelearModal';
import PopularProducts from '../../components/PopularProducts';
import MyProducts from '../../components/MyProducts';

type Props = BottomTabScreenProps<BottomTabParamList, 'OrderScreen'>;

const OrderScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const [selectedRole, setSelectedRole] = useState('Distributor');
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [textmessage, setTextMessage] = useState<string>('');
  const [selectedTab, setSelectedTab] = useState<'Popular' | 'My'>('Popular');
  const roleOptions = ['Distributor', 'Sub Distributor'];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View>
          <CustomText
            type="heading"
            color={COLORS.textColor}
            fontWeight="bold"
            style={{
              textAlign: 'center',
              marginTop: 20,
              marginBottom: verticalScale(20),
              fontSize: responsiveFontSize(30),
            }}
          >
            My Orders
          </CustomText>

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

          <TextInput
            placeholder="Enter text"
            value={textmessage}
            style={styles.textInput}
            placeholderTextColor="#aaa"
            onChangeText={setTextMessage}
          />

          <View style={styles.tabContainer}>
            <TouchableOpacity
              onPress={() => setSelectedTab('Popular')}
              style={[
                styles.tabButton,
                selectedTab === 'Popular' && styles.tabSelected,
              ]}
            >
              <Text
                style={[
                  styles.tabText,
                  selectedTab === 'Popular' && styles.textSelected,
                ]}
              >
                Popular Products
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setSelectedTab('My')}
              style={[
                styles.tabButton,
                selectedTab === 'My' && styles.tabSelected,
              ]}
            >
              <Text
                style={[
                  styles.tabText,
                  selectedTab === 'My' && styles.textSelected,
                ]}
              >
                My Products
              </Text>
            </TouchableOpacity>
          </View>

          {selectedTab === 'Popular' ? (
            <PopularProducts
              customer={selectedRole}
              otherCustomer={textmessage}
            />
          ) : (
            <MyProducts />
          )}

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
      </ScrollView>
    </SafeAreaView>
  );
};

export default OrderScreen;
