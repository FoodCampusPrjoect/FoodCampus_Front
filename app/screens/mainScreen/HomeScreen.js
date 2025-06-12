import React, { useState, useEffect, useRef, useCallback } from 'react';
import { SafeAreaView, View, StyleSheet, Image, TouchableOpacity, Text, ScrollView, Alert as RNAlert } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { WebView } from 'react-native-webview';
import { SearchBar } from 'react-native-elements';
import { Keyboard } from 'react-native';
import CustomText from '../../components/CustomText';
import { fetchStoreById, fetchStoresByCategory, fetchStoresByMainAndSubCategory } from '../../api/api';
import { KAKAO_APP_KEY } from '@env';
// Base64로 변환된 이미지 문자열
const map3Base64='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAYAAACOEfKtAAAACXBIWXMAAAsTAAALEwEAmpwYAAAIL0lEQVR4nO1ca2xcRxWeFpBQaQUICfgDiLf40x+4wd6Zu17fmbn78D7sTWLXXkQLpaQg1B+oRLSyd2eunZfdODQxiV9JmrZxYiexK34AQkBLeKSllRpSIYVEUUhwkMoz9XrXTuMkg84NKcGkSXzv2nPX3k860mrv7t1zv50z5zFnBqEKKqigggq0AreZnyY5+nUs2G6jg75CJH8DS1bEgl5yRLIivAfXsOS7Au3mQ4Zgn1rWfxtuNz+PJd1IJHuD2Kxo9sSmwoONKvbsKpUYaVapgy0qNd56VQ62OO/BtfBggzK31E/Bd+C7OEs3wL3QcgHO0iCW7LBhsyLrjb8VH25WDc9nXEl8X5OivckLQKZh8xdrsnUELVUE26xPYsl/RjpYwRpqvNIw5o60G8p4qwoPNl4xOniBSPrTQJv5CbSUgCV7lEhatHakZktK3A2I5DuSF+G3iKTfRuUOvBbfQyT9SXB9eCoxcv/CETdHEvubVXC9VcSS/TgkQnejckT1E/QjWLLj5tb66QUdde8kYxllfj9+gUh2PCCsD6MyJG+Cb09cXHTi/sekM4ptT74FuoBOqBwQEqEPYElPguJaybtO+A+SF7FNT1R9j78f+Rx3EMlfMJ9KXNBN2lyhW+MzWNKfg47Ir8CStgU3hAsQ/OombK6kxjMKdCPSfAL5EdXt/AtYsOnk6OJ52/lKYvR+RSSd9mPmcgeR7FVrIHVJN0m3Eqs/Bbn1y8hPwMKsN9bxKfB6ugm6pYxnFOgayNZFkF9AbHYsuntlSeYpuE9sW1pZ3SkV7Ag7Aq+j29LONfiM19+B+xBJX0d+QI2gXyKd3kdfbM8qxTbG1UND31L7XhpVvz/3upqY/IsjR88dU8MvjaqvDX1T8U0JFX3a4581nlGQk2MRuk83fwjbbCfvS826HnXPZ1SkL61SW5rV4ZO/UX+f+cdN5Zcnf62SPU0q2tfofNft7/IdyVks+YBe9oS4E0s2Bd7N7YMAeQ8OrFFnzp+9JXnX5E/nz6gH+r/hkOjJIwua1xoX1gj6xWAnz3sxWxh58yHvehKTPatVdM8q1yQanXyqWtB7tRFIcvwxtjU+48p0xzPOfPbiiV/Nm7zrzRnmTbeOhT4Vn6nJmd/RR6CkhyI7G117QnAKbsm7Jl8dfMS1UwHdic1H9BFos+P1e1e7I3BbWu1/+YBnAvceGVHR3rQrHeqfW60Mm/9BG4FYsvOJA+4ciNWVdEIVrwRCiGN1J13pAGknsek/9RGYozOpQ+4KB7UdYTUxec4zgXAPuJerefhQi8KSzugjMEsvuw2gS0Xg2TcnVKgj4koH0B2eQR+Bgk27HYGlMuHXJo4593JlwodaFSza6yNQsr+5LV/FetNOeuaVwOeOjKhY70r3wbTN/qqNQGLzU/F9ze7DmMFHvIcxA2tchzGwqE9sdlIbgYakR2LPuMsEoGoNgfQLfzzsmjwIwr0E0pAJEZv9VhuBAUG3WP2py64mcBiFT690CgOQls2XvNPnz6jE5tUqtsd9ZYb3JS/jrLlZH4HttKWuJ+o6F3ZI7Gt0CgPzIRHIe6D/YRXtcxdAX5O6J2OTpN1s1kagIdjnjE4+6eUhUv8hEQoDt5MXg8nDyPNazgIxOli+up1/Vm85S9Dp5IEWTw/ijMQ9q5w5EXJbSM8gPIE4EQRew3tQ9uJdcU9me70HxpIWtS9zEpv9KLLTmym9PRrHW515EXLbcFfKCbZBwlDS700710q1ZBoeSisi2Q+RbgRy5lfqemKe5kEdAvNfIGe26uYPrXicfYhIpqeByO1IH3MykBnjceODyA8gkr9WinlpsSSyyzHf3yG/ALfTh8EkdBNzuxLqikySHHsQ+QUhEbobukKTB71744UW0JFIWqgSibuQn4BtPsz7yqC1Y0dqlthsN/IbamCB3WYFX7d3jGWUIdk0rCYiP4JIdrQULR4LJZGh9BXsJ+cxFwHBEsENlj+dCfQHdlp5XzUVvUOH6im3Ja6FFMhiiHRqf/7tUAXgHPtycH0477vRt87KB3K0CfkdTU1N78KSnfbTKITRhyU9AcUPVA7AwkwZ6yx/NFxCQ2Unz2NhhlE5gUj6agT2xGkm0BpouAztx6jcEBAmhl2UkLjrIg8WzqHQEciyFagcgSUbY9uT2vaM0N7EBWLzvahcsUKEPoolLcBm6cUmL76/CUpWU2W3T24usGRrazdFFtehjGdUaGMkj3PsUVTuqFpT9R4i2KnIrvSiOZTIzkZwHMchpEJLATVQaJBsejHKXU7Lmp8LBm6BJd0a6o4WFtx0uyNFImg3WmqoEom7iGQTYF4LRWD4asx3JiRC70VLEURwAxoak6OlN+Wr67xsxsjWVaOljIAw19V2ldYrQ4cCeHqSY1m01BESoXcTSY+GhxpKdhyA1d8wiyV9pWyKBV4RbAt/jEiW93LozjWJDzeB180TwT+OlhMM22oyOlnRbYvw27luJy8GBG1ByxFE0JG6LbFptyFL3eZoEUv+DFquwGvxPVjSs5HBxnnv9uQDDZewpKfvfcx6H1rOqIazFiSbms98WD98tVAA/Ym69fcFcLauATZA306qB72IpIMViTBX6tbbV8CSPlm7MVy8WcM49AbWbooUiGTrdevrPwhxJxzaQ7fFp29+eA77xbKJ9+YL6NfDgv45PPT/TsUaBKfBz5bD8U0+OKiR/av+2f9uo4UlUiz5mzUi9Bnd+pUFAlm2gkhWgCM+E/uaweMWcJYFdOtVVqgW5krSwaecYz1tK61bn7JEQPDvgujWo4IKKqigAnRD/Bu2+fPS9x4c6QAAAABJRU5ErkJggg==';
const HomeScreen = () => {
    const navigation = useNavigation();
    const [searchValue, setSearchValue] = useState('');
    const [selectedButton, setSelectedButton] = useState(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const searchBarRef = useRef(null);
    const [selectedMainCategory, setSelectedMainCategory] = useState('음식점'); // 기본 카테고리를 '음식점'으로 설정
    const [subCategories, setSubCategories] = useState([]);
    const [stores, setStores] = useState([]);
    const webviewRef = useRef(null);

    const handleSearchChange = (value) => {
        setSearchValue(value);
    };

    const handleSearchBarPress = () => {
        navigation.navigate('Search');
    };

    const getStoresByCategory = async (category) => {
        try {
            const fetchedStores = await fetchStoresByCategory(category);
            setStores(fetchedStores);
            if (webviewRef.current) {
                webviewRef.current.postMessage(JSON.stringify(fetchedStores));
            }
        } catch (error) {
            console.error("카테고리 별 가게 정보를 가져오는 중 에러가 발생했습니다:", error);
        }
    };

    const getStoresByMainAndSubCategory = async (mainCategory, subCategory) => {
        try {
            const fetchedStores = await fetchStoresByMainAndSubCategory(mainCategory, subCategory);
            setStores(fetchedStores);
            if (webviewRef.current) {
                webviewRef.current.postMessage(JSON.stringify(fetchedStores));
            }
        } catch (error) {
            console.error("카테고리 별 가게 정보를 가져오는 중 에러가 발생했습니다:", error);
        }
    };

    useFocusEffect(
        useCallback(() => {
            getStoresByCategory(selectedMainCategory);
        }, [selectedMainCategory])
    );

    useEffect(() => {
        const showSubscription = Keyboard.addListener('keyboardDidShow', () => {});
        const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {});

        return () => {
            showSubscription.remove();
            hideSubscription.remove();
        };
    }, []);

    const handleMainCategorySelect = (category) => {
        setSelectedMainCategory(category);
        getStoresByCategory(category);
        switch (category) {
          case '음식점':
            setSubCategories(['한식', '중식', '일식', '양식', '분식']);
            break;
          case '술집':
            setSubCategories(['단체', '분위기 좋은', '와인바', '과팅']);
            break;
          case '편의점':
            setSubCategories(['CU', 'GS25', '세븐일레븐', '이마트24']);
            break;
          case '디저트':
            setSubCategories(['테이크아웃', '카공', '케이크', '아이스크림']);
            break;
          default:
            setSubCategories([]);
        }
    };

    const handleSubCategorySelect = (subCategory) => {
        getStoresByMainAndSubCategory(selectedMainCategory, subCategory);
        setSelectedButton(subCategory);
    };

    const handleWebViewMessage = (event) => {
        const { storeId } = JSON.parse(event.nativeEvent.data);
        navigation.navigate('DetailStoreScreen', { storeId });
    };

    const truncateText = (text, maxLength) => {
        if (text.length > maxLength) {
            return text.substring(0, maxLength);
        } else {
            return text;
        }
    };

    const handleStorePress = (category) => {
        handleMainCategorySelect(category);
    };

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

    const htmlContent = `
<html>
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <script type="text/javascript" src="https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_APP_KEY}&libraries=services"></script>
    <style>
        @font-face {
            font-family: 'GmarketSansBold';
            src: url('assets/fonts/GmarketSansBold.ttf') format('truetype');
            font-weight: bold;
            font-style: normal;
        }

        html, body {
            height: 100%;
            margin: 0;
        }
        #map {
            width: 100vw;
            height: 100vh;
        }
        .info-window {
            border: 1.5px solid #4FAF5A; /* 테두리 색상 */
            border-radius: 10px; /* 둥근 테두리 */
            padding: 4px; /* 패딩 추가 */
            background-color: white; /* 배경색 */
            position: relative; /* 위치 설정 */
            white-space: nowrap; /* 텍스트 줄바꿈 방지 */
            font-size: 13px; /* 글자 크기 조정 */
            max-width: 150px; /* 최대 너비 설정 */
            font-family: 'GmarketSansBold'; /* 폰트 설정 */
            bottom: 36px; /* 꼬리 위치 */
        }
        .info-window::after {
            content: '';
            position: absolute;
            bottom: -10px; /* 꼬리 위치 */
            left: 50%;
            transform: translateX(-50%);
            width: 0;
            height: 0;
            border-width: 10px 10px 0;
            border-style: solid;
            border-color: #ffffff transparent transparent transparent; /* 꼬리 배경 색상 */
        }
        .info-window::before {
            content: '';
            position: absolute;
            bottom: -12px; /* 꼬리 위치 */
            left: 50%;
            transform: translateX(-50%);
            width: 0;
            height: 0;
            border-width: 12px 12px 0;
            border-style: solid;
            border-color: #4FAF5A transparent transparent transparent; /* 꼬리 테두리 색상 */
        }
    </style>
</head>
<body>
    <div id="map"></div>
    <script>
        const stores = ${JSON.stringify(stores)};

        const container = document.getElementById('map');
        const options = {
            center: new kakao.maps.LatLng(37.451693, 126.657228),
            level: 6
        };
        const map = new kakao.maps.Map(container, options);

        stores.forEach(store => {
            const markerImage = new kakao.maps.MarkerImage(
                '${map3Base64}', // 커스텀 마커 이미지의 Base64 문자열
                new kakao.maps.Size(36, 36), // 커스텀 마커 이미지의 크기 조정
                { offset: new kakao.maps.Point(20, 40) }
            );

            const marker = new kakao.maps.Marker({
                map: map,
                position: new kakao.maps.LatLng(store.latitude, store.longitude),
                image: markerImage
            });

            kakao.maps.event.addListener(marker, 'click', function() {
                window.ReactNativeWebView.postMessage(JSON.stringify({ storeId: store.id }));
            });

            const customOverlay = new kakao.maps.CustomOverlay({
                map: map,
                position: marker.getPosition(),
                content: '<div class="info-window">' + store.name + '</div>',
                yAnchor: 1.5
            });
        });
    </script>
</body>
</html>

`;


    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.searchContainer}>
                <SearchBar
                    ref={searchBarRef}
                    placeholder="음식을 검색해주세요"
                    value={searchValue}
                    onChangeText={handleSearchChange}
                    platform="android"
                    inputContainerStyle={styles.searchInputContainer}
                    containerStyle={styles.searchBarContainer}
                    searchIcon={{ color: 'green' }}
                    onTouchStart={handleSearchBarPress}
                    style={{ fontFamily: 'GmarketSansMedium'}}
                />
            </View>
            
            <View style={{ height: 200 }}>
                <WebView
                    ref={webviewRef}
                    source={{ html: htmlContent }}
                    style={{ flex: 1 }}
                    onMessage={handleWebViewMessage}
                />
            </View>

            <ScrollView style={{ flex: 1 }}>
                <View style={[styles.newView, { flexDirection: 'row', justifyContent: 'space-around' }]}>
                    <View style={[styles.container, { backgroundColor: '#4FAF5A' }]}>
                        <TouchableOpacity onPress={() => handleStorePress('음식점')}>
                            <View style={styles.imageContainer}>
                                <Image source={require('../../../assets/images/main1.png')} style={styles.imageStyle} resizeMode="contain" />
                            </View>
                            <CustomText style={[styles.newSquareText1, { textAlign: 'center' }]}>음식점</CustomText>
                        </TouchableOpacity>
                    </View>
                    <View style={[styles.container, { marginRight: 10, backgroundColor: '#4FAF5A' }]}>
                        <TouchableOpacity onPress={() => handleStorePress('술집')} style={{ alignItems: 'center' }}>
                            <View style={styles.imageContainer}>
                                <Image source={require('../../../assets/images/main2.png')} style={styles.imageStyle} resizeMode="contain" />
                            </View>
                            <CustomText style={[styles.newSquareText1, { textAlign: 'center' }]}>술집</CustomText>
                        </TouchableOpacity>
                    </View>
                    <View style={[styles.container, { marginRight: 10, backgroundColor: '#4FAF5A' }]}>
                        <TouchableOpacity onPress={() => handleStorePress('편의점')}>
                            <View style={styles.imageContainer}>
                                <Image source={require('../../../assets/images/main3.png')} style={styles.imageStyle} resizeMode="contain" />
                            </View>
                            <CustomText style={[styles.newSquareText1, { textAlign: 'center' }]}>편의점</CustomText>
                        </TouchableOpacity>
                    </View>
                    <View style={[styles.container, { backgroundColor: '#4FAF5A' }]}>
                        <TouchableOpacity onPress={() => handleStorePress('디저트')}>
                            <View style={styles.imageContainer}>
                                <Image source={require('../../../assets/images/main4.png')} style={styles.imageStyle} resizeMode="contain" />
                            </View>
                            <CustomText style={[styles.newSquareText1, { textAlign: 'center' }]}>디저트</CustomText>
                        </TouchableOpacity>
                    </View>
                </View>

                {selectedMainCategory && (
                    <ScrollView horizontal={true} contentContainerStyle={styles.additionalView}>
                        {subCategories.map((item, index) => (
                            <TouchableOpacity
                                key={index}
                                style={[styles.button, selectedButton === item && styles.selectedButton]}
                                onPress={() => handleSubCategorySelect(item)}
                            >
                                <CustomText style={[styles.buttonText, selectedButton === item && styles.selecteCategoryText]}>{item}</CustomText>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                )}

                {selectedButton && (
                    <View style={styles.additionalSquareView}>
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingLeft: 20 }}>
                            <CustomText fontType={"bold"} style={[styles.selectedButtonText, { marginBottom: 5 }]}>{selectedButton}</CustomText>
                        </View>
                    </View>
                )}

                {stores.map((store, index) => (
                    <TouchableOpacity
                        key={index}
                        onPress={() => navigation.navigate('DetailStoreScreen', { storeId: store.id })}
                    >
                        <View style={styles.newSquareView}>
                            <Image source={{ uri: store.image }} style={styles.restaurantImage} resizeMode="cover" />
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <CustomText style={styles.newSquareText}>{store.name}</CustomText>
                                <Image source={getImageSource(store.score)} style={styles.scoreImage} />
                            </View>
                            <CustomText style={styles.SquareTextDetail} numberOfLines={4}>
                                {store.description}
                            </CustomText>
                            <CustomText style={styles.open_unopenText}>{store.openTime} ~ {store.closeTime}</CustomText>
                            {/* <CustomText style={styles.newSquareText2}>#{store.subCategories}</CustomText> */}
                            <View style={{ flexDirection: 'row' }}>
                                {store.subCategories.map((subCategory, index) => (
                                    <CustomText key={index} style={styles.newSquareText2}>#{subCategory}    </CustomText>
                                ))}
                            </View>
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    menuDropdown: {
        position: 'absolute',
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
        marginTop: 40,
        paddingVertical: 5,
        paddingHorizontal: 10,
        zIndex: 1,
    },
    menuItem: {
        paddingVertical: 5,
        paddingHorizontal: 10,
        fontSize: 16,
         fontFamily:"GmarketSansBold"
    },

    searchContainer: {
        padding: 6,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        marginTop:"6%"
    },
    searchBarContainer: {
        backgroundColor: 'transparent',
        borderBottomColor: 'transparent',
        borderTopColor: 'transparent',
        paddingHorizontal: 0,
        paddingVertical: 0,
    },
    searchInputContainer: {
        backgroundColor: '#f2f2f2',
        borderRadius: 20,
        height: 40,
    },
    newView: {
        flexDirection: 'row',
        height: 100,
        backgroundColor: '#4FAF5A',
        marginHorizontal: 5,
        marginVertical: 5,
        borderRadius: 10,
        marginBottom: 1,
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
        margin: 10,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    imageStyle: {
        flex: 1,
        width: '90%',
        height: '90%',
    },
    additionalView: {
        marginHorizontal: 5,
        borderRadius: 10,
        justifyContent: 'space-around',
        alignItems: 'center',
        height: 50,
        flexDirection: 'row',
        padding: 5,
    },
    button: {
        backgroundColor: 'white',
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 30,
        marginHorizontal: 10,
        width: 100,
        borderColor: '#ced4da',
        borderWidth: 1,
        color: 'gray',
    },
    selectedButton: {
        backgroundColor: '#4FAF5A',
        color: 'white',
    },
    buttonText: {
        color: 'black',
        textAlign: 'center',
         fontFamily:"GmarketSansMedium"
    },
    additionalSquareView: {
        flexDirection: 'row',
        height: 50,
        backgroundColor: '#4FAF5A',
        borderRadius: 10,
        marginHorizontal: 5,
        paddingHorizontal: 20,
        paddingVertical: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 5,
    },
    selectedButtonText: {
        fontSize: 17,
        color: 'white',
        textAlign: 'center',
         fontFamily:"GmarketSansBold"
    },
    selecteCategoryText: {
        fontSize: 15,
        color: 'white',
        textAlign: 'center',
         fontFamily:"GmarketSansBold"
    },
    newSquareView: {
        backgroundColor: 'white',
        borderRadius: 10,
        marginHorizontal: 5,
        paddingHorizontal: 20,
        paddingVertical: 5,
        marginTop: 5,
        marginLeft: 5,
    },
    restaurantImage: {
        flex:1,
        width: '100%',
        height: 150,
        borderRadius: 10,
        marginBottom: 10,
    },
    textContainer: {
        justifyContent: 'flex-start',
    },
    newSquareText: {
        fontSize: 28,
        color: 'black',
         fontFamily:"GmarketSansBold"
    },
    SquareTextDetail: {
        fontSize: 15,
        color: 'black',
        marginBottom: 5,
         fontFamily:"GmarketSansBold"
    },
    open_unopenText: {
        fontSize: 15,
        color: 'green',
        marginBottom: 5,
         fontFamily:"GmarketSansBold"
    },
    squareText: {
        fontSize: 16,
        color: 'black',
        marginTop: 5,
         fontFamily:"GmarketSansBold"
    },
    scoreImage: {
        width: "40%",
        height: "400%",
        position: 'absolute',
        right: "-5%",
        bottom:"-200%",
        resizeMode: 'contain',
         fontFamily:"GmarketSansBold"
    },
    newSquareText1: {
        fontSize: 16,
        color: 'white',
        textAlign: 'center',
        marginTop:10,
         fontFamily:"GmarketSansBold"
    },
    newSquareText2: {
        fontSize: 16,
        color: 'black',
        textAlign: 'left',
        marginTop: 0,
        fontFamily:"GmarketSansBold"
    },
    imageContainer: {
        width: 60,
        height: 60,
        borderRadius: 15,
        borderColor:"#4FAF5A",
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
      },
});

export default HomeScreen;
