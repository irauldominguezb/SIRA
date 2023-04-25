import { StyleSheet, View } from 'react-native'
import React, { useState, useEffect } from 'react'
import Filter from '../../../../kernel/components/Filter'
import { Button, Input, Icon } from '@rneui/base'
import axios from '../../../../kernel/components/http-client-gateway'
import Loading from '../../../../kernel/components/Loading'
import Error from '../../../../kernel/components/Error'
import Confirmation from '../../../../kernel/components/Confirmation'
import { isEmpty } from "lodash";
import { useNavigation } from "@react-navigation/native";

const RubroUserOne = (props) => {
    const { setReload } = props.route.params
    const navigation = useNavigation();
    const [showPassword, setShowPassword] = useState(true)
    const [error, setError] = useState("");
    const [fullname, setFullname] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [role, setRole] = useState("")
    const [roles, setRoles] = useState([])
    const [show, setShow] = useState(false)
    const [showSuccess, setShowSuccess] = useState(false)
    const [showError, setShowError] = useState(false)
    const [filter, setFilter] = useState("Rol");

    const itemSelector = (item) => {
        setRole(item)
    }

    useEffect(() => {
        axios
            .doGet("/role/")
            .then(({ data: { data } }) => {
                const role = data.map((role) => {
                    return {
                        role: role.name,
                    }
                })
                setRoles(role);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    const arrayRoles = roles.map((role) => {
        return role.role
    })

    const payload = {
        fullname: fullname,
        email: email,
        password: password,
        role: {
            name: role
        }
    }

    const handleSubmit = () => {
        if (!(isEmpty(fullname) || isEmpty(email) || isEmpty(password) || isEmpty(role))) {
            if (/^[a-zA-Z\s]*$/.test(fullname)) {
                setError({
                    fullname: "",
                    email: "",
                    password: "",
                    role: "",
                })
                setFilter("Rol");
                axios
                    .doPost("/user/", payload)
                    .then(({ data: { data } }) => {
                        setShow(false);
                        setShowSuccess(true);
                        setTimeout(() => {
                            setShowSuccess(false)
                            setReload(true)
                            navigation.navigate("rubroUserListStack")
                        }, 2000);
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            }else{
                setError({
                    fullname: "El nombre no puede contener números ni caracteres especiales",
                })
                setFilter("Rol");
            }
        } else {
            setError({
                fullname: isEmpty(fullname) ? "El nombre es obligatorio" : "",
                email: isEmpty(email) ? "El correo es obligatorio" : "",
                password: isEmpty(password) ? "La contraseña es obligatoria" : "",
                role: isEmpty(role) ? "El rol es obligatorio" : "",
            })
            setFilter(<Icon type="material-community" name="alert-circle-outline" color="#f00" />);
        }
    };


    return (

        <View style={styles.container}>

            <Input
                label={"Nombre completo"}
                errorMessage={error.fullname}
                onChange={(event) => { setFullname(event.nativeEvent.text) }}
                autoCapitalize='words'
            />
            <Input
                label={"Correo electrónico"}
                errorMessage={error.email}
                keyboardType="email-address"
                onChange={(event) => { setEmail(event.nativeEvent.text) }}
                autoCapitalize='none'
            />

            <Input
                label={"Contraseña"}
                rightIcon={{
                    type: "material-community",
                    name: showPassword ? "eye-off-outline" : "eye-outline",
                    size: 22,
                    onPress: () => setShowPassword(!showPassword)
                }}
                secureTextEntry={showPassword}
                onChange={(event) => { setPassword(event.nativeEvent.text) }}
                errorMessage={error.password}
            />
            <Filter
                title={filter}
                text={"Selecciona un rol"}
                contenido={arrayRoles}
                itemSelector={itemSelector}
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
                onPress={handleSubmit}
            />
            <Loading show={show} text={"Guardando usuario"} />
            <Error show={showError} text={"Ha ocurrido un error"} />
            <Confirmation show={showSuccess} text={"Usuario guardado"} />
        </View>
    )
}

export default RubroUserOne

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: "space-evenly"
    },
    search: {
        flex: 1,
        marginTop: 30,

    },
    container: {
        minHeight: "100%",
        backgroundColor: "#fff",
        padding: 30,
        paddingTop: 50
    },
    input: {
        marginTop: 20,
    },
    inputText: {
        fontSize: 20,
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
});