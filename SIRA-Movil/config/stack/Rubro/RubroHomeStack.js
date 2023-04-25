import React from "react";
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import RubroHome from '../../../modules/rubroHome/adapters/screens/RubroHome'
import RubroReport from '../../../modules/rubroHome/adapters/screens/RubroReport'
import { Image } from "react-native";

const Stack = createNativeStackNavigator();

export default function RubroHomeStack(){
    return(
        <Stack.Navigator 
            screenOptions={{
                headerMode: 'screen',
                headerTintColor: '#002e60',
                headerTitleStyle: {color: '#002e60'},
                headerStyle: {backgroundColor: '#fff', },
            }}
        >
            <Stack.Screen 
                name='rubroHomeStack'
                options={{title: 'Reportes',
                headerRight: () => <Image source={require('../../../assets/hojita.png')}
                style={{width: 30, height: 30}} />, }}
                component={RubroHome}
            />
            <Stack.Screen 
                name='rubroReportStack'
                options={{title: 'Reporte',
                headerRight: () => <Image source={require('../../../assets/hojita.png')}
                style={{width: 30, height: 30}} /> }}
                component={RubroReport}
            />
        </Stack.Navigator>
    )
}