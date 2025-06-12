import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, Alert, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomText from '../../components/CustomText';
import { getUserData } from '../../api/api';

export default function Profile() {
  const navigation = useNavigation();
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [token, setToken] = useState(null);
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    const fetchTokenAndUserData = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('accessToken');
        setToken(storedToken);
  
        if (storedToken) {
          const userData = await getUserData(storedToken);
          if (userData && userData.nickname) {
            setNickname(userData.nickname);
            setEmail(userData.email);
          }
          // 새로운 유저가 로그인했을 때 전화번호를 초기화
          if (!userData.phone) {
            await AsyncStorage.removeItem('phone');
            setPhone(null);
          } else {
            await AsyncStorage.setItem('phone', userData.phone); // 새로운 유저의 전화번호를 저장
            setPhone(userData.phone);
          }
          if (userData && userData.profileImage) {
            setProfileImage(userData.profileImage);
          }
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      }
    };
  
    fetchTokenAndUserData();
  }, []);
  
  const onPressChange = () => {
    if (!token) {
      Alert.alert('알림', '로그인 후 진행해주세요.', [
        { text: '아니오', style: 'cancel' },
        { text: '네', onPress: () => navigation.navigate('EmailLogin') },
      ], { cancelable: true });
    }
  };

  return (
    <View style={styles.back}>
    <View style={[styles.row, { backgroundColor: 'white' }]}>
      <TouchableOpacity onPress={() => navigation.navigate('ImageUpdate')}>
      {profileImage ? (
<Image style={styles.profile} source={{ uri: profileImage }} />
) : (
<Image style={styles.profile2} source={require('../../../assets/images/basic.png')} />
)}
      </TouchableOpacity>
        {token ? (
          <View>
            <TouchableOpacity onPress={() => navigation.navigate('NicknameChange')}>
              <CustomText style={styles.nickname}>{nickname}</CustomText>
            </TouchableOpacity>
          </View>
        ) : (
          <View>
            <TouchableOpacity onPress={onPressChange}>
              <CustomText style={styles.nickname}>회원이 아닙니다</CustomText>
            </TouchableOpacity>
          </View>
        )}
      </View>
      <View style={styles.separator} />

      <View style={{ backgroundColor: 'white' }}>
        <CustomText style={styles.choice}>이메일</CustomText>

        {token ? (
            <View>
              <CustomText style={styles.content}>{email}</CustomText>
            </View>
          ) : (
            <View>
              <CustomText style={styles.content}>로그인 후 확인 가능합니다</CustomText>
            </View>
          )}
          </View>
        <View style={styles.separator} />

        <View style={{ backgroundColor: 'white' }}>
          <CustomText style={styles.choice}>전화번호</CustomText>
          {token ? (
            <View>
             <TouchableOpacity onPress={() => navigation.navigate('PhoneChange')}>
  {phone !== null ? (
    <CustomText style={styles.content}>{phone}</CustomText>
  ) : (
    <CustomText style={styles.content}>전화번호가 없습니다</CustomText>
  )}
</TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity onPress={onPressChange}>
              <CustomText style={styles.content}>로그인 후 확인 가능합니다</CustomText>
            </TouchableOpacity>
          )}
        </View>
      <View style={styles.separator} />

      <TouchableOpacity onPress={() => navigation.navigate('PasswordChange')}>
        <View style={{ backgroundColor: 'white' }}>
          <CustomText style={styles.choice}>비밀번호 변경</CustomText>
        </View>
      </TouchableOpacity>
      <View style={styles.separator} />
    </View>
  );
}

const styles = StyleSheet.create({
title: {
  textAlign: 'center',
  margin: 20,
  fontSize: 30,
  fontFamily:"GmarketSansBold"
},
profile: {
  margin: 10,
  marginLeft: 30,
  borderRadius: 100,
  width: 110,
  height: 110,
  borderColor: '#4CAF50',
  borderWidth: 2,
},
profile2: {
  margin: 10,
  marginLeft: 30,
  borderRadius: 100,
  width: 110,
  height: 110,
  //borderColor: '#4CAF50',
  borderWidth: 2,
},
nickname: {
  margin: 10,
  marginTop: 50,
  fontSize: 26,
  fontFamily:"GmarketSansBold"
},
choice: {
  margin: 10,
  marginLeft: 20,
  marginTop: 20,
  fontSize: 25,
  fontFamily:"GmarketSansMedium"
},
content: {
  marginBottom: 20,
  marginLeft: 20,
  fontSize: 20,
  color: 'gray',
  fontFamily:"GmarketSansMedium"
},
back: {
  backgroundColor: 'white',
  flex: 1,
},
separator: {
  height: 1,
  backgroundColor: '#CCCCCC', // 구분선 색상
},
row: {
  flexDirection: 'row',
},

});