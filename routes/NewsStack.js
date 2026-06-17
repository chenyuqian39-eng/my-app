import React, { Component } from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import NewsScreen from '../screens/News'

const Stack = createNativeStackNavigator()
export default class NewsStack extends Component {
    render() {
        return (
            <Stack.Navigator>
                <Stack.Screen
                    name="News"
                    component={NewsScreen}
                    options={{
                        title: "首页",
                        headerStyle: {
                            backgroundColor: '#fff'
                        }

                    }}
                />

            </Stack.Navigator>
        )
    }
}
