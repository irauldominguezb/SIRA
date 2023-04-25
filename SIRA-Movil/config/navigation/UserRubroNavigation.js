import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Icon } from '@rneui/base'
import { Image } from "react-native";
import RubroFormIncidenciaStack from '../stack/Rubro/RubroFormIncidenciaStack'
import RubroLogin from '../../modules/rubroAuth/adapters/screens/RubroLogin'

const Tab = createBottomTabNavigator()

export default function UserRubroNavigation(props) {
    const {setReload} = props;
    return (
        <NavigationContainer>
            <Tab.Navigator
                screenOptions={({ route }) => ({
                    tabBarIcon: ({ color }) => screenOptions(route, color),
                    tabBarActiveTintColor: "white", 
                    tabBarInactiveTintColor: "#002e60", 
                    tabBarStyle: {
                        backgroundColor: "#0d8e66", 
                    },
                    headerTintColor: '#002e60',
                    headerTitleStyle: { color: '#002e60' },
                    headerStyle: { backgroundColor: '#fff', },
                })}
            >
                <Tab.Screen
                    name='rubroReport'
                    options={{headerShown: false, title: 'Reportar incidencia',}}
                    component={RubroFormIncidenciaStack}
                />

                <Tab.Screen
                    name='rubroLoginStack'
                    options={{title: 'Inicio de sesión',
                    headerRight: () => <Image source={require('../../assets/hojita.png')}
                    style={{width: 30, height: 30, marginRight: 18 }} />, }}
                    component={RubroLogin}
                    initialParams={{ "setReload": setReload }}

                />
            </Tab.Navigator>
        </NavigationContainer >
    )
}

const screenOptions = (route, color) => {
    let iconName;
    switch (route.name) {
        case "rubroLoginStack":
            iconName = "account";
            break;
        case "rubroReport":
            iconName = "note-plus";
            break;
    }
    return (
        <Icon type="material-community" name={iconName} size={22} color={color} />
    );
};