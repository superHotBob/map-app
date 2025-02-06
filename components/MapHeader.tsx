import { StyleSheet, View, Text } from "react-native"
import React, { useEffect, useState } from "react"
import { SecToMin } from "@/scripts/functions"

interface Props {
    distance: number,
    speed: number,
    path: number,
    type: string
}

const MapHeader: React.FC<Props> = (props) => {
    const {distance , speed, path , type } = props;
    const [time , setTime] = useState(0)
    useEffect(()=>{
        const i = setInterval(() => {
            setTime((prev) => prev + 1);
        },1000);
        return () => {
            clearInterval(i)
        }
    },[time])
    return (
        <View style={styles.distance}>
            {type === 'walking' ?
                <Text style={styles.distance_text}>To back{'\n'}{distance} m</Text>
                :
                <Text style={styles.distance_text}>Speed{'\n'}{speed} km/h</Text>
            }
            <Text style={[styles.distance_text]}>Path{'\n'}{path} m</Text>
            <Text style={styles.distance_text}>Time{'\n'} {SecToMin(time)} </Text>
        </View>
    )
}
const styles = StyleSheet.create({
    distance: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingBottom: 5
    },
    distance_text: {
        fontSize: 23,
        width: '33%',
        textAlign: 'center',
        height: 55,
        fontWeight: 'bold',
        paddingHorizontal: 5,

    },   
});
export default MapHeader;