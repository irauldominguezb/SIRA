import { StyleSheet, View, Text } from "react-native";
import React, { useState, useEffect } from "react";
import { Button, Icon } from "@rneui/base";
import axios from "../../../../kernel/components/http-client-gateway";
import Loading from "../../../../kernel/components/Loading";
import Error from "../../../../kernel/components/Error";
import Confirmation from "../../../../kernel/components/Confirmation";
import Question from "../../../../kernel/components/Question";
import { isEmpty } from "lodash";
import { useNavigation } from "@react-navigation/native";
import Filter from "../../../../kernel/components/Filter";

export default function RubroUpdateEncargado(props) {
  const { idAspect, name, status, userEmail, userFullname, setReload } =
    props.route.params;
  const [show, setShow] = useState(false);
  const [showError, setShowError] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showQuestion, setShowQuestion] = useState(false);
  const [filter, setFilter] = useState("Encargado");
  const [email, setEmail] = useState("")
  const [users, setUsers] = useState([]);
  const navigation = useNavigation();

  const itemSelector = (item) => {
    setEmail(item.split(" - ")[1]);
  };
  useEffect(() => {
    axios
      .doGet("/user/role/Encargado/status/true")
      .then(({ data: { data } }) => {
        const user = data.map((user) => {
          return {
            user: user.fullname,
            emailUser: user.email,
          };
        });
        setUsers(user);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const arrayUsers = users.map((user) => {
    return user.user + " - " + user.emailUser;
  });

  const payload = {
    name: name,
    status: status,
    user: {
      email: email,
    },
  };

  const handleSubmit = () => {
    if (!(isEmpty(email))) {
      setShowQuestion(false)
      setShow(true)
      axios
        .doPut(`/aspect/${idAspect}`, payload)
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
          }, 1000);
          console.log("Error al actualizar Aspecto", error)
        })
    } else {
      setShowQuestion(false)
      setFilter(<Icon type="material-community" name="alert-circle-outline" color="#f00" />);
    }
  }
  return (
    <View style={styles.container}>
      {userFullname && userEmail ? (
        <View style={styles.dataContainer} >
          <Text style={styles.textDataSub}>Encargado: {userFullname ? userFullname : "Sin encargado"}</Text>
          <Text style={styles.textDataSub}>Email: {userEmail}</Text>
        </View>
      ) : (
        <View style={styles.dataContainer} >
          <Text style={styles.textNull}>Encargado: Sin encargado asignado</Text>
        </View>
      )}
      {arrayUsers.length > 0 ? (

        <View style={styles.dataGeneral}>
          <Filter
            title={filter}
            text={"Encargados"}
            contenido={arrayUsers}
            itemSelector={itemSelector}
            search={true}
          />
          <Button
            title=" Guardar"
            icon={{
              name: "content-save-check",
              type: "material-community",
              size: 22,
              color: "#FFF",
            }}
            buttonStyle={styles.btnSave}
            containerStyle={styles.btnContainer}
            onPress={() => setShowQuestion(true)}
          />

        </View>
      ) : (
        <View style={styles.row}>
          <Icon type="material-community" name="alert-circle-outline" color="#f00" />
          <Text style={styles.alert}>No hay usuarios disponibles por el momento</Text>
        </View>
      )}

      <Loading show={show} text={"Guardando cambios"} />
      <Confirmation
        show={showSuccess}
        text={"Encargado modificado correctamente"}
      />
      <Error show={showError} text={"Ha ocurido un error"} />
      <Question
        show={showQuestion}
        text={"¿Seguro desea actualizar?"}
        onConfirm={() => handleSubmit()}
        onCancel={() => setShowQuestion(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: "100%",
    backgroundColor: "#fff",
    padding: 30,
    paddingTop: 50,
  },
  btnContainer: {
    marginVertical: 26,
    width: "50%",
    alignSelf: "center",
  },
  btnSave: {
    backgroundColor: "#0D8E66",
    borderRadius: 5,
    color: "#FFF"
  },
  dataContainer: {
    flex: 1,
    flexDirection: "column",
    maxHeight: 50,
  },
  textDataSub: {
    fontSize: 16,
    color: "gray",
    marginVertical: 5,
  }, dataGeneral: {
    marginTop: 20,
  },
  alert: {
    color: "#f00",
    textAlign: "center",
    fontSize: 14,
    fontWeight: "bold",
    marginLeft: 5
  },
  row: {
    flexDirection: 'row',
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24
  },
  textNull: {
    fontSize: 16,
    color: "gray",
    marginVertical: 5,
    textAlign: "center"
  }
});
