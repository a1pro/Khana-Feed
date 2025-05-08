import {StyleSheet} from 'react-native';
import { verticalScale } from '../../utils/Metrics';


const styles = StyleSheet.create({
  container: {flex: 1},
  logo:{
    height:100,
    width:100,
    resizeMode:'contain',
    paddingVertical:"40%",
    alignSelf:"center"
    
  },
  inputContainer: {
    gap: verticalScale(30),
    marginVertical: verticalScale(30),
    padding:20
  },
 
});

export default styles;
