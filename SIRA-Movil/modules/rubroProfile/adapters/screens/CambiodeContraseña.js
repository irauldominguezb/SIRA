import { StyleSheet, View, ScrollView } from "react-native";
import React, { useState, useEffect } from "react";
import { Button, Input, Icon } from "@rneui/base";
import { isEmpty } from "lodash";
import Loading from "../../../../kernel/components/Loading";
import Error from "../../../../kernel/components/Error";
import Warning from "../../../../kernel/components/Warning";
import Confirmation from "../../../../kernel/components/Confirmation";
import axios from "../../../../kernel/components/http-client-gateway";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

export default function CambiodeContraseña(props) {
  const { setReload } = props.route.params;

  const payload = {
    oldPassword: "",
    newPassword: "",
    repeatPassword: "",
  };

  const [data, setData] = useState(payload);
  const [error, setError] = useState("");
  const [show, setShow] = useState(false);
  const [showError, setShowError] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [showPassword, setShowPassword] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(true);
  const [showRepeatPassword, setShowRepeatPassword] = useState(true);

  const [session, setSession] = useState(null);
  //Extraer datos de la sesion
  useEffect(() => {
    (async () => {
      const session = await AsyncStorage.getItem("@session");
      setSession(JSON.parse(session));
    })();
  }, []);

  const changePayload = (e, type) => {
    setData({ ...data, [type]: e.nativeEvent.text });
  };
  const changePassword = () => {
    if (
      !(
        isEmpty(data.newPassword) ||
        isEmpty(data.repeatPassword) ||
        isEmpty(data.oldPassword)
      )
    ) {
      if (data.newPassword === data.repeatPassword) {
        setError({
          oldPassword: "",
          newPassword: "",
          repeatPassword: "",
        });
        setShowWarning(true);
      } else {
        setError({
          newPassword: "Los campos no coinciden",
          repeatPassword: "Los campos no coinciden",
        });
      }
    } else {
      setError({
        oldPassword: isEmpty(data.oldPassword) ? "Campo obligatorio" : "",
        newPassword: isEmpty(data.newPassword) ? "Campo obligatorio" : "",
        repeatPassword: isEmpty(data.repeatPassword) ? "Campo obligatorio" : "",
      });
    }
  };

  const logOut = async () => {
    try {
      await AsyncStorage.removeItem("@session");
      setReload(true);
    } catch (error) {
      setReload(true);
    }
  };
  const peticionPassword = async () => {
    axios
      .doPatch(`/user/updatePassword/${session.user.id}`, data)
      .then(({ data: { data } }) => {
        setShowWarning(false);
        if (data != null) {
          setShowSuccess(true);
          setTimeout(() => {
            setShowSuccess(false);
            logOut();
          }, 2000);
        } else {
          setError({
            oldPassword: "Contraseña incorrecta",
            newPassword: "",
            repeatPassword: "",
          });
        }
      })
      .catch((err) => {
        console.log("error contraseña", err);
        setShowWarning(false);
        setShowError(true);
        setTimeout(() => {
          setShowError(false);
        }, 2000);
      });
  };
  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.mx}>
          <Input
            placeholder="Contraseña actual"
            rightIcon={
              <Icon
                type="material-community"
                name={showOldPassword ? "eye-off-outline" : "eye-outline"}
                size={22}
                onPress={() => setShowOldPassword(!showOldPassword)}
              />
            }
            secureTextEntry={showOldPassword}
            onChange={(e) => changePayload(e, "oldPassword")}
            errorMessage={error.oldPassword}
            style={styles.input}
          />
          <Input
            placeholder="Contraseña"
            rightIcon={
              <Icon
                type="material-community"
                name={showPassword ? "eye-off-outline" : "eye-outline"}
                size={22}
                onPress={() => setShowPassword(!showPassword)}
              />
            }
            secureTextEntry={showPassword}
            onChange={(e) => changePayload(e, "newPassword")}
            errorMessage={error.newPassword}
            style={styles.input}
          />
          <Input
            placeholder="Repetir contraseña"
            rightIcon={
              <Icon
                type="material-community"
                name={showRepeatPassword ? "eye-off-outline" : "eye-outline"}
                size={22}
                onPress={() => setShowRepeatPassword(!showRepeatPassword)}
              />
            }
            secureTextEntry={showRepeatPassword}
            onChange={(e) => changePayload(e, "repeatPassword")}
            errorMessage={error.repeatPassword}
            style={styles.input}
          />
          <Button
            title=" Restablecer contraseña"
            icon={
              <Icon
                name="lock-reset"
                type="material-community"
                size={22}
                color="#FFF"
              />
            }
            buttonStyle={styles.btn}
            containerStyle={styles.btnContainer}
            onPress={() => changePassword()}
          />
        </View>
      </KeyboardAwareScrollView>
      <Loading show={show} text="Cambiando contraseña" />
      <Error show={showError} text="Ha ocurrido un error" />
      <Warning
        show={showWarning}
        text="¿Seguro que deseas actualizar la contraseña?"
        onConfirm={() => peticionPassword()}
        onCancel={() => setShowWarning(false)}
      />
      <Confirmation
        show={showSuccess}
        text={"Contraseña actualizada correctamente"}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: "100%",
    backgroundColor: "#fff",
  },
  mx: {
    marginHorizontal: 30,
    paddingTop: 30,
  },
  input: {
    marginTop: 20,
  },
  btn: {
    backgroundColor: "#002e60",
    borderRadius: 5,
  },
  btnContainer: {
    flex: 1,
    alignSelf: "center",
    justifyContent: "center",
    marginTop: 40,
    width: "80%",
  },
});
