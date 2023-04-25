import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import RubroUserGuest from '../../../modules/rubroProfile/adapters/screens/RubroUserGuest';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Image } from "react-native";
import RubroLogin from '../../../modules/rubroAuth/adapters/screens/RubroLogin';

const Stack = createNativeStackNavigator();

const RubroLoginStack = () => {
    return (
        <Stack.Navigator
            initialRouteName='controllerSessionStack'
            screenOptions={{
                headerMode: 'screen',
                headerTintColor: '#002e60',
                headerTitleStyle: { color: '#002e60' },
                headerStyle: { backgroundColor: '#fff', },
            }}
        >
            <Stack.Screen
                name='rubroLoginStack'
                options={{
                   headerShown: false,
                }}
                component={RubroLogin}
            />
        </Stack.Navigator>
    )
}

export default RubroLoginStack