import React, { useRef, useState } from 'react';
import { View, StyleSheet, Text, Button, Alert } from 'react-native';
import { WebView } from 'react-native-webview';
import { KAKAO_APP_KEY } from '@env';
const KakaoMap = () => {
  const webviewRef = useRef(null);
  const [selectedAddress, setSelectedAddress] = useState('');

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Kakao Map</title>
        <script type="text/javascript" src="https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_APP_KEY}&libraries=services"></script>
        <style>
            html, body {
                height: 100%;
                margin: 0;
                padding: 0;
            }
            #map {
                width: 100%;
                height: 100%;
            }
            #centerAddr {
                position: absolute;
                top: 10px;
                left: 10px;
                z-index: 100;
                background: white;
                padding: 10px;
                box-shadow: 0 1px 2px rgba(0,0,0,0.1);
            }
            .bAddr {
                position: absolute;
                bottom: 30px;
                left: 0;
                width: 100%;
                background: white;
                padding: 10px;
                box-shadow: 0 1px 2px rgba(0,0,0,0.1);
            }
            .title {
                font-weight: bold;
            }
        </style>
    </head>
    <body>
        <div id="map"></div>
        <div id="centerAddr"></div>
        <script>
            var mapContainer = document.getElementById('map'), 
                mapOption = {
                    center: new kakao.maps.LatLng(37.566826, 126.9786567), 
                    level: 3 
                }; 

            var map = new kakao.maps.Map(mapContainer, mapOption); 

            var geocoder = new kakao.maps.services.Geocoder();

            var marker = new kakao.maps.Marker({ 
                map: map 
            }); 

            var infowindow = new kakao.maps.InfoWindow({zindex:1}); 

            function searchAddrFromCoords(coords, callback) {
                geocoder.coord2RegionCode(coords.getLng(), coords.getLat(), callback);         
            }

            function searchDetailAddrFromCoords(coords, callback) {
                geocoder.coord2Address(coords.getLng(), coords.getLat(), callback);
            }

            function displayCenterInfo(result, status) {
                if (status === kakao.maps.services.Status.OK) {
                    var infoDiv = document.getElementById('centerAddr');

                    for(var i = 0; i < result.length; i++) {
                        if (result[i].region_type === 'H') {
                            infoDiv.innerHTML = result[i].address_name;
                            break;
                        }
                    }
                }    
            }

            searchAddrFromCoords(map.getCenter(), displayCenterInfo);

            kakao.maps.event.addListener(map, 'click', function(mouseEvent) {
                searchDetailAddrFromCoords(mouseEvent.latLng, function(result, status) {
                    if (status === kakao.maps.services.Status.OK) {
                        var detailAddr = !!result[0].road_address ? '<div>도로명주소 : ' + result[0].road_address.address_name + '</div>' : '';
                        detailAddr += '<div>지번 주소 : ' + result[0].address.address_name + '</div>';

                        var content = '<div class="bAddr">' +
                                        '<span class="title">법정동 주소정보</span>' + 
                                        detailAddr + 
                                    '</div>';

                        marker.setPosition(mouseEvent.latLng);

                        infowindow.setContent(content);
                        infowindow.open(map, marker);

                        window.ReactNativeWebView.postMessage(JSON.stringify({ address: result[0].address.address_name }));
                    }   
                });
            });

            kakao.maps.event.addListener(map, 'idle', function() {
                searchAddrFromCoords(map.getCenter(), displayCenterInfo);
            });
        </script>
    </body>
    </html>
  `;

  return (
    <View style={styles.container}>
      <WebView
        ref={webviewRef}
        source={{ html: htmlContent }}
        style={{ flex: 1 }}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        onMessage={(event) => {
          const data = JSON.parse(event.nativeEvent.data);
          console.log("Received address:", data.address);
          setSelectedAddress(data.address);
          Alert.alert("Selected Address", data.address);
        }}
        onError={(event) => {
          console.error("WebView error: ", event.nativeEvent);
        }}
      />
      <View style={styles.infoContainer}>
        <Text style={styles.addressText}>Selected Address: {selectedAddress}</Text>
        <Button title="Confirm Address" onPress={() => Alert.alert("Address Confirmed", selectedAddress)} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  infoContainer: {
    padding: 10,
    backgroundColor: 'white',
    alignItems: 'center',
  },
  addressText: {
    fontSize: 16,
    marginBottom: 10,
  },
});

export default KakaoMap;
