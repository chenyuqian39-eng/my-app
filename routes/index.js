import React, { Component } from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Ionicons from '@expo/vector-icons/Ionicons'
import HomeScreen from './HomeStack'
import NewsScreen from './NewsStack'
import UserScreen from './UserStack'

const Tab = createBottomTabNavigator()
export default class index extends Component {
    render() {
        return (
            <Tab.Navigator
                //initialROuteName="News"
                screenOptions={({ route }) => ({
                    tabBarIcon: ({ focused, color, size }) => {
                        let iconName

                        if (route.name === 'Home') {
                            iconName = focused ? 'add-circle' : 'add-circle-outline'
                        } else if (route.name === 'News') {
                            iconName = focused ? 'person' : 'person-outline'
                        } else if (route.name === 'User') {
                            iconName = focused ? 'settings' : 'settings-outline'
                        }

                        return <Ionicons name={iconName} size={size} color={color} />
                    },
                    headerShown: false,
                    tabBarActiveTintColor: 'tomato',
                    tabBarInactiveTintColor: 'gray'
                })}
            >
                <Tab.Screen name="Home" component={HomeScreen} />
                <Tab.Screen name="News" component={NewsScreen} />
                <Tab.Screen name="User" component={UserScreen} />

            </Tab.Navigator>
        )
    }
}
