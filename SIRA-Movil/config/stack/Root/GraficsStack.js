import { StyleSheet} from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { Image } from "react-native";
import GraficRubros from '../../../modules/graficAspect/adapters/screen/GraficRubros';

const Stack = createNativeStackNavigator();

export default function GraficStack() {
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
                name='mainGraficStack'
                options={{
                    title: 'Estadísticas',
                    headerRight: () => <Image source={require('../../../assets/hojita.png')}
                        style={{ width: 30, height: 30 }} />,
                }}
                component={GraficRubros}
            />
        </Stack.Navigator>
    )
}