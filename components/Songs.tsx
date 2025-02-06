import { SecToMin } from "@/scripts/functions";
import { useState } from "react";
import { Text, StyleSheet } from "react-native"

export const Songs = ({songs}) => (



   
    <Text style={styles.songs_string}>{songs} SONGS</Text>
   
)
const styles = StyleSheet.create({
    songs_string: {
        fontSize: 20,
        textAlign: 'center',
        borderBottomColor: "#ae3bec",
        borderBottomWidth: 1,
        color: '#ae3bec',

    },

})