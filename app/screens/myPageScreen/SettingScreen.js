import React, { useRef, useMemo } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomText from '../../components/CustomText';
import { withdrawUser } from '../../api/api';
import BottomSheet from '@gorhom/bottom-sheet';
import { Icon } from 'react-native-elements';

const SettingScreen = () => {
  const navigation = useNavigation();
  const bottomSheetRef = useRef(null);

  const handleLogoutPress = async () => {
    const accessToken = await AsyncStorage.getItem('accessToken'); // Check if user is logged in
    if (!accessToken) {
      // If not logged in, show alert to login first
      Alert.alert(
        '로그인 필요',
        '로그아웃을 하려면 먼저 로그인해주세요.',
        [{ text: '확인' }]
      );
      return; // Exit the function
    }

    // If logged in, proceed with logout
    Alert.alert('로그아웃', '로그아웃 하시겠습니까?', [
      { text: '취소', style: 'cancel' },
      {
        text: '로그아웃', onPress: async () => {
          console.log('로그아웃 실행');
          await AsyncStorage.removeItem('session'); // 세션 값 삭제
          await AsyncStorage.removeItem('accessToken'); // 세션 값 삭제
          const sessionValue = await AsyncStorage.getItem('session'); // 세션 값 가져오기
          if (sessionValue === null) {
            console.log('세션 값이 삭제되었습니다'); // 세션 값이 삭제된 경우 콘솔에 메시지 출력
          } else {
            console.log('세션 값이 삭제되지 않았습니다'); // 세션 값이 삭제되지 않은 경우 콘솔에 메시지 출력
          }
          navigation.navigate('Home'); // 로그아웃 후 로그인 화면으로 이동
        }
      },
    ]);
  };

  // 탈퇴하기 처리 함수
  const handleWithdrawPress = async () => {
    Alert.alert(
      '탈퇴하기',
      '정말로 탈퇴하시겠습니까?',
      [
        { text: '취소', style: 'cancel' },
        {
          text: '탈퇴하기',
          onPress: async () => {
            try {
              const accessToken = await AsyncStorage.getItem('accessToken');
              // 사용자 토큰으로 탈퇴 요청 보내기
              const response = await withdrawUser(accessToken);
              // 탈퇴 처리 성공
              console.log('탈퇴 처리 성공:', response);
              // 세션 및 토큰 삭제
              await AsyncStorage.removeItem('session');
              await AsyncStorage.removeItem('accessToken');
              // 탈퇴 처리 후 로그인 화면으로 이동
              navigation.navigate('EmailLogin');
            } catch (error) {
              // 탈퇴 처리 실패
              console.error('탈퇴 처리 중 오류:', error);
              // 오류 메시지 표시
              Alert.alert('탈퇴 처리 중 오류가 발생했습니다');
            }
          },
        },
      ]
    );
  };

  const handleTermsPress = () => {
    bottomSheetRef.current?.expand();
  };

  const handleCloseBottomSheet = () => {
    bottomSheetRef.current?.close();
  };

  // Bottom sheet snap points
  const snapPoints = useMemo(() => ['25%', '50%', '75%'], []);

  return (
    <View style={{ flex: 1 }}>
      <TouchableOpacity style={styles.menuItem}>
        <CustomText style={styles.title}>알림</CustomText>
      </TouchableOpacity>
      <View style={styles.menuItem}>
        <CustomText style={styles.title}>버전 정보</CustomText>
        <CustomText style={styles.versionInfo}>0.0.1 Beta</CustomText>
      </View>
      <TouchableOpacity style={styles.menuItem} onPress={handleTermsPress}>
        <CustomText style={styles.title}>약관 및 정책</CustomText>
      </TouchableOpacity>
      <TouchableOpacity style={styles.menuItem} onPress={handleLogoutPress}>
        <CustomText style={styles.title}>로그아웃</CustomText>
      </TouchableOpacity>
      <TouchableOpacity style={styles.menuItem} onPress={handleWithdrawPress}>
        <CustomText style={styles.title}>탈퇴하기</CustomText>
      </TouchableOpacity>

      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        onChange={(index) => {
          if (index === -1) {
            handleCloseBottomSheet();
          }
        }}
      >
        <View style={styles.bottomSheetContent}>
        <CustomText>- 위치 기반 서비스 이용 약관 -</CustomText>
        <Text></Text>
        <CustomText>
        본 위치 기반 서비스 이용 약관(이하 '본 약관')은 서비스 제공 업체명가 제공하는 위치 기반 서비스(이하 '서비스')를 이용함에 있어 회사와 사용자 간의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.
        </CustomText>
        <Text></Text><Text></Text><Text></Text>
        <CustomText>- 서비스 이용 약관 동의 -</CustomText>
        <Text></Text>
        <CustomText>
        본 약관은 회사가 제공하는 서비스의 이용과 관련하여 회사와 사용자 간의 권리, 의무 및 책임사항을 규정합니다.
        </CustomText>
        <Text></Text><Text></Text><Text></Text>
        <CustomText>- 14세 이상입니다 -</CustomText>
        <Text></Text>
        <CustomText>
        본 서비스는 만 14세 이상의 사용자만 이용할 수 있습니다. 만 14세 미만의 사용자는 부모나 법정 대리인의 동의를 받은 경우에만 서비스를 이용할 수 있으며, 부모나 법정 대리인은 언제든지 동의를 철회할 수 있습니다.
        </CustomText>
        <Text></Text><Text></Text><Text></Text>
                      
                      
          <TouchableOpacity
            style={styles.closeIcon}
            onPress={handleCloseBottomSheet}
          >
            <Icon name="close" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </BottomSheet>

    </View>
  );
};

const styles = StyleSheet.create({
  topContainer: {
    backgroundColor: 'white',
    paddingVertical: 30,
    paddingHorizontal: 20,
    marginBottom: 5,
    borderRadius: 10,
  },
  menuItem: {
    flexDirection: 'row',
    backgroundColor: 'white',
    justifyContent: 'space-between',
    paddingVertical: 20,
    paddingHorizontal: 20,
    marginVertical: 10,
    marginHorizontal: 20,
    borderRadius: 10,
  },
  settingTitle: {
    color: 'black',
    fontSize: 30,
    marginTop: 20,
  },
  title: {
    fontSize: 20,
    fontFamily: 'GmarketSansBold',
    color: 'black',
  },
  center: {
    textAlign: 'center',
  },
  versionInfo: {
    textAlign: 'right',
    color: '#4FAF5A',
    marginTop: 4,
  },
  bottomSheetContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeIcon: {
    position: 'absolute', // 절대 위치
    top: 10, // 상단에서 10
    right: 10, // 우측에서 10
    padding: 10, // 패딩 10으로 클릭 영역 확장
  },
});

export default SettingScreen;
  