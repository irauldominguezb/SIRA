import { StyleSheet, Text, View, ScrollView } from "react-native";
import { Input, Button, Image, Icon } from "@rneui/base";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState } from "react";
import Loading from "../../../../kernel/components/Loading";
import Error from "../../../../kernel/components/Error";
import { isEmpty } from "lodash";
import { validateEmail } from "../../../../kernel/validations";
import axios from "../../../../kernel/components/http-client-gateway";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

export default function RubroLogin(props) {
  const { navigation } = props;
  const {setReload} = props.route.params;
  const [error, setError] = useState({ email: "", password: "" });
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(true);
  const [show, setShow] = useState(false);
  const [showError, setShowError] = useState(false)
  const payload ={
    email: "",
    password: ""
  }
  const login = () => {
    if (!(isEmpty(email) || isEmpty(password))) {
      if (validateEmail(email)) {
        setShow(true);
        setError({ email: "", password: "" });
        payload.email = email;
        payload.password = password;
        axios
          .doPost('/auth/login',payload)
          .then(async({data :{data}}) =>{
            try {
              await AsyncStorage.setItem("@session", JSON.stringify(data));
              await AsyncStorage.setItem("@token", JSON.stringify(data.token));
              const session = JSON.parse(await AsyncStorage.getItem("@session"));
              setShow(false)
              setReload(true);
            } catch (error) {
              console.log("error",error)
            }

          })
          .catch((err)=>{
            console.log(err);
            setShow(false);
            setShowError(true)
            setTimeout(() => {
              setShowError(false)
            }, 2000);
          })
        
      } else {
        setError({ email: "Debe ser un correo válido", password: "" });
      }
    } else {
      setError({ email: "Campo obligatorio", password: "Campo obligatorio" });
      setShow(false);
    }
  };
  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView>
        <View style={styles.mx}>
          <Text style={styles.title}>SIRA</Text>
          <Text style={styles.subtitle}>Ingresa con tu cuenta</Text>
          <Image
            source={require("../../../../assets/hojita.png")}
            resizeMode="contain"
            style={styles.logotype}
          />
          <Input
            placeholder="Correo electrónico"
            keyboardType="email-address"
            containerStyle={styles.input}
            onChange={(event) => setEmail(event.nativeEvent.text)}
            rightIcon={
                <Icon
                  type="material-community"
                  name="at"
                  color="#002e60"
                ></Icon>
              }
            errorMessage={error.email}
            autoCapitalize="none"
          />
          <Input
            placeholder="Contraseña"
            containerStyle={styles.input}
            onChange={(event) => setPassword(event.nativeEvent.text)}
            secureTextEntry={showPassword}
            autoCapitalize="none"
            rightIcon={
              <Icon
                type="material-community"
                name={showPassword ? "eye-off-outline" : "eye-outline"}
                color="#002e60"
                onPress={() => setShowPassword(!showPassword)}
              ></Icon>
            }
            errorMessage={error.password}
          />
          <Button
            title="Iniciar sesión"
            icon={{
              name: "login",
              type: "material-community",
              size: 22,
              color: "white",
            }}
            buttonStyle={styles.btnSuccess}
            containerStyle={styles.btnContainer}
            onPress={login}
          />
          <Loading show={show} text="Iniciando sesión" />
          <Error show={showError} text="Error al iniciar sesión"/>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    height: "100%",
  },
  logotype: {
    width: "100%",
    height: 150,
    marginTop: 20,
    marginBottom: 24,
  },
  input: {
    width: "100%",
  },
  btnSuccess: {
    color: "#FFF",
    backgroundColor: "#0d8e66",
    borderRadius: 5,
  },
  btnContainer: {
    marginTop: 16,
    width: "70%",
    alignSelf: "center",
  },
  title: {
    fontSize: 45,
    textAlign: "center",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 25,
    textAlign: "center",
    marginBottom: 20,
  },
  mx: {
    marginHorizontal: 30,
    marginVertical: 40,
  },
});
