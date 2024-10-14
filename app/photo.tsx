import { View, Text, StyleSheet, Dimensions, TouchableOpacity, ScrollView, ImageBackground, Pressable, StatusBar, Button } from 'react-native';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import * as MediaLibrary from 'expo-media-library';
import { useState, useEffect, useCallback } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import * as SQLite from 'expo-sqlite';
import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message';

import Animated, {
    withTiming,
    useSharedValue,
    useAnimatedStyle,
} from 'react-native-reanimated';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { Duration } from '@/hooks/useDB';
import AsyncStorage from '@react-native-async-storage/async-storage';


const { width, height } = Dimensions.get('window');


const Carusel = () => {
    const scale = useSharedValue(1);
    const startScale = useSharedValue(0);
    const [result, setResult] = useState(false);
    const [assets, setAssets] = useState<Array<{ id: string, uri: string }>>([]);
    const [idImage, setIdImage] = useState(false)


    const { date = Date.now(), } = useLocalSearchParams();
    const path_date = (i) => (new Date(+i)).toLocaleString('ru-RU',
        { dateStyle: 'short', timeStyle: 'short', timeZone: "Europe/Minsk" }
    );


    const { type, start, end, name, id: id_path, path } = useLocalSearchParams();

    useFocusEffect(
        useCallback(() => {
            async function GetAssets() {               
                const id = await AsyncStorage.getItem('photo');                
                const { assets } = await MediaLibrary.getAssetsAsync({ album: id });               
                const new_assets = assets.filter(i => i.modificationTime > +start && i.modificationTime < +end)
                setAssets([...new_assets]);
            };
            GetAssets();
        }, [result])
    );

    async function DeletePath() {
        const db = await SQLite.openDatabaseAsync('tracker', {
            useNewConnection: true
        });
        await db.runAsync(`delete from paths where id = ${id_path}`);
        const ids = assets.map(i => i.id);
        await MediaLibrary.deleteAssetsAsync(ids);
        Toast.hide();
    };

    async function DeleteImage() {
        const result = await MediaLibrary.deleteAssetsAsync([idImage]);
        setResult(result);
    };
    function GetIdImage(id: number) {
        setIdImage(id)
    };
    const toastConfig = {
        tomatoToast: ({ text1 }) => (
            <View style={[styles.messages, { width: '98%', backgroundColor: '#ccc' }]}>
                <Text style={styles.messageText}>{text1}</Text>
                <Button title="YES" onPress={DeletePath} />
                <Button title="NO" onPress={() => Toast.hide()} />
            </View>
        )
    }
    const showToast = () => {
        Toast.show({
            type: 'tomatoToast',
            autoHide: false,
            topOffset: 200,
            text1: 'Do you want delete it path?',

        });
    }
    return (
        <View style={styles.mainBlock}>
            <StatusBar barStyle="light-content" />
            <View style={styles.header}>
                <Ionicons onPress={() => router.back()} name="arrow-back" color="blue" size={25} />
                <Text style={styles.name}>{name}</Text>
                <FontAwesome onPress={showToast} name="trash-o" color="blue" size={25} />
            </View>
            <Text style={styles.data}><Text style={styles.keys}>Type:</Text> {type}</Text>
            <Text style={styles.data}><Text style={styles.keys}>Date:</Text> {path_date(date)}</Text>
            <Text style={styles.data}><Text style={styles.keys}>Duration:</Text> {Duration(start, end)} sec</Text>
            <Text style={styles.data}>Distance: {path} m</Text>
            <ScrollView horizontal={true} onScrollBeginDrag={() => setIdImage(null)}>
                <View style={styles.imagesBlock}>
                    {assets.map(i =>
                        <Pressable
                            key={i.id}
                            onPress={() => GetIdImage(i.id)}
                            style={[styles.image, { opacity: result ? 0.3 : 1 }]}
                        >
                            <ImageBackground
                                style={[styles.image, { width: +width, height: width * (i.height / i.width), opacity: result ? 0.3 : 1 }]}
                                source={{ uri: i.uri }}
                                resizeMode='cover'
                            >
                                <Text />
                            </ImageBackground>
                        </Pressable>
                    )}
                    <View style={{ justifyContent: 'center', height: height / 2, width: +width, backgroundColor: '#ddd' }}>
                        <Text style={styles.noimage}>NO IMADE</Text>
                    </View>

                </View>

            </ScrollView>
            <Toast config={toastConfig} />
            {idImage ? <LinearGradient
                style={styles.btnDelete}
                colors={['#4c669f', '#3b5998', '#192f6a']}
            >
                <TouchableOpacity  disabled={result} onPress={DeleteImage}>
                    <Text style={styles.delete_text}>
                        {result ? 'PHOTO DELETED' : 'DELETE PHOTO'}
                    </Text>
                </TouchableOpacity>
            </LinearGradient> : null}
        </View>

    );
}
const styles = StyleSheet.create({
    mainBlock: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#fff',
        width: '100%',
        marginTop: StatusBar.currentHeight
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 60,
        width: '100%',
        borderBottomWidth: 1,
        paddingHorizontal: 12,
        borderColor: '#ddd'
    },
    name: {
        fontSize: 25,
        color: 'blue'
    },
    messages: {
        padding: 15,
        height: 150,
        gap: 12,
        borderRadius: 12
    },
    messageText: {
        textAlign: 'center',
        fontSize: 20
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        borderRadius: 15,
        resizeMode: 'contain',
    },
    noimage: {
        width: '100%',
        fontSize: 25,
        textAlign: 'center'
    },
    data: {
        marginTop: 5,
        fontSize: 22,
        fontFamily: 'SpaceMono'
    },
    keys: {
        fontWeight: 'bold',
        fontSize: 20
    },
    btnDelete: {
        width: '98%',
        borderRadius: 29,
        height: 50,
        position: 'absolute',
        bottom: 300
    },
    delete_text: {
        textAlign: 'center',
        fontSize: 18,
        color: '#fff',
        lineHeight: 50,
        fontWeight: 'bold',
        
    },
    imagesBlock: {
        flexDirection: 'row',
        flexWrap: 'nowrap',
        alignItems: 'center',
        gap: 8,
        zIndex: 1,
    }
})
export default Carusel;