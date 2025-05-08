import {StyleSheet} from 'react-native';
import COLORS from '../../utils/Colors';
import {verticalScale} from '../../utils/Metrics';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundColor,
    // justifyContent: '',
  },
  inputContainer: {
    gap: verticalScale(30),
    marginVertical: verticalScale(30),
    padding:20
  },
})
export default styles;