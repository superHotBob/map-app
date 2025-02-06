import { SecToMin } from "@/scripts/functions";
import { useState } from "react";
import { Text, StyleSheet } from "react-native"

export const SongsPlayed = ({sound}) =>{

    // const[timer, setTimer] = useState(0);
    // console.log('timer')
    // if (sound ) { 
    //     sound.setOnPlaybackStatusUpdate((status) => {
    //         if (status.isLoaded) {
    //             setTimer(status.durationMillis - status.positionMillis);

    //         }
    //     });
    // };    
    return (



   
    <Text style={styles.songs_string}>
        -{SecToMin((sound / 1000).toFixed(0))}
    </Text>
   
); };
const styles = StyleSheet.create({
    songs_string: {
        fontSize: 20,
        textAlign: 'center',
        borderBottomColor: "#ae3bec",
        borderBottomWidth: 1,
        color: '#ae3bec',

    },

})