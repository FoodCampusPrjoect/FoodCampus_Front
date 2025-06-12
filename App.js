import React, { useEffect, useState } from 'react';
import MainScreen from './app/screens/mainScreen/MainScreen';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginPage from './app/screens/loginScreen/LoginPage';
import EmailLoginScreen from './app/screens/loginScreen/EmailLoginScreen';
import TermsScreen from './app/screens/loginScreen/TermsScreen';
import SignUpScreen from './app/screens/loginScreen/SignUpScreen';
import FindPwScreen from './app/screens/loginScreen/FindPwScreen';
import StoreEvalutaion from './app/screens/mainScreen/StoreEvaluation';
import Splash from './app/screens/loginScreen/Splash';
import { StyleSheet, Text, View } from 'react-native';

import MyPageScreen from './app/screens/myPageScreen/MyPageScreen';
import DetailStoreScreen from'./app/screens/storeScreen/DetailStoreScreen';
import MyReview from './app/screens/myPageScreen/MyReview';
import ProfileUpdate from './app/screens/myPageScreen/ProfileUpdate';
import Setting from './app/screens/myPageScreen/SettingScreen';
import PhoneChange from './app/screens/myPageScreen/PhoneChange';
import PasswordChange from './app/screens/myPageScreen/PasswordChange';
import NicknameChange from './app/screens/myPageScreen/NicknameChange';
import ImageUpdate from './app/screens/myPageScreen/ImageUpdate';

import SearchScreen from './app/screens/mainScreen/SearchScreen';
import StoreUpScreen from './app/screens/storeScreen/StoreUpScreen';
import * as Font from 'expo-font';
import KakaoLoginScreen from './app/screens/loginScreen/KakaoLoginScreen';
import CustomText from './app/components/CustomText';
import StoreManagement from'./app/screens/storeScreen/StoreManagement.js'
import StoreUpdateScreen from'./app/screens/storeScreen/StoreUpdateScreen.js'
import SearchAddress from './app/components/SearchAddress.js'; 
import KakaoMap from './app/components/KakaoMap';


const Stack = createStackNavigator();

