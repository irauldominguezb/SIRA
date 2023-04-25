import React from "react";
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { Image } from "react-native";
import RubroHomeAdmin from "../../../modules/rubroHome/adapters/screens/rubroHomeAdmin";
import RubroReportAdmin from "../../../modules/rubroHome/adapters/screens/RubroReportAdmin";

const Stack = createNativeStackNavigator();

export default function RubroHomeAdminStack(){
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
                name='rubroHomeAdminStack'
                options={{title: 'Reportes',
                headerRight: () => <Image source={require('../../../assets/hojita.png')}
                style={{width: 30, height: 30}} />, }}
                component={RubroHomeAdmin}
            />
            <Stack.Screen 
                name='rubroReportAdminStack'
                options={{title: 'Reporte',
                headerRight: () => <Image source={require('../../../assets/hojita.png')}
                style={{width: 30, height: 30}} /> }}
                component={RubroReportAdmin}
            />
        </Stack.Navigator>
    )
}