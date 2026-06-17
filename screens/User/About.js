import React, { Component } from 'react'
import { StyleSheet, Text, View } from 'react-native'

export default class About extends Component {
    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>About</Text>
                <Text style={styles.text}>This is the about page.</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    text: {
        color: '#555',
        fontSize: 16,
    },
})
