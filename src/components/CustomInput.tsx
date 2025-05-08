import React, {FC, useState} from 'react';
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  KeyboardTypeOptions,
} from 'react-native';
import {CustomText} from './CustomText';
import {
  horizontalScale,
  responsiveFontSize,
  verticalScale,
} from '../utils/Metrics';
import COLORS from '../utils/Colors';
import VectorIcon from './VectorIcon';

type CustomInputProps = {
  placeholder: string;
  type?: 'text' | 'password' | 'search' | 'date';
  onChangeText: (text: string) => void;
  value: string;
  style?: object;
  isFilterIcon?: boolean;
  onFilterPress?: () => void;
  label?: string;
  heigth?: number;
  disabled?: boolean;
  maxDate?: Date;
  keyboardType?: KeyboardTypeOptions;
};

const CustomInput: FC<CustomInputProps> = ({
  placeholder,
  onChangeText,
  value,
  style,
  type = 'text',
  label,
  isFilterIcon = false,
  heigth = 56,
  disabled = false,
  keyboardType,
  maxDate = new Date(),
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false); // State to toggle password visibility

  return (
    <View
      style={[
        style,
        {
          gap: verticalScale(5),
        },
      ]}>
      {label && <CustomText fontFamily="medium">{label}</CustomText>}

      <View
        style={[
          styles.container, // Base container style
          type === 'search' && {gap: horizontalScale(10)}, // Add gap for search type
        ]}>
        {/* Render a search icon for search type */}
        {type === 'search' && (
          <VectorIcon type="AntDesign" name="search1" size={20} />
        )}
        <TouchableOpacity
          activeOpacity={0.9}
          style={[{flex: 1, height: heigth}]}
          disabled={disabled ? disabled : type !== 'date'}>
          <View
            pointerEvents={type === 'date' ? 'none' : 'auto'}
            style={{flex: 1, opacity: disabled ? 0.7 : 1}}>
            <TextInput
              keyboardType={keyboardType}
              style={[styles.input]} // Input field style
              placeholder={placeholder} // Placeholder text
              placeholderTextColor={COLORS.placeholder} // Placeholder text color
              secureTextEntry={type === 'password' && !isPasswordVisible} // Hide input text for password type if visibility is off
              onChangeText={onChangeText} // Handle text change
              value={value} // Display current value
              editable={disabled ? false : type !== 'date'}
            />
          </View>
        </TouchableOpacity>

        {/* Toggle password visibility for password type */}
        {type === 'password' && (
          <TouchableOpacity
            style={styles.iconContainer} // Style for the icon container
            // onPress={togglePasswordVisibility} // Toggle visibility on icon press
          >
            <VectorIcon type="Feather" name="eye" size={20} />
          </TouchableOpacity>
        )}

        {/* Render filter icon for search type */}
        {type === 'search' && isFilterIcon && (
          <VectorIcon type="AntDesign" name="search1" size={20} />
        )}
      </View>
    </View>
  );
};

export default CustomInput;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 25,
    paddingHorizontal: horizontalScale(15),
    backgroundColor: COLORS.inputBackground,
    borderWidth: 1,
    borderColor: COLORS.placeholder,
  },
  input: {
    flex: 1,
    fontSize: responsiveFontSize(14),
    color:COLORS.black
 
  },
  iconContainer: {
    marginLeft: 10,
  },
});

