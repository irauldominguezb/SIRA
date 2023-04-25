import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { Image } from "react-native";
import RubroUsersList from '../../../modules/rubroUser/adapters/screens/RubroUsersList';
import RubroUserOne from '../../../modules/rubroUser/adapters/screens/RubroUserOne';
import RubroDataUser from '../../../modules/rubroUser/adapters/screens/RubroDataUser'
import RubroUpdateUser from '../../../modules/rubroUser/adapters/screens/RubroUpdateUser'

const Stack = createNativeStackNavigator();

export default function RubroUserStack() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerMode: 'screen',
                headerTintColor: '#002e60',
                headerTitleStyle: { color: '#002e60' },
                headerStyle: { backgroundColor: '#fff', },
            }}
            initialRouteName='rubroUserListStack'
        >
            <Stack.Screen
                name='rubroUserListStack'
                options={{
                    title: 'Encargados de aspecto',
                    headerRight: () => <Image source={require('../../../assets/hojita.png')}
                        style={{ width: 30, height: 30 }} />,
                }}
                component={RubroUsersList}
            />

            <Stack.Screen
                name='rubroUserOneStack'
                options={{
                    title: 'Registrar encargado',
                    headerRight: () => <Image source={require('../../../assets/hojita.png')}
                        style={{ width: 30, height: 30 }} />,
                }}
                component={RubroUserOne}
            />

            <Stack.Screen
                name='rubroDataUserStack'
                options={{
                    title: 'Usuario',
                    headerRight: () => <Image source={require('../../../assets/hojita.png')}
                        style={{ width: 30, height: 30 }} />,
                }}
                component={RubroDataUser}
            />
            <Stack.Screen
                name='rubroUpdateUserStack'
                options={{
                    title: 'Editar información',
                    headerRight: () => <Image source={require('../../../assets/hojita.png')}
                        style={{ width: 30, height: 30 }} />,
                }}
                component={RubroUpdateUser}
            />


        </Stack.Navigator>
    )
}