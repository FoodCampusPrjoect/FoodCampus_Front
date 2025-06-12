// // // import React, { Component } from 'react';
// // // import Postcode from '@actbase/react-daum-postcode';
// // // import { View } from 'react-native';
// // // import { useNavigation } from '@react-navigation/native';

// // // class SearchAddress extends Component {
// // //     constructor(props) {
// // //         super(props);
// // //     }

// // //     getAddressData = (data) => {
// // //         let defaultAddress = '';

// // //         if (data.buildingName === '') {
// // //             defaultAddress = '';
// // //         } else if (data.buildingName === 'N') {
// // //             defaultAddress = "(" + data.apartment + ")";
// // //         } else {
// // //             defaultAddress = "(" + data.buildingName + ")";
// // //         }

// // //         this.props.navigation.navigate('StoreUpScreen', {
// // //             zonecode: data.zonecode,
// // //             address: data.address,
// // //             defaultAddress: defaultAddress
// // //         });
// // //     }

// // //     render() {
// // //         return (
// // //             <Postcode
// // //                 style={{ width: '100%', height: '100%' }}
// // //                 jsOptions={{ animation: true }}
// // //                 onSelected={(data) => this.getAddressData(data)}
// // //             />
// // //         )
// // //     }
// // // }

// // // export default function (props) {
// // //     const navigation = useNavigation();
// // //     return <SearchAddress {...props} navigation={navigation} />;
// // // }
// // // import React, { Component } from 'react';
// // // import Postcode from '@actbase/react-daum-postcode';
// // // import { View } from 'react-native';
// // // import { useNavigation } from '@react-navigation/native';

// // // class SearchAddress extends Component {
// // //     constructor(props) {
// // //         super(props);
// // //     }

// // //     getAddressData = (data) => {
// // //         let defaultAddress = '';

// // //         if (data.buildingName === '') {
// // //             defaultAddress = '';
// // //         } else if (data.buildingName === 'N') {
// // //             defaultAddress = "(" + data.apartment + ")";
// // //         } else {
// // //             defaultAddress = "(" + data.buildingName + ")";
// // //         }

// // //         this.props.navigation.navigate('StoreUpScreen', {
// // //             zonecode: data.zonecode,
// // //             address: data.address,
// // //             defaultAddress: defaultAddress
// // //         });
// // //     }

// // //     render() {
// // //         return (
// // //             <Postcode
// // //                 style={{ width: '100%', height: '100%' }}
// // //                 jsOptions={{ animation: true }}
// // //                 onSelected={(data) => this.getAddressData(data)}
// // //             />
// // //         )
// // //     }
// // // }

// // // export default function (props) {
// // //     const navigation = useNavigation();
// // //     return <SearchAddress {...props} navigation={navigation} />;
// // // }
import React, { Component } from 'react';
import Postcode from '@actbase/react-daum-postcode';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

class SearchAddress extends Component {
    constructor(props) {
        super(props);
    }

    getAddressData = (data) => {
        let defaultAddress = '';

        if (data.buildingName === '') {
            defaultAddress = '';
        } else if (data.buildingName === 'N') {
            defaultAddress = "(" + data.apartment + ")";
        } else {
            defaultAddress = "(" + data.buildingName + ")";
        }

        this.props.navigation.navigate('StoreUpScreen', {
            zonecode: data.zonecode,
            address: data.address,
            defaultAddress: defaultAddress
        });
    }

    render() {
        return (
            <Postcode
                style={{ width: '100%', height: '100%' }}
                jsOptions={{ animation: true }}
                onSelected={(data) => this.getAddressData(data)}
            />
        )
    }
}

export default function (props) {
    const navigation = useNavigation();
    return <SearchAddress {...props} navigation={navigation} />;
}

