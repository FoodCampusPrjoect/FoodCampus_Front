import React, { useState, useRef } from 'react';
import { View, TextInput, Button, StyleSheet, Alert, Text, TouchableOpacity } from 'react-native';
import { SignupUser } from '../../api/api';
import { useNavigation } from '@react-navigation/native'

const SignUpScreen = () => {
    const navigation = useNavigation();
    const [email, setEmail] = useState('');
    const [nickname, setNickname] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const inputRef = useRef(null);

    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const handleSignUp = async () => {
        if (!validateEmail(email)) {
            Alert.alert('오류', '유효한 이메일을 입력하세요.');
            return;
        }
        if (!email || !nickname || !password || !confirmPassword) {
            Alert.alert('오류', '모든 필드를 채워주세요.');
            return;
        }
        if (password !== confirmPassword) {
            Alert.alert('오류', '비밀번호가 일치하지 않습니다.');
            return;
        }
        try {
            const userData = { email, password, nickname };
            await SignupUser(userData);
            Alert.alert('성공', '회원가입이 완료되었습니다.', [
                { text: 'OK', onPress: () => navigation.navigate('EmailLogin') }
            ]);
            // 회원가입 성공 후 입력 필드를 초기화하고 키보드를 닫음
            setEmail('');
            setNickname('');
            setPassword('');
            setConfirmPassword('');
            if (inputRef.current) {
                inputRef.current.blur();
            }
        } catch (error) {
            let errorMessage = '회원가입 중 오류가 발생했습니다.';
            if (error.response && error.response.data === '이미 사용 중인 닉네임입니다') {
                errorMessage = '이미 사용 중인 닉네임입니다.';
            }else if(error.response&& error.response.data==='이미 등록된 이메일입니다'){
                errorMessage='이미 등록된 이메일 입니다'
            }
            Alert.alert('오류', errorMessage);
        }
    };

    return (
        <>
            <View style={styles.container}>
                <Text style={styles.title}>이메일 입력</Text>
                <TextInput
                    ref={inputRef}
                    style={styles.input}
                    placeholder="example@naver.com"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                />
                <Text style={styles.title}>닉네임 입력</Text>
                <TextInput
                    style={styles.input}
                    placeholder="닉네임을 입력해주세요"
                    value={nickname}
                    onChangeText={setNickname}
                />
                <Text style={styles.title}>비밀번호</Text>
                <TextInput
                    style={styles.input}
                    placeholder="영문,숫자 6자리 이상"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />
                <Text style={styles.title}>비밀번호 확인</Text>
                <TextInput
                    style={styles.input}
                    placeholder="비밀번호 확인"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry
                />
                <View style={styles.buttonStyle}>
                    <TouchableOpacity style={styles.buttonStyle} onPress={handleSignUp}>
                        <Text style={styles.buttonText}>가입하기</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    input: {
        height: 40,
        marginBottom: 30,
        borderWidth: 1,
        padding: 10,
        borderRadius: 5,
        fontFamily: "GmarketSansMedium",
    },
    title: {
        fontSize: 20,
        // fontWeight: 'bold',
        marginBottom: 10,
        fontFamily: "GmarketSansBold"
    },
    buttonStyle: {
        backgroundColor: '#4FAF5A',
        borderRadius: 10,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontFamily: "GmarketSansBold",
    },
});

export default SignUpScreen;