import { View, Image, Text, StyleSheet, Dimensions, TouchableOpacity, ScrollView, ImageBackground, Pressable } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import * as MediaLibrary from 'expo-media-library';
import { useState, useRef, useEffect } from 'react';
import { LinearGradient } from 'expo-linear-gradient';

import {
    Directions,
    Gesture,
    GestureDetector,
    GestureHandlerRootView,
} from 'react-native-gesture-handler';

import { Ionicons } from '@expo/vector-icons';
import Animated, {
    withTiming,
    useSharedValue,
    useAnimatedStyle,
} from 'react-native-reanimated';


const { width, height } = Dimensions.get('window');


const Carusel = () => {
    const scale = useSharedValue(1);
    const startScale = useSharedValue(0);
    const [result, setResult] = useState(false);
    const [assets, setAssets] = useState<Array<{id: string, uri: string}>>([]);
    const [idimage, setIdImage] = useState(false)

    const { date = Date.now(), } = useLocalSearchParams();
    const path_date = (new Date(+date)).toLocaleString('ru-RU',
        { dateStyle: 'short', timeStyle: 'short', timeZone: "Europe/Minsk" }
    );
   
    const { before, after } = useLocalSearchParams();
    useEffect(() => {
         
    console.log(Number(before) - Number(after))
        async function GetAssets() {
            const { id } = await MediaLibrary.getAlbumAsync("album_photo");           
            const my_assets = await MediaLibrary.getAssetsAsync({ album: id });
            setAssets([...my_assets.assets]);
            console.log(my_assets.assets)
        }
        GetAssets();
    }, [])
    async function Delete() {       
        const result = await MediaLibrary.deleteAssetsAsync([idimage]);
        setResult(result);
    };
    function GetId(id) {
        console.log(id)
        setIdImage(id)
    };
    
    return (
        <ScrollView>
            <View style={styles.mainBlock}>
                <Text style={styles.data}>
                    {path_date}
                </Text>
                <ScrollView horizontal={true} onScrollBeginDrag={() => setIdImage(null)}>
                    <View style={styles.imagesBlock}>
                        {assets.map(i =>
                            <Pressable
                                key={i.id}
                                onPress={() => console.log('gdfg')}
                                style={[styles.image, { width: width, opacity: result ? 0.3 : 1 }]}
                            >
                                <ImageBackground
                                    style={[styles.image, { width: +width, height: +height, opacity: result ? 0.3 : 1 }]}
                                    source={{ uri: i.uri }}
                                    resizeMode='cover'
                                >
                                    <Text></Text>
                                </ImageBackground>
                            </Pressable>
                        )}
                    </View>
                </ScrollView>
                {idimage ? <LinearGradient
                    style={styles.btnDelete}
                    colors={['#4c669f', '#3b5998', '#192f6a']}
                >
                    <TouchableOpacity style={styles.btnDelete} disabled={result} onPress={Delete}>
                        <Text style={styles.delete_text}>
                            {result ? 'УДАЛЕНО' : 'УДАЛИТЬ'}
                        </Text>
                    </TouchableOpacity>
                </LinearGradient> : null}
            </View>
        </ScrollView>
    );
}
const styles = StyleSheet.create({
    mainBlock: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        backgroundColor: '#fff',
        gap: 15,
        width: '100%',

    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        borderRadius: 8,
        resizeMode: 'contain',
    },
    data: {
        marginTop: 15,
        fontSize: 18,
        fontWeight: 'bold',
        fontFamily: 'SpaceMono'
    },
    btnDelete: {
        width: '98%',
        borderRadius: 8,
        height: 50
    },
    delete_text: {
        textAlign: 'center',
        fontSize: 18,
        color: '#fff',
        lineHeight: 50,
        fontWeight: 'bold'
    },
    imagesBlock: {
        flexDirection: 'row',
        flexWrap: 'nowrap',
        gap: 8,
        height: height - 220
    }
})
export default Carusel;