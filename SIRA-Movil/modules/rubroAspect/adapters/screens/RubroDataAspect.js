import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import Divider from "react-native-divider";
import { Icon, SpeedDial, Avatar } from "@rneui/base";
import { useNavigation } from "@react-navigation/native";
import Loading from "../../../../kernel/components/Loading";
import Error from "../../../../kernel/components/Error";
import Confirmation from "../../../../kernel/components/Confirmation";
import Question from "../../../../kernel/components/Question";
import axios from "../../../../kernel/components/http-client-gateway";

export default function RubroDataAspect(props) {
  const { idAspect, name, status, userEmail, userFullname, setReload } = props.route.params
  const navigation = useNavigation();
  const [open, setOpen] = React.useState(false);
  const [show, setShow] = useState(false);
  const [showError, setShowError] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showQuestion, setShowQuestion] = useState(false);

  const payload = {
    status: !status,
  };

  const changeStatus = () => {
    setShowQuestion(false)
    setShow(true)
    axios
      .doPatch(`/aspect/${idAspect}`, payload)
      .then(({ data: { data } }) => {
        setShow(false)
        setShowSuccess(true)
        setTimeout(() => {
          setShowSuccess(false)
          setReload(true)
          navigation.navigate("rubroAspectListStack")
        }, 1000);
      })
      .catch((error) => {
        setShow(false)
        setShowError(true)
        setTimeout(() => {
          setShowError(false)
        }, 3000);
        console.log(error);
      });
  }

  return (
    <View style={styles.container} >
      <ScrollView showsVerticalScrollIndicator={false}>
        <Divider borderColor="gray" color="gray" orientation="center">
          <Text style={styles.title}>Información del aspecto</Text>
        </Divider>
        <View style={styles.textContainer}>
          <View style={styles.row}>
            <Icon
              name="leaf"
              type="material-community"
              color="#002e60"
              size={110}
            />
            <View style={styles.dataContainer} >
              <Text style={styles.textData}>{name}</Text>
              <Text style={styles.textDataSub}>Encargado: {userFullname ? userFullname : "Sin encargado"}</Text>
              <Text style={styles.textDataSubStatus}>Estado: {status ? "Habilitado" : "Deshabilitado"}</Text>
            </View>
          </View>
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
          icon={{ name: "pencil-box", color: "#fff", type: "material-community" }}
          title="Editar información"
          buttonStyle={{ backgroundColor: "#002e60" }}
          onPress={() => navigation.navigate("rubroAspectUpdateNameStack", { idAspect: idAspect, name: name, status: status, userEmail: userEmail, setReload: setReload })}
        />
        <SpeedDial.Action
          icon={{ name: "account-edit", color: "#fff", type: "material-community" }}
          title="Editar encargado"
          buttonStyle={{ backgroundColor: "#002e60" }}
          onPress={() => navigation.navigate("rubroAspectUpdateUserStack", { idAspect: idAspect, name: name, status: status, userEmail: userEmail, userFullname: userFullname, setReload: setReload })}
        />
        <SpeedDial.Action
          icon={{ name: status ? "archive-arrow-down-outline" : "archive-arrow-up-outline", color: "#fff", type: "material-community" }}
          title={status ? "Deshabilitar aspecto" : "Habilitar aspecto"}
          buttonStyle={{ backgroundColor: "#002e60" }}
          onPress={() => setShowQuestion(true)}
        />
      </SpeedDial>
      <Loading show={show} text={"Guardando cambios"} />
      <Confirmation
        show={showSuccess}
        text={"Estado modificado correctamente"}
      />
      <Error show={showError} text={"Ha ocurido un error"} />
      <Question
        show={showQuestion}
        text={status ? "¿Desea deshabilitar el aspecto?" : "¿Desea habilitar el aspecto?"}
        onConfirm={() => changeStatus()}
        onCancel={() => setShowQuestion(false)}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    minHeight: "100%",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
  text: {
    fontSize: 16,
    color: "gray",
    marginLeft: 10,
    fontWeight: "bold",
  },
  textData: {
    fontSize: 18,
    color: "gray",
    marginLeft: 10,
    fontWeight: "bold",
  },
  textDataSub: {
    fontSize: 16,
    color: "gray",
    marginLeft: 10,
    marginVertical: 5,
  },
  textDataSubStatus: {
    fontSize: 14,
    color: "gray",
    marginLeft: 10,
  },
  dataContainer: {
    flex: 1,
    flexDirection: "column",
  },
  textContainer: {
    alignItems: "flex-start",
    justifyContent: "flex-start",
    marginLeft: 20,
    marginVertical: 20,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
})