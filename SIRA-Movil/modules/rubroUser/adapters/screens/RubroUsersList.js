import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { ScrollView } from 'react-native'
import { Avatar, Button, Icon } from '@rneui/base'
import axios from "../../../../kernel/components/http-client-gateway";
import Loading from '../../../../kernel/components/Loading'
import { FlatList } from "react-native";

export default function RubroUsersList({ navigation }) {
  const [users, setUsers] = useState([])
  const [show, setShow] = useState(true)
  const [reload, setReload] = useState(false)

  useEffect(() => {
    (async () => {
      axios
        .doGet("/user/")
        .then(({ data: { data } }) => {
          const users = data.map((user) => {
            return {
              id: user.id,
              fullname: user.fullname,
              email: user.email
            }
          })
          const sorted = users.sort((a, b) => {
            if (a.fullname < b.fullname) { return -1; }
            if (a.fullname > b.fullname) { return 1; }
            return 0;
          })
          setUsers(sorted)
          setShow(false)
        })
    })();
    setReload(false)
  }, [reload])

  const sort = () => {
    let usersCopy = [...users]
    usersCopy.reverse()
    setUsers(usersCopy)
  }

  const getUser = (id) => {
    axios
      .doGet(`/user/${id}`)
      .then(({ data: { data } }) => {
        navigation.navigate("rubroDataUserStack", { id: id, fullname: data.fullname, email: data.email, status: data.status, role: data.role, setReload: setReload })
      })
  }

  const Item = ({ id, fullname, email }) => {
    let initials = fullname.charAt(0) + fullname.charAt(fullname.indexOf(" ") + 1);
    return (
      <TouchableOpacity onPress={() => getUser(id)}>
        <View style={styles.containerUser}>
          <View style={styles.rowUser}>
            <View style={{ flexDirection: 'row', alignItems: 'space-between', alignItems: 'center' }}>
              <Avatar rounded title={fullname ? initials : ""} containerStyle={{ backgroundColor: '#002e60' }} />
              <View>
                <Text style={styles.user}>{fullname ? fullname : ""}</Text>
                <Text style={{ marginLeft: 12 }}>{email ? email : ""}</Text>
              </View>
            </View>
            <Icon
              name='chevron-right'
              type='material-community'
              size={22}
              color='#002e60'
              onPress={() => getUser(id)}
            />
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  const renderItem = ({ item }) => (
    <Item id={item.id} fullname={item.fullname} email={item.email} />
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
            icon={{ name: "account-plus", type: "material-community", size: 18, color: "#FFF" }}
            iconPosition="right"
            buttonStyle={styles.btn}
            containerStyle={styles.btnContainer}
            onPress={() => navigation.navigate("rubroUserOneStack", { setReload: setReload })}
          />
        </View>
      </View>
      {users.length > 0 ? (
        <View style={styles.mx}>
          <Text style={styles.title}>Lista de responsables</Text>
          <ScrollView horizontal={true} style={{ width: "100%" }} showsHorizontalScrollIndicator={false}>
            <View style={styles.flatlistContainer}>
              <FlatList
                data={users}
                renderItem={renderItem}
                keyExtractor={item => item.id}
              />
            </View>
          </ScrollView>
        </View>
      ) : (
        <View style={styles.mx}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', marginTop: 32 }}>No hay usuarios</Text>
        </View>
      )}

      <Loading show={show} text={"Cargando usuarios"} />
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
  rowUser: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  containerUser: {
    marginVertical: 8,
    borderBottomColor: 'black',
    borderBottomWidth: 1,
    paddingBottom: 8,
    width: '100%',
  },
  user: {
    fontSize: 18,
    marginBottom: 8,
    marginLeft: 12,
  },
  flatlistContainer: {
    minWidth: 324,
  },
  title: {
    fontWeight: 'bold',
    marginTop: 30,
    marginVertical: 20,
    fontSize: 18
  },
});
