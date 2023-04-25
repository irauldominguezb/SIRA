import { StyleSheet, Text, View, ScrollView, Platform, Linking } from "react-native";
import React, { useState, useEffect } from "react";
import { Button, Image, Icon } from "@rneui/base";
import Divider from "react-native-divider";
import Loading from "../../../../kernel/components/Loading";
import Error from "../../../../kernel/components/Error";
import Confirmation from "../../../../kernel/components/Confirmation";
import Warning from "../../../../kernel/components/Warning";
import axios from "../../../../kernel/components/http-client-gateway";
import { newDate } from "../../../../kernel/newDate";
import { setDate } from "../../../../kernel/setDate";
import * as Location from "expo-location";
import ShowAddress from "./components/ShowAddress";

export default function RubroReport(props) {
  const { navigation } = props;
  const [show, setShow] = useState(false);
  const [showError, setShowError] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [location, setLocation] = useState(null);
  const [showModal, setShowModal] = useState(false)
  const {
    id,
    name,
    description,
    dateStart,
    dateEnd,
    locationDescription,
    photo,
    status,
    latitude,
    longitude,
  } = props.route.params;
  const lat = parseFloat(latitude);
  const long = parseFloat(longitude);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "denied") {
        try {
          const loc = await Location.getCurrentPositionAsync({});
          setLocation({
            latitude: loc.coords.latitude,
            longitude: loc.coords.longitude,
            latitudeDelta: 0.004757,
            longitudeDelta: 0.006866,
          });
        } catch (error) {
          Alert.alert("Error al obtener la ubicación");
        }
      } else {
        Alert.alert("Es necesario aceptar los permisos de localización");
      }
    })();
  }, []);

  const updateReport = (id) => {
    setShowWarning(false);
    const payload = {
      date_end: newDate(),
    };
    setShow(true);
    axios
      .doPatch(`/report/${id}`, payload)
      .then((res) => {
        setShow(false);
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          navigation.navigate("rubroHomeStack");
        }, 2000);
      })
      .catch((err) => {
        console.log(err);
        setShowWarning(false);
        setShowError(true);
        setTimeout(() => {
          setShowError(false);
        }, 2000);
      });
  };

  const downloadPDF = async (id) => {
    setShow(true);
    Linking.openURL(`http://172.20.10.2:8080/api-sira/report/generateReport/${id}`)
    setShow(false);
  }

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Divider borderColor="gray" color="gray" orientation="center">
          <Text style={styles.titleDivider}>Información del reporte</Text>
        </Divider>
        <View style={styles.mx}>
          <Text style={styles.title}>Reporte de Incidencia</Text>
          <View style={styles.row}>
            <Icon
              name="leaf-circle-outline"
              type="material-community"
              color="gray"
              size={22}
            />
            <Text style={styles.content}>Aspecto ambiental: {name ? name : 'sin nombre'}</Text>
          </View>
          <View style={styles.row}>
            <Icon
              name="map-marker-radius-outline"
              type="material-community"
              color="gray"
              size={22}
            />
            <Text style={styles.content}>Ubicación: {locationDescription ? locationDescription : 'Sin localización'}</Text>
          </View>
          <View style={styles.row}>
            <Icon
              name="calendar-blank-outline"
              type="material-community"
              color="gray"
              size={22}
            />
            <Text style={styles.content}>Fecha inicial: {dateStart ? setDate(dateStart) : ''}</Text>
          </View>
          {dateEnd ? (
            <View style={styles.row}>
              <Icon
                name="calendar-check-outline"
                type="material-community"
                color="gray"
                size={22}
              />
              <Text style={styles.content}>Fecha final: {dateEnd ? setDate(dateEnd) : ""}</Text>
            </View>
          ) : (
            <></>
          )}
          {status ? (
            <View style={styles.row}>
              <Icon
                name="alert-box-outline"
                type="material-community"
                color="gray"
                size={22}
              />
              <Text style={styles.content}>Estado: Pendiente</Text>
            </View>
          ) : (
            <View style={styles.row}>
              <Icon
                name="checkbox-outline"
                type="material-community"
                color="gray"
                size={22}
              />
              <Text style={styles.content}>Estado: Completado</Text>
            </View>
          )}
          <Text style={styles.descriptionTitle}>Descripción del reporte:</Text>
          <Text style={styles.description}>{description ? description : 'Sin descripción'}</Text>
          {photo.length > 1 ? (
            <Image
              source={{ uri: photo }}
              style={styles.image}
              containerStyle={styles.containerImage}
            />
          ) : (
            <Image
              source={require('../../../../assets/noImage.png')}
              style={styles.noImage}
              containerStyle={styles.containerNoImage}
            />
          )}
          {status ? (
            <Button
              title="Marcar como completado"
              icon={{
                name: "checkbox-outline",
                type: "material-community",
                size: 22,
                color: "white",
              }}
              iconPosition="right"
              buttonStyle={styles.btn}
              containerStyle={styles.btnContainer}
              onPress={() => setShowWarning(true)}
            />
          ) : (
            <></>
          )}
          <Button
            title="Mostrar ubicación GPS"
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
          <Button
            title="Descargar reporte PDF"
            containerStyle={styles.btnPDFContainer}
            buttonStyle={styles.btnPDF}
            icon={{
              name: "file-pdf-box",
              type: "material-community",
              color: "#FFF",
              size: 22,
            }}
            iconPosition="right"
            onPress={() => downloadPDF(id)}
          />
          <Warning
            show={showWarning}
            text={"Esta acción es irreversible, ¿Deseas continuar?"}
            onConfirm={() => updateReport(id)}
            onCancel={() => setShowWarning(false)}
          />
          <Loading show={show} text={"Procesando"} />
          <Error show={showError} text={"Ocurrió un error"} />
          <Confirmation
            show={showSuccess}
            text={"Se ha marcado como completado"}
          />
        </View>
      </ScrollView>
      <ShowAddress show={showModal}
        latitude={lat} longitude={long}
        onCancel={() => setShowModal(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    backgroundColor: '#fff',
  },
  mx: {
    marginHorizontal: 32,
    marginTop: 1
  },
  image: {
    width: 300,
    height: 300,
  },
  noImage: {
    width: 280,
    height: 305,
    alignSelf: 'center',
  },
  containerNoImage: {
    marginTop: 30,
    marginBottom: 20,
    alignSelf: 'center',
  },
  containerImage: {
    marginVertical: 25,
    alignSelf: 'center',
  },
  description: {
    fontSize: 16,
    marginTop: 5,
    textAlign: "left",
  },
  descriptionTitle: {
    fontSize: 16,
    marginTop: 15,
  },
  btnLocationContainer: {
    flex: 1,
    alignSelf: 'center',
    justifyContent: 'center',
    marginTop: 10,
    width: '100%',
  },
  btnLocation: {
    backgroundColor: '#002e60',
    borderRadius: 5,
  },
  btnPDFContainer: {
    flex: 1,
    alignSelf: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 20,
    width: '100%',
  },
  btnPDF: {
    backgroundColor: '#002e60',
    borderRadius: 5,
  },
  btnContainer: {
    flex: 1,
    alignSelf: 'center',
    justifyContent: 'center',
    marginTop: 10,
    width: '100%',
  },
  btn: {
    backgroundColor: "#0d8e66",
    borderRadius: 5,
  },
  titleDivider: {
    fontSize: 16,
    fontWeight: "bold",
  },
  title: {
    fontSize: 20,
    textAlign: "center",
    marginTop: 15,
    marginBottom: 25,
    color: '#002e60',
    fontWeight: 'bold',
  },
  content: {
    fontSize: 16,
    textAlign: "left",
    marginLeft: 10,
    color: "#626567",
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: 10,
  },
})