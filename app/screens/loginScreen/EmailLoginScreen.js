import React, { useState, useEffect } from 'react';
import { View, Image, StyleSheet, Dimensions, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loginUser } from '../../api/api'; // loginUser 함수 임포트
import { useNavigation } from '@react-navigation/native';
import CustomTextInput from '../../components/CustomTextInput'; // 커스텀 컴포넌트 임포트

const { width, height } = Dimensions.get('window');

function EmailLoginScreen() {
    const navigation = useNavigation();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        const tryAutoLogin = async () => {
          try {
            const token = await AsyncStorage.getItem('accessToken');
            if (token) {
              console.log('자동 로그인 시도:', token);
              try {
                // 자동 로그인 시도 시 백엔드에 토큰 전송하지 않도록 수정
                navigation.navigate('Home');
              } catch (error) {
                console.error('자동 로그인 실패:', error);
              }
            } else {
              console.log('저장된 토큰 없음');
            }
          } catch (error) {
            console.error('토큰 확인 중 오류 발생:', error);
          }
        };
        tryAutoLogin();
    }, []); // 컴포넌트가 처음 렌더링될 때 한 번만 실행

    const handleLoginPress = async() => {
        console.log('로그인 시도: ', email, password);
        try {
            const data = await loginUser(email, password);
            console.log('로그인 성공:', data);
            // 로그인 성공 후 처리 로직, 예를 들어 홈 스크린으로 이동
            navigation.navigate('Home');
            // 로그인 성공 시 토큰을 AsyncStorage에 저장
            await AsyncStorage.setItem('accessToken', data.accessToken);
        } catch (error) {
            // 로그인 실패 처리 로직
            console.error('로그인 실패:', error);
            Alert.alert(
                "로그인 실패", // 팝업 제목
                "이메일 또는 비밀번호가 일치하지 않습니다", // 메시지 내용
                [
                    { text: "확인", onPress: () => console.log("OK Pressed") } // 버튼 설정
                ]
            );
        }
    };

    const handleFindPasswordPress = () => {
        navigation.navigate('FindPw')
    };
    
    // 회원가입을 눌렀을 때 실행될 함수
    const handleSignUpPress = () => {
        navigation.navigate('Terms')
    };

    const customTextStyle = {
        fontFamily: 'GmarketSansMedium',
      };

    return (
        <>
            <View style={styles.container}>
                <View style={styles.loginLogoContainer}>
                    <Image
                        style={styles.loginLogo}
                        source={require("../../../assets/images/Logo2.png")}
                    />
                </View>
                <View style={styles.inputContainer}>
                    <CustomTextInput
                        style={styles.input}
                        onChangeText={setEmail}
                        value={email}
                        placeholder="이메일"
                        keyboardType="email-address"
                        customTextStyle={customTextStyle}
                    />
                    <Text></Text>
                    <CustomTextInput
                        style={styles.input}
                        onChangeText={setPassword}
                        value={password}
                        placeholder="비밀번호"
                        secureTextEntry={true}
                        customTextStyle={customTextStyle}
                    />
                    <TouchableOpacity style={styles.loginButton} onPress={handleLoginPress}>
                        <Text style={styles.loginButtonText}>로그인</Text>
                    </TouchableOpacity>
                    {/* 로그인 버튼 아래로 링크 컨테이너 위치 변경 */}
                    <View style={styles.linkContainer}>
                        <TouchableOpacity onPress={handleFindPasswordPress}>
                            <Text style={styles.linkText}>비밀번호 찾기</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleSignUpPress}>
                            <Text style={styles.linkText}>회원가입</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
            
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    loginLogoContainer: {
        height: height / 3,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loginLogo: {
        resizeMode: 'contain',
    },
    inputContainer: {
        paddingHorizontal: 20,
    },
    input: {
        height: 50,
        marginVertical: 10,
        borderWidth: 1,
        borderColor: '#cccccc',
        borderRadius: 5,
        paddingHorizontal: 10,
        fontFamily:"GmarketSansMedium",
    },
    loginButton: {
        backgroundColor: '#4FAF5A',
        height: 60, 
        borderRadius: 5,
        marginTop: 10,
        alignItems: 'center',
        justifyContent: 'center', 
    },
    loginButtonText: {
        color: 'white',
        fontSize: 16,
        fontFamily:"GmarketSansBold",
    },
    linkContainer: {
        flexDirection: 'column',
        alignItems: 'center', 
        marginTop: 20, 
    },
    linkText: {
        margin: 10,
        textDecorationLine: 'underline',
        fontFamily:"GmarketSansMedium",
    },
});

export default EmailLoginScreen;