import {
    View, Text, StyleSheet,
    Dimensions, TouchableOpacity,
    ScrollView, ImageBackground,
    Pressable, StatusBar, Button, Image
} from 'react-native';
import { router, Stack, useFocusEffect, useLocalSearchParams } from 'expo-router';
import * as MediaLibrary from 'expo-media-library';
import { useState, useCallback } from 'react';
import { LinearGradient } from 'expo-linear-gradient';

import * as FileSystem from 'expo-file-system';
import Toast from 'react-native-toast-message';
import { useFonts } from 'expo-font';
import { DeletePath, Path_date } from '../scripts/functions';
import { FontAwesome } from '@expo/vector-icons';
import { Duration } from '@/hooks/useDB';
import { Colors } from '@/constants/Colors';


const { width, height } = Dimensions.get('window');
const color = Colors.light.tint;
const Carusel = () => {
    const [result, setResult] = useState(false);
    const [images, setImages] = useState<Array<{ ratio: number, id: string, uri: string }>>([]);
    const [idImage, setIdImage] = useState(false);    
    const [] = useFonts({
        'SpaceMono': require('../assets/fonts/SpaceMono-Regular.ttf'),
    });
    const params = useLocalSearchParams();
    const { type, start, end, name, id: id_path, path } = useLocalSearchParams();
    const directoryUri = `${FileSystem.documentDirectory}${'images'}${'/'}${name}`;

    useFocusEffect(
        useCallback(() => {
            async function GetAssets() {
                let { exists } = await FileSystem.getInfoAsync(directoryUri);
                if (exists) {
                    let images = await FileSystem.readDirectoryAsync(directoryUri);
                    let allimages = images.map(i => Object.assign({}, { uri: directoryUri + '/' + i, ratio: +i.charAt(0) === 4 ? 1.33 : 1 }))
                    setImages([...allimages]);
                } else { setImages([]); };               
            };
            GetAssets();
        }, [])
    );

    async function DeleteMyPath() {
        DeletePath(name);
        Toast.hide();
        router.back();
    };

    async function DeleteImage() {
        const result = await MediaLibrary.deleteAssetsAsync([idImage]);
        setResult(result);
    };
   
    const toastConfig = {
        tomatoToast: ({ text1 }: { text1: string }) => (
            <View style={[styles.messages, { width: '95%', backgroundColor: '#ccc' }]}>
                <Text style={styles.messageText}>{text1}</Text>
                <Button title="YES" onPress={DeleteMyPath} />
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
            <Stack.Screen
               options={{
                title: params.name,
                headerTitleAlign: 'center',
                headerRight: () =>  <FontAwesome onPress={showToast} name="trash-o" color={color} size={35} />
              }}
            />          
            <Text style={styles.data}><Text style={styles.keys}>Type:</Text> {type}</Text>
            <Text style={styles.data}><Text style={styles.keys}>Date:</Text> {Path_date(start, 'ru-RU')}</Text>
            <Text style={styles.data}><Text style={styles.keys}>Duration:</Text> {Duration(start, end)} sec</Text>
            <Text style={styles.data}>Distance: {path} m</Text>
            <ScrollView horizontal={true} onScrollBeginDrag={() => setIdImage(null)}>
                <View style={styles.imagesBlock}>
                    {images.map(i =>
                        <Pressable
                            key={i.uri}
                            // onPress={() => GetIdImage(i.id)}
                            style={[styles.image, { opacity: result ? 0.3 : 1 }]}
                        >
                            <ImageBackground
                                style={[styles.image, { width: +width, height: width * i.ratio, opacity: result ? 0.3 : 1 }]}
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
        paddingTop: 20        
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
        width: '100%',
        textAlign: 'center'
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