import {StyleSheet} from 'react-native';
import COLORS from '../../utils/Colors';

const styles = StyleSheet.create({
  container: {flex: 1,},
  backgroundimage:{height:"100%",width:"100%",resizeMode:"contain"},
  view1: {
    height: '40%',
    width: '80%',
    alignSelf: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundColor,
    position: 'absolute',
    bottom: 90,
    borderRadius:20 
  },
  logo:{
    height:100,
    width:100,
    resizeMode:'contain',
    paddingVertical:"30%"
    
  }
});

export default styles;
