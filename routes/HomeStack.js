import React, { Component } from 'react'
import { Text, TouchableOpacity } from 'react-native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import HomeScreen from '../screens/Home'
import TakePictureScreen from '../screens/Home/TakePicture'

const Stack = createNativeStackNavigator()
export default class HomeStack extends Component {
    render() {
        return (
            <Stack.Navigator
                initialRouteName="Home"
                screenOptions={{
                    headerShadowVisible: false,
                }}
            // headerMode={'none'}
            >
                <Stack.Screen name="TakePicture" component={TakePictureScreen} />
                <Stack.Screen
                    name="Home"
                    component={HomeScreen}
                    options={({ navigation }) => ({
                        title: "Homepage",
                        headerStyle: {
                            backgroundColor: '#00b38a',
                            elevation: 0,//delete shadow in Android
                            shadowOpacity: 0//IOS
                        },
                        headerShadowVisible: false,
                         headerTintColor: '#fff',
                        headerRight: () => (
                            <TouchableOpacity onPress={() => navigation.navigate('TakePicture')}>
                                <Text style={{ fontSize: 18, color: 'white', marginRight: 1 }}>Photo</Text>
                            </TouchableOpacity>
                        )
                    })}
                />

            </Stack.Navigator>
        )
    }
}
