import React, { useState } from 'react';
import { Image, View, StyleSheet, TouchableOpacity, Text, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomText from '../../components/CustomText';
import { uploadImageToFirebase, updateProfileImageApi } from '../../api/api'; // Import the new API functions

export default function ImageUpdate() {
  const [image, setImage] = useState(null);
  const [hasImage, setHasImage] = useState(false); // New state for tracking if an image is selected
  const navigation = useNavigation();

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to make this work!');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result); // 디버깅용 로그 추가

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImage(result.assets[0].uri);
      setHasImage(true); // Set hasImage to true when an image is selected
    }
  };

  const updateProfileImage = async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (!token) {
        Alert.alert('알림', '로그인 후 진행해주세요.');
        return;
      }
      const imageUrl = await uploadImageToFirebase(image);
      await updateProfileImageApi(token, imageUrl);

      Alert.alert('성공', '프로필 사진이 업데이트되었습니다.');
      navigation.navigate('Profile'); 
    } catch (error) {
      console.error('Failed to update profile image:', error);
      Alert.alert('오류', '프로필 사진 업데이트에 실패했습니다.');
    }
  };

  return (
    <View style={styles.container}>
      <CustomText style={styles.title}>프로필 사진 수정</CustomText>
      {hasImage ? ( // Conditional rendering based on whether an image is selected
        <Image source={{ uri: image }} style={styles.image} />
      ) : (
        <Image style={styles.pImg} source={require('../../../assets/images/basic.png')} />
      )}
      <TouchableOpacity style={styles.button} onPress={pickImage}>
        <Text style={styles.buttonText}>사진 선택</Text>
      </TouchableOpacity>
      {hasImage && (
        <TouchableOpacity style={styles.updateButton} onPress={updateProfileImage}>
          <Text style={styles.updateButtonText}>업로드하기</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center',
    backgroundColor: 'white',
    padding: 20,
  },
  title: { 
    fontSize: 24, 
    marginBottom: 20,
    fontFamily: 'GmarketSansBold', 
  },
  image: { 
    width: 200, 
    height: 200, 
    borderRadius: 100, 
    marginBottom: 20,
    borderColor: '#4CAF50',
    borderWidth: 2,
  },
  pImg: {
    width: 200, 
    height: 200, 
    borderRadius: 100, 
    marginBottom: 20,
    //borderColor: '#4CAF50',
    //borderWidth: 2,
  },
  button: { 
    backgroundColor: '#4CAF50', 
    padding: 10, 
    borderRadius: 5,
    marginTop: '25%',
    width: '80%',
    alignItems: 'center',
  },
  buttonText: { 
    color: '#fff',
    fontSize: 18,
    fontFamily: 'GmarketSansMedium',
  },
  updateButton: { 
    backgroundColor: '#4CAF50', 
    padding: 10, 
    borderRadius: 5, 
    marginTop: 10,
    width: '80%',
    alignItems: 'center',
  },
  updateButtonText: { 
    color: '#fff',
    fontSize: 18,
    fontFamily: 'GmarketSansMedium',
  },
});
