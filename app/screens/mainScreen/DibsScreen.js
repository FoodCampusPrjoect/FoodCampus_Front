import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import CustomText from '../../components/CustomText';
import { getDibsByUserId, getUserData, removeDibByUserAndStore } from '../../api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const DibsScreen = () => {
  const [userId, setUserId] = useState(null);
  const [dibs, setDibs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

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

  const fetchDibs = async (userId) => {
    try {
      const dibsData = await getDibsByUserId(userId);
      console.log("Fetched Dibs:", dibsData);
      setDibs(dibsData);
    } catch (error) {
      console.error('Failed to fetch dibs:', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (userId) {
        fetchDibs(userId);
      }
    }, [userId])
  );

  const handleRemoveDib = async (storeId) => {
    try {
      await removeDibByUserAndStore(userId, storeId);
      setDibs(dibs.filter(dib => dib.store.storeId !== storeId));
    } catch (error) {
      console.log('Failed to remove dib:', error);
    }
  };

  const toggleHeart = (storeId) => {
    handleRemoveDib(storeId);
  };

  const navigateToStoreDetail = (storeId) => {
    console.log('Navigating to store detail with storeId:', storeId);
    navigation.navigate('DetailStoreScreen', { storeId });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4FAF5A" />
      </View>
    );
  }

  const getImageSource = (score) => {
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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <CustomText style={styles.title}>찜 목록</CustomText>
      </View>

      <ScrollView>
        {dibs.map((dib) => (
          <TouchableOpacity key={dib.id} onPress={() => navigateToStoreDetail(dib.store.storeId)}>
            <View style={styles.itemContainer}>
              <View style={styles.textContainer}>
                {dib.store && (
                  <View style={styles.textAndImageContainer}>
                    <CustomText style={styles.storeTitle}>{dib.store.storeName}</CustomText>
                    <Image source={getImageSource(dib.store.score)} style={styles.scoreImage} />
                  </View>
                )}
                {dib.store && (
                  <>
                    <CustomText style={styles.storeDescription}>{dib.store.storeInfo}</CustomText>
                    <CustomText style={styles.dibs_address}>{dib.store.address}</CustomText>
                  </>
                )}
                <TouchableOpacity
                  onPress={() => toggleHeart(dib.store.storeId)}
                  style={styles.heartIconContainer}
                >
                  <FontAwesome
                    name='heart'
                    size={20}
                    color='red'
                  />
                </TouchableOpacity>
              </View>
              <View>
                {dib.store && (
                  <Image
                    style={styles.storeImg}
                    source={{ uri: dib.store.image || 'https://via.placeholder.com/150' }}
                    onError={(e) => {
                      console.error('Image load error:', e.nativeEvent.error);
                    }}
                  />
                )}
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};



const styles = StyleSheet.create({
  container: {
    width: width,
    height: height,
  },
  header: {
    height: height * 0.11,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  title: {
    fontSize: 30,
    paddingTop: 15,
    fontFamily: 'GmarketSansBold',
  },
  itemContainer: {
    width: '95%',
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 3,
    backgroundColor: 'white',
    borderRadius: 5,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  textContainer: {
    flex: 1,
    padding: 10,
  },
  textAndImageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  storeTitle: {
    fontSize: 20,
    color: 'black',
  },
  dibs_address: {
    fontSize: 13,
    marginTop:5,
    color: 'gray',
  },
  heartIconContainer: {
    marginRight: 10,
    alignSelf: 'flex-end',
  },
  scoreImage: {
    width: 50,
    height: 50,
    marginLeft: 5,
  },
  storeImg: {
    width: 110,
    height: 110,
    borderRadius: 5,
    resizeMode: 'cover',
    margin: 10,
    marginLeft: -4,
  },
  storeDescription: {
    fontSize: 14,
    marginVertical: 4,
  },
});

export default DibsScreen;
