import { StyleSheet, Text, View} from 'react-native'
import React from 'react'
import { Overlay, Button, Image } from '@rneui/base'

export default function Question(props) {
    const {show, text} = props;
  return (
    <Overlay
    isVisible={show}
    windowsBackgroundColor= 'rgb(0,0,0,0.5)'
    overlayBackgroundColor='transparent'
    overlayStyle={styles.overlay}
    >
        <View style={styles.container} >
            <Image
                source={require('../../assets/question.png')}
                style={styles.icon}
            />
            {text && <Text style={styles.text} >{text}</Text>}

            <View style={styles.row}>
                <Button
                    title='Aceptar'
                    onPress={props.onConfirm}
                    style={styles.btn}
                    icon={{
                        type:'material-community',
                        name:'check',
                        color:'#fff',
                    }}
                    iconPosition='right'
                    containerStyle={styles.btnContainer}
                    color={'green'}
                />
                <Button
                    title='Cancelar'
                    onPress={props.onCancel}
                    style={styles.btn}
                    icon={{
                        type:'material-community',
                        name:'close',
                        color:'#fff',
                    }}
                    iconPosition='right'
                    containerStyle={styles.btnContainer}
                    color={'orange'}
                />
            </View>
        </View>
    </Overlay>
  )
}

const styles = StyleSheet.create({
    overlay:{
        height:250,
        width:300,
        backgroundColor:'#fff',
        borderColor:'#fff',
        borderWidth:2,
        borderRadius:10,
        justifyContent:'center',
        alignItems:'center',
    },
    container:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
    },
    text:{
        color: '#000',
        textTransform: 'uppercase',
        marginTop: 15,
        textAlign: 'center',
    },
    icon:{
        width:100,
        height:100,
    },
    row:{
        flexDirection:'row',
        justifyContent:'center',
        width:'100%',
        marginTop:20,
    },
    btnContainer:{
        flex: 1,
        justifyContent:'center',
        alignItems:'center',
        borderRadius: 5,
    },
    btn:{
        borderRadius: 5,
    }
})