import { Image } from "react-native";
import React from "react";
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import RubroProfile from '../../../modules/rubroProfile/adapters/screens/RubroProfile'
const Stack = createNativeStackNavigator();
import CambiodeContraseña from "../../../modules/rubroProfile/adapters/screens/CambiodeContraseña";
export default function RubroProfileStack(props){
    const {setReload}=props.route.params;
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
                name='profileStack'
                options={{title: 'Perfil',
                headerRight: () => <Image source={require('../../../assets/hojita.png')}
                style={{width: 30, height: 30}} />, }}
                component={RubroProfile}
                initialParams={{ "setReload": setReload }}
            />
            <Stack.Screen 
                name='changePasswordStack'
                options={{title: 'Perfil',
                headerRight: () => <Image source={require('../../../assets/hojita.png')}
                style={{width: 30, height: 30}} />, }}
                component={CambiodeContraseña}
                initialParams={{ "setReload": setReload }}
            />
        </Stack.Navigator>
    )
}