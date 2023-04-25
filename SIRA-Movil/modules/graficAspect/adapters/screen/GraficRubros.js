import { ScrollView, StyleSheet, Text, View, Linking, Dimensions } from "react-native";
import React, { useState, useEffect } from "react";
import Filter from "../../../../kernel/components/Filter";
import axios from "../../../../kernel/components/http-client-gateway";
import { BarChart } from "react-native-chart-kit";
import Loading from "../../../../kernel/components/Loading";
import { Button, Input, Icon } from "@rneui/base";
import { isEmpty } from "lodash";
import StartDateCalendar from "./components/StartDateCalendar";
import EndDateCalendar from "./components/EndDateCalendar";

export default function GraficRubros(props) {
  const { navigation } = props;
  const [showErrorText, setShowErrorText] = useState(false);
  const [showStartDateCalendar, setShowStartDateCalendar] = useState(false);
  const [showEndDateCalendar, setShowEndDateCalendar] = useState(false);
  const [show, setShow] = useState(false);
  const [data, setData] = useState({});
  const [isNotNull, setIsNotNull] = useState(false);

  function daysInMonth(month, year) {
    return new Date(year, month, 0).getDate();
  }

  let month = new Date().getMonth() + 1;
  if (month < 10) {
    month = `0${month}`;
  }
  let year = new Date().getFullYear();
  let day = daysInMonth(month, year);
  let first_date = `${year}-${month}-01`;
  let last_date = `${year}-${month}-${day}`;
  const [first_Date, setFirst_Date] = useState(first_date);
  const [last_Date, setLast_Date] = useState(last_date);

  const getStadistics = () => {
    if (!isEmpty(first_Date) || !isEmpty(last_Date)) {
      setShow(true);
      setIsNotNull(false);
      axios
        .doGet("/aspect/")
        .then(({ data: { data } }) => {
          let labels = [];
          let datasets = [];
          data.forEach((aspect) => {
            axios
              .doGet(`/report/aspect/${aspect.name}/${first_Date}/${last_Date}`)
              .then(({ data: { data } }) => {
                if (data > 0) {
                  setIsNotNull(true);
                }
                labels.push(aspect.name);
                datasets.push(data);
                setData({
                  labels: labels,
                  datasets: [
                    {
                      data: datasets,
                    },
                  ],
                });
              });
          });
          setShow(false);
        })
        .catch((error) => {
          console.log(error);
        });
      setShowErrorText(false);
    } else {
      setShowErrorText(true);
    }
  };

  const chartConfig = {
    backgroundGradientFrom: "#fff",
    backgroundGradientTo: "#fff",
    backgroundGradientFromOpacity: 0,
    backgroundGradientToOpacity: 0,
    color: (opacity = 1) => `rgba(35, 155, 86, ${opacity})`,
  };

  const downLoadPdf = () => {
    setShow(true);
    Linking.openURL(`http://172.20.10.2:8080/api-sira/report/generateReport/${first_Date}/${last_Date}`)
    setShow(false);
  }

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.mx}>
          <Text style={styles.header}>Gráfica de Reportes</Text>
          <View style={styles.dateContainer}>
            <Text style={styles.label}>Seleccione la fecha inicial</Text>
            <View style={styles.row}>
              <Text style={styles.date}>{first_Date ? first_Date : ''}</Text>
              <Button
                buttonStyle={styles.btnCalendar}
                containerStyle={styles.btnCalendarContainer}
                icon={{
                  name: "calendar",
                  type: "material-community",
                  color: "#fff",
                }}
                onPress={() => {
                  setShowStartDateCalendar(true);
                }}
              />
            </View>
            {showErrorText ? (
              <Text style={styles.errorText}>Campo obligatorio</Text>
            ) : (
              <></>
            )}
          </View>
          <View style={styles.dateContainer}>
            <Text style={styles.label}>Seleccione la fecha final</Text>
            <View style={styles.row}>
              <Text style={styles.date}>{last_Date ? last_Date : ''}</Text>
              <Button
                buttonStyle={styles.btnCalendar}
                containerStyle={styles.btnCalendarContainer}
                icon={{
                  name: "calendar",
                  type: "material-community",
                  color: "#fff",
                }}
                onPress={() => {
                  setShowEndDateCalendar(true);
                }}
              />
            </View>
            {showErrorText ? (
              <Text style={styles.errorText}>Campo obligatorio</Text>
            ) : (
              <></>
            )}
          </View>
          {data.labels && data.datasets ? (
            <ScrollView
              horizontal={true}
              style={{ width: "100%" }}
              showsHorizontalScrollIndicator={false}
            >
              <BarChart
                data={data}
                width={Dimensions.get("window").width}
                height={320}
                fromZero={true}
                style={styles.graphStyle}
                chartConfig={chartConfig}
              />
            </ScrollView>
          ) : (
            <></>
          )}
          <Button
            title="Cargar gráfica"
            icon={{
              name: "reload",
              type: "material-community",
              color: "#fff",
            }}
            iconPosition="right"
            buttonStyle={styles.btn}
            containerStyle={styles.btnContainer}
            onPress={() => {
              getStadistics();
            }}
          />
          {(isNotNull ? (
            <Button
              title="Descargar PDF"
              icon={{
                name: "download",
                type: "material-community",
                color: "#fff",
              }}
              iconPosition="right"
              buttonStyle={styles.btn}
              containerStyle={styles.btnContainer}
              onPress={() => {
                downLoadPdf();
              }}
            />
          ) : (
            <></>
          ))}
        </View>
      </ScrollView>
      <StartDateCalendar show={showStartDateCalendar} onCancel={() => setShowStartDateCalendar(false)} date={first_Date} endDate={last_Date} onSave={(selected) => { setFirst_Date(selected) }} />
      <EndDateCalendar show={showEndDateCalendar} onCancel={() => setShowEndDateCalendar(false)} date={last_Date} firstDate={first_Date} onSave={(selected) => { setLast_Date(selected); }} />
      <Loading show={show} text="Cargando" />
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
  },
  dateContainer: {
    marginBottom: 16,
  },
  errorText: {
    color: 'red',
  },
  label: {
    marginBottom: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  date: {
    width: "80%",
    borderWidth: 1,
    borderRadius: 5,
    padding: 8,
    marginRight: 14,
    fontSize: 16,
  },
  btnCalendarContainer: {
    width: "16%",
  },
  btnCalendar: {
    backgroundColor: "#002e60",
    borderRadius: 5,
  },
  header: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 24,
  },
  graphStyle: {
    marginTop: 25,
    borderRadius: 0,
  },
  btnContainer: {
    alignSelf: "center",
    width: "80%",
    marginTop: 16,
  },
  btn: {
    backgroundColor: "#002e60",
    borderRadius: 5,
  },
});
