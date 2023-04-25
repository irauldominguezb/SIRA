import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import RubroUserGuest from '../../../modules/rubroProfile/adapters/screens/RubroUserGuest';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Image } from "react-native";
import RubroForm from '../../../modules/rubroForm/adapters/screens/RubroForm';

const Stack = createNativeStackNavigator();

const RubroFormIncidenciaStack = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerMode: 'screen',
                headerTintColor: '#002e60',
                headerTitleStyle: { color: '#002e60' },
                headerStyle: { backgroundColor: '#fff', },
            }}
        >

            <Stack.Screen
                name='rubroUserGuestStack'
                options={{
                    title: 'Bienvenido a SIRA',
                    headerRight: () => <Image source={require('../../../assets/hojita.png')}
                        style={{ width: 30, height: 30 }} />,
                }}
                component={RubroUserGuest}
            />
            <Stack.Screen
                name='rubroReportStack'
                options={{
                    title: 'Reportar incidencia',
                    headerRight: () => <Image source={require('../../../assets/hojita.png')}
                        style={{ width: 30, height: 30 }} />,
                }}
                component={RubroForm}
            />

        </Stack.Navigator>
    )
}

export default RubroFormIncidenciaStack
