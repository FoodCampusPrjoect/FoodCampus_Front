import React, { useState } from 'react';
import { View, SafeAreaView, FlatList, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { SearchBar } from 'react-native-elements';
import CustomText from '../../components/CustomText';
import { searchStores } from '../../api/api';
import { useNavigation } from '@react-navigation/native'; 

export default function SearchScreen() {
  const [searchValue, setSearchValue] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [contactData, setContactData] = useState([]);
  const navigation = useNavigation(); 

  const handleSearch = async (query) => {
    if (query.length === 0) {
      setContactData([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    try {
      const data = await searchStores(query);
      setContactData(data);
    } catch (error) {
      console.log('Error searching stores:', error);
      setContactData([]);
    }
  };

  const handlePressItem = (item) => {
    navigation.navigate('DetailStoreScreen', { storeId: item.storeId }); // 가게 ID를 전달합니다.
  };

  const customTextStyle = {
    fontFamily: 'GmarketSansMedium',
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.searchContainer}>
        <SearchBar
          placeholder="음식을 검색해주세요"
          style={customTextStyle}
          value={searchValue}
          onChangeText={text => {
            setSearchValue(text);
            handleSearch(text);
          }}
          inputContainerStyle={styles.searchInputContainer}
          containerStyle={styles.searchBarContainer}
        />
        {isSearching && (
          <FlatList
            data={contactData}
            keyExtractor={item => item.storeId.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => handlePressItem(item)}>
                <View style={styles.contactItem}>
                  <Image source={{ uri: item.storeImage }} style={styles.contactImage} />
                  <View style={styles.contactText}>
                    <CustomText style={styles.name}>{item.storeName}</CustomText>
                    <CustomText style={styles.phone}>{item.storeNumber}</CustomText>
                    <CustomText style={styles.phone}>{item.openTime} ~ {item.closeTime}</CustomText>
                  </View>
                </View>
              </TouchableOpacity>
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff'
  },
  searchBarContainer: {
    backgroundColor: 'transparent',
    borderBottomColor: 'transparent',
    borderTopColor: 'transparent',
    paddingHorizontal: 0,
    paddingTop: 30,
  },
  searchInputContainer: {
    backgroundColor: '#f2f2f2',
    borderRadius: 20,
    height: 40,
  },
  contactItem: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    alignItems: 'center'
  },
  contactImage: {
    width: 70,
    height: 70,
    borderRadius: 10
  },
  contactText: {
    marginLeft: 10,
    flex: 1,
  },
  name: {
    fontSize: 16,
  },
  phone: {
    fontSize: 14,
    color: '#666'
  },
  open: {
    fontSize: 14,
    color: 'green'
  },
  closed: {
    fontSize: 14,
    color: 'red'
  }
});
