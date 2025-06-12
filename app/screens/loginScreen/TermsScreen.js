import React, { useState } from 'react';
import { ScrollView, View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import CustomCheckbox from '../../components/CustomCheckbox'; 
import { useNavigation } from '@react-navigation/native';
import { Terms_Record } from '../../api/api';

const TermsScreen = () => {
    const navigation = useNavigation();
    const [agreements, setAgreements] = useState([false, false, false]);
    const [showFullText, setShowFullText] = useState([false, false, false]);

    const handleAgree = async () => {
        try {
            await Terms_Record(agreements); // 함수 호출
            navigation.navigate('SignUp');
        } catch (error) {
            console.error('동의 여부 전송 중 오류 발생:', error);
            // 오류 처리
        }
    };

    const toggleCheckbox = index => {
        setAgreements(agreements.map((value, i) => (i === index ? !value : value)));
    };

    const toggleShowFullText = index => {
        setShowFullText(showFullText.map((value, i) => (i === index ? !value : value)));
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
            <View style={styles.termsSection}>
                <View style={styles.termsHeader}>
                    <CustomCheckbox
                        isSelected={agreements[0]}
                        onValueChange={() => toggleCheckbox(0)}
                        size="large"
                    />
                    <Text style={styles.title}>위치기반 서비스 이용약관</Text>
                </View>
                <View style={styles.termsBox}>
                    <Text style={styles.termsText}>
                        {showFullText[0] ? (
                            <>
                                본 위치 기반 서비스 이용 약관(이하 "본 약관")은 서비스 제공 업체명가 제공하는 위치 기반 서비스(이하 "서비스")를 이용함에 있어 회사와 사용자 간의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.{"\n\n"}
                                제1조 (목적){"\n"}
                                본 약관은 회사가 제공하는 서비스의 이용과 관련하여 회사와 사용자 간의 권리, 의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.{"\n\n"}
                                제2조 (정의){"\n"}
                                "서비스"라 함은 회사가 제공하는 위치 정보 기반의 모든 서비스를 의미합니다.{"\n"}
                                "사용자"라 함은 본 약관에 따라 서비스를 이용하는 자를 의미합니다.{"\n"}
                                "위치 정보"라 함은 특정 개인의 위치를 식별할 수 있는 정보로, GPS 데이터, Wi-Fi 접속 정보, 기타 위치를 알 수 있는 정보를 포함합니다.{"\n\n"}
                                제3조 (위치 정보의 수집 및 이용){"\n"}
                                회사는 서비스 제공을 위해 필요한 범위 내에서 사용자의 위치 정보를 수집할 수 있습니다.{"\n"}
                                위치 정보는 사용자의 동의를 받은 경우에 한해 수집되며, 수집된 정보는 다음의 목적을 위해 이용됩니다.{"\n"}
                                - 서비스 제공 및 최적화{"\n"}
                                - 맞춤형 콘텐츠 및 광고 제공{"\n"}
                                - 통계 분석 및 서비스 개선{"\n\n"}
                                제4조 (위치 정보의 공유 및 제공){"\n"}
                                회사는 사용자의 동의 없이 제3자에게 위치 정보를 제공하지 않습니다. 다만, 다음의 경우는 예외로 합니다.{"\n"}
                                - 법령에 의한 요구가 있는 경우{"\n"}
                                - 수사기관이 수사 목적으로 요구하는 경우{"\n"}
                                - 사용자가 사전에 동의한 경우{"\n"}
                                위치 정보 제공 시, 제공 목적과 범위를 사용자에게 사전에 고지하고 동의를 받습니다.{"\n\n"}
                                제5조 (위치 정보의 보호){"\n"}
                                회사는 위치 정보의 안전한 관리를 위해 보안 시스템을 구축하고, 개인정보 보호법 등 관련 법령을 준수합니다.{"\n"}
                                회사는 위치 정보의 분실, 도난, 유출, 위조, 변조 등을 방지하기 위해 기술적, 관리적 조치를 강구합니다.{"\n\n"}
                                제6조 (사용자의 권리){"\n"}
                                사용자는 언제든지 위치 정보 수집, 이용, 제공에 대한 동의를 철회할 수 있습니다.{"\n"}
                                사용자는 회사에 대해 위치 정보의 열람, 수정, 삭제를 요청할 수 있습니다.{"\n"}
                                사용자는 위치 정보의 수집, 이용, 제공에 관한 불만을 회사에 제기할 수 있으며, 회사는 이에 대해 신속하게 처리합니다.{"\n\n"}
                                제7조 (책임의 한계){"\n"}
                                회사는 천재지변, 전쟁, 폭동, 테러, 해킹 등 불가항력적인 사유로 인한 위치 정보 서비스 제공의 장애에 대해 책임을 지지 않습니다.{"\n"}
                                회사는 사용자의 귀책 사유로 인한 위치 정보 서비스 이용의 장애에 대해 책임을 지지 않습니다.{"\n\n"}
                                제8조 (약관의 변경){"\n"}
                                회사는 법령의 변경, 서비스의 변경 등 합리적인 사유가 있는 경우 본 약관을 변경할 수 있습니다.{"\n"}
                                약관이 변경되는 경우 회사는 변경된 약관의 내용을 시행일자 7일 전부터 공지합니다.
                            </>
                        ) : (
                            "본 위치 기반 서비스 이용 약관(이하 '본 약관')은 서비스 제공 업체명가 제공하는 위치 기반 서비스(이하 '서비스')를 이용함에 있어 회사와 사용자 간의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다."
                        )}
                    </Text>
                    <TouchableOpacity onPress={() => toggleShowFullText(0)}>
                        <Text style={styles.moreText}>{showFullText[0] ? "간략히 보기" : "더보기"}</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.termsSection}>
                <View style={styles.termsHeader}>
                    <CustomCheckbox
                        isSelected={agreements[1]}
                        onValueChange={() => toggleCheckbox(1)}
                        size="large"
                    />
                    <Text style={styles.title}>14세 이상입니다</Text>
                </View>
                <View style={styles.termsBox}>
                    <Text style={styles.termsText}>
                        {showFullText[1] ? (
                            <>
                                본 서비스는 만 14세 이상의 사용자만 이용할 수 있습니다.{"\n\n"}
                                제1조 (목적){"\n"}
                                본 약관은 만 14세 이상의 사용자에 대한 서비스 이용과 관련하여 회사와 사용자 간의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.{"\n\n"}
                                제2조 (정의){"\n"}
                                "사용자"라 함은 만 14세 이상으로 본 약관에 동의하고 서비스를 이용하는 자를 의미합니다.{"\n\n"}
                                제3조 (서비스 이용){"\n"}
                                만 14세 미만의 사용자는 부모나 법정 대리인의 동의를 받은 경우에만 서비스를 이용할 수 있습니다.{"\n"}
                                부모나 법정 대리인은 만 14세 미만의 사용자가 서비스를 이용하는 데 동의함으로써 이 약관에 동의한 것으로 간주됩니다.{"\n\n"}
                                제4조 (부모나 법정 대리인의 권리){"\n"}
                                부모나 법정 대리인은 만 14세 미만의 사용자의 개인정보 열람, 수정, 삭제를 요청할 수 있습니다.{"\n"}
                                부모나 법정 대리인은 언제든지 동의를 철회할 수 있으며, 동의 철회 시 해당 사용자는 서비스 이용이 제한될 수 있습니다.{"\n\n"}
                                제5조 (책임의 한계){"\n"}
                                회사는 만 14세 미만의 사용자가 부모나 법정 대리인의 동의 없이 서비스를 이용하여 발생한 문제에 대해 책임을 지지 않습니다.{"\n"}
                                부모나 법정 대리인은 만 14세 미만 사용자의 서비스 이용에 대한 모든 책임을 집니다.{"\n\n"}
                                제6조 (약관의 변경){"\n"}
                                회사는 법령의 변경, 서비스의 변경 등 합리적인 사유가 있는 경우 본 약관을 변경할 수 있습니다.{"\n"}
                                약관이 변경되는 경우 회사는 변경된 약관의 내용을 시행일자 7일 전부터 공지합니다.
                            </>
                        ) : (
                            "본 서비스는 만 14세 이상의 사용자만 이용할 수 있습니다. 부모나 법정 대리인의 동의를 받은 경우에만 서비스를 이용할 수 있습니다."
                        )}
                    </Text>
                    <TouchableOpacity onPress={() => toggleShowFullText(1)}>
                        <Text style={styles.moreText}>{showFullText[1] ? "간략히 보기" : "더보기"}</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.termsSection}>
                <View style={styles.termsHeader}>
                    <CustomCheckbox
                        isSelected={agreements[2]}
                        onValueChange={() => toggleCheckbox(2)}
                        size="large"
                    />
                    <Text style={styles.title}>서비스 이용약관 동의</Text>
                </View>
                <View style={styles.termsBox}>
                    <Text style={styles.termsText}>
                        {showFullText[2] ? (
                            <>
                                제1조 (목적){"\n"}
                                본 약관은 회사가 제공하는 서비스의 이용과 관련하여 회사와 사용자 간의 권리, 의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.{"\n\n"}
                                제2조 (정의){"\n"}
                                "서비스"라 함은 회사가 제공하는 모든 서비스 및 관련 부가서비스를 의미합니다.{"\n"}
                                "사용자"라 함은 본 약관에 따라 서비스를 이용하는 자를 의미합니다.{"\n\n"}
                                제3조 (이용계약의 성립){"\n"}
                                이용계약은 사용자가 본 약관의 내용에 대해 동의한 후 이용신청을 하고, 회사가 이를 승낙함으로써 성립합니다.{"\n\n"}
                                제4조 (서비스의 제공 및 변경){"\n"}
                                회사는 사용자에게 다음과 같은 서비스를 제공합니다:{"\n"}
                                - 맛집 추천 및 검색 서비스{"\n"}
                                - 사용자 리뷰 및 평점 제공 서비스{"\n"}
                                - 위치 기반 맛집 정보 제공 서비스{"\n"}
                                회사는 서비스의 내용, 운영상 또는 기술상 필요에 따라 제공하는 서비스의 일부 또는 전부를 변경할 수 있습니다.{"\n\n"}
                                제5조 (서비스 이용의 제한 및 중지){"\n"}
                                회사는 사용자가 본 약관을 위반하거나 다음 각 호에 해당하는 경우 서비스 이용을 제한하거나 중지할 수 있습니다:{"\n"}
                                - 법령 또는 공공질서 및 미풍양속을 위반하는 경우{"\n"}
                                - 타인의 권리를 침해하거나, 타인의 개인정보를 무단으로 수집하는 경우{"\n\n"}
                                제6조 (책임의 한계){"\n"}
                                회사는 천재지변, 전쟁, 폭동, 테러, 해킹 등 불가항력적인 사유로 인한 서비스 제공의 장애에 대해 책임을 지지 않습니다.{"\n"}
                                회사는 사용자의 귀책 사유로 인한 서비스 이용의 장애에 대해 책임을 지지 않습니다.{"\n\n"}
                                제7조 (약관의 변경){"\n"}
                                회사는 법령의 변경, 서비스의 변경 등 합리적인 사유가 있는 경우 본 약관을 변경할 수 있습니다.{"\n"}
                                약관이 변경되는 경우 회사는 변경된 약관의 내용을 시행일자 7일 전부터 공지합니다.
                            </>
                        ) : (
                            "본 약관은 회사가 제공하는 서비스의 이용과 관련하여 회사와 사용자 간의 권리, 의무 및 책임사항을 규정합니다."
                        )}
                    </Text>
                    <TouchableOpacity onPress={() => toggleShowFullText(2)}>
                        <Text style={styles.moreText}>{showFullText[2] ? "간략히 보기" : "더보기"}</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.agreeButtonContainer}>
                <TouchableOpacity
                    onPress={handleAgree}
                    disabled={!agreements.every(value => value)}
                    style={[styles.button, !agreements.every(value => value) ? styles.buttonDisabled : styles.buttonEnabled]} // 조건에 따라 스타일 변경
                >
                    <Text style={styles.buttonText}>다음</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    termsSection: {
        marginBottom: 20,
    },
    termsHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    title: {
        fontSize: 20,
        // fontWeight: 'bold',
        marginLeft: 10,
        fontFamily: "GmarketSansBold",
    },
    termsBox: {
        borderWidth: 1,
        borderColor: '#dcdcdc',
        backgroundColor: '#D4D7DD',
        padding: 10,
        borderRadius: 5,
    },
    termsText: {
        fontSize: 14,
        fontFamily: "GmarketSansMedium",
        color: "grey"
    },
    moreText: {
        color: '#007BFF',
        marginTop: 10,
        fontFamily: "GmarketSansMedium",
    },
    contentContainer: {
        paddingBottom: 50,
    },
    agreeButtonContainer: {
        backgroundColor: '#4FAF5A',
        borderRadius: 10,
    },
    button: {
        padding: "2%",
        borderRadius: 10,
    },
    buttonText: {
        color: '#fff',
        textAlign: 'center',
        fontFamily: "GmarketSansBold",
    },
    buttonEnabled: {
        backgroundColor: '#4FAF5A',
    },
    buttonDisabled: {
        backgroundColor: '#cccccc',
    },
});

export default TermsScreen;
