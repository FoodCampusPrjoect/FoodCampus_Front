import React, { useState, useEffect } from 'react';
import { ScrollView, Text, View, StyleSheet, TextInput, Pressable, Alert, TouchableOpacity } from 'react-native';
import ProgressBar from '../../components/ProgressBar';
import ImagePickerComponent from '../../components/ImagePicker';
import MainImagePicker from '../../components/MainImagePicker';
import DropDown from '../../components/DropDown';
import { storeUpload, handleImageUpload } from '../../api/api';
import { useNavigation, useRoute } from '@react-navigation/native';
import CustomText from '../../components/CustomText';

const StoreUpScreen = () => {
    const [mainImage, setMainImage] = useState('');
    const [images, setImages] = useState([]);
    const [storeName, setStoreName] = useState('');
    const [address, setAddress] = useState('');
    const [detailAddress, setDetailAddress] = useState('');
    const [storeNumber, setStoreNumber] = useState('');
    const [openTime, setOpenTime] = useState('');
    const [closeTime, setCloseTime] = useState('');
    const [selectMainCategory, setSelectMainCategory] = useState('');
    const [selectSubCategory, setSelectSubCategory] = useState([]);
    const [closedDay, setClosedDay] = useState([]);
    const [storeInfo, setStoreInfo] = useState('');
    const [shortInfo, setShortInfo] = useState('');
    const [taste, setTaste] = useState(0);
    const [price, setPrice] = useState(0);
    const [kindness, setKindness] = useState(0);
    const [hygiene, setHygiene] = useState(0);
    const [addedMenuItems, setAddedMenuItems] = useState([]);
    const [newMenuItem, setNewMenuItem] = useState('');
    const [formValid, setFormValid] = useState(false);

    const totalScore = (taste + price + kindness + hygiene);
    const maxLength = 250;
    const smallLength = 15;

    const navigation = useNavigation();
    const route = useRoute();

    useEffect(() => {
        checkFormValidity();
    }, [mainImage, images, storeName, address, storeNumber, openTime, closeTime, detailAddress, selectMainCategory, selectSubCategory, closedDay, storeInfo, shortInfo, taste, price, kindness, hygiene]);

    useEffect(() => {
        if (route.params?.address) {
            setAddress(route.params.address);
        }
    }, [route.params]);

    const checkFormValidity = () => {
        if (
            mainImage &&
            images.length > 0 &&
            storeName &&
            address &&
            storeNumber &&
            openTime &&
            closeTime &&
            detailAddress &&
            selectMainCategory &&
            selectSubCategory.length > 0 &&
            closedDay.length > 0 &&
            storeInfo &&
            shortInfo &&
            taste > 0 &&
            price > 0 &&
            kindness > 0 &&
            hygiene > 0
        ) {
            setFormValid(true);
        } else {
            setFormValid(false);
        }
    };

    const handleSubmit = async () => {
        if (!formValid) {
            Alert.alert('오류', '모든 필드를 올바르게 채워주세요.');
            return;
        }
        try {
            const storeImage = await handleImageUpload(mainImage);
            const url = await Promise.all(images.map(async (image) => await handleImageUpload(image)));
            const menu = addedMenuItems.map(item => ({ menu: item }));

            const storeData = {
                storeImage,
                storeName,
                address,
                storeNumber,
                menu,
                openTime,
                closeTime,
                detailAddress,
                selectMainCategory,
                selectSubCategories: selectSubCategory,
                closedDays: closedDay,
                storeInfo,
                shortInfo,
                taste,
                price,
                kindness,
                hygiene,
                url,
                score: totalScore,
            };

            console.log('storeData:', storeData);

            await storeUpload(storeData);

            Alert.alert('성공', '가게가 성공적으로 등록되었습니다.', [
                {
                    text: 'OK',
                    onPress: () => {
                        navigation.navigate('MainScreen')
                    },
                },
            ]);

            setMainImage('');
            setImages([]);
            setStoreName('');
            setAddress('');
            setStoreNumber('');
            setAddedMenuItems([]);
            setOpenTime('');
            setCloseTime('');
            setDetailAddress('');
            setSelectMainCategory('');
            setSelectSubCategory([]);
            setClosedDay([]);
            setStoreInfo('');
            setShortInfo('');
            setTaste(0);
            setPrice(0);
            setKindness(0);
            setHygiene(0);
        } catch (error) {
            let errorMessage = '가게 등록 중 오류가 발생했습니다.';
            if (error.response && error.response.data) {
                errorMessage = error.response.data;
            } else if (error.message) {
                errorMessage = error.message;
            }
            console.log(errorMessage);
            Alert.alert('오류', errorMessage);
        }
    };

    const handleTasteChange = (newStep) => {
        setTaste(newStep);
    };

    const handlePriceChange = (newStep) => {
        setPrice(newStep);
    };

    const handleKindnessChange = (newStep) => {
        setKindness(newStep);
    };

    const handleHygieneChange = (newStep) => {
        setHygiene(newStep);
    };

    const handleDaySelect = (day) => {
        if (!closedDay.includes(day)) {
            setClosedDay([...closedDay, day]);
        }
    };

    const handleDayRemove = (day) => {
        const updatedDays = closedDay.filter((closedDay) => closedDay !== day);
        setClosedDay(updatedDays);
    };

    const handleMainCategoryChange = (category) => {
        setSelectMainCategory(category);
        setSelectSubCategory([]);
        getSubCategoryOptions(category);
    };

    const getSubCategoryOptions = (selectMainCategory) => {
        switch (selectMainCategory) {
            case '음식점':
                return ['한식', '중식', '일식', '양식', '분식'];
            case '술집':
                return ['단체', '분위기 좋은', '와인바', '과팅'];
            case '편의점':
                return ['CU', 'GS25', '세븐일레븐', '이마트24'];
            case '디저트':
                return ['테이크아웃', '카공', '케이크', '아이스크림'];
            default:
                return [];
        }
    };

    const handleSubCategoryChange = (subCategory) => {
        if (!selectMainCategory) {
            Alert.alert(
                '메인카테고리 선택',
                '메인카테고리를 먼저 선택해주세요.',
                [{ text: '확인', onPress: () => console.log('메인카테고리 미선택') }],
                { cancelable: false }
            );
            return;
        }
        if (!selectSubCategory.includes(subCategory)) {
            setSelectSubCategory([...selectSubCategory, subCategory]);
        }
    };

    const handleSubCategoryRemove = (subCategory) => {
        const updatedSubCategories = selectSubCategory.filter((category) => category !== subCategory);
        setSelectSubCategory(updatedSubCategories);
    };

    const handleImageSelect = (selectedImage) => {
        setImages([...images, selectedImage]);
    };

    const handleMainImage = (selectedImage) => {
        setMainImage(selectedImage);
    };

    const handleMenuRemove = (item) => {
        setAddedMenuItems(addedMenuItems.filter(menuItem => menuItem !== item));
    };

    const addMenuItem = () => {
        if (newMenuItem.trim() !== '') {
            setAddedMenuItems([...addedMenuItems, newMenuItem.trim()]);
            setNewMenuItem('');
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={{ padding: 10 }}>
                <Text style={styles.text}>대표 사진</Text>
                <MainImagePicker style={styles.imagePicker} onImageSelect={handleMainImage} />

                <Text style={styles.text}>가게 사진</Text>
                <ImagePickerComponent style={styles.imagePicker} onImageSelect={handleImageSelect} />

                <View style={styles.row}>
                    <View style={styles.column}>
                        <Text style={styles.text}>가게이름</Text>
                        <Text style={styles.text}>주소</Text>
                        <Text style={styles.text}>상세주소</Text>
                        <Text style={styles.text}>전화번호</Text>
                        <Text style={styles.text}>오픈시간</Text>
                        <Text style={styles.text}>마감시간</Text>
                        <Text style={styles.text}>대표메뉴</Text>
                        <Text style={styles.category}>카테고리</Text>
                        <Text style={styles.text}>휴무일</Text>
                    </View>
                    <View style={styles.column}>
                        <TextInput
                            placeholder="상호명"
                            value={storeName}
                            onChangeText={setStoreName}
                            style={styles.textInput}
                        />
                        <TouchableOpacity activeOpacity={0.8} style={styles.btn} onPress={() => navigation.navigate('SearchAddress')}>
                            <Text style={styles.btn_text}>우편번호 찾기</Text>
                        </TouchableOpacity>
                        <TouchableOpacity activeOpacity={0.8} style={styles.btn} onPress={() => navigation.navigate('KakaoMap')}>
                            <Text style={styles.btn_text}>지도에서 주소 선택</Text>
                        </TouchableOpacity>
                        <View style={styles.number_text}>
                            <Text style={styles.text}>{address}</Text>
                        </View>
                        <TextInput
                            placeholder="ㅇㅇ건물 ㅇ층 / 없음"
                            value={detailAddress}
                            onChangeText={setDetailAddress}
                            style={styles.textInput}
                        />
                        <TextInput
                            placeholder="032-000-0000"
                            value={storeNumber}
                            onChangeText={setStoreNumber}
                            style={styles.textInput}
                        />
                        <TextInput
                            placeholder="00:00"
                            value={openTime}
                            onChangeText={setOpenTime}
                            style={styles.textInput}
                        />
                        <TextInput
                            placeholder="00:00"
                            value={closeTime}
                            onChangeText={setCloseTime}
                            style={styles.textInput}
                        />
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <TextInput
                                placeholder="메뉴 입력"
                                value={newMenuItem}
                                onChangeText={setNewMenuItem}
                                style={styles.textInput}
                            />
                            <TouchableOpacity style={styles.addButton} onPress={addMenuItem}>
                                <CustomText style={styles.buttonText}>추가</CustomText>
                            </TouchableOpacity>
                        </View>
                        <DropDown
                            options={['음식점', '술집', '편의점', '디저트']}
                            selectedValue={selectMainCategory}
                            onValueChange={handleMainCategoryChange}
                        />
                        <DropDown
                            options={getSubCategoryOptions(selectMainCategory)}
                            selectedValue=""
                            onValueChange={handleSubCategoryChange}
                            disabled={!selectMainCategory}
                        />
                        <DropDown
                            options={['월요일', '화요일', '수요일', '목요일', '금요일', '토요일', '일요일', '공휴일', '없음']}
                            selectedValue=""
                            onValueChange={handleDaySelect}
                        />
                    </View>
                </View>

                <View style={styles.selectedItemsContainer}>
                    <ScrollView horizontal={true} contentContainerStyle={styles.selectedItemsScrollView}>
                        <View style={styles.selectedItems}>
                            {addedMenuItems.map((item) => (
                                <Pressable
                                    key={item}
                                    style={styles.selectedItem}
                                    onPress={() => handleMenuRemove(item)}
                                >
                                    <Text style={styles.selectedItemText}>{item}</Text>
                                    <Text style={styles.closeButton}> X</Text>
                                </Pressable>
                            ))}
                        </View>
                    </ScrollView>
                </View>

                <View style={styles.selectedItemsContainer}>
                    <ScrollView horizontal={true} contentContainerStyle={styles.selectedItemsScrollView}>
                        <View style={styles.selectedItems}>
                            {selectSubCategory.map((subCategory) => (
                                <Pressable
                                    key={subCategory}
                                    style={styles.selectedItem}
                                    onPress={() => handleSubCategoryRemove(subCategory)}
                                >
                                    <Text style={styles.selectedItemText}>{subCategory}</Text>
                                    <Text style={styles.closeButton}> X</Text>
                                </Pressable>
                            ))}
                        </View>
                    </ScrollView>
                </View>
                <View style={styles.selectedItemsContainer}>
                    <ScrollView horizontal={true} contentContainerStyle={styles.selectedItemsScrollView}>
                        <View style={styles.selectedItems}>
                            {closedDay.map((day) => (
                                <Pressable
                                    key={day}
                                    style={styles.selectedItem}
                                    onPress={() => handleDayRemove(day)}
                                >
                                    <Text style={styles.selectedItemText}>{day}</Text>
                                    <Text style={styles.closeButton}> X</Text>
                                </Pressable>
                            ))}
                        </View>
                    </ScrollView>
                </View>

                <View style={styles.contentContainer}>
                    <Text style={styles.text}>한줄소개</Text>
                    <TextInput
                        multiline
                        placeholder="가게 한줄소개를 적어주세요"
                        style={styles.textArea}
                        onChangeText={(shortText) => {
                            setShortInfo(shortText);
                            checkFormValidity();
                        }}
                        value={shortInfo}
                        maxLength={smallLength}
                    />
                    <Text style={styles.textCounter}>
                        {shortInfo.length}/{smallLength}
                    </Text>
                </View>

                <View style={styles.contentContainer}>
                    <Text style={styles.text}>가게설명</Text>
                    <TextInput
                        multiline
                        placeholder="가게설명을 적어주세요"
                        style={styles.textArea}
                        onChangeText={(text) => {
                            setStoreInfo(text);
                            checkFormValidity();
                        }}
                        value={storeInfo}
                        maxLength={maxLength}
                    />
                    <Text style={styles.textCounter}>
                        {storeInfo.length}/{maxLength}
                    </Text>
                </View>

                <View style={styles.contentContainer}>
                    <Text style={styles.text}>맛점평가</Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 10, marginBottom: 15 }}>
                        <Text style={{ position: 'absolute', left: '20%', fontFamily: 'GmarketSansBold' }}>F</Text>
                        <Text style={{ position: 'absolute', left: '35%', fontFamily: 'GmarketSansBold' }}>D</Text>
                        <Text style={{ position: 'absolute', left: '52%', fontFamily: 'GmarketSansBold' }}>C</Text>
                        <Text style={{ position: 'absolute', left: '69%', fontFamily: 'GmarketSansBold' }}>B</Text>
                        <Text style={{ position: 'absolute', left: '86%', fontFamily: 'GmarketSansBold' }}>A</Text>
                        <Text style={{ position: 'absolute', left: '101%', fontFamily: 'GmarketSansBold' }}>A+</Text>
                    </View>

                    <View style={styles.evaluation}>
                        <Text style={[styles.taste, { marginRight: "11%" }]}>맛</Text>
                        <View style={styles.progressContainer}>
                            <ProgressBar style={styles.progressBar} currentStep={taste} totalSteps={5} onProgressChange={(newStep) => {
                                handleTasteChange(newStep);
                                checkFormValidity();
                            }} />
                        </View>
                    </View>
                    <View style={styles.evaluation}>
                        <Text style={[styles.taste, { marginRight: "8%" }]}>가격</Text>
                        <View style={styles.progressContainer}>
                            <ProgressBar style={styles.progressBar} currentStep={price} totalSteps={5} onProgressChange={(newStep) => {
                                handlePriceChange(newStep);
                                checkFormValidity();
                            }} />
                        </View>
                    </View>
                    <View style={styles.evaluation}>
                        <Text style={[styles.taste, { marginRight: "8%" }]}>친절</Text>
                        <View style={styles.progressContainer}>
                            <ProgressBar style={styles.progressBar} currentStep={kindness} totalSteps={5} onProgressChange={(newStep) => {
                                handleKindnessChange(newStep);
                                checkFormValidity();
                            }} />
                        </View>
                    </View>
                    <View style={styles.evaluation}>
                        <Text style={[styles.taste, { marginRight: "8%" }]}>위생</Text>
                        <View style={styles.progressContainer}>
                            <ProgressBar style={styles.progressBar} currentStep={hygiene} totalSteps={5} onProgressChange={(newStep) => {
                                handleHygieneChange(newStep);
                                checkFormValidity();
                            }} />
                        </View>
                    </View>
                </View>

                <Pressable style={[styles.registerButton, { opacity: formValid ? 1 : 0.5 }]} onPress={handleSubmit} disabled={!formValid}>
                    <Text style={styles.registerButtonText}>등록하기</Text>
                </Pressable>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    contentContainer: {
        marginBottom: 8,
    },
    row: {
        flexDirection: 'row',
    },
    column: {
        flex: 1,
        marginTop: 10
    },
    imagePicker: {
        alignSelf: 'center',
    },
    textInput: {
        height: 40,
        borderColor: '#4FAF5A',
        borderWidth: 1,
        marginBottom: "6%",
        paddingHorizontal: 15,
        flex: 1,
        marginLeft: '-30%',
        borderRadius: 5,
        fontFamily: 'GmarketSansMedium',
    },
    text: {
        fontSize: 19,
        marginBottom: "7.5%",
        marginTop: 15,
        marginLeft: 5,
        fontFamily: 'GmarketSansBold',
    },
    textArea: {
        height: 150,
        borderColor: '#4FAF5A',
        borderWidth: 1,
        paddingHorizontal: 10,
        textAlignVertical: 'top',
        borderRadius: 5,
    },
    textCounter: {
        textAlign: 'right',
        marginTop: "5%",
        fontFamily: 'GmarketSansMedium'
    },
    evaluation: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    progressContainer: {
        flex: 1,
    },
    progressBar: {
        backgroundColor: '#ddd',
    },
    closedDaysScrollContainer: {
        marginTop: 10,
    },
    closedDaysScrollView: {
        paddingLeft: 10,
    },
    closedDaysContainer: {
        flexDirection: 'row',
    },
    closedDay: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ddd',
        borderRadius: 5,
        paddingHorizontal: 10,
        marginRight: 10,
        paddingVertical: 5,
    },
    closedDayText: {
        fontSize: 12,
        marginRight: 5,
    },
    closeButton: {
        fontSize: 12,
        color: 'white',
        fontFamily: 'GmarketSansMedium'
    },
    selectedItemsContainer: {
        marginTop: 10,
    },
    selectedItemsScrollView: {
        paddingLeft: 10,
    },
    selectedItems: {
        flexDirection: 'row',
    },
    selectedItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#4FAF5A',
        borderRadius: 20,
        paddingHorizontal: 10,
        marginRight: 10,
        paddingVertical: 5,
        fontFamily: 'GmarketSansMedium'
    },
    selectedItemText: {
        fontSize: 15,
        marginRight: 5,
        color: 'white',
        fontFamily: 'GmarketSansMedium'
    },
    registerButton: {
        backgroundColor: '#4FAF5A',
        paddingVertical: "4%",
        borderRadius: 5,
        alignItems: 'center',
        marginTop: "1%",
        marginVertical: "2%",
    },
    registerButtonText: {
        color: '#fff',
        fontSize: 16,
    },
    taste: {
        fontSize: 15,
        marginBottom: "7.5%",
        marginTop: 15,
        marginLeft: 5,
        fontFamily: 'GmarketSansBold',
    },
    category: {
        fontSize: 19,
        marginBottom: "35%",
        marginTop: "10%",
        marginLeft: 5,
        fontFamily: 'GmarketSansBold',
    },
    addButton: {
        backgroundColor: '#4FAF5A',
        paddingHorizontal: 12,
        height: 38,
        borderWidth: 1,
        borderColor: '#4FAF5A',
        borderRadius: 5,
        justifyContent: 'center',
        marginLeft: 5,
        marginBottom: "5%"
    },
    buttonText: {
        color: 'white',
        textAlign: 'center',
        fontFamily: "GmarketSansMedium"
    },
    btn: {
        backgroundColor: '#4FAF5A',
        paddingHorizontal: 12,
        height: 38,
        borderWidth: 1,
        borderColor: '#4FAF5A',
        borderRadius: 5,
        justifyContent: 'center',
        marginLeft: 5,
        marginBottom: "5%",
        alignItems: 'center'
    },
    btn_text: {
        color: 'white',
        textAlign: 'center',
        fontFamily: "GmarketSansMedium"
    },
    number_text: {
        marginLeft: 5,
        marginBottom: "5%",
    }
});

export default StoreUpScreen;

