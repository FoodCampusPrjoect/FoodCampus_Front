import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { storage } from './firebaseConfig'; // Firebase 초기화 파일에서 storage를 가져옵니다.
import { ref, getDownloadURL,uploadBytes } from "firebase/storage";
import { BASE_URL } from '@env';
// Axios 인스턴스를 생성합니다. 이 인스턴스를 통해 모든 HTTP 요청을 관리합니다.
const api = axios.create({
  baseURL: BASE_URL,
});


//////////////////////////////////////  로그인  ////////////////////////////////////////////

//로그인
export const loginUser = async (email, password) => {
  try {
    const response = await api.post('/auth/login', {
      email,
      password
    });
    return response.data;
  } catch (error) {
    console.error('Login error:', error.response || error);
    throw error;
  }
};

// 회원가입
export const SignupUser = async (userData) => {
  try {
    const response = await api.post('/auth/signup', userData);
    return response.data;
  } catch (error) {
    console.error('Signup error:', error.response || error);
    throw error;
  }
};

// 프론트엔드에서 동의 여부를 전달하는 함수
export const Terms_Record = async (agreement) => {
  try {
    const response = await api.post('/terms_record', {
      agreementDay: new Date().toISOString(),
      consent: agreement ? 1 : 0
    });
    console.log(response.data);
  } catch (error) {
    console.error('동의 여부 전송 중 오류 발생:', error);
  }
};

// 파이어베이스에 이미지
export const uploadImageToFirebase = async (imageUri) => {
  const response = await fetch(imageUri);
  const blob = await response.blob();
  const storageRef = ref(storage, `profileImages/${Date.now()}`);
  await uploadBytes(storageRef, blob);
  const downloadUrl = await getDownloadURL(storageRef);
  return downloadUrl;
};

//데이터베이스에 프로필사진업데이트 콜하기
export const updateProfileImageApi = async (token, imageUrl) => {
  await api.post('/auth/update-profile-image', { imageUrl }, {
    headers: {
      Authorization: token
    }
  });
};

////////////////////////////////////////////////검색///////////////////////////////////////////
export const searchStores = async (query) => {
  try {
    const response = await api.get('/api/stores/search', { params: { query } });
    return response.data;
  } catch (error) {
    console.error('Error searching stores:', error);
    throw error;
  }
};


//////////////////////////////////////   가게관리   ////////////////////////////////////////////


// 가게 등록
export const storeUpload = async (storesData) => {
  try {
    const response = await api.post('/api/register', storesData);
    return response.data;
  } catch (error) {
    console.error('Store Upload error:', error.response || error);
    throw error;
  }
};

// 가게 수정
export const updateStore = async (storeId, storeData) => {
  try {
    const response = await api.put(`/api/stores/update/${storeId}`, storeData);
    return response.data;
  } catch (error) {
    console.error('Store Update error:', error.response || error);
    throw error;
  }
};

// 가게 정보를 가져오는 함수
export const fetchStores = async () => {
  try {
    const response = await api.get('/api/stores');
    const storesData = await Promise.all(
      (response.data || []).map(async (store) => {
        let storeImageUrl = store.storeImage;
        // 이미지 URL이 정의되어 있고, gs:// 형식인 경우 변환
        if (typeof store.storeImage === 'string' && store.storeImage.startsWith('gs://')) {
          try {
            const imageRef = ref(storage, store.storeImage); // Storage 참조 생성
            storeImageUrl = await getDownloadURL(imageRef); // 다운로드 URL 가져오기
          } catch (storageError) {
            console.error("Storage URL 변환 중 에러가 발생했습니다:", storageError);
            // 필요에 따라 기본 이미지를 설정하거나 에러 처리를 추가할 수 있습니다.
          }
        }

        const images = await Promise.all(
          (store.images || []).map(async (image) => {
            let imageUrl = image.url;
            // 이미지 URL이 정의되어 있고, gs:// 형식인 경우 변환
            if (typeof image.url === 'string' && image.url.startsWith('gs://')) {
              try {
                const imageRef = ref(storage, image.url); // Storage 참조 생성
                imageUrl = await getDownloadURL(imageRef); // 다운로드 URL 가져오기
              } catch (storageError) {
                console.error("Storage URL 변환 중 에러가 발생했습니다:", storageError);
                // 필요에 따라 기본 이미지를 설정하거나 에러 처리를 추가할 수 있습니다.
              }
            }
            return imageUrl;
          })
        );

        return {
          id: store.storeId,
          name: store.storeName,
          address: store.address,
          storeNumber: store.storeNumber,
          openTime: store.openTime,
          closeTime: store.closeTime,
          image: storeImageUrl, // 변환된 HTTPS URL 또는 원래의 URL
          images, // 변환된 HTTPS URL 목록
          description: store.shortInfo,
          score: store.score,
          latitude: store.latitude,
          longitude: store.longitude,
        };
      })
    );
    return storesData;
  } catch (error) {
    console.error("가게 정보를 가져오는 중 에러가 발생했습니다:", error);
    throw error;
  }
};

