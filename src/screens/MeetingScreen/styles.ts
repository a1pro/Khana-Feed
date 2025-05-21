import { StyleSheet } from 'react-native';
import COLORS from '../../utils/Colors';
import { horizontalScale, verticalScale } from '../../utils/Metrics';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: horizontalScale(10),
  },
  header: {
    flexDirection:"row",
    justifyContent:"space-between",
    alignItems: 'center',
    marginBottom: verticalScale(20),
  },
  logo: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: verticalScale(10),
  },
  logo2: {
    width: 30,
    height: 30,
    // borderRadius: 30,
    // marginBottom: verticalScale(10),
  },
dropdown: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-around',
  backgroundColor: '#4CAF50',
  width:'80%',
  borderRadius: 20,
  paddingVertical: 15,
  // paddingHorizontal: 20,
  alignSelf: 'center',
  marginVertical: verticalScale(10),
},
dropdownText: {
  color: '#fff',
  fontSize: 16,
  fontWeight: '600',
  marginRight: 8,
},
dropdownIcon: {
  width: 16,
  height: 16,
  tintColor: '#fff',
},
  textInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginVertical: verticalScale(10),
    color: '#000',
  },
  uploadLabel: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginVertical: verticalScale(10),
  },
  uploadCircle: {
    width: 200,
    height: 200,
    // borderWidth: 2,
    borderColor: '#4CAF50',
    // borderRadius: 50,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: verticalScale(20),
  },
   uploadIcon: {
    width: 150,
    height: 150,
    tintColor: '#4CAF50',
  },
  uploadIcon2: {
    width: 150,
    height: 150,
    // tintColor: '#4CAF50',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: verticalScale(10),
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  tabContainer: {
  flexDirection: 'row',
  justifyContent: 'center',
  marginTop: 10,
  marginBottom: 10,
},
tabButton: {
  flex: 1,
  paddingVertical: 10,
  backgroundColor: '#f0f0f0',
  borderBottomWidth: 2,
  borderBottomColor: 'transparent',
  alignItems: 'center',
},
tabButtonActive: {
  backgroundColor: COLORS.appColor,
  borderBottomColor: COLORS.appColor, // or any highlight color
},
tabButtonText: {
  color: COLORS.textColor,
  fontWeight: 'bold',
  fontSize: 16,
},
tabButtonTextActive: {
  color: COLORS.backgroundColor,
},
});

export default styles;
