import React, { Component } from 'react'
import { Text, StyleSheet, View, SafeAreaView, TouchableOpacity, Image } from 'react-native'
import Ionicons from '@expo/vector-icons/Ionicons'

export default class index extends Component {
    render() {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.avatar}>
                    <Image
                        source={{ uri: 'http://reactnative.dev/img/tiny_logo.png' }}
                        style={{ width: 80, height: 80, marginVertical: 10, borderRadius: 40 }}

                    />
                </View>

                <TouchableOpacity
                    onPress={() => this.props.navigation.navigate('About')}
                >
                    <View style={styles.listItem}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Ionicons name={'information-circle-outline'} size={20} color='#2d3' />
                            <Text style={{ marginLeft: 10, fontSize: 10 }}>About</Text>
                        </View>
                        <Ionicons name={'chevron-forward-outline'} size={20} color='#bbb' />
                    </View>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => alert('aaa')}
                >
                    <View style={styles.listItem}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Ionicons name={'information-circle-outline'} size={20} color='#22d' />
                            <Text style={{ marginLeft: 10, fontSize: 10 }}>Setting</Text>
                        </View>
                        <Ionicons name={'chevron-forward-outline'} size={20} color='#bbb' />
                    </View>
                </TouchableOpacity>
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'flex-start'
    },
    avatar: {
        flexDirection: 'row',
        justifyContent: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#fff'
    },
    listItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        height: 50,
        paddingHorizontal: 20
    }


})
