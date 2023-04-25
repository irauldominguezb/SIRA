import { ScrollView, StyleSheet, Text, View, Linking } from 'react-native'
import Loading from "../../../../kernel/components/Loading";
import React, { useState } from 'react'
import { setDate } from "../../../../kernel/setDate";
import { Button, Icon, Image } from "@rneui/base";
import ShowAddress from "./components/ShowAddress";
import Divider from "react-native-divider";

export default function RubroReportAdmin(props) {
  const { id, name, description, dateStart, dateEnd, locationDescription, photo, status, latitude, longitude, } = props.route.params;
  const [showModal, setShowModal] = useState(false)
  const [show, setShow] = useState(false)
  const lat = parseFloat(latitude);
  const long = parseFloat(longitude);

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
        </View>
      </ScrollView>
      <Loading show={show} text={"Descargando"} />
      <ShowAddress show={showModal}
        latitude={lat} longitude={long}
        onCancel={() => setShowModal(false)} />
    </View>
  )
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
    marginBottom: 5,
  },
  btnLocation: {
    backgroundColor: '#002e60',
    borderRadius: 5,
  },
  btnPDFContainer: {
    flex: 1,
    alignSelf: 'center',
    justifyContent: 'center',
    marginTop: 5,
    width: '100%',
    marginBottom: 20,
  },
  btnPDF: {
    backgroundColor: '#002e60',
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