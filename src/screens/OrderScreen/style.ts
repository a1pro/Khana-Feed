import {StyleSheet} from 'react-native';
import COLORS from '../../utils/Colors';
import { verticalScale } from '../../utils/Metrics';

const styles = StyleSheet.create({
  container: {flex: 1,},
  backgroundimage:{height:"100%",width:"100%",resizeMode:"contain"},
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
    width:"80%",
    alignSelf:"center",
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 20,
    marginVertical: verticalScale(10),
    color: '#000',
  },
   tabContainer: {
    flexDirection: 'row',
    marginTop: 20,
    marginBottom: 10,
    justifyContent: 'space-evenly',
  },
  tabButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: COLORS.grey,
    borderRadius: 20,
  },
  tabSelected: {
    backgroundColor: COLORS.appColor,
  },
  tabText: {
    fontSize: 14,
    color: COLORS.black,
  },
  textSelected: {
    color: COLORS.inputBackground,
    fontWeight: 'bold',
  },
  });

export default styles;