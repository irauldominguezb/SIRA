import { StyleSheet, View, Dimensions } from "react-native";
import React, { useState, useEffect } from "react";
import { Divider, Button } from "@rneui/base";
import { Overlay } from "@rneui/themed";
import * as Location from "expo-location";
import * as MediaLibrary from "expo-media-library";
import MapView, { Marker } from "react-native-maps";

const widthScreen = Dimensions.get("window").width;

export default function ChangeAddress(props) {
  const { show } = props;
  const [location, setLocation] = useState(null);

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

  const saveLocation = () => {
    props.onSave(location);
  };

  return (
    <Overlay
      isVisible={show}
      windowBackgroundColor="rgba(0,0.0,0.5)"
      overlayBackgroundColor="transparent"
      overlayStyle={styles.overlay}
    >
      <View>
        <View>
          {location && (
            <MapView
            style={styles.map}
            initialRegion={location}
            showsUserLocation={true}
            minZoomLevel={15}
            onRegionChange={(region) => setLocation(region)}
          >
            <Marker
              coordinate={{
                latitude: location.latitude,
                longitude: location.longitude,
              }}
              tile="Incidencia" 
              draggable 
            />
          </MapView>
          )}
        </View>
        <View style={styles.dividerArea}>
          <Divider style={styles.divider} color={"#002e60"} width={2} />
        </View>
        <View style={styles.row}>
          <Button
            title="Cancelar"
            containerStyle={styles.btnDangerContainer}
            buttonStyle={styles.btnDanger}
            onPress={props.onCancel}
            icon={{
              name: "close",
              type: "material-community",
              color: "#FFF",
              size: 22,
            }}
            iconPosition="right"
          />
          <Button
            title="Guardar"
            containerStyle={styles.btnSuccessContainer}
            buttonStyle={styles.btnSuccess}
            icon={{
              name: "map-marker-radius",
              type: "material-community",
              color: "#FFF",
              size: 22,
            }}
            iconPosition="right"
            onPress={saveLocation}
          />
        </View>
      </View>
    </Overlay>
  );
}

const styles = StyleSheet.create({
  overlay: {
    height: "auto",
    width: "90%",
    backgroundColor: "#fff",
  },
  map: {
    width: "100%",
    height: 520,
  },
  dividerArea: {
    flex: 1,
    alignItems: "center",
    marginTop: 10,
  },
  divider: {
    width: "100%",
  },
  row: {
    alignSelf: "center",
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
    width: "90%",
  },
  btnSuccessContainer: {
    width: "50%",
    padding: 10,
  },
  btnDangerContainer: {
    width: "50%",
    padding: 10,
  },
  btnSuccess: {
    backgroundColor: "#0d8e66",
    borderRadius: 5,
  },
  btnDanger: {
    backgroundColor: "red",
    borderRadius: 5,
  },
});
