import { StyleSheet, Text, View, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { Input, Button, Image, Icon } from '@rneui/base'
import { isEmpty } from 'lodash'
import { validateEmail } from '../../../../kernel/validations'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

export default function RubroUserGuest(props) {
    const { navigation } = props;
    const [error, setError] = useState({ email: '' });
    const [email, setEmail] = useState("");
    const [show, setShow] = useState(false);
    const next = () => {
        if (!(isEmpty(email))) {
            if (validateEmail(email)) {
                setShow(true)
                setError({ email: '' })
                navigation.navigate('rubroReportStack')
            } else {
                setError({ email: 'Debe ser un correo valido' })
            }

        } else {
            setError({ email: 'Campo obligatorio' })
            setShow(false)
        }
    };
    return (
        <View style={styles.container}>
            <KeyboardAwareScrollView>
                <View style={styles.mx}>
                    <Text style={styles.title}>SIRA</Text>
                    <Text style={styles.subtitle}>Reporta incidencias</Text>
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
                        errorMessage={error.email}
                        autoCapitalize='none'
                        rightIcon={{
                            name: 'at',
                            type: 'material-community',
                            size: 22,
                            color: '#002e60'
                        }}
                    />
                    <Button
                        title="Continuar"
                        icon={{
                            name: 'chevron-right',
                            type: 'material-community',
                            size: 22,
                            color: 'white'
                        }}
                        iconPosition='right'
                        buttonStyle={styles.btnSuccess}
                        containerStyle={styles.btnContainer}
                        onPress={next}
                    />
                </View>
            </KeyboardAwareScrollView>
        </View>
    )
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
        width: '100%',
    },
    btnSuccess: {
        color: '#FFF',
        backgroundColor: '#002e60',
        borderRadius: 5,
    },
    btnContainer: {
        flex: 1,
        alignSelf: 'center',
        width: '75%',
        marginTop: 16,
    },
    mx: {
        marginHorizontal: 30,
        marginVertical: 40,
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
})