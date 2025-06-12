import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import CustomText from '../../components/CustomText';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { updatePassword } from '../../api/api';

export default function PasswordChange({ navigation }) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('accessToken');
        if (storedToken) {
          setToken(storedToken);
        } else {
          console.error('No token found');
        }
      } catch (error) {
        console.error('Failed to fetch token:', error);
      }
    };

    fetchToken();
  }, []);

  const toggleShowCurrentPassword = () => {
    setShowCurrentPassword(!showCurrentPassword);
  };

  const toggleShowNewPassword = () => {
    setShowNewPassword(!showNewPassword);
  };

  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const onPressChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      Alert.alert('오류', '비밀번호와 비밀번호 확인이 일치하지 않습니다.');
      return;
    }

    if (!currentPassword || !newPassword) {
      Alert.alert('오류', '현재 비밀번호와 새로운 비밀번호를 입력하세요.');
      return;
    }

    try {
      await updatePassword(token, currentPassword, newPassword);
      Alert.alert('성공', '비밀번호가 성공적으로 변경되었습니다.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      // 변경 후 메인 화면으로 이동
      navigation.navigate('Home');
    } catch (error) {
      Alert.alert('오류', '비밀번호 변경에 실패했습니다. 다시 시도하세요.');
    }
  };

  return (
    <View style={styles.back}>
      <CustomText style={styles.title}>현재 비밀번호</CustomText>
      <View style={styles.container}>
        <TextInput
          onChangeText={setCurrentPassword}
          value={currentPassword}
          placeholder='현재 비밀번호를 입력하세요'
          style={[styles.input]}
          secureTextEntry={!showCurrentPassword}
        />
        <TouchableOpacity style={styles.showPasswordButton} onPress={toggleShowCurrentPassword}>
          <CustomText style={styles.showPasswordButtonText}>{showCurrentPassword ? '숨기기' : '보이기'}</CustomText>
        </TouchableOpacity>
      </View>

      <CustomText style={styles.title}>새로운 비밀번호</CustomText>
      <View style={styles.container}>
        <TextInput
          onChangeText={setNewPassword}
          value={newPassword}
          placeholder='새로운 비밀번호를 입력하세요'
          style={[styles.input]}
          secureTextEntry={!showNewPassword}
        />
        <TouchableOpacity style={styles.showPasswordButton} onPress={toggleShowNewPassword}>
          <CustomText style={styles.showPasswordButtonText}>{showNewPassword ? '숨기기' : '보이기'}</CustomText>
        </TouchableOpacity>
      </View>

      <CustomText style={styles.title}>비밀번호 확인</CustomText>
      <View style={styles.container}>
        <TextInput
          onChangeText={setConfirmPassword}
          value={confirmPassword}
          placeholder='비밀번호를 다시 입력하세요'
          style={[styles.input]}
          secureTextEntry={!showConfirmPassword}
        />
        <TouchableOpacity style={styles.showPasswordButton} onPress={toggleShowConfirmPassword}>
          <CustomText style={styles.showPasswordButtonText}>{showConfirmPassword ? '숨기기' : '보이기'}</CustomText>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.button} onPress={onPressChangePassword}>
        <CustomText style={styles.buttonText}>변경하기</CustomText>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    margin: 20,
    marginLeft: 35,
    fontFamily:'GmarketSansBold'
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: '#dbdbdb',
    borderWidth: 1,
    paddingHorizontal: 8,
    fontSize: 15,
    borderRadius: 4,
    fontFamily: 'GmarketSansMedium',
  },
  back: {
    backgroundColor: 'white',
    flex: 1,
  },
  button: {
    backgroundColor: '#4FAF5A',
    margin: 30,
    padding: 12,
    borderRadius: 100,
    alignItems: 'center',
    alignSelf: 'flex-end',
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
    fontFamily:'GmarketSansMedium'
  },
  showPasswordButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  showPasswordButtonText: {
    color: '#8C8C8C',
    fontSize: 16,
    fontFamily:'GmarketSansBold'
  },
});