import React, { useState, useEffect } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import Divider from "react-native-divider";
import { Button, Icon, SpeedDial, Avatar } from "@rneui/base";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import axios from "../../../../kernel/components/http-client-gateway";

export default function RubroProfile(props) {
  const { setReload } = props.route.params;
  const navigation = useNavigation();
  const [open, setOpen] = React.useState(false);
  const [session, setSession] = useState(null);
  const [aspect, setAspect] = useState("");

  const getAspectName = async () => {
    try {
      const session = await AsyncStorage.getItem("@session");
      if (JSON.parse(session).user.role.name == "Encargado") {
        const response = await axios.doGet(`/aspect/user/${JSON.parse(session).user.id}`)
        setAspect(response.data.data.name)
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    (async () => {
      const session = await AsyncStorage.getItem("@session");
      setSession(JSON.parse(session));
    })();
    getAspectName()
  }, []);

  const logOut = async () => {
    try {
      await AsyncStorage.removeItem("@session")
      setReload(true)
    } catch (error) {
      setReload(true)
    }
  }

  const initialsAvatar = () => {
    if (session != null) {
      let fullname = (session.user.fullname).toUpperCase();
      let initials = fullname.charAt(0) + fullname.charAt(fullname.indexOf(" ") + 1);
      return initials;
    }
  }

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Divider borderColor="gray" color="gray" orientation="center">
          <Text style={styles.title}>Información del usuario</Text>
        </Divider>
        <View style={styles.infoContainer}>
          <Avatar
            size={120}
            rounded
            title={session != null ? initialsAvatar() : ""}
            containerStyle={styles.avatar}
          />
        </View>
        <View style={styles.textContainer}>
          <View style={styles.row}>
            <Icon
              name="account-outline"
              type="material-community"
              color="gray"
              size={25}
            />
            <Text style={styles.text}>
              Nombre: {session != null ? session.user.fullname : ""}
            </Text>
          </View>
          <View style={styles.row}>
            <Icon
              name="email-outline"
              type="material-community"
              color="gray"
              size={25}
            />
            <Text style={styles.text}>
              Correo: {session != null ? session.user.email : ""}
            </Text>
          </View>
          <View style={styles.row}>
            <Icon
              name="hammer-wrench"
              type="material-community"
              color="gray"
              size={25}
            />
            <Text style={styles.text}>
              Rol: {session != null ? session.user.role.name : ""}
            </Text>
          </View>
          {session != null && session.user.role.name == "Encargado" ? (
            <View style={styles.row}>
              <Icon
                name="leaf"
                type="material-community"
                color="gray"
                size={25}
              />
              <Text style={styles.text}>
                Aspecto: {aspect != "" ? aspect : "Sin aspecto asignado"}
              </Text>
            </View>
          ) : (
            <></>
          )}
        </View>
        <Button
          title="Cerrar sesión"
          icon={{
            name: "logout",
            type: "material-community",
            size: 22,
            color: "white",
          }}
          buttonStyle={styles.btnLogOut}
          containerStyle={styles.btnContainer}
          onPress={() => logOut()}
        />
      </ScrollView>
      <SpeedDial
        isOpen={open}
        icon={{ name: "edit", color: "#fff" }}
        openIcon={{ name: "close", color: "#fff" }}
        onOpen={() => setOpen(!open)}
        onClose={() => setOpen(!open)}
        buttonStyle={{ backgroundColor: "#002e60" }}
      >
        <SpeedDial.Action
          icon={{ name: "lock-outline", color: "#fff", type: "material-community" }}
          title="Editar contraseña"
          buttonStyle={{ backgroundColor: "#002e60" }}
          onPress={() => navigation.navigate("changePasswordStack")}
        />
      </SpeedDial>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    minHeight: "100%",
  },
  text: {
    fontSize: 16,
    color: "gray",
    marginLeft: 10,
    fontWeight: "bold",
  },
  btnLogOut: {
    backgroundColor: '#002e60',
    borderRadius: 5,
  },
  btnContainer: {
    alignSelf: 'center',
    marginTop: 20,
    width: '50%',
  },
  infoContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  textContainer: {
    alignItems: "flex-start",
    justifyContent: "flex-start",
    marginLeft: 20,
  },
  avatar: {
    backgroundColor: "#002e60",
    marginVertical: 40,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
});
