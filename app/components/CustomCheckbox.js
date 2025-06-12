import React from 'react';
import {StyleSheet, View, Pressable, Text} from 'react-native';

/**
 * Custom CheckBox
 * @param {boolean} isSelected
 * @param {Function} onValueChange
 * @param {string} size 'small'/'large'
 */
const CustomCheckbox = ({isSelected, onValueChange, size}) => {
  return (
    <Pressable
      style={[styles(isSelected, size).checkboxWrap]}
      onPress={onValueChange}>
      {isSelected && (
        <View style={styles(isSelected, size).checkboxInner}>
          <Text style={styles(isSelected, size).checkboxCheck}>✓</Text>
        </View>
      )}
    </Pressable>
  );
};

const styles = (isSelected, size) =>
  StyleSheet.create({
    checkboxWrap: {
      width: size === 'small' ? 15 : 20,
      height: size === 'small' ? 15 : 20,
      borderWidth: 1,
      borderColor: '#4FAF5A', // 예시 색상입니다.
      borderRadius: 4,
      backgroundColor: isSelected ? '#4FAF5A' : '#fff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      // iOS 그림자 스타일
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      // Android 그림자 스타일
      elevation: 5,
    },
    checkboxInner: {
      width: '70%',
      height: '70%',
      backgroundColor: '#4FAF5A',
      justifyContent: 'center',
      alignItems: 'center',
    },
    checkboxCheck: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: size === 'small' ? 10 : 14, // 크기에 따른 글자 크기 조정
      margin:-10
    },
  });

export default CustomCheckbox;
