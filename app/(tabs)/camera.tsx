import { CameraView, useCameraPermissions } from 'expo-camera';
import { useState, useRef } from 'react';
import { Button, StyleSheet, Text, View, Dimensions, StatusBar } from 'react-native';
const { width } = Dimensions.get('window');
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/Colors';
import { useDispatch, useSelector } from 'react-redux';
import { addpoint } from '@/reduser';
import * as Location from 'expo-location';
import { router } from 'expo-router';
import * as FileSystem from 'expo-file-system';
import { CreateDB } from '@/hooks/useDB';
const background = Colors.light.background;

function Camera() {
    const cameraRef = useRef(null);
    const dispatch = useDispatch();
    const { name } = useSelector((state)=>state.track);
    const [zoom, setZoom] = useState(0);
    const [ratio, setRatio] = useState(1);
    const [flash, setFlash] = useState<number>(0);
    const [facing, setFacing] = useState(0);
    const [permission, requestPermission] = useCameraPermissions();


    if (!permission) {
        // Camera permissions are still loading.
        return <View />;
    };
    if (!permission.granted) {
        // Camera permissions are not granted yet.
        return (
            <View style={[styles.container,styles.permission]}>
                <Text style={styles.message}>Нужно ваше разрешение на использование камеры</Text>
                <Button onPress={requestPermission} title="Разрешить" />
            </View>
        );
    };

    function Ratio(a: string) {
        if (a === '16:9') {
            return 16 / 9
        } else if (a === '4:3') {
            return 4 / 3
        } else {
            return 1
        }
    }
    async function takePicture() {
        const { uri } = await cameraRef.current!.takePictureAsync();
        const directoryUri = `${FileSystem.documentDirectory}${'images'}${'/'}${name}`;
        let { exists } = await FileSystem.getInfoAsync(directoryUri);
        if( exists ) {
            await FileSystem.moveAsync({from: uri, to: directoryUri +'/' + ratio + '_' + Date.now() + '.jpg'})
        } else {
            CreateDB();
            await FileSystem.makeDirectoryAsync(directoryUri,{intermediates: true});
            await FileSystem.moveAsync({from: uri, to: directoryUri +'/' + ratio + '_' + Date.now() + '.jpg'});
        };       
        const { coords } = await Location.getCurrentPositionAsync({ accuracy: 5 });
        const x = 0.001 - Math.random()/500;
        const point = {
            longitude: coords.longitude +  0.001 - Math.random()/500,
            latitude: coords.latitude +  0.001 - Math.random()/500 ,
            type: 'photo'
        };
        dispatch(addpoint(point));
        router.push('/(tabs)/map');
    };
    return (
        <View style={styles.container}>
            <StatusBar barStyle='light-content' backgroundColor="#000" />
            <View style={styles.zoomBox}>
                <LinearGradient style={[styles.plusBtn, styles.ratio]} colors={background}>
                    <Text onPress={() => setRatio(ratio === 1 ? 4 : ratio === 4 ? 6 : 1)} style={styles.ratioText}>
                        {ratio === 1 ? '1:1' : ratio === 4 ? '4:3' : '16:9'}
                    </Text>
                </LinearGradient>
                <LinearGradient style={styles.plusBtn} colors={background}>
                    <Ionicons onPress={() => setZoom(zoom === 0.0 ? 0 : zoom - 0.1)} name="remove-sharp" size={25} color="#fff" />
                </LinearGradient>
                <Text style={styles.text}>{(zoom * 10).toFixed(0)}</Text>
                <LinearGradient style={styles.plusBtn} colors={background}>
                    <Ionicons onPress={() => setZoom(zoom === 1 ? 1 : zoom + 0.1)} name="add" size={25} color="#fff" />
                </LinearGradient>
                <LinearGradient style={[styles.plusBtn, styles.flash]} colors={background}>
                    <Ionicons onPress={() => setFlash(flash === 1 ? 0 : 1)} name={flash === 1 ? "flash-off" : "flash"} size={25} color="#ddd" />
                </LinearGradient>
                <LinearGradient style={[styles.plusBtn, styles.flash]} colors={background}>
                    <Ionicons onPress={() => setFacing(facing === 1 ? 0 : 1)} name="camera-reverse-sharp" size={25} color="#fff" />
                </LinearGradient>
            </View>
            <CameraView
                style={[styles.camera, { height: width * Ratio(ratio === 1 ? '1:1' : ratio === 4 ? '4:3' : '16:9') }]}
                ref={cameraRef}
                zoom={zoom}
                ratio={ratio === 1 ? '1:1' : ratio === 4 ? '4:3' : '16:9'}
                flash={flash === 0 ? 'off' : 'on'}
                facing={facing === 0 ? 'back' : 'front'}
            />
            <View style={styles.six}>
                <LinearGradient style={[styles.plusBtn, styles.photo]} colors={background}>
                    <Ionicons onPress={takePicture} name="camera" size={40} color="#fff" />
                </LinearGradient>
            </View>
        </View>
    );
};
export default Camera;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        paddingBottom: 20,
        marginTop: StatusBar.currentHeight
    },
    permission: {
        marginTop: 100,
    },
    message: {
        textAlign: 'center',
        paddingBottom: 10,
    },
    zoomBox: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginVertical: 20,
        alignItems: 'center',
        gap: 8
    },
    camera: {
        width: '100%',
    },
    plusBtn: {
        height: 50,
        borderRadius: 50,
        alignItems: 'center',
        width: 50,
        justifyContent: 'center'
    },
    photo: {
        width: 80,
        height: 80,
        justifyContent: 'center',
        marginHorizontal: 'auto',
        borderRadius: 50,
        alignContent: 'center'
    },
    flash: {
        width: 50,
        height: 50,
    },
    ratio: {
        width: 50
    },
    ratioText: {
        fontSize: 18,
        color: '#fff'
    },
    text: {
        fontSize: 30,
        width: 35,
        textAlign: 'center',
        fontWeight: 'bold'
    },
    functions: {
        flexDirection: 'row',
        marginTop: 10,
        justifyContent: 'center',
        gap: 15,
        alignItems: 'center',
        width: '100%'
    },
    six: {
        position: 'absolute',
        bottom: 20,
        width: '100%'
    }
});
