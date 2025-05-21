import React, { useState } from 'react';
import {
  ScrollView,
  SafeAreaView,
  View,
  TouchableOpacity,
  Text,
  Alert,
  Image,
  Platform,
} from 'react-native';
import styles from './style';
import { CustomText } from '../../components/CustomText';
import COLORS from '../../utils/Colors';
import { responsiveFontSize, verticalScale } from '../../utils/Metrics';
import { KeyboardAvoidingContainer } from '../../components/KeyboardAvoidingComponent';
import CustomInput from '../../components/CustomInput';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import axios, { isCancel } from 'axios';
import ENDPOINTS, { API_URL } from '../../APIService/endPoints';
import { getLocalStorageData } from '../../utils/Storage';
import STORAGE_KEYS from '../../utils/Constants';
import DocumentPicker, { keepLocalCopy, pick } from '@react-native-documents/picker';
import IMAGES from '../../assets/images';
import { PermissionsAndroid } from 'react-native';

type DocumentItem = {
  type: string;
  number: string;
  files: Array<{
    uri: string;
    name: string;
    type: string;
    fileType: 'image' | 'pdf';
  }>;
};

const initialInput = {
  name: '',
  email: '',
  phone: '',
  state: '',
  district: '',
  tehsil: '',
  village: '',
  address: '',
  tax: '',
};

// <-- here we initialize with a `files` array, not `images`
const initialDocuments: DocumentItem[] = [
  { type: '', number: '', files: [] },
];

