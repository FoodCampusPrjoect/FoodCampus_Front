import React, { useRef, useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, Animated, View } from 'react-native';

const ProgressBar = ({ currentStep, totalSteps, onProgressChange }) => {
  const progressAnim = useRef(new Animated.Value(0)).current;
  const [barWidth, setBarWidth] = useState(0); // 프로그레스바의 전체 너비를 저장할 상태

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: currentStep,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [currentStep, progressAnim]);

  const handlePress = (evt) => {
    const newStep = Math.floor((evt.nativeEvent.locationX / barWidth) * totalSteps) + 1;
    onProgressChange(Math.min(Math.max(newStep, 1), totalSteps));
  };

  // 동그란 마커들을 생성합니다.
  const renderMarkers = () => {
    let markers = [];
    for (let i = 1; i < totalSteps; i++) {
      markers.push(
        <View
          key={i}
          style={[
            styles.marker,
            { left: `${(i / totalSteps) * 100}%` },
            i === currentStep ? styles.activeMarker : {},
          ]}
        />
      );
    }
    return markers;
  };

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={1} style={styles.touchableArea}>
      <View
        style={styles.container}
        onLayout={(event) => {
          const { width } = event.nativeEvent.layout;
          setBarWidth(width);
        }}
      >
        <Animated.View style={[styles.progress, { width: progressAnim.interpolate({
          inputRange: [0, totalSteps],
          outputRange: ['0%', '100%'],
        }) }]} />
        {renderMarkers()}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  touchableArea: {
    width: '100%', // TouchableOpacity가 전체 너비를 차지하도록 설정
  },
  container: {
    height: 20,
    width: '100%',
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
    position: 'relative', // 마커를 절대 위치로 배치하기 위해 설정
  },
  progress: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 10,
  },
  marker: {
    position: 'absolute',
    bottom: 7, // 마커가 프로그레스바 밖으로 조금 나오게 조정
    width: 7,
    height: 7,
    borderRadius: 5, // 동그란 마커를 만들기 위해 설정
    backgroundColor: '#FFFFFF',
    transform: [{ translateX: -3.5 }], // 마커의 중심을 정확한 위치에 맞추기 위해 조정
  },
  activeMarker: {
    
  },
});

export default ProgressBar;
