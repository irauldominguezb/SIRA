import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Icon } from "@rneui/base";
import RubroHomeStack from '../stack/Rubro/RubroHomeStack'
import RubroProfileStack from '../stack/Rubro/RubroProfileStack'

const RubroTab = createBottomTabNavigator();

export default function RubroNavigation(props) {
  const {setReload} = props;
  return (
    <NavigationContainer>
        <RubroTab.Navigator
            initialRouteName="rubroHome"
            screenOptions={({route})=>({
                tabBarIcon: ({color})=>screenOptions(route, color),
                tabBarActiveTintColor: "white",
                tabBarInactiveTintColor: "#002e60",
                headerShown: false,
                tabBarStyle:{
                    backgroundColor: "#0d8e66",
                }
            })}
        >

            <RubroTab.Screen
                name="rubroHome"
                options={{title: "Reportes"}}
                component={RubroHomeStack}
            />
            <RubroTab.Screen
                name="rubroProfile"
                options={{title: "Perfil"}}
                component={RubroProfileStack}
                initialParams={{ "setReload": setReload }}

            />
        </RubroTab.Navigator>
    </NavigationContainer>
  )
}

const screenOptions = (route, color) => {
  let iconName;
  switch (route.name) {
    case "rubroHome":
      iconName = "note";
      break;
    case "rubroProfile":
        iconName = "account";
        break;
  }
  return (
    <Icon type="material-community" name={iconName} size={22} color={color} />
  );
};
