import { StyleSheet, View, Text } from 'react-native'
import React, { useState, useEffect } from 'react'
import Filter from '../../../../kernel/components/Filter'
import { Button, Icon, Input } from '@rneui/base'
import Loading from '../../../../kernel/components/Loading'
import Error from '../../../../kernel/components/Error'
import Confirmation from '../../../../kernel/components/Confirmation'
import { isEmpty } from "lodash";
import { useNavigation } from "@react-navigation/native";
import axios from "../../../../kernel/components/http-client-gateway";

const RubroAspectOne = (props) => {
    const { setReload } = props.route.params
    const [show, setShow] = useState(false)
    const [showSuccess, setShowSuccess] = useState(false)
    const [showError, setShowError] = useState(false)
    const [user, setUser] = useState("")
    const [filter, setFilter] = useState("Encargado");
    const [users, setUsers] = useState([])
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [error, setError] = useState("")
    const navigation = useNavigation();

    const itemSelector = (item) => {
        setEmail(item.split(" - ")[1])
    }

    useEffect(() => {
        axios
            .doGet("/user/role/Encargado/status/true")
            .then(({ data: { data } }) => {
                const user = data.map((user) => {
                    return {
                        user: user.fullname,
                        emailUser: user.email
                    }
                })
                setUsers(user)
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    const arrayUsers = users.map((user) => {
        return user.user + " - " + user.emailUser
    })

    const payload = {
        name: name,
        user: {
            email: email
        }
    }

    const handleSubmit = () => {
        if (!(isEmpty(name) || isEmpty(email))) {
            if(/^[a-zA-Z\s]*$/.test(name)){
                setShow(true)
            axios.doPost("/aspect/", payload)
                .then(({ data: { data } }) => {
                    setShow(false)
                    setShowSuccess(true)
                    setTimeout(() => {
                        setShowSuccess(false)
                        setReload(true)
                        navigation.navigate("rubroAspectListStack")
                    }, 2000);
                })
                .catch((error) => {
                    console.log(error);
                    setShow(false)
                    setShowError(true)
                    setTimeout(() => {
                        setShowError(false)
                    }, 2000);
                });
            }else{
                setError({
                    name: "El nombre no puede contener números ni caracteres especiales",
                })
            }
        } else {
            setError({
                name: isEmpty(name) ? "El nombre es obligatorio" : "",
            })
            setFilter(<Icon type="material-community" name="alert-circle-outline" color="#f00" />);
        }
    }

    return (

        <View style={styles.container}>

            <Input label={"Rubro"}
                onChange={(event) => setName(event.nativeEvent.text)}
                errorMessage={error.name}
            />
            {arrayUsers.length > 0 ? (
                <View>
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
                            color: "#FFF"
                        }}
                        buttonStyle={styles.btnSave}
                        containerStyle={styles.btnContainer}
                        onPress={handleSubmit}
                    />
                </View>
            ) : (
                <View style={styles.row}>
                    <Icon type="material-community" name="alert-circle-outline" color="#f00" />
                    <Text style={styles.alert}>No hay usuarios disponibles por el momento</Text>
                </View>
            )}
            <Loading show={show} text={"Guardando aspecto"} />
            <Error show={showError} text={"Ha ocurrido un error"} />
            <Confirmation show={showSuccess} text={"Aspecto guardado"} />
        </View>

    )
}

export default RubroAspectOne

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
    mx: {
        marginHorizontal: 20,
    },
    input: {
        marginTop: 20,
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
    }
});