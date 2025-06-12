import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';

const FindPwScreen = () => {
    const [email, setEmail] = useState('');

    const sendEmail = () => {
        Alert.alert('알림', `${email}로 초기화된 비밀번호가 전송되었습니다.`);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>이메일</Text>
            <TextInput
                style={styles.input}
                onChangeText={setEmail}
                value={email}
                placeholder="이메일 주소"
                keyboardType="email-address"
            />
            <Text style={styles.description}>해당 이메일로 초기화된 비밀번호가 전송됩니다.</Text>
            <TouchableOpacity style={styles.buttonStyle} onPress={sendEmail}>
                <Text style={styles.buttonText}>메일 보내기</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    input: {
        width: '100%',
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#dcdcdc',
        padding: 10,
        fontFamily: "GmarketSansMedium",
    },
    description: {
        marginBottom: 20,
        fontFamily: "GmarketSansLight",
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        fontFamily: "GmarketSansMedium",
    },
    buttonStyle: {
        backgroundColor: '#4FAF5A',
        borderRadius: 10,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center', // 버튼 텍스트를 중앙으로 정렬
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontFamily: "GmarketSansBold", // 버튼 텍스트에 폰트 적용
    },
});

export default FindPwScreen;
