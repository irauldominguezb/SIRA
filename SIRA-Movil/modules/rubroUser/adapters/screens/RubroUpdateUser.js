import { StyleSheet, View } from 'react-native'
import React, { useState } from 'react'
import { Button, Input } from '@rneui/base'
import axios from '../../../../kernel/components/http-client-gateway'
import Loading from '../../../../kernel/components/Loading'
import Error from '../../../../kernel/components/Error'
import Confirmation from '../../../../kernel/components/Confirmation'
import Question from '../../../../kernel/components/Question'
import { isEmpty } from "lodash";
import { useNavigation } from "@react-navigation/native";

export default function RubroUpdateUser(props) {
    const { id, fullname, email,status, role, setReload } = props.route.params;
    const navigation = useNavigation();
    const [newName, setNewName] = useState(fullname)
    const [newEmail, setNewEmail] = useState(email)
    const [newPassword, setNewPassword] = useState("")
    const [showPassword, setShowPassword] = useState(true)
    const [error, setError] = useState("")
    const [show, setShow] = useState(false)
    const [showError, setShowError] = useState(false)
    const [showSuccess, setShowSuccess] = useState(false)
    const [showQuestion, setShowQuestion] = useState(false)
    const [newRoleName, setNewRoleName] = useState(role.name)


    const payload = {
        fullname: newName,
        email: newEmail,
        password: newPassword,
        status: status,
        role:{
            name: newRoleName
        }
    }

    const handleSubmit = () =>{
        setShowQuestion(false)
        if(!(isEmpty(newPassword)) && !(isEmpty(newEmail) && !(isEmpty(newName)))) {
            if ( /^[a-zA-Z\s]*$/.test(newName)) {
                setShow(true)
                axios
                .doPut(`/user/${id}`,payload)
                .then(({data: {data}}) =>{
                    setShow(false)
                    setShowSuccess(true)
                    setTimeout(() => {
                        setShowSuccess(false)
                        setReload(true)
                        navigation.navigate("rubroUserListStack")
                    }, 1000);
                })
                .catch((error)=>{
                    console.log("Error al actualizar usuario", error)
                })
            }else{
                setError({
                    fullname: "El nombre no puede contener números ni caracteres especiales"
                })
            }
        }else{
            setError({
                fullname: "Campo obligatorio",
                email: "Campo obligatorio",
                password: "Es necesario ingresar una contraseña"
            })
        }
    }


  return (
    <View style={styles.container} >
            <Input
                label={"Nombre completo"}
                errorMessage={error.fullname}
                onChange={(event) => { setNewName(event.nativeEvent.text) }}
                defaultValue={fullname}
            />
            <Input
                label={"Correo electrónico"}
                errorMessage={error.email}
                onChange={(event) => { setNewEmail(event.nativeEvent.text) }}
                autoCapitalize='none'
                defaultValue={email}
            />

            <Input
                label={"Ingresa una contraseña"}
                rightIcon={{
                    type: "material-community",
                    name: showPassword ? "eye-off-outline" : "eye-outline",
                    size: 22,
                    onPress: () => setShowPassword(!showPassword)
                }}
                secureTextEntry={showPassword}
                onChange={(event) => { setNewPassword(event.nativeEvent.text) }}
                errorMessage={error.password}
            />
            <Button
                title=" Guardar"
                icon={{
                    name: "content-save-check",
                    type: "material-community",
                    size: 22,
                    color: "#FFF"
                }}
                buttonStyle={styles.btnSave}
                containerStyle={styles.btnContainer}
                onPress={()=>setShowQuestion(true)}
            />
        <Loading show={show} text={"Guardando cambios"}/>
        <Confirmation show={showSuccess} text={"Usuario modificado correctamente"} />
        <Error show={showError} text={"Ha ocurido un error"}/>
        <Question show={showQuestion} text={"¿Seguro desea actualizar?"} onConfirm={()=> handleSubmit()} onCancel={()=> setShowQuestion(false)} />
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        minHeight: "100%",
        backgroundColor: "#fff",
        padding: 30,
        paddingTop: 50
    },
    
    btnContainer: {
        marginVertical: 26,
        width: "50%",
        alignSelf: "center"
    },
    btnSave: {
        backgroundColor: '#0D8E66',
        borderRadius: 5,
        color: "#FFF"
    },
})