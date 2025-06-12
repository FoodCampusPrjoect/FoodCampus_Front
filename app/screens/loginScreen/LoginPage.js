import React from 'react';
import { View, Image, Button, StyleSheet, Dimensions, Text } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import KakaoLoginImage from '../../../assets/images/kakao_login_large_wide.png';
import NaverLoginImage from '../../../assets/images/naver_login.png';
import { useNavigation } from '@react-navigation/native';


const { width, height } = Dimensions.get('window');

function LoginPage() {

  const navigation = useNavigation();

    const handleEmailLogin = () => {
      navigation.navigate('EmailLogin')
    };

    const handleKakaoLogin = () => {
      navigation.navigate('KakaoLogin')
    };

    const handleNaverLogin = () => {
        
    };

    return (  
        <>
        <View style ={styles.container}>            
        <View style={styles.loginLogoContainer}>
                <Image
                    style={styles.loginLogo} 
                    source={require("../../../assets/images/Logo2.png")} 
                />
            </View>
            <View style={styles.buttonContainer}>
                
            <TouchableOpacity style={styles.button} onPress={handleEmailLogin}>
                <Text style={styles.buttonText}>이메일로 로그인</Text>
            </TouchableOpacity>
            
                <TouchableOpacity style={[styles.button, styles.kakaoButton]} onPress={handleKakaoLogin}>
                    <Image source={KakaoLoginImage} style={styles.buttonImage}/>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.button, styles.naverButton]} onPress={handleNaverLogin}>
                    <Image source={NaverLoginImage} style={styles.buttonImage}/>
                </TouchableOpacity>
            </View>
        </View>
        </>
    );
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor: 'white',
    },
    loginLogoContainer: {
      height: height / 2,
      justifyContent: 'center',
      alignItems: 'center', 
    },
    loginLogo: {
      resizeMode: 'contain',
    },
    buttonContainer: {
      flexDirection: 'column',
      margin: 10,
      fontFamily:"GmarketSansBold",
    },
    button: {
      borderRadius: 5,
      alignItems: 'center',
      justifyContent: 'center', 
      margin: 5,
      height: 50, 
      backgroundColor: '#4FAF5A'
    },
    buttonImage: {
      width: '100%', 
      height: '100%', 
      resizeMode: 'contain',
    },
    naverButton:{
      backgroundColor:'#03C75A',
    },
    kakaoButton:{
      backgroundColor:'#FEE500',
    },
    buttonText: {
      color: 'white', // 텍스트 색상, 예제로 흰색을 사용
      fontSize: 16,
      fontFamily:"GmarketSansMedium",
    },
});



export default LoginPage;
