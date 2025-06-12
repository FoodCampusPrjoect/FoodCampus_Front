import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Alert, Modal, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import CustomText from '../../components/CustomText';
import { getReviewsByUserId, deleteReviewById, getUserData } from '../../api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function MyReview() {
  const navigation = useNavigation();
  const [showAllText, setShowAllText] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchTokenAndUserData = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('accessToken');
        
        if (storedToken) {
          const userData = await getUserData(storedToken);
          if (userData && userData.id) {
            setUserId(userData.id);
            fetchReviews(userData.id, storedToken);
          }
        }
      } catch (error) {
        console.log('Failed to fetch user data:', error);
      }
    };
  
    fetchTokenAndUserData();
  }, []);

  const fetchReviews = async (userId, token) => {
    try {
      const data = await getReviewsByUserId(userId, token);
      setReviews(data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
      setLoading(false);
    }
  };

  const onPressDelete = (reviewId) => {
    if (!reviewId) {
      Alert.alert('Error', 'Review ID is not valid.');
      return;
    }

    Alert.alert('알림', '리뷰를 삭제하시겠습니까?', [
      { text: '아니오', style: 'cancel' },
      { text: '네', onPress: () => deleteReview(reviewId) },
    ]);
  };
  
  const deleteReview = async (reviewId) => {
    try {
      if (!reviewId) {
        throw new Error('Review ID is not valid.');
      }
  
      await deleteReviewById(reviewId); // 리뷰 삭제 API 호출

      Alert.alert('알림', '리뷰가 성공적으로 삭제되었습니다.');
  
      const storedToken = await AsyncStorage.getItem('accessToken');
      if (userId && storedToken) {
        await fetchReviews(userId, storedToken);
      }
    } catch (error) {
      console.error('리뷰 삭제 중 에러 발생:', error);
      Alert.alert('알림', '리뷰 삭제에 실패했습니다.');
    }
  };
  
  const toggleShowAllText = () => {
    setShowAllText(!showAllText);
  };

  const renderText = (text) => {
    if (showAllText) {
      return text;
    } else {
      return text.length > 100 ? text.substring(0, 100) + '...' : text;
    }
  };


  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#4FAF5A" />
      </View>
    );
  }

  const getGradeText = (gradeValue) => {
    switch (gradeValue) {
      case 1:
        return 'D';
      case 2:
        return 'C';
      case 3:
        return 'B';
      case 4:
        return 'A';
      case 5:
        return 'A+';
      default:
        return '';
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      {reviews.map((review) => (
        <View key={review.reviewId} style={styles.reviewContainer}>
          <TouchableOpacity onPress={() => navigation.navigate('DetailStoreScreen', { storeId: review.storeId })}>
            <CustomText fontType={"bold"} style={{ marginTop: 10, fontSize: 30 }}>{review.storeName}</CustomText>
          </TouchableOpacity>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <CustomText style={[styles.score, { fontSize: 11, color: '#848484' }]}>
              맛 {getGradeText(review.taste)} | 가격 {getGradeText(review.price)} | 친절도 {getGradeText(review.kindness)} | 위생 {getGradeText(review.hygiene)}
            </CustomText>
            <TouchableOpacity style={styles.button} onPress={() => onPressDelete(review.reviewId)}>
              <CustomText style={styles.buttonText}>삭제하기</CustomText>
            </TouchableOpacity>
          </View>

          <CustomText>{renderText(review.reviewText)}</CustomText>
          {review.reviewText.length > 100 && (
            <TouchableOpacity onPress={toggleShowAllText}>
              <CustomText style={{ color: 'gray' }}>{showAllText ? '간략히' : '더보기'}</CustomText>
            </TouchableOpacity>
          )}
          <View style={styles.imageContainer}>
            {review.imageUrls && review.imageUrls.map((image, imageIndex) => (
              <Image key={imageIndex} style={styles.storeImg} source={{ uri: image }} />
            ))}
          </View>
        </View>
      ))}


    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  reviewContainer: {
    flex: 1,
    paddingHorizontal: 16,
    margin: 10,
    borderRadius: 5,
    backgroundColor: 'white',
  },
  button: {
    backgroundColor: '#4FAF5A',
    margin: 0,
    padding: 8,
    borderRadius: 100,
    alignItems: 'center',
    alignSelf: 'flex-end',
    marginBottom: 10,
  },
  buttonText: {
    fontSize: 14,
    color: 'white',
  },
  score: {
    fontSize: 24,
    marginTop: 5,
    padding: 5,
    marginBottom: 10,
  },
  storeImg: {
    height: 100,
    width: 100,
    marginBottom: 10,
    marginRight: 10,
    marginTop: 10,
    borderRadius: 6,
  },
  imageContainer: {
    flexDirection: 'row',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    padding: 10,
    borderRadius: 10,
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

