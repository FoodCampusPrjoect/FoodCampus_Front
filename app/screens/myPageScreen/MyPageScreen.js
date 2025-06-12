import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomText from '../../components/CustomText';
import { getUserData } from '../../api/api';

const { width, height } = Dimensions.get('window');

export default function MyPage() {
  const navigation = useNavigation();
  const [nickname, setNickname] = useState('');
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(0);
  const [profileImage, setProfileImage] = useState(null);


  useEffect(() => {
    const fetchTokenAndUserData = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('accessToken');
        setToken(storedToken);
        
        if (storedToken) {
          const userData = await getUserData(storedToken);
          if (userData) {
            setNickname(userData.nickname);
            setRole(userData.role || 0); // 역할 설정, 없으면 기본값으로 0
          }
          if(userData.profileImage){
            setProfileImage(userData.profileImage);
          }
        }
        
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      }
    };
  
    fetchTokenAndUserData();
  }, []);

  const handleProfilePress = () => {
    Alert.alert(
      "알림",
      "로그인 후 진행해주세요.",
      [
        {
          text: "아니오",
          style: 'cancel'
        },
        {
          text: "네",
          onPress: () => navigation.navigate('EmailLogin'),
        },
      ],
      { cancelable: true }
    );
  };
  const handleReviewPress = () => {
    if (!token) {
      Alert.alert(
        "회원이 아닙니다",
        "로그인을 하시겠습니까?",
        [
          {
            text: "닫기",
            style: 'cancel'
          },
          {
            text: "네",
            onPress: () => navigation.navigate('EmailLogin'),
          },
        ],
        { cancelable: true }
      );
    } else {
      navigation.navigate('MyReview');
    }
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <CustomText style={styles.title}>마이 페이지</CustomText>
      </View>

      <View style={styles.profile}>
      {profileImage ? (
  <Image style={styles.pImg} source={{ uri: profileImage }} />
) : (
  <Image style={styles.pImg2} source={require('../../../assets/images/basic.png')} />
)}
        {token ? (
          <TouchableOpacity onPress={() => navigation.navigate('ProfileUpdate')}>
            <CustomText style={styles.nickname}>{nickname}</CustomText>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={handleProfilePress}>
            <CustomText style={styles.nickname}>회원이 아닙니다</CustomText>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.middle}>
  {role === 1 ? (
    <>
      <TouchableOpacity onPress={() => navigation.navigate('MyReview')}>
        <Image style={styles.storeupimg} source={require('../../../assets/images/review.png')} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Setting')}>
        <Image style={styles.img} source={require('../../../assets/images/setting.png')} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('StoreUpScreen')}>
        <Image style={styles.img2} source={require('../../../assets/images/StoreUp.png')} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('StoreManagement')}>
        <Image style={styles.img2} source={require('../../../assets/images/StoreManagement.png')} />
      </TouchableOpacity>
    </>
  ) : (
    <>
      <TouchableOpacity onPress={handleReviewPress}>
        <Image style={styles.img} source={require('../../../assets/images/review.png')} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('ProfileUpdate')}>
        <Image style={styles.img} source={require('../../../assets/images/profile.png')} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Setting')}>
        <Image style={styles.img} source={require('../../../assets/images/setting.png')} />
      </TouchableOpacity>
    </>
  )}
</View>

    {/* <View style={styles.chatbotContainer}>
            <TouchableOpacity style={styles.chatbotButton} onPress={() => navigation.navigate('ChatBot')}>
              <CustomText style={styles.chatbotButtonText}>챗봇 상담하기</CustomText>
            </TouchableOpacity>
          </View> */}
        </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: width,
    height: height,
  },
  header: {
    height: height * 0.12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white'
  },
  title: {
    fontSize: 30,
    paddingTop: 25,
    fontFamily: 'GmarketSansBold'
  },
  profile: {
    height: height * 0.26,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 5,
    marginHorizontal: 10,
    marginTop: 10,
  },
  pImg: {
    width: 130,
    height: 130,
    borderRadius: 100,
    borderColor: '#4CAF50',
    borderWidth: 2,
    marginTop:10
  },
  pImg2: {
    width: 130,
    height: 130,
    borderRadius: 100,
    borderColor: 'white',
    borderWidth: 2,
    marginTop:10
  },
  nickname: {
    marginTop: 20,
    fontSize: 30,
    fontFamily: 'GmarketSansBold'
  },
  middle: {
    height: height * 0.15,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 5,
    marginHorizontal: 10,
    marginTop: 10
  },
  img: {
    width: 75,
    height: 80
  },
  img2:{
    width: 75,
    height: 80,
    marginTop:"10%"
  },

  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: height * 0.05,
    marginLeft: 20,
    marginTop: 10,
  },
  footerText: {
    fontSize: 20,
    fontFamily: 'GmarketSansMedium'
  },
  logoutText: {
    fontSize: 20,
    color: 'red'
  },
  store: {
    height: height * 0.18,
    backgroundColor: 'white',
    borderRadius: 5,
    marginHorizontal: 10,
    flexDirection: 'row', // 가로로 배치
    alignItems: 'center', // 세로 중앙 정렬
  },
  storeInfo: {
    flex: 1, // store 컨테이너의 공간을 나눠가짐
    padding: 10,
    marginRight: 10, // 오른쪽 여백 추가
  },
  storeTitle: {
    fontSize: 20,
    marginBottom: 5
  },
  storeSubtitle: {
    fontSize: 15,
    marginBottom: 5
  },  
  storeAddress: {
    fontSize: 11,
    color: 'gray'
  },
  storeImg: {
    width: 110,
    height: 110,
    borderRadius: 5,
    resizeMode: 'cover', // 이미지가 화면을 채우도록 설정
    margin: 10,
    marginLeft: -4
  },
  storeupimg:{
    width: 75,
    height: 80,
    marginTop:5
  },
  chatbotContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  chatbotButton: {
    backgroundColor: '#4FAF5A',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  chatbotButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});