import { StyleSheet } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { Image } from "react-native";
import RubroAspect from '../../../modules/rubroAspect/adapters/screens/RubroAspectList';
import RubroAspectOne from '../../../modules/rubroAspect/adapters/screens/RubroAspectOne';
import RubroUpdateEncargado from '../../../modules/rubroAspect/adapters/screens/RubroUpdateEncargado';
import RubroUpdateName from '../../../modules/rubroAspect/adapters/screens/RubroUpdateName';
import RubroDataAspect from '../../../modules/rubroAspect/adapters/screens/RubroDataAspect';

const Stack = createNativeStackNavigator();

export default function RubroAspectStack() {
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
                name='rubroAspectListStack'
                options={{
                    title: 'Aspectos ambientales',
                    headerRight: () => <Image source={require('../../../assets/hojita.png')}
                        style={{ width: 30, height: 30 }} />,
                }}
                component={RubroAspect}
            />

            <Stack.Screen
                name='rubroAspectOneStack'
                options={{
                    title: 'Registrar aspecto',
                    headerRight: () => <Image source={require('../../../assets/hojita.png')}
                        style={{ width: 30, height: 30 }} />,
                }}
                component={RubroAspectOne}
            />
            <Stack.Screen
                name='rubroAspectDataStack'
                options={{
                    title: 'Aspecto',
                    headerRight: () => <Image source={require('../../../assets/hojita.png')}
                        style={{ width: 30, height: 30 }} />,
                }}
                component={RubroDataAspect}
            />
            <Stack.Screen
                name='rubroAspectUpdateUserStack'
                options={{
                    title: 'Editar encargado',
                    headerRight: () => <Image source={require('../../../assets/hojita.png')}
                        style={{ width: 30, height: 30 }} />,
                }}
                component={RubroUpdateEncargado}
            />
            <Stack.Screen
                name='rubroAspectUpdateNameStack'
                options={{
                    title: 'Editar aspecto',
                    headerRight: () => <Image source={require('../../../assets/hojita.png')}
                        style={{ width: 30, height: 30 }} />,
                }}
                component={RubroUpdateName}
            />
        </Stack.Navigator>
    )
}