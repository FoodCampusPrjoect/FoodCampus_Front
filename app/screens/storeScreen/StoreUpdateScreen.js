import React, { useState, useEffect } from 'react';
import { ScrollView, Text, View, StyleSheet, TextInput, Pressable, Alert, TouchableOpacity } from 'react-native';
import ProgressBar from '../../components/ProgressBar';
import ImagePickerComponent from '../../components/ImagePicker';
import MainImagePicker from '../../components/MainImagePicker';
import DropDown from '../../components/DropDown';
import { fetchStoreById, updateStore, handleImageUpload } from '../../api/api';
import { useNavigation, useRoute } from '@react-navigation/native';
import CustomText from '../../components/CustomText';

const StoreUpdateScreen = () => {
    const [mainImage, setMainImage] = useState('');   //가게 대표 사진
    const [images, setImages] = useState([]);           //가게 사진
    const [storeName, setStoreName] = useState('');     //가게 이름
    const [address, setAddress] = useState('');         //가게 주소
    const [detailAddress, setDetailAddress] = useState('');     //상세 주소
    const [storeNumber, setStoreNumber] = useState(''); //가게 번호
    const [openTime, setOpenTime] = useState('');       //오픈 시간
    const [closeTime, setCloseTime] = useState('');     //마감 시간
    const [selectMainCategory, setSelectMainCategory] = useState('');//메인 카테고리
    const [selectSubCategory, setSelectSubCategory] = useState([]); //서브 카테고리
    const [closedDay, setClosedDay] = useState([]);     //휴무일
    const [storeInfo, setStoreInfo] = useState('');     //가게 설명
    const [shortInfo, setShortInfo] = useState('');     //한 줄 설명

    const [taste, setTaste] = useState(0);              //맛점평가(맛)
    const [price, setPrice] = useState(0);              //맛점평가(가격)
    const [kindness, setKindness] = useState(0);        //맛점평가(친절도)
    const [hygiene, setHygiene] = useState(0);          //맛점평가(위생)

    const [addedMenuItems, setAddedMenuItems] = useState([]); // 메뉴 항목 배열 상태
    const [newMenuItem, setNewMenuItem] = useState(''); // 새로운 메뉴 항목 입력을 위한 상태

    const [store, setStore] = useState(null);

    const [formValid, setFormValid] = useState(false);

    const totalScore = (taste + price + kindness + hygiene);    //맛점평가 합산 점수

    const maxLength = 250;  //가게 설명 글자수 제한
    const smallLength = 15; //한 줄 설명 글자수 제한

    const navigation = useNavigation();
    const route = useRoute();

    useEffect(() => {
        const getStoreData = async () => {
            try {
                const storeData = await fetchStoreById(route.params.storeId);
                console.log('Fetched store data:', storeData);
                setStore(storeData);
                setMainImage(storeData.image);
                setImages(storeData.images || []);
                setStoreName(storeData.name);
                setAddress(storeData.address);
                setDetailAddress(storeData.detailAddress);
                setStoreNumber(storeData.storeNumber);
                setOpenTime(storeData.openTime);
                setCloseTime(storeData.closeTime);
                setSelectMainCategory(storeData.selectMainCategory);
                setSelectSubCategory(storeData.selectSubCategories || []);
                setClosedDay(storeData.closedDays || []);
                setStoreInfo(storeData.description);
                setShortInfo(storeData.shortInfo);
                setTaste(storeData.taste);
                setPrice(storeData.price);
                setKindness(storeData.kindness);
                setHygiene(storeData.hygiene);
                setAddedMenuItems(storeData.menus || []);
            } catch (error) {
                console.log("가게 정보를 가져오는데 실패했습니다.", error);
            }
        };
        getStoreData();
    }, [route.params.storeId]);
    
    

    useEffect(() => {
        checkFormValidity();
    }, [mainImage, images, storeName, address, storeNumber, openTime, closeTime, detailAddress, selectMainCategory, selectSubCategory, 
        closedDay, storeInfo, shortInfo, taste, price, kindness, hygiene]);

    const checkFormValidity = () => {
        if (
            mainImage &&
            images &&
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

// handleSubmit 함수 수정
const handleSubmit = async () => {
    if (!formValid) {
        Alert.alert('오류', '모든 필드를 올바르게 채워주세요.');
        return;
    }
    try {
        const storeImage = await handleImageUpload(mainImage);

        const url = await Promise.all(images.map(async (image) => {
            return await handleImageUpload(image);
        }));

        const menu = addedMenuItems.map(item => item);

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

        await updateStore(route.params.storeId, storeData);

        Alert.alert('성공', '가게가 성공적으로 수정되었습니다.', [
            {
                text: 'OK',
                onPress: () => {
                    navigation.navigate('MainScreen');
                },
            },
        ]);
        // 폼 초기화 코드는 수정 후에 해당합니다.
        // 폼 초기화
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
        let errorMessage = '가게 수정 중 오류가 발생했습니다.';
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

    // 이미지 선택 핸들러
    const handleImageSelect = (selectedImage) => {
        setImages([...images, selectedImage]); // 기존 이미지 배열에 새로운 이미지 추가
    };

    // 대표 사진 선택
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
                <MainImagePicker style={styles.imagePicker} onImageSelect={handleMainImage} existingImage={mainImage} />

                <Text style={styles.text}>가게 사진</Text>
                <ImagePickerComponent style={styles.imagePicker} onImageSelect={handleImageSelect} existingImages={images} />

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
                        <TextInput
                            placeholder="ㅇㅇ시 ㅇㅇ구 ㅇㅇ로 ㅇㅇ번길"
                            value={address}
                            onChangeText={setAddress}
                            style={styles.textInput}
                        />
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
                        <Text style={{ position: 'absolute', left: '20%', fontWeight: 'bold' }}>F</Text>
                        <Text style={{ position: 'absolute', left: '35%', fontWeight: 'bold' }}>D</Text>
                        <Text style={{ position: 'absolute', left: '52%', fontWeight: 'bold' }}>C</Text>
                        <Text style={{ position: 'absolute', left: '69%', fontWeight: 'bold' }}>B</Text>
                        <Text style={{ position: 'absolute', left: '86%', fontWeight: 'bold' }}>A</Text>
                        <Text style={{ position: 'absolute', left: '101%', fontWeight: 'bold' }}>A+</Text>
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
        marginBottom: "8",
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
        borderRadius:5,
    },
    textCounter: {
        textAlign: 'right',
        marginTop: "5%",
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
    },
    selectedItemText: {
        fontSize: 15,
        marginRight: 5,
        color:'white'
    },
    registerButton: {
        backgroundColor: '#4FAF5A', 
        paddingVertical: "4%",
        borderRadius: 5,
        alignItems: 'center',
        marginTop: "1%",
        marginVertical:"2%",
    },
    registerButtonText: {
        color: '#fff',
        fontSize: 16,
    },
    taste:{
        fontSize: 15,
        marginBottom: "7.5%",
        marginTop: 15,
        marginLeft: 5,
        fontFamily: 'GmarketSansBold',

    },
    category:{
        fontSize: 19,
        marginBottom: "35%",
        marginTop: "10%",
        marginLeft: 5,
        fontFamily: 'GmarketSansBold',
    },
    //버튼 스타일
    addButton: {
        backgroundColor: '#4FAF5A', 
        paddingHorizontal: 12, 
        height:38,
        borderWidth: 1,
        borderColor: '#4FAF5A', 
        borderRadius: 5,
        justifyContent: 'center',
        marginLeft: 5, 

    },
    buttonText: {
        color: 'white',
        textAlign: 'center', 
    },
});

export default StoreUpdateScreen;