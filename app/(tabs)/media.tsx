import {
    View, Text, FlatList,
    StyleSheet,
} from 'react-native';
import { SecToMin } from '@/scripts/functions';
import { useCallback, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from 'expo-router';
import * as MediaLibrary from 'expo-media-library';
import { Audio, InterruptionModeAndroid, InterruptionModeIOS } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import { TimerSong } from '@/components/timer_song';

const HomeScreen = () => {
    const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();
    const [files, setFiles] = useState([]);
    const [timepause, setTimePause] = useState(0);
    const [sound, setSound] = useState<Object| null>(null);
    const [timeout, setTime] = useState();
    const [volume, setVolume] = useState(1.0)
    const fileIndex = useRef(-1);
    const [viewVolume, setViewVolume] = useState(false);


    async function playMusic() {
       
        if ( fileIndex.current +1  === files.length ) {           
            fileIndex.current = -1;
        };
        if (timepause === 0) {
            fileIndex.current = fileIndex.current + 1
        };

        if (files.length === 0) {
            return;
        };
        const { sound } = await Audio.Sound.createAsync(
            { uri: files[fileIndex.current]['uri'] },
            { volume: volume }
        );
       
        setSound(sound);
        const time = files[fileIndex.current]['duration'];

        let timeout = setTimeout(() => {
            sound.unloadAsync();
            setSound(null);
            playMusic();
        }, time * 1000);
        setTime(timeout);
        sound.setPositionAsync(timepause);
        await sound.playAsync();
        setTimePause(0);
    };

    useFocusEffect(
        useCallback(() => {
            async function ReadStorage() {
                if (permissionResponse?.status !== 'granted') {
                    await requestPermission();
                }
                const id = await MediaLibrary.getAlbumAsync('Music');
                const all_files = await MediaLibrary.getAssetsAsync({
                    mediaType: 'audio',
                    album: id,
                    first: 100
                });
                setFiles(all_files.assets);
            };
            ReadStorage();
        }, [])
    );

    const Item = ({ title, index }: { title: {filename: string}, index: number }) => (
        <View style={[styles.song_wrapper, { backgroundColor: index === fileIndex.current ? '#ddd' : '#fff' }]}>
            <Text
                onPress={() => playSelectMusic(index - 1)}
                style={[styles.song,{fontWeight: index === fileIndex.current ? 'bold' : '400'}]}
            >
                {(title.filename.replace(".mp3", '')).substring(0, 25)}
            </Text>
            {index === fileIndex.current ?
                <TimerSong
                    duration={(title.duration).toFixed(0)}
                    style={[styles.song,{fontWeight: index === fileIndex.current ? 'bold' : '400'}]}
                    sound={timepause}
                />
                :
                <Text style={styles.song_time}>
                    {SecToMin((title.duration).toFixed(0))}
                </Text>}
        </View>
    );
    function playSelectMusic(a) {
        fileIndex.current = a;
        clearTimeout(timeout);
        stopMusic();
        playMusic();
    };
    function stopMusic() {
        clearTimeout(timeout);
        
        sound != null
            ? sound?.unloadAsync() : undefined;
        setSound(null)    
    };
    async function pauseMusic() {
        if (typeof sound !== 'object') return;
        let s = await sound?.getStatusAsync();
        if (s.positionMillis === 0) return;

        setTimePause(s.positionMillis);
        stopMusic();
    };
    async function setMuted() {

        if (volume !== 0.0) {
            return await setPlayVolume(0.0);
        }
        await setPlayVolume(0.5);
    }
    function playNextMusic() {
       
        stopMusic();
        playMusic();
    };
    async function setPlayVolume(a) {
        setVolume(a);
        await sound?.setVolumeAsync(a);

    }
    return (
        <View style={styles.main_block}>
            <View style={{
                paddingHorizontal: 5,
                borderRadius: 10,
                width: '100%',
                height: '85%',
                backgroundColor: "#fff",
                paddingBottom: 10
            }}
            >
                <Text style={styles.songs_string}>{files?.length} SONGS</Text>
                <FlatList
                    data={files}
                    numColumns={1}

                    ListEmptyComponent={() => <Text style={styles.empty}>The folder 'Music' is empty</Text>}
                    keyExtractor={item => item.id}
                    renderItem={({ item, index }) => <Item title={item} index={index} />}
                />
            </View>
            <View style={styles.player}>
            <Ionicons name='play-skip-back' onPress={playNextMusic} size={40} color="#ae3bec" />
                {sound === null ?
                    <Ionicons  name='play-circle-outline' onPress={() => playMusic()} size={50} color="#ae3bec" />
                    :
                    <Ionicons name='pause-circle-outline' onPress={pauseMusic} size={50} color="#ae3bec" />
                }
                {/* <Ionicons name='stop' onPress={stopMusic} size={45} color="#ae3bec" /> */}
                <Ionicons name='play-skip-forward' onPress={playNextMusic} size={40} color="#ae3bec" />

                <Ionicons
                    name={volume !== 0.0 ? 'volume-medium-outline' : 'volume-mute-outline'}
                    onPress={() => setViewVolume(!viewVolume)}
                    onLongPress={setMuted}
                    size={45}
                    color="#ae3bec"



                />
            </View>
            {viewVolume ?
                <View style={styles.volume}>
                    <Ionicons name='add-outline' onPress={() => setPlayVolume(volume >= 0.9 ? 1.0 : volume + 0.1)} size={45} color="#ae3bec" />
                    <Text style={styles.text_volume}>{(volume * 10).toFixed(0)}</Text>
                    <Ionicons name='remove-sharp' onPress={() => setPlayVolume(volume <= 0.1 ? 0.0 : volume - 0.1)} size={45} color="#ae3bec" />
                </View> : null}
        </View>
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
        paddingTop: 30,
        
    },
    songs_string: {
        fontSize: 24,
        textAlign: 'center',
        borderBottomColor: "#ae3bec",
        borderBottomWidth: 1,
        color: '#ae3bec',
        fontWeight: 'bold'
    },
    song_wrapper: {
        paddingHorizontal: 8,
        flexDirection: 'row',
        borderRadius: 10,
       
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    song: {

        width: '86%',
        textTransform: 'lowercase',
        color: "#ae3bec",
        fontSize: 18,
        textAlign: 'left',
    },
    song_time: {
        color: "#ae3bec",
        fontSize: 18,
        width: 40,
        textAlign: 'right'
    },
    player: {
        position: 'absolute',
        bottom: 60,
        backgroundColor: "#fff",
        width: '100%',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'space-around',
        flex: 1,
        flexDirection: 'row'
    },
    empty: {
        fontSize: 20,
        textAlign: 'center',
        marginTop: 150
    },
    volume: {
        position: 'absolute',
        right: 55,
        top: '30%',
        width: 60,
        height: 200,
        borderRadius: 30,
        backgroundColor: '#fff',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderColor: '#ae3bec',
        borderWidth: 3
    },
    text_volume: {
        fontSize: 35,
        fontWeight: 'bold',
        color: '#ae3bec'
    }
});
