import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState, useEffect } from 'react'
import { ScrollView } from 'react-native'
import { Button, Icon } from '@rneui/base'
import axios from "../../../../kernel/components/http-client-gateway";
import Loading from '../../../../kernel/components/Loading'
import { FlatList } from "react-native";

export default function RubroAspect({ navigation }) {
  const [aspects, setAspects] = useState([])
  const [show, setShow] = useState(true)
  const [reload, setReload] = useState(false)

  useEffect(() => {
    (async () => {
      axios
        .doGet("/aspect/")
        .then(({ data: { data } }) => {
          const aspects = data.map((aspect) => {
            if (aspect.user != null) {
              return {
                id: aspect.id,
                name: aspect.name,
                status: aspect.status,
                user: aspect.user.fullname,
              }
            } else {
              return {
                id: aspect.id,
                name: aspect.name,
                status: aspect.status,
                user: "Sin responsable",
              }
            }
          })
          const sorted = aspects.sort((a, b) => {
            if (a.fullname < b.name) { return -1; }
            if (a.fullname > b.name) { return 1; }
            return 0;
          })
          setAspects(sorted)
          setShow(false)
        })
    })()
    setReload(false)
  }, [reload])

  const sort = () => {
    let aspectsCopy = [...aspects]
    aspectsCopy.reverse()
    setAspects(aspectsCopy)
  }

  const getAspect = (id) => {
    axios
      .doGet(`/aspect/${id}`)
      .then(({ data: { data } }) => {
        if (data.user != null) {
          navigation.navigate("rubroAspectDataStack", { idAspect: id, status: data.status, name: data.name, userEmail: data.user.email, userFullname: data.user.fullname, setReload: setReload })
        } else {
          navigation.navigate("rubroAspectDataStack", { idAspect: id, status: data.status, name: data.name, setReload: setReload })
        }
      })
  }

  const Item = ({ id, name, user, status }) => {
    return (
      <TouchableOpacity onPress={() => getAspect(id)}>
        <View style={styles.containerAspect}>
          <View style={styles.rowAspect}>
            <View style={{ flexDirection: 'row', alignItems: 'space-between', alignItems: 'center' }}>
              <Icon
                name={status ? "archive-arrow-up-outline" : "archive-arrow-down-outline"}
                type="material-community"
                size={28}
                color={status ? "#002e60" : "#c2c2c2"}
              />
              <View>
                <Text style={styles.aspect}>{name ? name : ""}</Text>
                <Text style={{ marginLeft: 12 }}>Encargado: {user ? user : ""}</Text>
                <Text style={{ marginLeft: 12 }}>Estado: {status ? "Habilitado" : "Deshabilitado"}</Text>
              </View>
            </View>
            <Icon
              name='chevron-right'
              type='material-community'
              size={22}
              color='#002e60'
              onPress={() => getAspect(id)}
            />
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  const renderItem = ({ item }) => (
    <Item id={item.id} name={item.name} user={item.user} status={item.status} />
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false} >
      <View style={styles.headerButtons}>
        <View style={styles.row}>
          <Button
            title="Ordenar"
            icon={{ name: "sort", type: "material-community", size: 18, color: "#FFF" }}
            iconPosition="right"
            buttonStyle={styles.btn}
            containerStyle={styles.btnContainer}
            onPress={() => sort()}
          />
          <Button
            title="Agregar"
            icon={{ name: "plus-circle-outline", type: "material-community", size: 18, color: "#FFF" }}
            iconPosition="right"
            buttonStyle={styles.btn}
            containerStyle={styles.btnContainer}
            onPress={() => navigation.navigate("rubroAspectOneStack", { setReload: setReload })}
          />
        </View>
      </View>
      {aspects.length > 0 ? (
        <View style={styles.mx}>
          <Text style={styles.title}>Lista de aspectos ambientales</Text>
            <ScrollView horizontal={true} style={{ width: "100%" }} showsHorizontalScrollIndicator={false}>
              <View style={styles.flatlistContainer}>
                <FlatList
                  data={aspects}
                  renderItem={renderItem}
                  keyExtractor={item => item.id}
                />
              </View>
            </ScrollView>
        </View>
      ) : (
        <View style={styles.mx}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', marginTop: 32 }}>No hay aspectos</Text>
        </View>
      )}
      <Loading show={show} text={"Cargando rubros"} />
    </ScrollView>
  )
}



const styles = StyleSheet.create({
  row: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',

  },
  headerButtons: {
    flex: 1,
    marginTop: 30,
  },
  container: {
    minHeight: "100%",
    backgroundColor: "#fff"
  },
  mx: {
    marginHorizontal: 10,
    alignSelf: 'center',
  },
  btn: {
    backgroundColor: '#002e60',
    borderRadius: 5,
  },
  btnContainer: {
    marginTop: 8,
    width: "45%",
  },
  rowAspect: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  containerAspect: {
    marginVertical: 8,
    borderBottomColor: 'black',
    borderBottomWidth: 1,
    paddingBottom: 8,
    width: '100%',
  },
  aspect: {
    fontSize: 18,
    marginBottom: 8,
    marginLeft: 12,
  },
  title: {
    fontWeight: 'bold',
    marginTop: 30,
    marginVertical: 20,
    fontSize: 18
  },
  flatlistContainer: {
    minWidth: 324,
  },
});
