import React, { useState } from 'react';
import { TextInput, Text, View, StyleSheet } from 'react-native';

const CustomTextInput = ({ onChangeText, value, placeholder, customTextStyle, editable = true, keyboardType = 'default', secureTextEntry = false }) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={{ position: 'relative' }}>
      {!isFocused && !value && (
        <Text style={[styles.placeholder, customTextStyle]}>
          {placeholder}
        </Text>
      )}
      <TextInput
        onChangeText={onChangeText}
        value={value}
        style={[styles.input, customTextStyle]}
        editable={editable}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    height: 50,
    borderColor: '#dbdbdb',
    borderWidth: 1,
    paddingHorizontal: 8,
    fontSize: 20,
    color: '#383A39',
    borderRadius: 4
  },
  placeholder: {
    position: 'absolute',
    left: 10,
    top: 15,
    fontSize: 20,
    color: 'gray',
  },
});

export default CustomTextInput;
