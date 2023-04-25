import { StyleSheet, Text, View, ScrollView } from 'react-native'
import React from 'react'
import { Image, Button } from '@rneui/base'

export default function RubroUserOption(props) {
    const { navigation } = props
    return (
        <View style={styles.container}>
            <ScrollView
                style={styles.mx}
                centerContent={true}
            >
                <Text style={styles.title}>Sira</Text>
                <Text style={styles.subtitle}>Reportar incidencia</Text>
                <Image
                    source={require('../../../../assets/hojita.png')}
                    resizeMode='contain'
                    style={styles.img}
                />
                <View style={styles.viewBtnContainer}>
                    <Button
                        title='Comunidad UTEZ'
                        icon={{
                            name: 'login',
                            type: 'material-community',
                            size: 15,
                            color: 'white'
                        }}
                        buttonStyle={styles.btn}
                        containerStyle={styles.btnContainer}
                        onPress={() => navigation.navigate('userGuestStack')}
                    />
                    <Button
                        title='Invitado'
                        icon={{
                            name: 'login',
                            type: 'material-community',
                            size: 15,
                            color: 'white'
                        }}
                        buttonStyle={styles.btn}
                        containerStyle={styles.btnContainer}
                        onPress={() => navigation.navigate('userGuestStack')}
                    />
                </View>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        height: '100%',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    mx: {
        marginLeft: 32,
        marginRight: 32
    },
    img: {
        marginTop: 20,
        width: '100%',
        height: 150
    },
    btn: {
        backgroundColor: '#002e60',
        borderRadius: 5,
        margin: 10,
    },
    viewBtnContainer: {
        flex: 1,
        alignItems: 'center',
        marginTop: 20
    },
    btnContainer: {
        width: '100%'
    },
    title: {
        fontSize: 60,
        textAlign: 'center',
        marginTop: 12,
        marginBottom: 5,
    },
    subtitle: {
        fontSize: 30,
        textAlign: 'center',
        marginBottom: 20
    },
})