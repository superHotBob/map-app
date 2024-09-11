import { CameraView, useCameraPermissions } from 'expo-camera';
import { useState, useRef, useEffect } from 'react';
import { Button, StyleSheet, Text, View, Dimensions } from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SQLite from 'expo-sqlite';
const { height, width } = Dimensions.get('window');
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/Colors';

const background = Colors.light.background;

function Camera() {
    const [zoom, setZoom] = useState(1);
    const [flash, setFlash] = useState<string>('off');
    const [facing, setFacing] = useState('front');
    const [permission, requestPermission] = useCameraPermissions();
    const cameraRef = useRef(null)

    useEffect(() => {
        async function GetAlbums() {
            const albums = await MediaLibrary.getAssetsAsync({ album: '587356258' });
            // console.log(albums)
        }
        GetAlbums()
    }, [])
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
    async function takePicture() {

        try {

            const photo = await cameraRef.current!.takePictureAsync();
            const asset = await MediaLibrary.createAssetAsync(photo.uri);
            // console.log(cameraRef.current)
            console.log(photo)
            // const { id } = await MediaLibrary.createAssetAsync(photo.uri);
            // const album_photo = await AsyncStorage.getItem('album_photo');
            // const db = await SQLite.openDatabaseAsync('tracker');
            // if (album_photo) {

            //     const result = await MediaLibrary.addAssetsToAlbumAsync([id], album_photo);

            //     console.log(result);
            // } else {
            //     const album_photo = await MediaLibrary.createAlbumAsync('album_photo', id, false)

            //     console.log(album_photo);
            // }
        } catch (e) {
            console.log(e)
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.zoomBox}>
                <LinearGradient style={styles.plusBtn} colors={background}>
                    <Ionicons onPress={() => setZoom(+zoom.toFixed(1) === 0.0 ? 0.0 : zoom - 0.1)} name="remove-sharp" size={35} color="#fff" />
                </LinearGradient>

                <Text style={styles.text}>{zoom.toFixed(1) * 10}</Text>
                <LinearGradient style={styles.plusBtn} colors={background}>
                    <Ionicons onPress={() => setZoom(+zoom.toFixed(1) === 1.0 ? 1 : zoom + 0.1)} name="add" size={35} color="#fff" />
                </LinearGradient>
            </View>

            <CameraView
                style={[styles.camera, { height: width * 16 / 9 - 225 }]}
                ref={cameraRef}
                zoom={zoom}
                ratio='16:9'
                flash={flash}
                facing={facing}
                enableTorch={true}
            />



            <View style={styles.functions}>
                <LinearGradient style={[styles.plusBtn, styles.ratio]} colors={background}>
                    <Text style={styles.ratioText}>16:9</Text>
                </LinearGradient>
                <LinearGradient style={[styles.plusBtn, styles.flash]} colors={background}>
                    <Ionicons onPress={() => setFacing(facing === 'front' ? 'back' : 'front')} name="camera-reverse-sharp" size={30} color="#fff" />
                </LinearGradient>
                <LinearGradient style={[styles.plusBtn, styles.photo]} colors={background}>
                    <Ionicons onPress={takePicture} name="camera" size={40} color="#fff" />
                </LinearGradient>
                <LinearGradient style={[styles.plusBtn, styles.flash]} colors={background}>
                    <Ionicons onPress={() => setFlash('on')} name={flash === 'on' ? "flash-off" : "flash"} size={30} color="#ddd" />
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
        paddingBottom: 20
    },
    message: {
        textAlign: 'center',
        paddingBottom: 10,
    },
    zoomBox: {
        flexDirection: 'row',

        justifyContent: 'center',
        marginTop: 50,
        alignItems: 'center'
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
        width: 70,
        height: 70,
    },
    flash: {
        width: 50,
        height: 50,
    },
    ratio: {
        width: 70
    },
    ratioText: {
        fontSize: 20,
        color: '#fff'
    },
    text: {
        fontSize: 28,
        width: 60,
        textAlign: 'center',
        fontWeight: 'bold'
    },
    functions: {
        flexDirection: 'row',
        marginTop: 10,
        justifyContent: 'center',
        gap: 15,
        alignItems: 'center'
    }
});
