import {StyleSheet} from 'react-native';
import { responsiveFontSize, verticalScale } from '../../utils/Metrics';


const styles = StyleSheet.create({
  container: {flex: 1},
  logo:{
    height:100,
    width:100,
    resizeMode:'contain',
    paddingVertical:"30%",
    alignSelf:"center"
    
  },
  inputContainer: {
    gap: verticalScale(10),
    marginVertical: verticalScale(20),
    padding:20
  },
  error:{
    fontSize:responsiveFontSize(16),
    color:"red",
    marginHorizontal:verticalScale(10)
  }
 
});

export default styles;
