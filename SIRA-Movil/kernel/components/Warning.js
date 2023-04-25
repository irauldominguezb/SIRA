import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Overlay, Button, Image } from '@rneui/base'

export default function Warning(props) {
    const { show, text } = props;
    return (
        <Overlay
            isVisible={show}
            windowsBackgroundColor='rgb(0,0,0,0.5)'
            overlayBackgroundColor='transparent'
            overlayStyle={styles.overlay}
        >
            <View style={styles.container} >
                <Image
                    source={require('../../assets/warning.png')}
                    style={styles.icon}
                />
                {text && <Text style={styles.text} >{text}</Text>}

                <View style={styles.row}>
                    <Button
                        title='Aceptar'
                        titleStyle={{ fontSize: 16, fontWeight: 'bold' }}
                        onPress={props.onConfirm}
                        style={styles.btn}
                        icon={{
                            type: 'material-community',
                            name: 'check',
                            color: '#fff',
                            size: 20,
                            weight: 'bold',
                        }}
                        iconPosition='right'
                        containerStyle={styles.btnContainer}
                        color={'red'}
                    />
                    <Button
                        title='Cancelar'
                        titleStyle={{ fontSize: 16, fontWeight: 'bold' }}
                        onPress={props.onCancel}
                        style={styles.btn}
                        icon={{
                            type: 'material-community',
                            name: 'close',
                            color: '#fff',
                            size: 20,
                            weight: 'bold',
                        }}
                        iconPosition='right'
                        containerStyle={styles.btnContainer}
                        color={'#ffcd01'}
                    />
                </View>
            </View>
        </Overlay>
    )
}

const styles = StyleSheet.create({
    overlay: {
        height: 260,
        width: 290,
        backgroundColor: '#fff',
        borderColor: '#fff',
        borderWidth: 2,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        color: '#000',
        marginVertical: 20,
        textAlign: 'center',
        fontSize: 16,
        textTransform: 'uppercase',
    },
    icon: {
        width: 100,
        height: 100,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
    btnContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    btn: {
        borderRadius: 5,
    }
})