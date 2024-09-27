import { View, Text, StyleSheet, Dimensions, TouchableOpacity, ScrollView, ImageBackground, Pressable } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import * as MediaLibrary from 'expo-media-library';
import { useState, useEffect } from 'react';
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
    const [assets, setAssets] = useState<Array<{ id: string, uri: string }>>([]);
    const [idImage, setIdImage] = useState(false)


    const { date = Date.now(), } = useLocalSearchParams();
    const path_date = (i) => (new Date(+i)).toLocaleString('ru-RU',
        { dateStyle: 'short', timeStyle: 'short', timeZone: "Europe/Minsk" }
    );


    const { start, end } = useLocalSearchParams();

    useEffect(() => {

        async function GetAssets() {

            const { id } = await MediaLibrary.getAlbumAsync("album_photo");
            const { assets } = await MediaLibrary.getAssetsAsync({ album: id });
            // console.log(assets.map(i=>path_date(i.modificationTime)))

            const new_assets = assets.filter(i => i.modificationTime > +start && i.modificationTime < +end )
            setAssets([...new_assets]);
            
        }
        GetAssets();
    }, [])
    async function Delete() {
        const result = await MediaLibrary.deleteAssetsAsync([idImage]);
        setResult(result);
    };
    function GetId(id) {        
        setIdImage(id)
    };

    return (
        <View style={styles.mainBlock}>
            <Text style={styles.data}>{path_date(date)}</Text>
            <ScrollView horizontal={true} onScrollBeginDrag={() => setIdImage(null)}>
                <View style={styles.imagesBlock}>
                    {assets.map(i =>
                        <Pressable
                            key={i.id}
                            onPress={() => GetId(i.id)}
                            style={[styles.image, { opacity: result ? 0.3 : 1 }]}
                        >
                            <ImageBackground
                                style={[styles.image, { width: +width, height: width * (i.height / i.width), opacity: result ? 0.3 : 1 }]}
                                source={{ uri: i.uri }}
                                resizeMode='cover'
                            >
                                <Text></Text>
                            </ImageBackground>
                        </Pressable>
                    )}
                </View>
            </ScrollView>
            {idImage ? <LinearGradient
                style={styles.btnDelete}
                colors={['#4c669f', '#3b5998', '#192f6a']}
            >
                <TouchableOpacity style={styles.btnDelete} disabled={result} onPress={Delete}>
                    <Text style={styles.delete_text}>
                        {result ? 'DELETED' : 'DELETE'}
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
        height: 50,
        position: 'absolute',
        bottom: 10
    },
    delete_text: {
        textAlign: 'center',
        fontSize: 18,
        color: '#fff',
        lineHeight: 50,
        fontWeight: 'bold',
        bottom: -10
    },
    imagesBlock: {
        flexDirection: 'row',
        flexWrap: 'nowrap',
        alignItems: 'center',
        gap: 8,
        height: height - 220
    }
})
export default Carusel;