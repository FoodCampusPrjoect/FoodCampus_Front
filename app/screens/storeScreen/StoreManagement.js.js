import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import CustomText from '../../components/CustomText';
import { fetchStores, deleteStore } from '../../api/api';

export default function StoreManagement({ navigation }) {
  const [stores, setStores] = useState([]);

  useEffect(() => {
    const getStores = async () => {
      try {
        const storeData = await fetchStores();
        setStores(storeData);
      } catch (error) {
        console.error('Failed to fetch stores:', error);
      }
    };

    getStores();
  }, []);

  const navigateToStoreDetail = (storeId) => {
    navigation.navigate('DetailStoreScreen', { storeId });
  };

  const handleUpdate = (storeId) => {
    // Add update store logic
    console.log('Update store:', storeId);
    navigation.navigate('StoreUpdateScreen', { storeId });
  };

  const handleDelete = (storeId) => {
    Alert.alert(
      '삭제 확인',
      '정말로 삭제하시겠습니까?',
      [
        {
          text: '취소',
          style: 'cancel',
        },
        {
          text: '삭제',
          onPress: async () => {
            try {
              await deleteStore(storeId);
              setStores(stores.filter(store => store.id !== storeId));
              console.log('Store deleted:', storeId);
            } catch (error) {
              console.error('Failed to delete store:', error);
            }
          },
          style: 'destructive',
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        {stores.map((store) => (
          <View key={store.id} style={styles.storeItem}>
            <Image
              style={styles.storeImage}
              source={{ uri: store.image || 'https://via.placeholder.com/150' }}
            />
            <View style={styles.storeInfo}>
              <CustomText style={styles.storeName}>{store.name}</CustomText>
              <CustomText style={styles.storeAddress}>{store.address}</CustomText>
            </View>
            <View style={styles.actions}>
              <TouchableOpacity onPress={() => handleDelete(store.id)} style={styles.actionButton}>
                <CustomText style={styles.actionButtonText}>삭제하기</CustomText>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  storeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    marginBottom: 10,
  },
  storeInfo: {
    flex: 1,
    marginLeft: 10,
  },
  storeName: {
    fontSize: 20,
    fontFamily: 'GmarketSansBold'
  },
  storeAddress: {
    fontSize: 14,
    color: '#888',
    marginTop: 5,
    fontFamily: 'GmarketSansMedium'
  },
  storeImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },
  actions: {
    flexDirection: 'column',
    marginLeft: 10,
  },
  actionButton: {
    backgroundColor: '#4FAF5A',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginTop: 5,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});
