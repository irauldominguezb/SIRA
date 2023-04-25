import AdminRubroNavigation from "./config/navigation/AdminRubroNavigation";
import UserRubroNavigation from "./config/navigation/UserRubroNavigation";
import { LogBox } from "react-native";
import RootRubroNavigation from "./config/navigation/RootRubroNavigation";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState, useEffect } from "react";
LogBox.ignoreAllLogs(true);
import { initializeApp } from "firebase/app";
import { app } from './config/utils/firebase'

export default function App() {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  //Hacer que el componente se recargue cuando se cambia el estado de reload
  const [reload, setReload] = useState(false);
  useEffect(() => {
    (async () => {
      console.log("Use effect app");
      try {
        const user = JSON.parse(await AsyncStorage.getItem("@session"));
        setSession(user);
        if (session != null) {
          setUser(true);
        } else {
          setUser(false);
        }
      } catch (error) {
        console.log("error app",error)
      }
    })()
    setReload(false);
  }, [reload]);
  
  if (session != null) {
    if (session.user.role.name === "Encargado") {
      return <AdminRubroNavigation setReload={setReload} user={session}/>;
    } else if (session.user.role.name === "Administrador") {
      return <RootRubroNavigation setReload={setReload} user={session}/>;
    } else {
      return <UserRubroNavigation setReload={setReload} />;
    }
  } else {
    return <UserRubroNavigation setReload={setReload} />;
  }
}