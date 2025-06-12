import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import CustomText from '../../components/CustomText';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation hook
import { getUserData, updateNickname } from '../../api/api';
import CustomTextInput from '../../components/CustomTextInput'; // 커스텀 컴포넌트 임포트
import { color } from 'react-native-elements/dist/helpers';

export default function NicknameChange() {
  const navigation = useNavigation(); // Initialize navigation object
  const [currentNickname, setCurrentNickname] = useState('');
  const [newNickname, setNewNickname] = useState('');
  const [token, setToken] = useState(null);

  useEffect(() => {
    const fetchTokenAndUserData = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('accessToken');
        setToken(storedToken);

        if (storedToken) {
          const userData = await getUserData(storedToken);
          if (userData && userData.nickname) {
            setCurrentNickname(userData.nickname);
          }
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      }
    };

    fetchTokenAndUserData();
  }, []);

  const onChangeCurrentNickname = (inputText) => {
    setCurrentNickname(inputText);
  };

  const onChangeNewNickname = (inputText) => {
    setNewNickname(inputText);
  };

  const onPressChangeNickname = async () => {
    if (!newNickname) {
      Alert.alert('알림', '변경할 닉네임을 입력하세요.');
      return;
    }

    try {
      await updateNickname(token, newNickname);
      Alert.alert('성공', '닉네임이 성공적으로 변경되었습니다.', [
        {
          text: 'OK',
          onPress: () => {
            setCurrentNickname(newNickname);
            setNewNickname('');
            navigation.navigate('Home'); // Navigate to MainScreen
          },
        },
      ]);
    } catch (error) {
      Alert.alert('오류', '닉네임 변경에 실패했습니다. 다시 시도하세요.');
    }
  };

  const customTextStyle = {
    fontFamily: 'GmarketSansMedium',
    color: 'gray'
  };

  return (
    <View style={styles.back}>
      <View>
        <CustomText style={styles.title}>현재 닉네임</CustomText>
      </View>

      <View style={styles.container}>
        <CustomTextInput
          onChangeText={onChangeCurrentNickname}
          value={currentNickname}
          placeholder='입력된 닉네임이 없습니다'
          customTextStyle={customTextStyle}
          editable={false}
        />
      </View>

      <View>
        <CustomText style={styles.title}>변경할 닉네임</CustomText>
      </View>

      <View style={styles.container}>
        <CustomTextInput
          onChangeText={onChangeNewNickname}
          value={newNickname}
          placeholder='변경할 닉네임을 입력하세요'
          customTextStyle={customTextStyle}
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={onPressChangeNickname}>
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
