import MapView, { Circle, Marker, Polyline } from 'react-native-maps';
import { useState, useRef, useEffect } from 'react';
import { View, TouchableHighlight, Text, Dimensions, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
const { height, width } = Dimensions.get('window');


function MapComponent() {
    const refzoom = useRef(null);
    const [typeMap, settypeMap] = useState<string>('standard');
    const [zoom, setZoom] = useState(12);
    const { nodes} = useSelector((state) => state.track);
   
   
    const ZoomUp = async () => {
        let ss = await refzoom.current?.getCamera();
        ss.zoom += 0.7;
        await refzoom.current?.animateCamera(ss);
        setZoom(zoom + 0.7)
    };
    const ZoomDown = async () => {
        let ss = await refzoom.current?.getCamera();
        ss.zoom -= 0.7;
        await refzoom.current?.animateCamera(ss);
        setZoom(zoom - 0.7)
    };
    const setTypeMap = () => {
        settypeMap(typeMap === 'satellite' ? 'standard' : 'satellite')
    };
    return (
        <View>
            <MapView
                ref={refzoom}
                zoomEnabled={false}
                mapType={typeMap}
                style={[styles.map, { height: height - 248 }]}
                region={{
                    latitude: nodes[0].latitude,
                    longitude: nodes[0].longitude,
                    latitudeDelta: 0.02,
                    longitudeDelta: 0.02,
                }}
            >
                <Polyline
                    coordinates={nodes}
                    strokeColor="#3d4eea"
                    strokeWidth={3}
                    lineDashPattern={[10]}
                />
                {nodes.map((i, index) => i.type === 'photo' ?
                    <Marker key={index}
                        coordinate={{
                            latitude: i.latitude,
                            longitude: i.longitude
                        }}
                        calloutOffset={{ x: -15, y: -15 }}
                        image={require('../assets/images/camera.png')}
                    />
                    :
                    <Circle key={index}
                        center={{
                            latitude: i.latitude,
                            longitude: i.longitude
                        }}
                        radius={index === 0 ? 30 * 10 / zoom : (index === nodes.length - 1) ? 30 * 10 / zoom : 30 * 10 / zoom}
                        fillColor={index === 0 ? 'red' : (index === nodes.length - 1) ? '#fff' : 'gold'}
                        strokeColor='yellow'
                        strokeWidth={4}
                    />
                )}
            </MapView>
            {/* <View style={styles.btnContainer}>
                <TouchableHighlight style={styles.btnZoom} onPress={ZoomDown}>
                    <Text style={styles.btnText}>ZOOM -</Text>
                </TouchableHighlight>
                <LinearGradient style={styles.button_map_grad} colors={['#4c669f', '#3b5998', '#192f6a']}>
                    <Ionicons
                        onPress={setTypeMap}
                        name={typeMap === 'standard' ? "earth-outline" : "earth-sharp"}
                        size={30}
                        color='#fff'
                    />
                </LinearGradient>
                <LinearGradient colors={['#4c669f', '#3b5998', '#192f6a']} style={styles.btnZoom} >
                    <Text onPress={ZoomUp} style={styles.btnText}>ZOOM +</Text>
                </LinearGradient>
            </View> */}
        </View>
    )
};


export default MapComponent;

const styles = StyleSheet.create({
    btnZoom: {
        width: '38%',
        height: 50,
        backgroundColor: '#ddd',
        borderRadius: 28,
    },
    btnMap: {
        width: '20%',
        height: 50,
        borderRadius: 28,
    },
    button_map_grad: {
        width: '22%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 28,
        lineHeight: 50
    },
    btnText: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        backgroundColor: 'blue',
        lineHeight: 50,
        color: '#fff',
        borderRadius: 28,
    },
    btnContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 8,

    },
    map: {
        width: '100%',
        marginBottom: 8
    },
});