function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  async function loadFonts() {
    await Font.loadAsync({
      'GmarketSansBold': require('./assets/fonts/GmarketSansTTFBold.ttf'),
      'GmarketSansLight': require('./assets/fonts/GmarketSansTTFLight.ttf'),
      'GmarketSansMedium': require('./assets/fonts/GmarketSansTTFMedium.ttf'),
    });
    setFontsLoaded(true);
  }

  useEffect(() => {
    loadFonts();
  }, []);

  if (!fontsLoaded) {
    return null; // 폰트가 로드되기 전에는 null을 반환하여 아무것도 렌더링하지 않습니다.
  }

  return (
    <NavigationContainer>
       <Stack.Navigator initialRouteName="Splash">
        <Stack.Screen name="Splash" component={Splash} options={{ headerTitle: () => (<Text style={styles.navText}>  </Text>), }} />
        <Stack.Screen name="MainScreen" component={MainScreen} options={{ headerShown: false }} />
        <Stack.Screen name="store" component={DetailStoreScreen} />
        <Stack.Screen name="Login" component={LoginPage} options={{ headerTitle: () => (
          <CustomText style={styles.navText}>로그인</CustomText> ),headerTitleAlign:'center',}}/>

        <Stack.Screen name="EmailLogin" component={EmailLoginScreen} options={{ headerTitle: () => (
          <CustomText style={styles.navText}>이메일 로그인</CustomText> ),headerTitleAlign:'center',}}/>

        <Stack.Screen name="Terms" component={TermsScreen} options={{ headerTitle: () => (
          <CustomText style={styles.navText}>약관 동의</CustomText> ),headerTitleAlign:'center',}}/>

        <Stack.Screen name="SignUp" component={SignUpScreen} options={{ headerTitle: () => (
          <CustomText style={styles.navText}>회원가입</CustomText> ),headerTitleAlign:'center',}}/>

        <Stack.Screen name="FindPw" component={FindPwScreen} />
        <Stack.Screen name="Evaluation" component={StoreEvalutaion} options={{ headerTitle: () => (
          <CustomText style={styles.navText}>평가하기</CustomText> ),headerTitleAlign:'center',}}/>
        <Stack.Screen name="MyPageScreen" component={MyPageScreen} />
        <Stack.Screen name="KakaoLogin" component={KakaoLoginScreen} options={{ headerTitle: () => (
          <CustomText style={styles.navText}>카카오 로그인</CustomText> ),headerTitleAlign:'center',}}/>

        <Stack.Screen name="SearchScreen" component={SearchScreen} />

        <Stack.Screen name="DetailStoreScreen" component={DetailStoreScreen}
        options={{headerTitle:()=>(
          <CustomText style={styles.navText}>가게 페이지</CustomText>

        ),headerTitleAlign:'center',
      }}
        
        />

        <Stack.Screen name="MyReview" component={MyReview}
        options={{
          headerTitle: () => (
            <CustomText style={styles.title}>리뷰 관리</CustomText>
          ),
          headerTitleAlign: 'center'
        }} />

        <Stack.Screen name="ProfileUpdate" component={ProfileUpdate}
        options={{
          headerTitle: () => (
            <CustomText style={styles.title}>프로필 수정</CustomText>
          ),
          headerTitleAlign: 'center'
        }} />

        <Stack.Screen name="Setting" component={Setting}
        options={{
          headerTitle: () => (
            <CustomText style={styles.title}>설정</CustomText>
          ),
          headerTitleAlign: 'center'
        }} />

        <Stack.Screen name="PhoneChange" component={PhoneChange}
        options={{
          headerTitle: () => (
            <CustomText style={styles.title}>전화번호 변경</CustomText>
          ),
          headerTitleAlign: 'center'
        }} />

        <Stack.Screen name="PasswordChange" component={PasswordChange}
        options={{
          headerTitle: () => (
            <CustomText style={styles.title}>비밀번호 변경</CustomText>
          ),
          headerTitleAlign: 'center'
        }} />

        <Stack.Screen name="NicknameChange" component={NicknameChange}
        options={{
          headerTitle: () => (
            <CustomText style={styles.title}>닉네임 변경</CustomText>
          ),
          headerTitleAlign: 'center'
        }} />
        <Stack.Screen name="ImageUpdate" component={ImageUpdate} options={{ headerTitle: () => (
          <CustomText style={styles.navText}>프로필사진 수정</CustomText> ),headerTitleAlign:'center',}}/>

        
        <Stack.Screen name="StoreUpScreen" component={StoreUpScreen} options={{headerTitle:()=>(
        <CustomText style={styles.navText}>가게등록</CustomText> ),headerTitleAlign:'center',}}/>

        <Stack.Screen name="StoreManagement" component={StoreManagement} options={{headerTitle:()=>(
        <CustomText style={styles.navText}>가게관리</CustomText> ),headerTitleAlign:'center',}}/>

        <Stack.Screen name="StoreUpdateScreen" component={StoreUpdateScreen} options={{headerTitle:()=>(
        <CustomText style={styles.navText}>가게수정</CustomText> ),headerTitleAlign:'center',}}/>

        <Stack.Screen name="SearchAddress" component={SearchAddress} options={{ headerTitle: () => (
        <CustomText style={styles.navText}>주소 검색</CustomText>), headerTitleAlign: 'center', }} />

        <Stack.Screen name="KakaoMap" component={KakaoMap} options={{ headerTitle: () => (
        <CustomText style={styles.navText}>지도에서 주소 선택</CustomText>), headerTitleAlign: 'center', }} />

      
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({  
  container: {
    flex: 1,
    backgroundColor: 'White',  
  },
  navText:{
    fontSize:21,
    fontFamily: 'GmarketSansBold'
  },
  title: {
    fontSize: 30,
    fontFamily: 'GmarketSansBold',
  },
});

export default App;