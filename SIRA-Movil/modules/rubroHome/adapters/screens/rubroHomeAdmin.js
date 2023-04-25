import { StyleSheet, Text, View, ScrollView, FlatList, TouchableOpacity, Linking } from "react-native";
import React, { useState, useEffect } from "react";
import axios from "../../../../kernel/components/http-client-gateway";
import Loading from "../../../../kernel/components/Loading";
import Filter from "../../../../kernel/components/Filter";
import { Icon, Button } from "@rneui/base";
import { setDate } from "../../../../kernel/setDate";

export default function rubroHomeAdmin(props) {
  const [aspects, setAspects] = useState([]);
  const [reports, setReports] = useState([]);
  const [aspect, setAspect] = useState("Todos")
  const [titleReports, setTitleReports] = useState("Lista de todos los reportes");
  const [show, setShow] = useState(true);
  const { navigation } = props;
  const [aspectosConId, setAspectosConId] = useState([])

  const getAspects = () => {
    axios
      .doGet("/aspect/")
      .then(({ data: { data } }) => {
        const aspectosConId = data.map((aspect) => {
          return {
            id: aspect.id,
            aspect: aspect.name,
          };
        });
        setAspectosConId(aspectosConId);
        const aspectos = data.map((aspect) => {
          return aspect.name;
        });
        setAspects(aspectos);
        setAspects((aspects) => [...aspects, "Todos"]);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const itemSelector = (item) => {
    setAspect(item)
    if (item === "Todos") {
      setTitleReports("Lista de todos los reportes");
      axios
        .doGet("/report/")
        .then(({ data: { data } }) => {
          const reports = data.map((report) => {
            return {
              id: report.id,
              date: report.date_start,
              place: report.location_description,
            };
          });
          reports.sort((a, b) => {
            return new Date(b.date) - new Date(a.date);
          });
          setReports(reports);
          setShow(false);
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      setTitleReports(`Lista de reportes de ${item}`);
      axios
        .doGet(`/report/aspect/${item}/`)
        .then(({ data: { data } }) => {
          const reports = data.map((report) => {
            return {
              id: report.id,
              date: report.date_start,
              place: report.location_description,
            };
          });
          reports.sort((a, b) => {
            return new Date(b.date) - new Date(a.date);
          });
          setReports(reports);
          setShow(false);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      getAspects();
      itemSelector("Todos");
    })
  }, []);



  const Item = ({ id, date, place }) => {
    return (
      <TouchableOpacity onPress={() => getReport(id)}>
        <View style={styles.containerReport}>
          <View style={styles.rowReport}>
            <Text style={styles.report}>
              Reporte {date ? setDate(date) : ""}
            </Text>
            <Icon
              name="chevron-right"
              type="material-community"
              size={22}
              color="#002e60"
              onPress={() => getReport(id)}
            />
          </View>
          <Text>{place ? place : ""}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderItem = ({ item }) => (
    <Item id={item.id} date={item.date} place={item.place} />
  );

  const getReport = (id) => {
    axios
      .doGet(`/report/${id}/`)
      .then(({ data: { data } }) => {
        navigation.navigate("rubroReportAdminStack", {
          id: id,
          name: data.aspect.name,
          description: data.description,
          dateStart: data.date_start,
          locationDescription: data.location_description,
          photo: data.photo,
          dateEnd: data.date_end,
          status: data.status,
          longitude: data.longitude,
          latitude: data.latitude,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  function daysInMonth(month, year) {
    return new Date(year, month, 0).getDate();
  }

  const downloadReport = () => {
    setShow(true);
    let initialMonth = new Date().getMonth() + 1;
    let initialYear = new Date().getFullYear();
    if (initialMonth < 10) {
      initialMonth = `0${initialMonth}`
    }
    let day = daysInMonth(initialMonth, initialYear)
    let first_date = `${initialYear}-${initialMonth}-01`
    let last_date = `${initialYear}-${initialMonth}-${day}`
    if (aspect !== "Todos"){
      for (let i = 0; i < aspectosConId.length; i++) {
      if(aspectosConId[i].aspect === aspect){
        Linking.openURL(`http://172.20.10.2:8080/api-sira/report/generateReport/${aspectosConId[i].id}/${first_date}/${last_date}`) 
        setShow(false);
        }
      }
    }else{
      Linking.openURL(`http://172.20.10.2:8080/api-sira/report/generateReport/${first_date}/${last_date}`)
      setShow(false);
    }
  }

  return (
    <View style={styles.container}>
      <Filter title="Aspectos" contenido={aspects} text={"Selecciona un aspecto"} itemSelector={itemSelector} />
      <ScrollView showsVerticalScrollIndicator={false}>
        {reports.length > 0 ? (
          <View style={styles.mx}>
            <Text style={styles.title}>
              {titleReports ? titleReports : ""}
            </Text>
            <ScrollView horizontal={true} style={{ width: "100%" }} showsHorizontalScrollIndicator={false}>
              <View style={styles.flatlistContainer}>
                <FlatList
                  data={reports}
                  renderItem={renderItem}
                  keyExtractor={(item) => item.id}
                />
              </View>
            </ScrollView>
            <Button
              title="Generar resumen mensual"
              containerStyle={styles.btnContainer}
              buttonStyle={styles.btn}
              icon={{
                name: "file-pdf-box",
                type: "material-community",
                color: "#FFF",
                size: 22,
              }}
              iconPosition="right"
              onPress={() => downloadReport()}
            />
          </View>
        ) : (
          <View style={styles.mx}>
            <Text style={styles.noReports}>
              No hay reportes
            </Text>
          </View>
        )}
      </ScrollView>
      <Loading show={show} text={"Cargando"} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    height: "100%",
  },
  mx: {
    marginHorizontal: 32,
    alignSelf: "center",
  },
  title: {
    fontWeight: "bold",
    marginBottom: 20,
    fontSize: 18,
    textAlign: "left",
  },
  btnContainer: {
    flex: 1,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    marginVertical: 20,
  },
  btn: {
    backgroundColor: "#002e60",
    borderRadius: 5,
  },
  rowReport: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  containerReport: {
    marginVertical: 8,
    borderBottomColor: "black",
    borderBottomWidth: 1,
    paddingBottom: 8,
    width: "100%",
  },
  report: {
    fontSize: 18,
    marginBottom: 8,
  },
  flatlistContainer: {
    minWidth: 324,
  },
  noReports: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 32
  }
});
