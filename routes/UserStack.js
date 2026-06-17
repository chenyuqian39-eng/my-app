import React, { Component } from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import UserScreen from '../screens/User'
import AboutScreen from '../screens/User/About'

//control shift L 统一改
const Stack = createNativeStackNavigator()
export default class UserStack extends Component {
    render() {
        return (
            <Stack.Navigator>
                <Stack.Screen
                    name="User"
                    component={UserScreen}
                    options={{
                        title: "Profile",
                        headerStyle: {
                            backgroundColor: 'white'
                        }

                    }}
                />
                <Stack.Screen
                    name="About"
                    component={AboutScreen}
                    options={{
                        title: "About",
                        headerStyle: {
                            backgroundColor: 'white'
                        }

                    }}
                />

            </Stack.Navigator>
        )
    }
}
