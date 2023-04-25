import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { NavigationContainer } from '@react-navigation/native';
import { Icon } from "@rneui/base";
import RubroHomeAdminStack from '../stack/Root/RubroHomeAdminStack';
import RubroProfileStack from '../stack/Rubro/RubroProfileStack';
import RubroAspectStack from '../stack/Root/RubroAspectStack';
import RubroUserStack from '../stack/Root/RubroUserStack';
import GraficStack from '../stack/Root/GraficsStack';


const Tab = createBottomTabNavigator();


export default function RootRubroNavigation(props) {
    const { setReload } = props;
    return (
        <NavigationContainer>
            <Tab.Navigator
                screenOptions={({ route }) => ({
                    tabBarIcon: ({ color }) => screenOptions(route, color),
                    tabBarActiveTintColor: "white", 
                    tabBarInactiveTintColor: "#002e60", 
                    headerShown: false,
                    tabBarStyle: {
                        backgroundColor: "#0d8e66", 
                    }
                })}
            >
                <Tab.Screen
                    name="rubroHome"
                    options={{ title: "Reportes" }}
                    component={RubroHomeAdminStack}
                />
                <Tab.Screen
                    name="rubroAspect"
                    options={{ title: "Aspectos" }}
                    component={RubroAspectStack}
                />
                <Tab.Screen
                    name="rubroUserStack"
                    options={{ title: "Encargados" }}
                    component={RubroUserStack}
                />


                <Tab.Screen
                    name="grafic"
                    options={{ title: "Estadísticas" }}
                    component={GraficStack}
                />

                <Tab.Screen
                    name="rubroProfile"
                    options={{ title: "Perfil" }}
                    component={RubroProfileStack}
                    initialParams={{ "setReload": setReload }}
                />
            </Tab.Navigator>
        </NavigationContainer>
    )
}

const screenOptions = (route, color) => {
    let iconName;
    switch (route.name) {
        case "rubroHome":
            iconName = "note";
            break;
        case "notifications":
            iconName = "bell-badge";
            break;
        case "rubroProfile":
            iconName = "account";
            break;
        case "rubroUserStack":
            iconName = "account-group";
            break;
        case "rubroAspect":
            iconName = "leaf";
            break;
        case "grafic":
            iconName = "chart-bar";
            break;
    }
    return (
        <Icon type="material-community" name={iconName} size={22} color={color} />
    );
};