// 특정 가게 정보를 가져오는 함수
export const fetchStoreById = async (storeId) => {
  try {
    const response = await api.get(`/api/stores/${storeId}`);
    const store = response.data;

    // 변환된 store_image URL
    let imageUrl = store.storeImage;
    if (typeof store.storeImage === 'string' && store.storeImage.startsWith('gs://')) {
      try {
        const imageRef = ref(storage, store.storeImage);
        imageUrl = await getDownloadURL(imageRef);
      } catch (storageError) {
        console.error("Storage URL 변환 중 에러가 발생했습니다:", storageError);
      }
    }

     // 변환된 images URL 목록
     const images = Array.isArray(store.url)
     ? await Promise.all(store.url.map(async (imageUrl) => {
         if (typeof imageUrl === 'string' && imageUrl.startsWith('gs://')) {
           try {
             const imageRef = ref(storage, imageUrl);
             return await getDownloadURL(imageRef);
           } catch (storageError) {
             console.error("Storage URL 변환 중 에러가 발생했습니다:", storageError);
             return null; // 오류가 발생한 경우 null을 반환하여 유효하지 않은 URL을 필터링할 수 있게 함
           }
         } else {
           return imageUrl;
         }
       }))
     : [];

    // 변환된 menus 목록 (String 타입의 텍스트 배열)
    const menus = Array.isArray(store.menu)
      ? store.menu.map(menu => menu.menu)
      : [];

    // 휴무일 목록
    const closedDays = Array.isArray(store.closedDays)
      ? store.closedDays
      : [];

    // 메인 카테고리와 서브 카테고리
    const selectMainCategory = store.selectMainCategory || '';
    const selectSubCategories = Array.isArray(store.selectSubCategories)
      ? store.selectSubCategories
      : [];

    return {
      id: store.storeId,
      name: store.storeName,
      address: store.address,
      detailAddress: store.detailAddress,
      openTime: store.openTime,
      closeTime: store.closeTime,
      storeNumber: store.storeNumber,
      image: imageUrl, // 변환된 HTTPS URL 또는 원래의 URL
      images, // 변환된 HTTPS URL 목록
      menus,    // 메뉴 목록 불러오기
      closedDays,
      selectMainCategory,
      selectSubCategories,
      description: store.storeInfo,
      shortInfo: store.shortInfo,
      taste: store.taste,
      price: store.price,
      kindness: store.kindness,
      hygiene: store.hygiene,
      score: store.score
    };
  } catch (error) {
    console.error(`ID가 ${storeId}인 가게 정보를 가져오는 중 에러가 발생했습니다:`, error);
    throw error;
  }
};

// 스토어를 삭제하는 함수
export const deleteStore = async (storeId) => {
  try {
    const response = await api.delete(`/api/stores/${storeId}`);
    return response.data;
  } catch (error) {
    console.error('Store Deletion error:', error.response || error);
    throw error;
  }
};


//////////////////////////////////////   리뷰관리   ////////////////////////////////////////////

// 이미지 업로드 함수 - Firebase에 이미지를 업로드하고 이미지 URL을 반환합니다.
export const handleImageUpload = async (image) => {
  try {
    const response = await fetch(image.uri);
    const blob = await response.blob();

    const storageRef = ref(storage, image.fileName || 'photo.jpg');
    await uploadBytes(storageRef, blob);

    const imageUrl = await getDownloadURL(storageRef);
    return imageUrl;
  } catch (error) {
    console.error('Image upload error:', error);
    throw error;
  }
};

