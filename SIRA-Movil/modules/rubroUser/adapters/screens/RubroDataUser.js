import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import Divider from "react-native-divider";
import { Icon, SpeedDial, Avatar } from "@rneui/base";
import { useNavigation } from "@react-navigation/native";
import axios from "../../../../kernel/components/http-client-gateway";

export default function RubroDataUser(props) {
  const { id, fullname, email, status, role, setReload } = props.route.params;
  const [aspect, setAspect] = useState("");
  const navigation = useNavigation();
  const [open, setOpen] = React.useState(false);

  const getAspectName = async (id) => {
    try {
      const response = await axios.doGet(`/aspect/user/${id}`);
      setAspect(response.data.data.name);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (role.name === "Encargado") {
      getAspectName(id);
    }
  }, []);

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
            title={fullname.charAt(0) + fullname.charAt(fullname.indexOf(" ") + 1)}
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
            <Text style={styles.text}>Nombre: {fullname}</Text>
          </View>
          <View style={styles.row}>
            <Icon
              name="email-outline"
              type="material-community"
              color="gray"
              size={25}
            />
            <Text style={styles.text}>
              Correo: {email}
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
              Rol: {role.name}
            </Text>
          </View>
          {role.name === "Encargado" ? (
            <View style={styles.row}>
              <Icon
                name="leaf"
                type="material-community"
                color="gray"
                size={25}
              />
              <Text style={styles.text}>
                Aspecto: {aspect ? aspect : "Sin aspecto asignado"}
              </Text>
            </View>
          ) : (
            <></>
          )}
        </View>
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
          icon={{ name: "account-edit", color: "#fff", type: "material-community" }}
          title="Editar información"
          buttonStyle={{ backgroundColor: "#002e60" }}
          onPress={() => navigation.navigate("rubroUpdateUserStack", { id: id, fullname: fullname, email: email, status: status, role: role, setReload: setReload })}
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
    marginVertical: 20,
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
