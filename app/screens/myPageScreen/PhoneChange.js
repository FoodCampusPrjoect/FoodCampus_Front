import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import CustomText from '../../components/CustomText';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUserData, updatePhoneNumber } from '../../api/api';
import { useNavigation } from '@react-navigation/native';
import CustomTextInput from '../../components/CustomTextInput'; // 커스텀 컴포넌트 임포트
import { color } from 'react-native-elements/dist/helpers';

export default function PhoneChange() {
  const [currentPhone, setCurrentPhone] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [token, setToken] = useState(null);

  const navigation = useNavigation();

  useEffect(() => {
    const fetchTokenAndUserData = async () => {
      try {
        // AsyncStorage에서 토큰을 가져옴
        const storedToken = await AsyncStorage.getItem('accessToken');
        setToken(storedToken);

        if (storedToken) {
          // 토큰이 있으면 사용자 정보를 가져옵니다.
          const userData = await getUserData(storedToken);
          if (userData && userData.phone) {
            setCurrentPhone(userData.phone);
          }
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      }
    };

    fetchTokenAndUserData();
  }, []);

  const onChangeCurrentPhone = (inputText) => {
    setCurrentPhone(inputText);
  };

  const onChangeNewPhone = (inputText) => {
    setNewPhone(inputText);
  };

  const onPressChangePhone = async () => {
    if (!newPhone) {
      Alert.alert('알림', '변경할 전화번호를 입력하세요.');
      return;
    }

    try {
      await updatePhoneNumber(token, newPhone);
       // 전화번호 변경 성공 시 새로운 전화번호를 AsyncStorage에 저장
      await AsyncStorage.setItem('phone', newPhone); // 변경된 전화번호를 AsyncStorage에 저장
      Alert.alert('성공', '전화번호가 성공적으로 변경되었습니다.', [
        {
          text: 'OK',
          onPress: () => {
            setCurrentPhone(newPhone); // 현재 전화번호 업데이트
            setNewPhone(''); // 입력 필드 초기화
            navigation.navigate('Profile'); // Profile 화면으로 이동
          },
        },
      ]);
    } catch (error) {
      Alert.alert('오류', '전화번호 변경에 실패했습니다. 다시 시도하세요.');
    }
  };

  const customTextStyle = {
    fontFamily: 'GmarketSansMedium',
    color: 'gray'
  };

  return (
    <View style={styles.back}>
      <View>
        <CustomText style={styles.title}>현재 전화번호</CustomText>
      </View>

      <View style={styles.container}>
      <CustomTextInput
            onChangeText={onChangeCurrentPhone}
            value={currentPhone}
            placeholder="입력된 번호가 없습니다"
            customTextStyle={customTextStyle}
            editable={false}
          />

      </View>

      <View>
        <CustomText style={styles.title}>변경할 전화번호</CustomText>
      </View>

      <View style={styles.container}>
        <CustomTextInput
          onChangeText={onChangeNewPhone}
          value={newPhone}
          placeholder="변경할 전화번호를 입력하세요"
          customTextStyle={customTextStyle}
          keyboardType="phone-pad"
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={onPressChangePhone}>
        <CustomText style={styles.buttonText}>변경하기</CustomText>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 25,
    margin: 20,
    marginLeft: 35,
  },
  container: {
    paddingHorizontal: 30,
  },
  input: {
    height: 50,
    borderColor: '#dbdbdb',
    borderWidth: 1,
    paddingHorizontal: 8,
    fontSize: 20,
    color: '#383A39',
    borderRadius: 4,
  },
  back: {
    backgroundColor: 'white',
    flex: 1,
  },
  button: {
    backgroundColor: '#4FAF5A',
    margin: 40,
    padding: 13,
    borderRadius: 100,
    alignItems: 'center',
    alignSelf: 'flex-end',
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
  },
});