const Distribution = () => {
  const [inputData, setInputData] = useState(initialInput);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [documents, setDocuments] = useState<DocumentItem[]>(initialDocuments);
  const [loading, setLoading] = useState(false);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^\d{10}$/;

  const handleInputChange = (field: keyof typeof initialInput, value: string) => {
    setInputData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handleAddDocument = () => {
    if (documents.length < 4) {
      setDocuments(prev => [...prev, { type: '', number: '', files: [] }]);
    }
  };
  const requestStoragePermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  };
  const validateForm = () => {
    let valid = true;
    const newErrors: Record<string, string> = {};

    // Basic fields
    if (!inputData.name.trim()) {
      newErrors.name = 'Name is required';
      valid = false;
    }
    if (!inputData.email.trim()) {
      newErrors.email = 'Email is required';
      valid = false;
    } else if (!emailRegex.test(inputData.email.trim())) {
      newErrors.email = 'Invalid email format';
      valid = false;
    }
    if (!inputData.phone.trim()) {
      newErrors.phone = 'Phone is required';
      valid = false;
    } else if (!phoneRegex.test(inputData.phone.trim())) {
      newErrors.phone = 'Phone must be 10 digits';
      valid = false;
    }
    if (!inputData.tax.trim()) {
      newErrors.tax = 'GST No. is required';
      valid = false;
    }
    ['state', 'district', 'tehsil', 'village', 'address'].forEach(f => {
      if (!(inputData as any)[f].trim()) {
        newErrors[f] = `${f.charAt(0).toUpperCase() + f.slice(1)} is required`;
        valid = false;
      }
    });

    // Documents
    documents.forEach((doc, idx) => {
      if (!doc.type.trim()) {
        newErrors[`doc${idx}_type`] = 'Document name is required';
        valid = false;
      }
      if (!doc.number.trim()) {
        newErrors[`doc${idx}_number`] = 'Document number is required';
        valid = false;
      }
      if (doc.files.length === 0) {
        newErrors[`doc${idx}_files`] = 'At least one image or PDF is required';
        valid = false;
      }
    });

    setErrors(newErrors);
    return valid;
  };

  const pickMedia = async (mode: 'camera' | 'gallery', index: number) => {
    const options = { mediaType: 'photo', selectionLimit: 2 };
    try {
      const result =
        mode === 'camera'
          ? await launchCamera(options)
          : await launchImageLibrary(options);

      if (result.assets && result.assets.length > 0) {
        const picked = result.assets.map(asset => ({
          uri: asset.uri!,
          name: asset.fileName || `photo_${Date.now()}.jpg`,
          type: asset.type || 'image/jpeg',
          fileType: 'image' as const,
        }));
        setDocuments(prev => {
          const updated = [...prev];
          updated[index].files = picked;
          return updated;
        });
        setErrors(prev => ({ ...prev, [`doc${index}_files`]: '' }));
      }
    } catch {
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const pickPdf = async (index) => {
    try {
      const [file] = await pick({
        type: ['application/pdf'],
        allowMultiSelection: false,
      });
      if (!file) return;

      // Keep a local copy for upload
      const [localCopy] = await keepLocalCopy({
        files: [
          {
            uri: file.uri,
            fileName: file.name ?? 'document.pdf',
          },
        ],
        destination: 'documentDirectory',
      });

      // Always use the file:// URI for upload
      const fileUri = localCopy.localUri || localCopy.LocalUri || localCopy.sourceUri;

      const updated = [...documents];
      updated[index].files = [
        {
          uri: fileUri,
          name: file.name || 'document.pdf',
          type: 'application/pdf',
          fileType: 'pdf',
        },
      ];
      setDocuments(updated);
      setErrors((prev) => ({ ...prev, [`doc${index}_files`]: '' }));
    } catch (err) {
      if (!isCancel(err)) {
        Alert.alert('Error', 'Failed to pick PDF');
      }
    }
  };



  const handleAddFile = (index: number) => {
    Alert.alert('Select File', 'Choose an option', [
      { text: 'Camera', onPress: () => pickMedia('camera', index) },
      { text: 'Gallery', onPress: () => pickMedia('gallery', index) },
      { text: 'PDF', onPress: () => pickPdf(index) },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setLoading(true);

    const formData = new FormData();
    Object.entries(inputData).forEach(([key, val]) => {
      formData.append(
        key === 'address'
          ? 'adresse'
          : key === 'tax'
            ? 'tax_number'
            : key,
        val
      );
    });
    console.log('data', documents)
    documents.forEach((doc, idx) => {
      const i = idx + 1;
      formData.append(`document${i}_type`, doc.type);
      formData.append(`document${i}_number`, doc.number);
      doc.files.forEach((file, j) => {
        formData.append(`document${i}_image[]`, {
          uri: file.uri, // always file://
          name: file.name,
          type: file.type,
        });
      });
    });


    console.log('formmdata', formData)
    try {
      const token = await getLocalStorageData(STORAGE_KEYS.token);
      if (!token) {
        Alert.alert('Error', 'No token found');
        setLoading(false); // <-- FIXED
        return;
      }
      const res = await axios.post(
        `${API_URL}${ENDPOINTS.distrubution}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data?.success) {
        Alert.alert('Success', res.data.message || 'Registered!');
        setInputData(initialInput);
        setDocuments(initialDocuments);
        setErrors({});
      } else {
        Alert.alert('Error', res.data.message || 'Registration failed');
      }
    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        console.error('Submit PDF Error:', err.response?.status, err.response?.data);
        setLoading(false)
        const serverMsg = err.response?.data?.message;
        Alert.alert('Error', serverMsg || err.message);
      } else {
        console.error('Unexpected Submit Error:', err);
        Alert.alert('Error', 'Something went wrong');
      }
    } finally {
      setLoading(false);
    }
  };


  return (
    <KeyboardAvoidingContainer>
      <SafeAreaView style={styles.container}>
        <ScrollView>
          <View style={styles.container}>
            <CustomText
              type="heading"
              color={COLORS.textColor}
              fontWeight="bold"
              style={{
                textAlign: 'center',
                marginVertical: verticalScale(20),
                fontSize: responsiveFontSize(26),
              }}
            >
              Distributor
            </CustomText>

            {[
              { label: 'Name', field: 'name', keyboard: 'default' },
              { label: 'Email', field: 'email', keyboard: 'default' },
              { label: 'Phone No.', field: 'phone', keyboard: 'numeric' },
              { label: 'GST No.', field: 'tax', keyboard: 'numeric' },
              { label: 'State', field: 'state', keyboard: 'default' },
              { label: 'District', field: 'district', keyboard: 'default' },
              { label: 'Tehsil', field: 'tehsil', keyboard: 'default' },
              { label: 'Village', field: 'village', keyboard: 'default' },
              { label: 'Address', field: 'address', keyboard: 'default' },
            ].map(({ label, field, keyboard }) => (
              <View key={field}>
                <CustomText
                  type="title"
                  color={COLORS.textColor}
                  fontWeight="bold"
                  style={styles.txt}
                >
                  {label}
                </CustomText>
                <CustomInput
                  style={styles.input}
                  keyboardType={keyboard as any}
                  value={inputData[field as keyof typeof inputData]}
                  placeholder={`Enter your ${label.toLowerCase()}`}
                  onChangeText={v =>
                    handleInputChange(field as any, v)
                  }
                />
                {errors[field] && (
                  <Text style={{ color: 'red', marginLeft: 10 }}>
                    {errors[field]}
                  </Text>
                )}
              </View>
            ))}

            {documents.length < 4 && (
              <View style={styles.view}>
                <TouchableOpacity
                  style={styles.tchbtn}
                  onPress={handleAddDocument}
                >
                  <Text style={{ color: COLORS.textColor }}>
                    Add Document
                  </Text>
                  <View style={styles.view2}>
                    <Text style={{ color: '#fff', fontWeight: 'bold' }}>
                      +
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            )}

            {documents.map((doc, idx) => (
              <View key={idx} style={{ marginBottom: 20 }}>
                {/* ...type and number inputs */}
                <CustomText
                  type="title"
                  color={COLORS.textColor}
                  fontWeight="bold"
                  style={styles.txt}
                >
                  Document Name
                </CustomText>
                <CustomInput
                  style={styles.input}
                  keyboardType="default"
                  value={doc.type}
                  placeholder="Enter your document name"
                  onChangeText={(v) => {
                    const updated = [...documents];
                    updated[idx].type = v;
                    setDocuments(updated);
                  }}
                />
                {errors[`doc${idx}_type`] && (
                  <Text style={{ color: 'red', marginLeft: 10 }}>
                    {errors[`doc${idx}_type`]}
                  </Text>
                )}

                <CustomText
                  type="title"
                  color={COLORS.textColor}
                  fontWeight="bold"
                  style={styles.txt}
                >
                  Document Number
                </CustomText>
                <CustomInput
                  style={styles.input}
                  keyboardType="default"
                  value={doc.number}
                  placeholder="Enter your document number"
                  onChangeText={(v) => {
                    const updated = [...documents];
                    updated[idx].number = v;
                    setDocuments(updated);
                  }}
                />
                {errors[`doc${idx}_number`] && (
                  <Text style={{ color: 'red', marginLeft: 10 }}>
                    {errors[`doc${idx}_number`]}
                  </Text>
                )}

                {/* File Thumbnails */}
                <View style={{ flexDirection: 'row', marginVertical: 10 }}>
                  {doc.files.map((file, j) =>
                    file.fileType === 'pdf' ? (
                      <TouchableOpacity
                        key={j}
                        onPress={() => {
                          // Optionally, open PDF in a viewer
                          Alert.alert('PDF', file.name || 'PDF File');
                        }}
                        style={{
                          width: 60,
                          height: 60,
                          borderRadius: 8,
                          marginRight: 10,
                          borderWidth: 1,
                          borderColor: '#ccc',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: '#f2f2f2'
                        }}
                      >
                        <Image source={IMAGES.pdficon} style={{ width: 32, height: 32 }} />
                        <Text numberOfLines={1} style={{ fontSize: 10 }}>{file.name}</Text>
                      </TouchableOpacity>
                    ) : (
                      <Image
                        key={j}
                        source={{ uri: file.uri }}
                        style={{
                          width: 60,
                          height: 60,
                          borderRadius: 8,
                          marginRight: 10,
                          borderWidth: 1,
                          borderColor: '#ccc',
                        }}
                      />
                    )
                  )}
                </View>
                {errors[`doc${idx}_files`] && (
                  <Text style={{ color: 'red', marginLeft: 10 }}>
                    {errors[`doc${idx}_files`]}
                  </Text>
                )}

                <TouchableOpacity
                  style={styles.tchbtn2}
                  onPress={() => handleAddFile(idx)}
                >
                  <Text style={{ color: '#fff', fontWeight: 'bold' }}>
                    {doc.files.length ? 'Change Images / PDF' : 'Add Images / PDF'}
                  </Text>
                </TouchableOpacity>
              </View>
            ))}

            <TouchableOpacity
              style={styles.tchbtn2}
              onPress={handleSubmit}
              disabled={loading}
            >
              <Text style={{ color: '#fff', fontWeight: 'bold' }}>
                {loading ? 'Submitting...' : 'Submit'}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingContainer>
  );
};

export default Distribution;
