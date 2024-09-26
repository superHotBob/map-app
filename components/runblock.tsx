import { StyleSheet, View, StatusBar, Text } from "react-native";


function RunBlock({setheight, height, distance, time, speed}) {

    function SecundsToTime(i) {       
        const hours = (i/3600).toFixed(0);       
        const mins = Math.trunc((i - hours*3600)/60);
        const sec = i - hours*3600 - mins*60;       
        return ( hours + ' : ' + mins + ' : ' + sec.toFixed(0)); 
    }
    return (
        <View style={[styles.mainblock, {height:height}]}>
            <View style={[styles.blockitem,{height: height/2.6}]}>
                <Text style={styles.textitem}>Speed</Text>
                <Text style={styles.textitem}>{speed.toFixed(0)} km/h</Text>
            </View>
            <View style={[styles.blockitem,{height: height/2.6}]}>
                <Text style={styles.textitem}>Distance</Text>
                <Text style={styles.textitem}>{distance} m</Text>
            </View>
            <View style={[styles.blockitem,{height: height/2.6}]}>
            <Text style={styles.textitem}>Time</Text>
            <Text style={styles.textitem}>{SecundsToTime(time)}</Text>
            </View>
            <View style={[styles.blockitem,{height: height/2.6}]}>
                <Text style={styles.textitem}>Average</Text>
                <Text style={styles.textitem}>speed</Text>
                <Text style={styles.textitem}>{((distance/1000)/(time/3600)).toFixed(1)} km/h</Text>
            </View>
            <Text onPress={()=>setheight(0)} style={styles.tomap}>To map</Text>
        </View>
    )
}
export default RunBlock;

const styles = StyleSheet.create({
    mainblock: {
        position: 'absolute',
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: 10,
        gap: 12,
        top: StatusBar.currentHeight,
        backgroundColor: '#fff',
        marginHorizontal: 'auto',
        justifyContent: 'space-around',
        overflow: 'hidden'
    },
    blockitem: {
        width: '48%',
        
        backgroundColor: 'blue',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
    textitem: {
        fontSize: 30,
        color: '#fff'
    },
    tomap: {
        width: '98%',
        height: 50,
        backgroundColor: '#ddd',
        fontSize: 25,
        textAlign: 'center',
        lineHeight: 45,
        borderRadius: 10
    }
})