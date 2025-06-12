import { View, Pressable, Image, FlatList, StyleSheet, Text, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import React, { useState, useEffect } from 'react';

const MainImagePicker = ({ onImageSelect, existingImage }) => {
  const [images, setImages] = useState(existingImage ? [existingImage] : []);
  const [status, requestPermission] = ImagePicker.useMediaLibraryPermissions();

  useEffect(() => {
    if (existingImage) {
      setImages([existingImage]);
    }
  }, [existingImage]);

  const showImagePickerOptions = () => {
    Alert.alert("이미지 추가", "", [
      {
        text: "갤러리에서 선택",
        onPress: () => uploadImage(),
      },
      {
        text: "카메라로 촬영",
        onPress: () => takePhoto(),
      },
      {
        text: "취소",
        style: "cancel",
      },
    ]);
  };

  const uploadImage = async () => {
    if (images.length >= 1) {
      Alert.alert("알림", "사진은 최대 1장까지 업로드할 수 있습니다.");
      return;
    }

    if (!status?.granted) {
      const permission = await requestPermission();
      if (!permission.granted) {
        return;
      }
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled && result.assets && result.assets.length > 0) {
      const newImage = result.assets[0];
      setImages(currentImages => [...currentImages, newImage.uri]);
      onImageSelect(newImage); // 선택된 이미지를 부모 컴포넌트로 전달
    }
  };

  const takePhoto = async () => {
    if (images.length >= 1) {
      Alert.alert("알림", "사진은 최대 1장까지 업로드할 수 있습니다.");
      return;
    }

    const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
    if (!cameraStatus.granted) {
      Alert.alert("알림", "카메라 권한이 필요합니다.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (result.assets && result.assets.length > 0 && !result.cancelled) {
      const newImage = result.assets[0];
      setImages(currentImages => [...currentImages, newImage.uri]);
      onImageSelect(newImage); // 선택된 이미지를 부모 컴포넌트로 전달
    }
  };

  const handleImagePress = (uri) => {
    Alert.alert("사진 삭제", "사진을 삭제하겠습니까?", [
      {
        text: "아니오",
        style: "cancel",
      },
      {
        text: "네",
        onPress: () => deleteImage(uri),
      },
    ]);
  };

  const deleteImage = (uri) => {
    setImages(currentImages => currentImages.filter(image => image !== uri));
  };

  const renderItem = ({ item }) => (
    <Pressable onPress={() => handleImagePress(item)}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: item }} style={styles.image} />
      </View>
    </Pressable>
  );

  return (
    <View>
      <FlatList
        data={images}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        ListHeaderComponent={
          <Pressable onPress={showImagePickerOptions} style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1 }]}>
            <View style={styles.addButton}>
              <Icon name="image" size={40} color="grey" />
              <Text style={styles.imageCountText}>{images.length}/1</Text>
            </View>
          </Pressable>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  addButton: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    borderRadius: 5,
    borderColor: '#4FAF5A',
    borderWidth: 1,
  },
  imageCountText: {
    position: 'absolute',
    bottom: 8,
    color: 'grey',
    fontSize: 16,
  },
  imageContainer: {
    marginRight: 10,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 5,
  },
});

export default MainImagePicker;
