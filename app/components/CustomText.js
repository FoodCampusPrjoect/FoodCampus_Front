import React from 'react';
import { Text, StyleSheet } from 'react-native';

const CustomText = ({ children, style, fontType, ...props }) => {
  // 폰트 타입에 따라 스타일을 결정합니다.
  const getFontStyle = () => {
    switch (fontType) {
      case 'bold':
        return styles.bold;
      case 'light':
        return styles.light;
      case 'medium':
        return styles.medium;
      default:
        return styles.default;
    }
  };

  return (
    <Text style={[getFontStyle(), style]} {...props}>
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  default: {
    fontFamily: 'GmarketSansMedium', // 기본 폰트
  },
  bold: {
    fontFamily: 'GmarketSansBold', // 볼드 폰트
  },
  light: {
    fontFamily: 'GmarketSansLight', // 라이트 폰트
  },
  medium: {
    fontFamily: 'GmarketSansMedium', // 미디엄 폰트
  },
});

export default CustomText;
