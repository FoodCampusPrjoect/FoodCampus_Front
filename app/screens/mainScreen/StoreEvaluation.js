import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import ProgressBar from '../../components/ProgressBar';
import ImagePickerComponent from '../../components/ImagePicker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import CustomText from '../../components/CustomText';
import { useNavigation, useRoute } from '@react-navigation/native';
import { handleImageUpload, submitReview, getUserData } from '../../api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

function StoreEvaluation() {
  const textInputRef = useRef(null);
  const navigation = useNavigation();
  const route = useRoute();
  const { storeId } = route.params;

  useEffect(() => {
    return () => {
      if (textInputRef.current) {
        textInputRef.current.blur();
      }
    };
  }, []);

  const [taste, setTaste] = useState(0);
  const [price, setPrice] = useState(0);
  const [kindness, setKindness] = useState(0);
  const [hygiene, setHygiene] = useState(0);
  const [text, setText] = useState('');
  const maxLength = 500;
  const [images, setImages] = useState([]);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchTokenAndUserData = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('accessToken');
        
        if (storedToken) {
          const userData = await getUserData(storedToken);
          if (userData && userData.id) {
            setUserId(userData.id);
          }
        }
      } catch (error) {
        console.log('Failed to fetch user data:', error);
      }
    };
  
    fetchTokenAndUserData();
  }, []);

  const handleImageSelect = (selectedImage) => {
    setImages([...images, selectedImage]);
  };

  const handleSave = async () => {
    const totalScore = taste + price + kindness + hygiene;

    try {
      const imageUrls = await Promise.all(images.map(async (image) => {
        return await handleImageUpload(image);
      }));

      const reviewData = {
        reviewText: text,
        totalScore,
        taste,
        price,
        kindness,
        hygiene,
        storeId,
        imageUrls,
        userId,  // 유저 아이디 포함
      };

      console.log('Review Data:', reviewData);

      await submitReview(reviewData);

      Alert.alert('알림', '리뷰가 등록되었습니다', [
        { text: '확인', onPress: () => navigation.navigate('Home') }
      ]);
    } catch (error) {
      console.error('Review submission error:', error);
      Alert.alert('오류', '리뷰 등록에 실패했습니다');
    }
  };

  return (
    <KeyboardAwareScrollView>
      <View style={styles.container}>
        <View style={styles.contentContainer}>
          <ImagePickerComponent onImageSelect={handleImageSelect} />
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <CustomText fontType="bold" style={{ fontSize: 30, margin: 5, marginTop: 20 }}>맛점평가</CustomText>
            <CustomText fontType='light' style={{ fontSize: 14, color: '#979797', marginTop: 15 }}>(필수)</CustomText>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 10, marginBottom: 15 }}>
            <CustomText fontType="bold" style={{ position: 'absolute', left: '20%' }}>F</CustomText>
            <CustomText fontType="bold" style={{ position: 'absolute', left: '35%' }}>D</CustomText>
            <CustomText fontType="bold" style={{ position: 'absolute', left: '52%' }}>C</CustomText>
            <CustomText fontType="bold" style={{ position: 'absolute', left: '69%' }}>B</CustomText>
            <CustomText fontType="bold" style={{ position: 'absolute', left: '86%' }}>A</CustomText>
            <CustomText fontType="bold" style={{ position: 'absolute', left: '101%' }}>A+</CustomText>
          </View>
          <View style={styles.evaluation}>
            <CustomText style={styles.text}>맛 </CustomText>
            <View style={styles.progressContainer}>
              <ProgressBar currentStep={taste} totalSteps={5} onProgressChange={setTaste} />
            </View>
          </View>
          <View style={styles.evaluation}>
            <CustomText style={styles.text}>가격</CustomText>
            <View style={styles.progressContainer}>
              <ProgressBar currentStep={price} totalSteps={5} onProgressChange={setPrice} />
            </View>
          </View>
          <View style={styles.evaluation}>
            <CustomText style={styles.text}>친절도</CustomText>
            <View style={styles.progressContainer}>
              <ProgressBar currentStep={kindness} totalSteps={5} onProgressChange={setKindness} />
            </View>
          </View>
          <View style={styles.evaluation}>
            <CustomText style={styles.text}>위생</CustomText>
            <View style={styles.progressContainer}>
              <ProgressBar currentStep={hygiene} totalSteps={5} onProgressChange={setHygiene} />
            </View>
          </View>
        </View>
        <View style={styles.contentContainer}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <CustomText fontType="bold" style={styles.textTitle}>후기작성</CustomText>
            <CustomText fontType='light' style={{ fontSize: 14, color: '#979797' }}>(필수)</CustomText>
          </View>
          <TextInput
            multiline
            placeholder="방문 후기를 남겨주세요!"
            style={styles.textArea}
            onChangeText={setText}
            value={text}
            maxLength={maxLength}
            ref={textInputRef}
          />
          <CustomText style={styles.textCounter}>
            {text.length}/{maxLength}
          </CustomText>
          <View style={styles.registerButtonContainer}>
            <TouchableOpacity style={styles.registerButton} onPress={handleSave}>
              <CustomText style={styles.registerButtonText}>등록하기</CustomText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  contentContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  evaluation: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5, // 상하 마진 조정
    flex: 1,
  },
  textArea: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#4FAF5A',
    borderRadius: 5,
    padding: 10,
    height: 200,
    textAlignVertical: 'top',
    fontFamily: 'GmarketSansMedium',
  },
  textCounter: {
    alignSelf: 'flex-end',
    marginTop: 4,
    color: 'grey',
  },
  text: {
    fontSize: 20, 
    marginRight: 8, 
    width: 60,
    lineHeight: 24,
    fontFamily: 'GmarketSansBold'
  },
  textTitle: {
    fontSize: 22,
    margin: 5,
  },
  progressContainer: {
    flex: 1,
    backgroundColor: '#e0e0e0', 
    borderRadius: 10,
  },
  // 버튼 스타일
  registerButtonContainer: {
    alignItems: 'flex-end',
    marginTop: 10,
  },
  registerButton: {
    backgroundColor: '#4FAF5A', 
    paddingHorizontal: 20, 
    paddingVertical: 10, 
    borderRadius: 20, 
  },
  registerButtonText: {
    color: 'white', // 텍스트 색상
  },
});

export default StoreEvaluation;