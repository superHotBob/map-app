import { CameraView, useCameraPermissions } from 'expo-camera';
import { useState, useRef, useEffect } from 'react';
import { Button, StyleSheet, Text, View, Dimensions, StatusBar } from 'react-native';
import * as MediaLibrary from 'expo-media-library';
const { width } = Dimensions.get('window');
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/Colors';
import { useDispatch, useSelector } from 'react-redux';
import { addpoint } from '@/reduser';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';

const background = Colors.light.background;

function Camera() {
    const [zoom, setZoom] = useState(0);
    const [ratio, setRatio] = useState('1:1');
    const [flash, setFlash] = useState<string>('off');
    const [facing, setFacing] = useState('back');
    const [permission, requestPermission] = useCameraPermissions();
    const cameraRef = useRef(null)
    const nodes = useSelector((state) => state.track.nodes)
    const dispatch = useDispatch();
    StatusBar.setBarStyle('dark-content');

    if (!permission) {
        // Camera permissions are still loading.
        return <View />;
    };
    if (!permission.granted) {
        // Camera permissions are not granted yet.
        return (
            <View style={styles.container}>
                <Text style={styles.message}>We need your permission to show the camera</Text>
                <Button onPress={requestPermission} title="grant permission" />
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
        try {
            
            const photo = await cameraRef.current!.takePictureAsync();
            const asset = await MediaLibrary.createAssetAsync(photo.uri);
            await MediaLibrary.addAssetsToAlbumAsync([asset.id], '587356258', false);
            const data = await Location.getCurrentPositionAsync({});
            const point = {
                longitude: data.coords.longitude + (0.01 - Math.random() / 50),
                latitude: data.coords.latitude + (0.01 + Math.random() / 50),
                type: 'photo'
            };
            dispatch(addpoint(point));            
        } catch (e) {
            console.log(e)
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.zoomBox}>
                <LinearGradient style={[styles.plusBtn, styles.ratio]} colors={background}>
                    <Text onPress={() => setRatio(ratio === '16:9' ? '1:1' : ratio === '1:1' ? '4:3' : '16:9')} style={styles.ratioText}>{ratio}</Text>
                </LinearGradient>
                <LinearGradient style={styles.plusBtn} colors={background}>
                    <Ionicons onPress={() => setZoom(zoom === 0.0 ? 0 : zoom - 0.1)} name="remove-sharp" size={25} color="#fff" />
                </LinearGradient>
                <Text style={styles.text}>{(zoom*10).toFixed(0)}</Text>
                <LinearGradient style={styles.plusBtn} colors={background}>
                    <Ionicons onPress={() => setZoom(zoom === 1 ? 1 : zoom + 0.1)} name="add" size={25} color="#fff" />
                </LinearGradient>
                <LinearGradient style={[styles.plusBtn, styles.flash]} colors={background}>
                    <Ionicons onPress={() => setFlash('on')} name={flash === 'on' ? "flash-off" : "flash"} size={25} color="#ddd" />
                </LinearGradient>
                <LinearGradient style={[styles.plusBtn, styles.flash]} colors={background}>
                    <Ionicons onPress={() => setFacing(facing === 'front' ? 'back' : 'front')} name="camera-reverse-sharp" size={25} color="#fff" />
                </LinearGradient>
            </View>
            <CameraView
                style={[styles.camera, { height: width * Ratio(ratio) }]}
                ref={cameraRef}
                zoom={zoom}
                ratio={ratio}
                flash={flash}
                facing={facing}
                enableTorch={true}
            />
            <View style={[styles.functions, ratio === '16:9' ? styles.six : null]}>               
                <LinearGradient style={[styles.plusBtn, styles.photo]} colors={background}>
                    <Ionicons disabled={nodes.length === 0} onPress={takePicture} name="camera" size={40} color="#fff" />
                </LinearGradient>               
            </View>
        </View>
    );
};
export default Camera;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
        paddingBottom: 20,
        marginTop: StatusBar.currentHeight,
    },
    message: {
        textAlign: 'center',
        paddingBottom: 10,
    },
    zoomBox: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: StatusBar.currentHeight,
        alignItems: 'center',
        gap: 8
    },
    camera: {
        width: '100%',
        marginTop: 10
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
    },
    flash: {
        width: 50,
        height: 50,
    },
    ratio: {
        width: 50
    },
    ratioText: {
        fontSize: 20,
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
        bottom: 20
    }
});
