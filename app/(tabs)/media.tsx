import {
    View, Text, FlatList,
    ImageBackground,    
    StyleSheet,
} from 'react-native';

import { useCallback, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from 'expo-router';
import * as MediaLibrary from 'expo-media-library';
import { Audio } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';

const HomeScreen = () => {
    const [back, setBack] = useState<string | null>('forest');
    const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();
    const [files, setFiles] = useState([]);
    const [file, setFile] = useState(-1);
    const [sound, setSound] = useState();

    async function playMusic() {
        
        const { sound } = await Audio.Sound.createAsync(
            { uri: files[file + 1]['uri'] },
            { shouldPlay: false });
        setSound(sound);
        await sound.playAsync();
        setFile(file + 1);
    }

    useFocusEffect(
        useCallback(() => {
            async function ReadStorage() {
                if (permissionResponse?.status !== 'granted') {
                    await requestPermission();
                }
                const all_files = await MediaLibrary.getAssetsAsync({
                    mediaType: 'audio'
                });               
                setFiles(all_files.assets);
                const background = await AsyncStorage.getItem('background');
                setBack(background);
            };
            ReadStorage();
        }, [])
    );
    const image = { uri: `https://superbob.pythonanywhere.com/image?name=${back}` }
    const Item = ({ title, uri, index }) => (        
        <Text  
            onPress={() => playMusic(uri)} 
            style={[styles.title, {backgroundColor: index === file ? '#ddd' : '#fff' }]}
        >
            {title.replace(".mp3", '')}
        </Text>

        
    );
    function stopMusic() {
        console.log(typeof sound)
        return typeof sound === 'object'
            ?sound.unloadAsync(): undefined;
    };
    function playNextMusic() {
        stopMusic();
        playMusic();
    }
    return (
        <ImageBackground
            style={styles.main_block}
            source={image}
        >
            
            <View style={{borderRadius: 10, width: '100%', height: '85%', backgroundColor: "#fff"}}>
                <FlatList
                    data={files}
                    numColumns={1}
                    keyExtractor={item => item.id}
                    renderItem={({ item, index }) => <Item title={item.filename} uri={item.uri} index={index} />}
                />
            </View>
            <View style={styles.player}>
                <Ionicons name='play' onPress={playMusic} size={45} color="blue" />
                <Ionicons name='stop' onPress={stopMusic} size={45} color="blue" />
                <Ionicons name='play-forward' onPress={playNextMusic} size={45} color="blue" />

            </View>

        </ImageBackground>
    );
}
export default HomeScreen;
const styles = StyleSheet.create({
    main_block: {
        flex: 1,
        backgroundColor: '#ae3bec',
        justifyContent: 'flex-start',
        alignItems: 'center',
        alignContent: 'center',
        padding: 8,
        paddingTop: 50
    },
   
    title: {
        margin: 2,
        width: '100%',
       
        
       
        paddingLeft: 10,
        fontSize: 15,
        textAlign: 'left',
        
    },
    player: {
        position: 'absolute',
        bottom: 60,
        backgroundColor: "#fff",
        width: '100%',
        padding: 10,
        borderRadius: 10,
        justifyContent: 'space-around',
        flex: 1, flexDirection: 'row'
    }
});
