import { StyleSheet, View } from "react-native";
import React, { useState } from "react";
import { Button, Input } from "@rneui/base";
import axios from "../../../../kernel/components/http-client-gateway";
import Loading from "../../../../kernel/components/Loading";
import Error from "../../../../kernel/components/Error";
import Confirmation from "../../../../kernel/components/Confirmation";
import Question from "../../../../kernel/components/Question";
import { isEmpty } from "lodash";
import { useNavigation } from "@react-navigation/native";

export default function RubroUpdateName(props) {
  const { idAspect, name, status, userEmail, setReload } =
    props.route.params;
  const navigation = useNavigation();
  const [newName, setNewName] = useState(name);
  const [error, setError] = useState("");
  const [show, setShow] = useState(false);
  const [showError, setShowError] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showQuestion, setShowQuestion] = useState(false);

  const payload = userEmail ? {
    name: newName,
    status: status,
    user: {
      email: userEmail
    }
  } : {
    name: newName,
    status: status,
    user: null
  };

  const handleSubmit = ()=>{
    setShowQuestion(false)
    if(!(isEmpty(newName))){
      if(/^[a-zA-Z\s]*$/.test(newName)){
        setShow(true)
      axios
      .doPut(`/aspect/${idAspect}`,payload)
      .then(({data : {data}})=>{
        setShow(false)
        setShowSuccess(true)
        setTimeout(() => {
            setShowSuccess(false)
            setReload(true)
            navigation.navigate("rubroAspectListStack")
        }, 1000);
      })
      .catch((error)=>{
        setShow(false)
        setShowError(true)
        setTimeout(() => {
          setShowError(false)
        }, 1000);
        console.log("Error al actualizar Aspecto", error)
      })
      }else{
        setError({
          name: "El nombre no puede contener números ni caracteres especiales"
        })
      }
    }else{
      setError({
        name: "Campo obligatorio"
      })
    }
  }

  return (
    <View style={styles.container}>
      <Input
        label={"Nombre del aspecto"}
        errorMessage={error.name}
        onChange={(event) => {
          setNewName(event.nativeEvent.text);
        }}
        defaultValue={name}
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
      <Loading show={show} text={"Guardando cambios"} />
      <Confirmation
        show={showSuccess}
        text={"Aspecto modificado correctamente"}
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
    color: "#FFF",
  },
});
