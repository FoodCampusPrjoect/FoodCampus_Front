import React, { useEffect, useState } from 'react';
import { ScrollView, View, Image, Text, StyleSheet, TouchableOpacity, Dimensions, ActivityIndicator, Share, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PaginationDot from 'react-native-animated-pagination-dot';
import { useNavigation, useRoute } from '@react-navigation/native';
import { fetchStoreById, getReviewsByStoreId, addDib, getUserData, checkDib,removeDibByUserAndStore  } from '../../api/api';

const DetailStoreScreen = () => {
  const navigation = useNavigation();
  const [isHeartFilled, setIsHeartFilled] = useState(false);
  const [curPage, setCurPage] = useState(0);
  const windowWidth = Dimensions.get('window').width;
  const route = useRoute();
  const [store, setStore] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [userId, setUserId] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const fetchTokenAndUserData = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('accessToken');
        setToken(storedToken);

        if (storedToken) {
          const userData = await getUserData(storedToken);
          if (userData && userData.id) {
            setUserId(userData.id);
            await initializeHeartState(userData.id);
          }
        }
      } catch (error) {
        console.log('Failed to fetch user data:', error);
      }
    };
  
    fetchTokenAndUserData();
  }, []);

  const initializeHeartState = async (userId) => {
    try {
      const isDibChecked = await checkDib(userId, route.params.storeId);
      setIsHeartFilled(isDibChecked);
    } catch (error) {
      console.log('Failed to check dib state:', error);
    }
  };
  

  useEffect(() => {
    const getStoreData = async () => {
      try {
        const storeData = await fetchStoreById(route.params.storeId);
        console.log('Fetched store data:', storeData);
        setStore(storeData);
      } catch (error) {
        console.log("가게 정보를 가져오는데 실패했습니다.", error);
      }
    };
    getStoreData();
  }, [route.params.storeId]);
  
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const storeReviews = await getReviewsByStoreId(route.params.storeId);
        console.log('Fetched reviews:', storeReviews);
        setReviews(storeReviews);
      } catch (error) {
        console.log("리뷰 데이터를 가져오는데 실패했습니다.");
      }
    };
  
    fetchReviews();
  }, [route.params.storeId]);

  const truncateText = (text, maxLength) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  if (!store) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4FAF5A" />
      </View>
    );
  }

  const handleHeartPress = async () => {
    try {
      if (!isHeartFilled && userId) {
        await addDib(userId, route.params.storeId);
        setIsHeartFilled(true); // 하트를 채움
      } else if (isHeartFilled && userId) {
        await removeDibByUserAndStore(userId, route.params.storeId);
        setIsHeartFilled(false); // 하트를 비움
      }
    } catch (error) {
      console.log('Failed to update dib state:', error);
      Alert.alert('찜 목록 업데이트에 실패했습니다.');
    }
  };

  const handleScroll = (event) => {
    const pageWidth = event.nativeEvent.layoutMeasurement.width;
    const currentPage = event.nativeEvent.contentOffset.x / pageWidth;
    setCurPage(Math.floor(currentPage));
  };

  const onShare = async () => {
    if (!store) {
      Alert.alert("가게 정보가 없습니다!");
      return;
    }
  
    try {
      const message = `[FoodCampus]\n${store.name}\n${store.address}`;
      const result = await Share.share({
        message,
      });
  
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          console.log("공유 방식:", result.activityType);
        } else {
          console.log("공유 성공");
        }
      } else if (result.action === Share.dismissedAction) {
        console.log("공유 취소");
      }
    } catch (error) {
      Alert.alert("공유 중 오류가 발생했습니다.", error.message);
    }
  };

  const onPressChange = () => {
    if (!token) {
      Alert.alert('알림', '로그인 후 진행해주세요.', [
        { text: '아니오', style: 'cancel' },
        { text: '네', onPress: () => navigation.navigate('Login') },
      ], { cancelable: true });
    }
  };

  const getImageSource = () => {
    const score = store?.score;

    if (score >= 17 && score <= 20) {
      return require('../../../assets/images/scoreA+.png');
    } else if (score >= 13 && score <= 16) {
      return require('../../../assets/images/scoreA.png');
    } else if (score >= 9 && score <= 12) {
      return require('../../../assets/images/scoreB.png');
    } else if (score >= 5 && score <= 8) {
      return require('../../../assets/images/scoreC.png');
    } else if (score >= 0 && score <= 4) {
      return require('../../../assets/images/scoreD.png');
    }

    return require('../../../assets/images/scoreF.png');
  };

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
        return ''; // 기본값은 빈 문자열로 처리할 수 있습니다.
    }
  };
  const text = `맛 ${getGradeText(store.taste)} | 가격 ${getGradeText(store.price)} | 친절도 ${getGradeText(store.kindness)} | 위생 ${getGradeText(store.hygiene)}`;


  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <View style={[styles.layer, styles.imageLayer]}>
        {store.images && store.images.length > 0 ? (
          <ScrollView
            horizontal={true}
            pagingEnabled={true}
            onScroll={handleScroll}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.scrollViewContent}
          >
            {store.images.map((imageUrl, index) => (
              <View key={index} style={styles.imageContainer}>
                <Image source={{ uri: imageUrl }} style={styles.image} />
              </View>
            ))}
          </ScrollView>
        ) : (
          <View style={styles.noImageContainer}>
            <Text style={styles.noImageText}>사진이 없습니다</Text>
          </View>
        )}
        <View style={styles.paginationContainer}>
          <PaginationDot
            activeDotColor={'#E9E9EA'}
            curPage={curPage}
            maxPage={store.images ? store.images.length : 1}
          />
        </View>
      </View>

      <View style={[styles.layer, styles.layer2]}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Text style={styles.storename}>{store.name}</Text>
          <View style={[styles.imageOverlay, { marginLeft: 'auto' }]}>
           <Image
              style={[styles.smallImage, { width: 130, height: 90, borderRadius: 10 ,marginBottom:"7%",marginBottom:"10%"}]}
              source={getImageSource()}
            />
          </View>
        </View>
        <View style={{ flexDirection: 'row', marginTop: "-13%" }}>
          <View style={{ marginRight: "-17%", marginTop:"-5%", alignItems: 'flex-start' }}>
            <Text style={[styles.layer4, { fontSize: 10, color: '#848484', marginBottom: "5%" }]}>{text}</Text>
            <Text style={[styles.layer4, { fontSize: 15, marginBottom: 7 }]}>위       치  : </Text>
            <Text style={[styles.layer4, { fontSize: 15, marginBottom: 10 }]}>영업시간  : </Text>
            <Text style={[styles.layer4, { fontSize: 15, marginBottom: 6 }]}>가게번호  : </Text>
          </View>
          <View style={{ flexShrink: 1, justifyContent: 'center', flex: 1 }}>
            <Text style={[styles.layer4, { fontSize: 15, marginBottom: 4 }]}>{store.address}</Text>
            <Text style={[styles.layer4, { fontSize: 15, marginBottom: 10 }]}>{store.openTime} ~ {store.closeTime}</Text>
            <Text style={[styles.layer4, { fontSize: 15 }]}>{store.storeNumber}</Text>
          </View>
        </View>
      </View>

      <View style={[styles.buttonLayer]}>
        <View style={[styles.buttonContainer]}>
          {token ? (
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Evaluation', { storeId: store.id })}>
            <Text style={[styles.buttonText, styles.buttonTextBold]}> 리뷰쓰기</Text>
          </TouchableOpacity>
        ): (
          <TouchableOpacity style={styles.button} onPress={onPressChange}>
            <Text style={[styles.buttonText, styles.buttonTextBold]}> 리뷰쓰기</Text>
          </TouchableOpacity>
        )}
          <View style={styles.separator}></View>
          <TouchableOpacity style={styles.button} onPress={handleHeartPress}>
            <Ionicons
              name={isHeartFilled ? 'heart' : 'heart-outline'}
              size={24}
              color={isHeartFilled ? 'red' : 'white'}
            />
          </TouchableOpacity>
          <View style={styles.separator}></View>
          <TouchableOpacity style={styles.button} onPress={onShare}>
            <Text style={[styles.buttonText, styles.buttonTextBold]}>공유하기</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={[styles.layer, styles.layer4]}>
        <Text style={[styles.layer, styles.layer4]}>대표메뉴</Text>
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={true}
          pagingEnabled={false}
        >
          <View style={{ flexDirection: 'column' }}>
            {store.menus && store.menus.length > 0 ? (
              store.menus.map((menu, index) => (
                <View key={index}>
                  <Text style={styles.menuText}>
                    {menu}
                  </Text>
                </View>
              ))
            ) : (
              <View>
                <Text style={styles.menuText}>등록된 메뉴가 없습니다</Text>
              </View>
            )}
          </View>
        </ScrollView>
      </View>
      
      <View style={[styles.layer, styles.layer5]}>
        <View style={styles.reviewHeader}>
          <Text style={styles.layerText}>리뷰</Text>
        </View>
        <View style={styles.reviewContainer}>
          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            pagingEnabled={false}
          >
            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {reviews.slice(0, 4).map((review, index) => (
              <View key={index} style={styles.review}>
                <View style={{ flexDirection: 'row' }}>
                  <Image source={{ uri: review.imageUrls[0] }} style={styles.reviewimg} />
                  <View style={{ marginLeft: 10, flexShrink: 1 }}>
                    <Text numberOfLines={4} style={styles.reviewText}>
                      {truncateText(review.reviewText, 100)}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
          </ScrollView>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#E9E9EA',
    flexGrow: 1,
    paddingVertical: 20,
    fontFamily: 'GmarketSansBold', 
  },
  layer: {
    backgroundColor: 'white',
    padding: 0,
    fontFamily: 'GmarketSansBold', 
  },
  imageLayer: {
    marginTop: -50,
    borderRadius: 10,
    width: '100%',
    fontFamily: 'GmarketSansBold', 
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 25,
    paddingVertical: 8,
    width: '97%',
    backgroundColor: '#4FAF5A',
    marginTop: 15,
    borderRadius: 24,
    marginBottom:10,
    marginLeft:6,
    fontFamily: 'GmarketSansBold', 
  },
  button: {
    backgroundColor: 'transparent',
    paddingVertical: 10,
    paddingHorizontal: 6,
    borderRadius: 6,
    fontFamily: 'GmarketSansBold', 
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'GmarketSansBold', 
  },
  buttonTextBold: {
    fontFamily: 'GmarketSansBold', 
  },
  separator: {
    height: '80%',
    width: 2,
    backgroundColor: 'white',
  },
  layer2: {
    height: 200,
    marginTop: 0,
    padding:10,
    fontSize:24,
    fontFamily: 'GmarketSansBold', 
  },
  layer4: {
    fontSize:24,
    fontFamily: 'GmarketSansBold', 
    marginTop: 4,
    padding: 5,
    flexWrap: 'wrap',
  },
  menuImage: {
    width: 120,
    height: 60,
    borderRadius: 10,
    marginRight: 10,
    resizeMode:'stretch',
    borderColor:"#4FAF5A",
    borderWidth:1,
  },
  layer5: {
    height: 210,
    marginTop: 5,
    marginBottom: 0,
    padding:15,
    fontSize:24,
    fontFamily: 'GmarketSansBold', 
  },
  imageContainer: {
    alignItems: 'center',
 
  },
  image: {
    width: Dimensions.get('window').width, 
    height: 200,
    resizeMode: 'cover',
 
  },
  paginationContainer: {
    position: 'absolute',
    bottom: 10,
    alignSelf: 'center',
    fontFamily: 'GmarketSansBold', 
  },
  reviewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    fontFamily: 'GmarketSansBold', 
  },
  review: {
    width: 280,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 10,
    height: 120,
    borderRadius: 10,
    marginTop:15,
    borderColor: '#4FAF5A',
    fontFamily: 'GmarketSansMedium', 
    
  },
  moreReviewsButton: {
    marginLeft: 5,
    paddingVertical: 5,
    fontFamily: 'GmarketSansBold', 
    
  },
  moreReviewsText: {
    color: '#848484',
    fontFamily: 'GmarketSansMedium', 
    fontSize:13
  },
  layerText:{
    fontSize:24,
    fontFamily: 'GmarketSansBold', 
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10, // 리뷰 헤더와 리뷰 목록 사이의 간격 조절
  },
  storename:{
    fontSize: 24,
    marginTop: -50,
    fontFamily: 'GmarketSansBold', 
  },
  reviewimg:{
    width: 96,
    height: 96,
    borderRadius: 5,
   // resizeMode: 'cover', // 이미지가 화면을 채우도록 설정
   
  },
  reviewAuthor: {
    marginTop:10,
    marginBottom: 10,
    flexShrink: 1,
    maxWidth: '80%',
    fontFamily: 'GmarketSansMedium',
    marginRight:10,
    marginLeft:5
  },
  reviewText:{
    fontSize:15,
    marginTop:15,
    fontFamily: 'GmarketSansMedium',
  
  },
  noImageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 200, 
    backgroundColor:"#F2F2F2"
  },
  noImage: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  menuText: {
    fontSize: 16,
    color: '#000000',
    fontFamily: "GmarketSansMedium",
    marginLeft: 20,
    marginBottom: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
});

export default DetailStoreScreen;