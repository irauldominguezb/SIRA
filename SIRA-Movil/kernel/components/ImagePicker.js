import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Button, Image } from "@rneui/base";
import * as ImagePicker from "expo-image-picker";
import * as MediaLibrary from 'expo-media-library'

function App(props) {
  const { getPhoto } = props; 
  const [pickedImagePath, setPickedImagePath] = useState("");

  const showImagePicker = async () => {
    const {status} = await MediaLibrary.requestPermissionsAsync()
    if (status === "denied") {
      alert("Se han negado los permisos para acceder a la galería de imágenes");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync();

    if (!result.canceled) {
      setPickedImagePath(result.uri);
      getPhoto(result.uri);
    }
  };

  const openCamera = async () => {
    const {status} = await MediaLibrary.requestPermissionsAsync()
    if (status === "denied") {
      alert("Se han negado los permisos para acceder a la cámara");
      return;
    }
    const result = await ImagePicker.launchCameraAsync();
    console.log(result);
    if (!result.canceled) {
      setPickedImagePath(result.uri);
      getPhoto(result.uri);
    }
  };

  return (
    <View style={styles.screen}>
      <View style={styles.row} >
        <Button
          title="Seleccionar imagen"
          icon={{
            name: "image-plus",
            type: "material-community",
            size: 22,
            color: "white",
          }}
          iconPosition="right"
          buttonStyle={styles.btn}
          containerStyle={styles.btnContainer2}
          onPress={showImagePicker}
        />
        <Button
          icon={{
            name: "camera",
            type: "material-community",
            size: 22,
            color: "white",
          }}
          buttonStyle={styles.btnRow}
          containerStyle={styles.btnContainer}
          onPress={openCamera}
        />
      </View>
      <View style={styles.imageContainer}>
        {pickedImagePath !== "" && (
          <Image source={{ uri: pickedImagePath }} style={styles.image} />
        )}
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "90%",
  },
  imageContainer: {
    marginVertical: 10,
  },
  image: {
    width: 280,
    height: 280,
    resizeMode: "cover",
  },
  row: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 10,
    alignItems: "center",
    alignSelf: "center",
  },
  btnRow: {
    color: "#FFF",
    backgroundColor: "#002e60",
    borderRadius: 5,
  },
  btn: {
    backgroundColor: '#002e60',
    borderRadius: 5,
  },
  btnContainer: {
    marginLeft: 10,
    width: '20%',
  },
  btnContainer2: {
    flex: 1,
    alignSelf: 'center',
    justifyContent: 'center',
    marginVertical: 0,
    width: '60%',
  },
});

export default App;
