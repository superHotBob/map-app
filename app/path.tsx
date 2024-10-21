import { View, Text, StyleSheet, Dimensions, TouchableOpacity, ScrollView, ImageBackground, Pressable, StatusBar, Button } from 'react-native';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import * as MediaLibrary from 'expo-media-library';
import { useState,  useCallback } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import * as SQLite from 'expo-sqlite';
import Toast from 'react-native-toast-message';
import { useFonts } from 'expo-font';
import { Path_date } from '../scripts/functions';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { Duration } from '@/hooks/useDB';
import AsyncStorage from '@react-native-async-storage/async-storage';


const { width, height } = Dimensions.get('window');

interface thisPath {
    speed: number,
    calories: number
}
const Carusel = () => {   
    const [result, setResult] = useState(false);
    const [assets, setAssets] = useState<Array<{ id: string, uri: string }>>([]);
    const [idImage, setIdImage] = useState(false);
    const [thispath, setThisPath] = useState<thisPath>({speed: 0,calories: 0})
    const [loaded, error] = useFonts({
        'SpaceMono': require('../assets/fonts/SpaceMono-Regular.ttf'),
      });

    const { date = Date.now(), } = useLocalSearchParams();
   


    const { type, start, end, name, id: id_path, path } = useLocalSearchParams();

    useFocusEffect(
        useCallback(() => {
            async function GetAssets() {
                const id = await AsyncStorage.getItem('photo');
                const { assets } = await MediaLibrary.getAssetsAsync({ album: id });
                const new_assets = assets.filter(i => i.modificationTime > +start && i.modificationTime < +end)
                setAssets([...new_assets]);
                if (type === 'running') {
                    const db = await SQLite.openDatabaseAsync('tracker', {
                        useNewConnection: true
                    });
                    const path = await db.getAllAsync(`select * from run where name = ?`, [name]);
                    setThisPath(path[0]);
                    
                }
            };
            GetAssets();
        }, [])
    );

    async function DeletePath() {
        const db = await SQLite.openDatabaseAsync('tracker', {
            useNewConnection: true
        });
        await db.runAsync(`delete from paths where id = ${id_path}`);
        const ids = assets.map(i => i.id);
        await MediaLibrary.deleteAssetsAsync(ids);
        Toast.hide();
        router.back();
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
            <View style={[styles.messages, { width: '95%', backgroundColor: '#ccc' }]}>
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
            text1: 'Do you want delete path ?',
        });
    }
    return (
        <View style={styles.mainBlock}>
            <StatusBar barStyle="dark-content" />
            <View style={styles.header}>
                <Ionicons onPress={() => router.back()} name="arrow-back" color="blue" size={23} />
                <Text style={styles.name}>{name}</Text>
                <FontAwesome onPress={showToast} name="trash-o" color="blue" size={25} />
            </View>
            <Text style={styles.data}><Text style={styles.keys}>Type:</Text> {type}</Text>
            <Text style={styles.data}><Text style={styles.keys}>Date:</Text> {Path_date(date)}</Text>
            <Text style={styles.data}><Text style={styles.keys}>Duration:</Text> {Duration(start, end)} sec</Text>
            <Text style={styles.data}>Distance: {path} m</Text>
            {type === 'running' ?
                <View>
                    <Text style={styles.data}><Text style={styles.keys}>Speed:</Text> {thispath['speed']} km/h</Text>
                    <Text style={styles.data}><Text style={styles.keys}>Calories:</Text> {thispath['calories']}</Text>
                    
                </View>
                :
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

                </ScrollView>}
            <Toast config={toastConfig} />
            {idImage ? <LinearGradient
                style={styles.btnDelete}
                colors={['#4c669f', '#3b5998', '#192f6a']}
            >
                <TouchableOpacity disabled={result} onPress={DeleteImage}>
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
        justifyContent: 'flex-start',
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
        fontSize: 22,
        color: 'blue',
        fontFamily: 'SpaceMono',

    },
    messages: {
        padding: 20,
        height: 'auto',
        justifyContent: 'space-between',
        gap: 20,
        borderRadius: 12
    },
    messageText: {
        textAlign: 'center',
        fontSize: 25
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
        fontFamily: 'SpaceMono',
        letterSpacing: 0.08,
        
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