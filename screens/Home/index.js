import React, { Component } from 'react'
import { Alert, Text, Image, StyleSheet, View, TouchableOpacity, Dimensions, ScrollView } from 'react-native'
import Ionicons from '@expo/vector-icons/Ionicons'
import Swiper from 'react-native-swiper'
import * as Location from 'expo-location'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { LinearGradient } from 'expo-linear-gradient'
import { getCityInfo } from '../../utils/api.js'
export default class index extends Component {
    state = {
        cityInfo: null,
        loadingCityInfo: false,
        cityInfoError: '',
    }

    componentDidMount = async () => {
        try {
            this.setState({ loadingCityInfo: true, cityInfoError: '' })
            const { status } = await Location.requestForegroundPermissionsAsync()

            if (status !== 'granted') {
                Alert.alert('报错', '没有定位权限')
                this.setState({ loadingCityInfo: false, cityInfoError: '没有定位权限' })
                return
            }

            const info = await Location.getCurrentPositionAsync({
                timeout: 20000,
            })

            console.log(info)
            // 获取地理位置成功后，将其保存下来
            await AsyncStorage.setItem('coords', JSON.stringify(info.coords))

            const places = await Location.reverseGeocodeAsync(info.coords)
            const currentCityName = places[0]?.city || places[0]?.subregion || places[0]?.region
            const cityInfo = await getCityInfo(info.coords, currentCityName)
            console.log(cityInfo)
            this.setState({ cityInfo, loadingCityInfo: false })
        } catch (error) {
            this.setState({
                loadingCityInfo: false,
                cityInfoError: error.message || JSON.stringify(error),
            })
            Alert.alert('报错', JSON.stringify(error))
        }
    }

    render() {
        const { cityInfo, loadingCityInfo, cityInfoError } = this.state
        const today = cityInfo?.data?.forecasts?.[0]

        return (
            <ScrollView>
                <View style={styles.container}>
                    <TouchableOpacity onPress={() => alert('require permission for camera')}>
                        <View style={styles.itemBase}>
                            <Ionicons name="scan-outline" size={40} color="#fff" />
                            <Text style={styles.fontBase}>scan</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <View style={styles.itemBase}>
                            <Ionicons name="qr-code-outline" size={40} color="#fff" />
                            <Text style={styles.fontBase}>QR-code</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <View style={styles.itemBase}>
                            <Ionicons name="trail-sign-outline" size={40} color="#fff" />
                            <Text style={styles.fontBase}>Trail-sign</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <View style={styles.itemBase}>
                            <Ionicons name="collection-outline" size={40} color="#fff" />
                            <Text style={styles.fontBase}>Collection</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <Swiper
                    style={styles.wrapper}
                    showsButtons={true}
                    autoplay={true}
                >
                    <Image style={styles.slideImage}
                        source={require('../../images/1.jpg')} />
                    <Image style={styles.slideImage}
                        source={require('../../images/2.jpg')} />
                    <Image style={styles.slideImage}
                        source={require('../../images/3.jpg')} />
                </Swiper>
                <LinearGradient
                    colors={['#00b38a', '#7ec8ff', '#38d5b2']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.apiCard}
                >
                    <Text style={[styles.apiTitle, styles.apiTextLight]}>Weather forecast</Text>
                    {loadingCityInfo ? (
                        <Text style={[styles.apiText, styles.apiTextLight]}>Loading...</Text>
                    ) : null}
                    {cityInfo ? (
                        <>
                            <Text style={[styles.apiText, styles.apiTextLight]}>City: {cityInfo.cityName}</Text>
                            {today ? (
                                <>
                                    <Text style={[styles.apiText, styles.apiTextLight]}>Weather: {today.sky_condition}</Text>
                                    <Text style={[styles.apiText, styles.apiTextLight]}>Max Temp: {formatNumber(today.max_temp_c)}°C</Text>
                                    <Text style={[styles.apiText, styles.apiTextLight]}>Min Temp: {formatNumber(today.min_temp_c)}°C</Text>
                                    <Text style={[styles.apiText, styles.apiTextLight]}>Wind: {formatNumber(today.max_wind_kph)} km/h</Text>
                                    <Text style={[styles.apiText, styles.apiTextLight]}>Rain: {formatNumber(today.total_precip_mm)} mm</Text>
                                </>
                            ) : (
                                <Text style={[styles.apiText, styles.apiTextLight]}>No forecast data</Text>
                            )}
                        </>
                    ) : null}
                    {cityInfoError ? (
                        <Text style={styles.apiError}>{cityInfoError}</Text>
                    ) : null}
                </LinearGradient>
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
    },
    itemBase: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#00b38a',
        height: 90,
        width: Dimensions.get('window').width / 4,
    },
    fontBase: {
        color: '#fff',
        fontSize: 14,
    },
    wrapper: {
        height: 200,
    },
    slideImage: {
        height: 200,
        width: Dimensions.get('window').width,
    },
    apiCard: {
        padding: 15,
    },
    apiTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    apiText: {
        color: '#333',
        fontSize: 14,
        marginBottom: 6,
    },
    apiTextLight: {
        color: '#fff',
    },
    apiError: {
        color: 'red',
        fontSize: 14,
    },
    indexContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        marginLeft: 10,
    },
    indexItem: {
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 20,
        backgroundColor: '#deb',
        width: Dimensions.get('window').width / 3 - 10,
        height: 80,
        marginTop: 10,
        marginRight: 10,
    },
    indexName: {
        color: '#222',
        fontSize: 14,
    },
    indexBase: {
        color: '#00b38a',
        fontSize: 15,
    },
})

function formatNumber(value) {
    if (typeof value !== 'number') {
        return '--'
    }

    return value.toFixed(1)
}
