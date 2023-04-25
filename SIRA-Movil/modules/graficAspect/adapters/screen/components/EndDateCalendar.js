import { StyleSheet, Text, View } from 'react-native'
import React, { useState, useMemo, useEffect } from 'react'
import { Button, Overlay } from '@rneui/base';
import { Calendar, LocaleConfig } from "react-native-calendars";

export default function EndDateCalendar(props) {
  const { show, date, firstDate } = props;
  const [today, setToday] = useState(new Date());
  const [selected, setSelected] = useState(date);

  useEffect(() => {
    setSelected(date);
  }, [date]);

  LocaleConfig.locales['es'] = {
    monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
    monthNamesShort: ['Ene.', 'Feb.', 'Mar.', 'Abr.', 'May.', 'Jun.', 'Jul.', 'Ago.', 'Sep.', 'Oct.', 'Nov.', 'Dic.'],
    dayNames: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
    dayNamesShort: ['Dom.', 'Lun.', 'Mar.', 'Mié.', 'Jue.', 'Vie.', 'Sáb.'],
    today: 'Hoy'
  };

  LocaleConfig.defaultLocale = 'es';

  const getLastDay = () => {
    let date = new Date();
    let lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    return lastDay;
  }

  const marked = useMemo(() => ({
    [selected]: {
      selected: true,
      selectedColor: '#002e60',
      selectedTextColor: '#fff',
    }
  }), [selected]);

  const saveDate = () => {
    props.onSave(selected);
    props.onCancel();
  };

  return (
    <Overlay
      isVisible={show}
      windowsBackgroundColor='rgb(0,0,0,0.5)'
      overlayBackgroundColor='transparent'
      overlayStyle={styles.overlay}
    >
      <Calendar
        initialDate={today}
        minDate={firstDate}
        maxDate={getLastDay()}
        disableAllTouchEventsForDisabledDays={true}
        markedDates={marked}
        onDayPress={(day) => {
          setSelected(day.dateString);
        }}
        {...props}
        theme={{
          arrowColor: '#002e60',
          textSectionTitleColor: '#002e60',
          'stylesheet.calendar.header': {
            dayTextAtIndex0: {
              color: 'gray'
            },
            dayTextAtIndex6: {
              color: 'gray'
            }
          },
          'stylesheet.day.basic': {
            todayText: {
              color: '#002e60',
              fontWeight: 'bold',
            },
          },
        }}
      />
      <View style={styles.container} >
        <View style={styles.row}>
          <Button
            title='Seleccionar'
            titleStyle={styles.title}
            onPress={saveDate}
            icon={{
              type: 'material-community',
              name: 'check',
              color: '#fff',
              size: 18,
              weight: 'bold',
            }}
            iconPosition='right'
            buttonStyle={styles.btnSelect}
            containerStyle={styles.btnContainer}
          />
          <Button
            title='Cerrar'
            titleStyle={styles.title}
            onPress={props.onCancel}
            icon={{
              type: 'material-community',
              name: 'close',
              color: '#fff',
              size: 18,
              weight: 'bold',
            }}
            iconPosition='right'
            buttonStyle={styles.btnClose}
            containerStyle={styles.btnContainer}
          />
        </View>
      </View>
    </Overlay>
  )
}

const styles = StyleSheet.create({
  overlay: {
    height: 450,
    width: 300,
    backgroundColor: '#fff',
    borderColor: '#fff',
    borderWidth: 2,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  title: {
    fontSize: 14,
  },
  btnSelect: {
    backgroundColor: '#002e60',
    borderRadius: 5,
  },
  btnClose: {
    backgroundColor: 'gray',
    borderRadius: 5,
  },
  btnContainer: {
    marginHorizontal: 5,
  },
})