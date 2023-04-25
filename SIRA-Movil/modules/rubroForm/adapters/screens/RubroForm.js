import { StyleSheet, Text, View } from 'react-native'
import React, { useState, useEffect } from 'react'
import Filter from '../../../../kernel/components/Filter'
import ImagePicker from '../../../../kernel/components/ImagePicker'
import { Button, Icon, Image, Input } from '@rneui/base'
import axios from '../../../../kernel/components/http-client-gateway'
import { isEmpty } from "lodash";
import { newDate } from '../../../../kernel/newDate'
import Confirmation from '../../../../kernel/components/Confirmation'
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Loading from '../../../../kernel/components/Loading'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import ChangeAddress from './components/ChangeAddress'

const RubroForm = (props) => {
  const { navigation } = props;
  const [showSuccess, setShowSuccess] = useState(false);
  const [filter, setFilter] = useState("Rubro");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [location_description, setLocation_description] = useState("");
  const [photo, setPhoto] = useState("");
  const [aspect, setAspect] = useState("");
  const [error, setError] = useState({ description: "", location: "", locationDescription: "", photo: "", dateStart: "", aspect: "" });
  const [aspects, setAspects] = useState([])
  const [file, setFile] = useState("");
  const [show, setShow] = useState(false)
  const [showModal, setShowModal] = useState(false)

  const getPhoto = (uri) => {
    setPhoto(uri);
    const fileName = uri.split("/").pop();
    setFile(fileName);
  }

  const uploadImage = async (uri, aspect, date) => {
    const response = await fetch(uri);
    const { _bodyBlob } = response;
    const storage = getStorage();
    const storageRef = ref(storage, `reportes/${aspect}/${date}/${file}`);
    return uploadBytes(storageRef, _bodyBlob);
  };


  const itemSelector = (item) => {
    setAspect(item)
  }

  useEffect(() => {
    axios
      .doGet("/aspect/active")
      .then(({ data: { data } }) => {
        const aspect = data.map((aspect) => {
          return {
            aspect: aspect.name,
          }
        })
        setAspects(aspect);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const arrayAspects = aspects.map((aspect) => {
    return aspect.aspect
  })


  const payload = {
    description: description,
    latitude: null,
    longitude: null,
    location_description: location_description,
    photo: photo,
    date_start: newDate(),
    aspect: {
      name: aspect
    }
  }
  
  if(location!=null){
    payload.longitude = location.longitude
    payload.latitude = location.latitude
  }else{
    payload.longitude = ""
    payload.latitude = ""
  }

  const noSeAtasquen = () => {
    setShow(true)
    handleSubmit()
  }

  const handleSubmit = () => {
    if (!(isEmpty(description) || isEmpty(location_description) || isEmpty(aspect))) {
      setError({ description: "", locationDescription: "" });
      setFilter("Rubro");
      if(location!== ""){
        if (!isEmpty(photo)) {
          uploadImage(photo, aspect, newDate())
            .then((snapshot) => {
              getDownloadURL(snapshot.ref).then((url) => {
                payload.photo = url;
                setPhoto(url);
                axios
                  .doPost("/report/", payload)
                  .then(({ data: { data } }) => {
                    axios
                      .doPost("/report/sendMail", payload)
                      .then(({ data: { data } }) => {
                        setShow(false)
                        setShowSuccess(true);
                        setTimeout(() => {
                          setShowSuccess(false);
                          navigation.navigate("rubroUserGuestStack");
                        }, 3000);
                      })
                  })
                  .catch((error) => {
                    console.log(error);
                  });
              });
            })
        } else {
          axios
            .doPost("/report/", payload)
            .then(({ data: { data } }) => {
              axios
                .doPost("/report/sendMail", payload)
                .then(({ data: { data } }) => {
                  setShow(false)
                  setShowSuccess(true);
                  setTimeout(() => {
                    setShowSuccess(false);
                    navigation.navigate("rubroUserGuestStack");
                  }, 3000);
                })
            })
            .catch((error) => {
              console.log(error);
            });
        }
      }else{}
    } else {
      setShow(false)
      setError({ description: "Campo obligatorio", locationDescription: "Campo obligatorio" });
      setFilter(<Icon type="material-community" name="alert-circle-outline" color="#f00" />);
    }
  };
  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.mx}>
          <Text style={styles.title}>
            Reporte de Incidencia
          </Text>
          <Filter
            title={filter}
            text={"Selecciona una opción"}
            contenido={arrayAspects}
            itemSelector={itemSelector}
          />
          <Input
            placeholder="Descripción del problema"
            containerStyle={styles.input}
            rightIcon={{
              name: "sticker-text",
              type: "material-community",
              size: 22,
              color: "#002e60",
            }}
            multiline
            errorMessage={error.description}
            onChange={(event) => setDescription(event.nativeEvent.text)}
          />
          <Button
            title="Marcar ubicación GPS"
            containerStyle={styles.btnLocationContainer}
            buttonStyle={styles.btnLocation}
            icon={{
              name: "map-marker-radius",
              type: "material-community",
              color: "#FFF",
              size: 22,
            }}
            iconPosition="right"
            onPress={() => setShowModal(true)}
          />
          {location==="" ?(
            <View>
              <Text style={styles.msgError} >Campo obligatorio</Text>
            </View>
          ):(
            <View>
              <Text style={styles.msgOk} >Ubicación guardada exitosamente</Text>
            </View>
          )}
          <Input
            placeholder="Descripción del lugar"
            containerStyle={styles.input}
            rightIcon={
              <Icon
                type="material-community"
                name="map-marker-radius"
                color="#002e60"
              ></Icon>
            }
            errorMessage={error.locationDescription}
            onChange={(event) => setLocation_description(event.nativeEvent.text)}
          />
          <View style={styles.imagePickerContainer}>
            <ImagePicker getPhoto={getPhoto} />
          </View>
          <Button
            title="Enviar reporte"
            containerStyle={styles.btnContainer}
            buttonStyle={styles.btn}
            icon={{
              name: "send",
              type: "material-community",
              color: "#FFF",
              size: 22,
            }}
            iconPosition="right"
            onPress={noSeAtasquen}
          />
          <Confirmation show={showSuccess} text="Reporte enviado exitosamente" />
        </View>
      </KeyboardAwareScrollView>
      <Loading show={show} text={"Guardando reporte"} />
      <ChangeAddress show={showModal} onCancel={() => setShowModal(false)}
        onSave={(location)=>{setLocation(location); setShowModal(false)}}
      />
    </View>
  )
}

export default RubroForm

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    height: "100%",
  },
  input: {
    width: "100%",

  },
  btnContainer: {
    flex: 1,
    alignSelf: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    width: '60%',
  },
  btn: {
    backgroundColor: '#0d8e66',
    borderRadius: 5,
  },
  btnLocationContainer: {
    flex: 1,
    alignSelf: 'center',
    justifyContent: 'center',
    marginTop: 10,
    width: '90%',
    marginBottom: 5,
  },
  btnLocation: {
    backgroundColor: '#002e60',
    borderRadius: 5,
  },
  title: {
    fontSize: 26,
    textAlign: "center",
    marginTop: 30,
    marginBottom: 10,
  },
  mx: {
    marginHorizontal: 20,
  },
  imagePickerContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
  },
  msgOk:{
    color: "green",
    alignSelf: 'center',
    marginBottom: 24,
  },
  msgError:{
    color: "red",
    alignSelf: 'center',
    marginBottom: 24,
  }
});