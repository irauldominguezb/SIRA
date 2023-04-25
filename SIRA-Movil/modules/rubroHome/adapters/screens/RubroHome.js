import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Linking,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Button, Icon } from "@rneui/base";
import Loading from "../../../../kernel/components/Loading";
import Filter from "../../../../kernel/components/Filter";
import axios from "../../../../kernel/components/http-client-gateway";
import { FlatList } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setDate } from "../../../../kernel/setDate";

export default function RubroHome(props) {
  const status = ["Pendientes", "Finalizados", "Todos"];
  const { navigation } = props;
  const [reports, setReports] = useState([]);
  const [show, setShow] = useState(true);
  const [aspectName, setAspectName] = useState("");
  const [aspectId, setAspectId] = useState(0);

  const itemSelector = (item) => {
    (async () => {
      const session = await AsyncStorage.getItem("@session");
      axios
        .doGet(`/aspect/user/${JSON.parse(session).user.id}`)
        .then(({ data: { data } }) => {
          if (data !== null) {
            setAspectName(data.name);
            setAspectId(data.id);
            if (item === "Pendientes") {
              axios
                .doGet(`/report/aspect/${data.name}/status/true`)
                .then(({ data: { data } }) => {
                  const reports = data.map((report) => {
                    return {
                      id: report.id,
                      date: report.date_start,
                      place: report.location_description,
                      latitude: report.latitude,
                      longitude: report.longitude,
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
            } else if (item === "Finalizados") {
              axios
                .doGet(`/report/aspect/${data.name}/status/false`)
                .then(({ data: { data } }) => {
                  const reports = data.map((report) => {
                    return {
                      id: report.id,
                      date: report.date_start,
                      place: report.location_description,
                      latitude: report.latitude,
                      longitude: report.longitude,
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
              axios
                .doGet(`/report/aspect/${data.name}/`)
                .then(({ data: { data } }) => {
                  const reports = data.map((report) => {
                    return {
                      id: report.id,
                      date: report.date_start,
                      place: report.location_description,
                      latitude: report.latitude,
                      longitude: report.longitude,
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
          } else {
            setShow(false);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    })();
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      itemSelector();
    });
  }, []);

  const getReport = (id) => {
    axios
      .doGet(`/report/${id}/`)
      .then(({ data: { data } }) => {
        navigation.navigate("rubroReportStack", {
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
  function daysInMonth(month, year) {
    return new Date(year, month, 0).getDate();
  }

  const downloadReport = () => {
    setShow(true);
    let initialMonth = new Date().getMonth() + 1;
    let initialYear = new Date().getFullYear();
    if (initialMonth < 10) {
      initialMonth = `0${initialMonth}`;
    }
    let day = daysInMonth(initialMonth, initialYear);
    let first_date = `${initialYear}-${initialMonth}-01`;
    let last_date = `${initialYear}-${initialMonth}-${day}`;
    Linking.openURL(
      `http://172.20.10.2:8080/api-sira/report/generateReport/${aspectId}/${first_date}/${last_date}`
    );
    setShow(false);
  };

  return (
    <View style={styles.container}>
      <Filter
        title={"Filtro"}
        contenido={status}
        text={"Selecciona una opción"}
        itemSelector={itemSelector}
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        {reports.length > 0 ? (
          <View style={styles.mx}>
            <Text style={styles.titleFlatlist}>
              Lista de reportes de {aspectName}
            </Text>
            <ScrollView
              horizontal={true}
              style={{ width: "100%" }}
              showsHorizontalScrollIndicator={false}
            >
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
            {aspectName != "" ? (
              <Text style={{ fontSize: 18, fontWeight: "bold", marginTop: 32 }}>
                No hay reportes
              </Text>
            ) : (
              <Text style={{ fontSize: 18, fontWeight: "bold", marginTop: 32 }}>
                Sin aspecto asignado
              </Text>
            )}
          </View>
        )}
      </ScrollView>
      <Loading show={show} text={"Cargando reportes"} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFF",
    height: "100%",
  },
  mx: {
    marginHorizontal: 32,
    alignSelf: "center",
  },
  title: {
    fontWeight: "bold",
    fontSize: 20,
    textAlign: "center",
    margin: 16,
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
  map: {
    width: "100%",
    height: 520,
  },
  titleFlatlist: {
    fontWeight: "bold",
    marginBottom: 20,
    fontSize: 18,
    textAlign: "left",
  },
});
