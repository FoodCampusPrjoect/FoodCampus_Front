import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Modal from 'react-native-modal';
import { FontAwesome } from '@expo/vector-icons'; 
// npm install react-native-modal @expo/vector-icons

const DropDown = ({ options, selectedValue, onValueChange }) => {
    const [isVisible, setIsVisible] = useState(false);

    const toggleModal = () => {
        setIsVisible(!isVisible);
    };

    const handleOptionPress = (value) => {
        onValueChange(value.toString()); // 선택한 값을 문자열로 변환하여 전달
        toggleModal();
    };    

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={toggleModal} style={styles.selectBox}>
                <Text style={styles.selectedValue}>{selectedValue || "선택하세요"}</Text>
                <FontAwesome name="caret-down" size={17} color="black" style={styles.icon} />
            </TouchableOpacity>
            <Modal isVisible={isVisible} onBackdropPress={toggleModal}>
                <View style={styles.modalContent}>
                    {options.map((option) => (
                        <TouchableOpacity key={option} onPress={() => handleOptionPress(option)}>
                            <Text style={styles.optionText}>{option}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        borderWidth: 1,
        borderColor: '#4FAF5A',
        borderRadius: 5,
        flexDirection: 'column',
        marginVertical:5,
        marginRight:2,
        marginLeft:-60
    },
    selectBox: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        paddingVertical: 9,
    },
    selectedValue: {
        fontSize: 14,
        
    },
    icon: {
        marginLeft: 5,
    },
    modalContent: {
        backgroundColor: 'white',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 5,
        marginVertical:10
    },
    optionText: {
        fontSize: 17,
        paddingVertical: 8,
    },
});

export default DropDown;
