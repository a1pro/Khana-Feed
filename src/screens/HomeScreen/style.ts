import {StyleSheet} from 'react-native';
import COLORS from '../../utils/Colors';
import {verticalScale} from '../../utils/Metrics';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundColor,
    // justifyContent: '',
  },
  logo:{
    height:60,
    width:60,
    resizeMode:'contain',
    alignSelf:"center"
    
  },
  logo2:{
    height:30,
    width:30,
    borderRadius:20,
    resizeMode:'contain',
    alignSelf:"center",
    right:10
  },
  logo3:{
    height:"30%",
    width:"60%",
    borderRadius:200,
    resizeMode:'contain',
    alignSelf:"center",
    marginBottom:verticalScale(30)
    // backgroundColor:"black"
    // right:10
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor:COLORS.appColor,
    height:"15%",
    borderBottomRightRadius:30,
    borderBottomLeftRadius:30
  },
view1: {
  width: '90%',
  flexDirection:"row",
  alignSelf: 'center',
  alignItems: 'center',
  justifyContent: 'space-around',
  paddingVertical: 20,
  backgroundColor: COLORS.backgroundColor,
  borderRadius: 12,
  marginVertical: 10,
}
});

export default styles;