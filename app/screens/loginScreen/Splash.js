import React from 'react';
import { View, Image, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import app from '../../../assets/images/logoimg.png'; 
import { useNavigation } from '@react-navigation/native'; // 추가
import CustomText from '../../components/CustomText';

export default function Splash() {
    const navigation = useNavigation(); 
    
    const handlePress = () => {
        // '시작하기' 버튼을 누를 때 MainScreen 페이지로 이동
        navigation.navigate('MainScreen');
    };

    return (
        <View style={styles.container}>
            <View style={styles.imageContainer}>
                <Image source={app} style={styles.appImage} />
            </View>
           
            <View style={styles.popupContainer}>
                <CustomText style={styles.heading}>학생들의 찐 맛집!</CustomText>
                <CustomText style={styles.heading}>푸드캠퍼스</CustomText>
                <CustomText style={styles.popupText}>학생들이 직접 선정한 진정한 맛집! 오직 푸드캠퍼스에서만 확인하세요!</CustomText>
                <TouchableOpacity onPress={handlePress}>
                    <View style={styles.buttonContainer}>
                        <CustomText style={styles.buttonText}>시작하기</CustomText>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center', // 수직으로 중앙 정렬
        backgroundColor:'white', // 배경색을 흰색으로 설정
    },
    imageContainer: {
        marginBottom: 240,
    },
    appImage: {
        borderRadius: 10,
        borderColor: '#000',
    },
    popupContainer: {
        backgroundColor:'white',
        padding: 45,
        alignItems: 'center',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        elevation:0, // 그림자 제거
        width: '100%', // 팝업이 전체 너비를 차지하도록 설정
        position: 'absolute',
        bottom: 5,
    },
    heading: {
        fontSize: 30,
        padding: 6,
        fontFamily: 'GmarketSansBold', 
    },

    popupText: {
        textAlign: 'center',
        marginTop: 20,
        color: '#848484',
    },
    buttonContainer: {
        width: Dimensions.get('window').width * 0.8,
        padding: 15,
        backgroundColor: '#4FAF5A',
        borderRadius: 50, // 더 둥근 버튼을 위해 작은 값 사용
        alignItems: 'center',
        marginTop: 35,
    },
    buttonText: {
        fontSize: 21,
        color:'white',
    },
});
