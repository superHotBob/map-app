import { StyleSheet, View, Dimensions, Text } from "react-native";
import { SecondsToTime } from "@/hooks/useDB";
import { useSelector } from "react-redux";
import { useFonts } from 'expo-font';
const { height: my_height } = Dimensions.get('window');

type Props = {
    height: number,
    distance: number,
    time: number,
    speed: number,
    setheight: VoidFunction
        
    
}

function RunBlock({ setheight, height, distance, time, speed }:Props) {    
    const [loaded] = useFonts({
        'fredoka': require('../assets/fonts/Fredoka-Bold.ttf'),
      });
    const { weight, braslet } = useSelector(state => state.track);
    if (!loaded) {
        return ;
    }
    return (
        <View style={[styles.mainblock, { height: height }]}>
            <View style={[styles.blockitem, { height: my_height / 4.6 }]}>
                <Text style={styles.textitem}>Speed</Text>
                <Text style={styles.textitem}>{speed.toFixed(0)} km/h</Text>
            </View>
            <View style={[styles.blockitem, { height: my_height / 4.6 }]}>
                <Text style={styles.textitem}>Distance</Text>
                <Text style={styles.textitem}>{distance} m</Text>
            </View>
            <View style={[styles.blockitem, { height: my_height / 4.6 }]}>
                <Text style={styles.textitem}>Time the run</Text>
                <Text style={styles.textitem}>{SecondsToTime(time)}</Text>
            </View>
            <View style={[styles.blockitem, { height: my_height / 4.6 }]}>
                <Text style={styles.textitem}>Average</Text>
                <Text style={styles.textitem}>speed</Text>
                <Text style={styles.textitem}>{((distance / 1000) / ((Date.now() - time) / 1000 / 3600)).toFixed(1)} km/h</Text>
            </View>
            <View style={[styles.blockitem, {backgroundColor: 'red', height: my_height / 4.6 }]}>
                <Text style={styles.textitem}>Calories</Text>
                <Text style={styles.textitem}>burned</Text>
                <Text style={styles.textitem}>{(weight * distance / 1000).toFixed(0)} ccal</Text>
            </View>
            { braslet ? 
                <View style={[styles.blockitem, {backgroundColor: 'green', height: my_height / 4.6 }]}>
                    <Text style={styles.textitem}>Heart Rate</Text>
                    <Text style={styles.textitem}>{100}</Text>
                </View> 
            : null }
            <Text onPress={() => setheight(0)} style={styles.tomap}>VIEW MAP</Text>
        </View>
    )
}
export default RunBlock;

const styles = StyleSheet.create({
    mainblock: {
        position: 'absolute',
        flexDirection: 'row',
        flexWrap: 'wrap',       
           
        top: 50,
        height: 0,
        backgroundColor: '#fff',
        marginHorizontal: 'auto',
        justifyContent: 'space-around',
        overflow: 'hidden'
    },
    blockitem: {
        width: '48%',
        backgroundColor: 'blue',
        borderRadius: 12,
        marginTop: 8,
        alignItems: 'center',
        justifyContent: 'center'
    },
    textitem: {
        fontSize: 25,
        color: '#fff',
        fontFamily: 'fredoka',
        fontWeight: 'bold'
    },
    tomap: {
        width: '98%',
        height: 50,
        backgroundColor: '#ddd',
        fontSize: 25,
        marginTop: 8,
        textAlign: 'center',
        lineHeight: 45,
        borderRadius: 10
    }
})