// 리뷰 데이터를 전송하는 함수 - 리뷰 데이터에 이미지 URL을 추가하여 전송합니다.
export const submitReview = async (reviewData) => {
  try {
    const response = await api.post('/api/reviews', reviewData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Review submission error:', error.response || error);
    throw error;
  }
};

// 모든 리뷰를 가져오는 함수
export const getAllReviews = async () => {
  try {
    const response = await api.get('/api/reviews');
    return response.data;
  } catch (error) {
    console.error('Error fetching reviews:', error.response || error);
    throw error;
  }
};

// 특정 리뷰를 ID로 가져오는 함수
export const getReviewById = async (id) => {
  try {
    const response = await api.get(`/api/reviews/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching review by ID:', error.response || error);
    throw error;
  }
};

// 특정 상점 ID로 리뷰들을 가져오는 함수
export const getReviewsByStoreId = async (storeId) => {
  try {
    const response = await api.get(`/api/store/${storeId}`);
    return response.data;
  } catch (error) {
    console.log('특정 상점 ID로 리뷰를 가져오는 도중 에러 발생:', error.response || error);
    throw error;
  }
};

// 특정 사용자 ID로 리뷰들을 가져오는 함수
export const getReviewsByUserId = async (userId, token) => {
  try {
    const response = await api.get(`/api/reviews/user?userId=${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching user reviews:', error.response || error);
    throw error;
  }
};

export const deleteReviewById = async (reviewId) => {
  try {
    const response = await api.delete(`/api/reviews/${reviewId}`);
    return response.data;
  } catch (error) {
    console.error('리뷰 삭제 중 에러 발생:', error.response || error);
    throw error;
  }
};
//////////////////////////////////////   유저관리   ////////////////////////////////////////////



export const getUserData = async (token) => {
  try {
    const response = await api.get('/auth/user', {
      headers: {
        'Authorization': `${token}`
      }
    });
    const userData = response.data;
    // 받아온 데이터에 롤 정보가 포함되어 있는지 확인하여 필요하다면 가져옵니다.
    const { role, phone, ...userInfo } = userData;
    // 전화번호를 AsyncStorage에 저장
    if (phone) {
      await AsyncStorage.setItem('phone', phone);
    }
    return {  ...userInfo, role: parseInt(role), phone }; // 사용자 정보와 롤 정보를 합쳐서 반환합니다.
  } catch (error) {
    console.error('Failed to fetch user data:', error.response || error);
    throw error;
  }
};



// 전화번호를 업데이트하는 함수 추가
export const updatePhoneNumber = async (token, newPhone) => {
  try {
    const response = await api.post('/auth/update-phone', {
      phone: newPhone,
    }, {
      headers: {
        'Authorization': `${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Failed to update phone number:', error.response || error);
    throw error;
  }
};

export const updateNickname = async (token, newNickname) => {
  try {
    const response = await api.post('/auth/update-nickname', {
      nickname: newNickname,
    }, {
      headers: {
        'Authorization': `${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Failed to update nickname:', error.response || error);
    throw error;
  }
};

export const withdrawUser = async (token) => {
  try {
    const response = await api.post('/auth/withdraw', null, {
      headers: {
        'Authorization': `${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Failed to withdraw user:', error.response || error);
    throw error;
  }
};


// 비밀번호를 업데이트하는 함수
export const updatePassword = async (token, currentPassword, newPassword) => {
  try {
    const response = await api.post('/auth/update-password', {
      currentPassword,
      newPassword
    }, {
      headers: {
        'Authorization': `${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Failed to update password:', error.response || error);
    throw error;
  }
};

// 역할 불러오기 (user/admin)
export const fetchUserRole = async () => {
  try {
    const token = await AsyncStorage.getItem('token'); // AsyncStorage에서 토큰을 가져옴
    const response = await api.get('/auth/user', {
      headers: {
        Authorization: `Bearer ${token}`, // 토큰을 헤더에 담아서 서버로 전송
      },
    });
    return response.data.role; // API 응답에서 role 값을 반환
  } catch (error) {
    console.error('Error fetching user role:', error);
    throw error; // 에러를 상위 컴포넌트로 전파하여 처리
  }
};

// 특정 카테고리의 가게 정보를 가져오는 함수
export const fetchStoresByCategory = async (category) => {
  try {
    const response = await api.get(`/api/stores/category/${category}`);
    const storesData = await Promise.all(
      (response.data || []).map(async (store) => {
        let storeImageUrl = store.storeImage;
        if (typeof store.storeImage === 'string' && store.storeImage.startsWith('gs://')) {
          try {
            const imageRef = ref(storage, store.storeImage);
            storeImageUrl = await getDownloadURL(imageRef);
          } catch (storageError) {
            console.error("Storage URL 변환 중 에러가 발생했습니다:", storageError);
          }
        }

        const images = await Promise.all(
          (store.images || []).map(async (image) => {
            let imageUrl = image.url;
            if (typeof image.url === 'string' && image.url.startsWith('gs://')) {
              try {
                const imageRef = ref(storage, image.url);
                imageUrl = await getDownloadURL(imageRef);
              } catch (storageError) {
                console.error("Storage URL 변환 중 에러가 발생했습니다:", storageError);
              }
            }
            return imageUrl;
          })
        );

        return {
          id: store.storeId,
          name: store.storeName,
          address: store.address,
          storeNumber: store.storeNumber,
          openTime: store.openTime,
          closeTime: store.closeTime,
          subCategories: store.selectSubCategories,
          image: storeImageUrl,
          images,
          description: store.shortInfo,
          score: store.score,
          latitude: store.latitude,
          longitude: store.longitude,
        };
      })
    );
    return storesData;
  } catch (error) {
    console.error("카테고리 별 가게 정보를 가져오는 중 에러가 발생했습니다:", error);
    throw error;
  }
};

// 서브 카테고리 별 가게 리스트를 가져오는 함수
export const fetchStoresByMainAndSubCategory = async (mainCategory, subCategory) => {
  try {
    const response = await api.get(`/api/stores/category/${mainCategory}/${subCategory}`);
    const storesData = await Promise.all(
      (response.data || []).map(async (store) => {
        let storeImageUrl = store.storeImage;
        if (typeof store.storeImage === 'string' && store.storeImage.startsWith('gs://')) {
          try {
            const imageRef = ref(storage, store.storeImage);
            storeImageUrl = await getDownloadURL(imageRef);
          } catch (storageError) {
            console.error("Storage URL 변환 중 에러가 발생했습니다:", storageError);
          }
        }

        const images = await Promise.all(
          (store.images || []).map(async (image) => {
            let imageUrl = image.url;
            if (typeof image.url === 'string' && image.url.startsWith('gs://')) {
              try {
                const imageRef = ref(storage, image.url);
                imageUrl = await getDownloadURL(imageRef);
              } catch (storageError) {
                console.error("Storage URL 변환 중 에러가 발생했습니다:", storageError);
              }
            }
            return imageUrl;
          })
        );

        return {
          id: store.storeId,
          name: store.storeName,
          address: store.address,
          storeNumber: store.storeNumber,
          openTime: store.openTime,
          closeTime: store.closeTime,
          subCategories: store.selectSubCategories,
          image: storeImageUrl,
          images,
          description: store.shortInfo,
          score: store.score,
          latitude: store.latitude,
          longitude: store.longitude,

        };
      })
    );
    return storesData;
  } catch (error) {
    console.error("카테고리 별 가게 정보를 가져오는 중 에러가 발생했습니다:", error);
    throw error;
  }
};


//////////////////////////////////////   찜목록 관리   ////////////////////////////////////////////

// 새로운 찜 추가
export const addDib = async (userId, storeId) => {
  try {
    const response = await api.post('/api/dibs', null, {
      params: {
        userId: userId,
        storeId: storeId,
      },
    });
    return response.data;
  } catch (error) {
    console.log('Failed to add dib:', error);
    throw error;
  }
};

export const getDibsByUserId = async (userId) => {
  try {
    const response = await api.get(`/api/dibs/user/${userId}`);
    const dibs = response.data;

    const dibsWithStores = await Promise.all(
      dibs.map(async (dib) => {
        const storeId = dib.storeId;
        if (!storeId) {
          return { ...dib, store: null };
        }
        try {
          const storeResponse = await api.get(`/api/stores/${storeId}`);
          const store = storeResponse.data;
          return { ...dib, store: { ...store, storeInfo: store.storeInfo, image: store.storeImage } }; 
        } catch (storeError) {
          return { ...dib, store: null };
        }
      })
    );

    return dibsWithStores;
  } catch (error) {
    throw error;
  }
};


export const getDibsByStoreId = async (storeId) => {
  try {
    const response = await api.get(`/api/dibs/store/${storeId}`);
    return response.data;
  } catch (error) {
    console.log('Failed to get dibs by store ID:', error);
    throw error;
  }
};

export const removeDib = async (dibId) => {
  try {
    await api.delete(`/api/dibs/${dibId}`);
  } catch (error) {
    console.log('Failed to remove dib:', error);
    throw error;
  }
};

export const checkDib = async (userId, storeId) => {
  try {
    const response = await api.get(`/api/dibs?userId=${userId}&storeId=${storeId}`);
    return response.data;
  } catch (error) {
    console.log('Failed to check dib:', error);
    throw error;
  }
};

export const removeDibByUserAndStore = async (userId, storeId) => {
  try {
    await api.delete(`/api/dibs`, {
      params: {
        userId: userId,
        storeId: storeId
      }
    });
  } catch (error) {
    console.log('Failed to remove dib by user and store:', error);
    throw error;
  }
};