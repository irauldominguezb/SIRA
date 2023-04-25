import { StyleSheet, Text, View } from 'react-native'
import React from "react";
import SelectDropdown from "react-native-select-dropdown";

export default function Filter(props) {
    const { contenido, text, title, itemSelector, search } = props

    return (
        <View style={styles.rowFilter}>
            {title && <Text style={styles.subtitle}>{title}</Text>}
            {/* https://www.npmjs.com/package/react-native-select-dropdown  aquí está la documentación*/}
            <SelectDropdown
                data={contenido}
                defaultButtonText={text} 
                buttonStyle={styles.dropdownBtnStyle}
                onSelect={(selectedItem, index) => {
                    itemSelector(selectedItem);
                }}
                buttonTextAfterSelection={(selectedItem, index) => {
                    return selectedItem;
                }}
                rowTextForSelection={(item, index) => {
                    return item;
                }}
                search={search}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    rowFilter: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginVertical: 30,
    },
    subtitle: {
        textAlign: "left",
        fontSize: 16,
        marginRight: 30,
        alignSelf: "center",
    },
    dropdownBtnStyle: {
        backgroundColor: "#FFF",
        borderColor: "#002e60",
        borderWidth: 2,
        borderRadius: 5,
        width: "64%",
        height: 35,
    },
});