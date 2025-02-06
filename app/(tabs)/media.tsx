import {
    View, Text, FlatList,
    StyleSheet, Animated,   
    TouchableHighlight
} from 'react-native';
import { SecToMin } from '@/scripts/functions';
import { useMemo, useRef, useState, useEffect } from 'react';
import * as MediaLibrary from 'expo-media-library';
import { Audio, InterruptionModeAndroid, InterruptionModeIOS } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import { Songs } from '@/components/Songs';


const SongsPlayer = () => {
    const opacity = useRef(new Animated.Value(0)).current;
    const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();
    const [songs, setSongs] = useState([]);
    const [timepause, setTimePause] = useState(0);
    const [sound, setSound] = useState<Object | null>(null);
    const [volume, setVolume] = useState(10);
    const fileIndex = useRef(0);
    const [timefrombegin, setTimeOut] = useState(0);    

    useEffect(() => {
        Audio.setAudioModeAsync({
            staysActiveInBackground: true,
            playsInSilentModeIOS: true,
            interruptionModeIOS: InterruptionModeIOS.DuckOthers,
            interruptionModeAndroid: InterruptionModeAndroid.DuckOthers,
            shouldDuckAndroid: true,
            playThroughEarpieceAndroid: false,
        });
        return sound ? () => sound.unloadAsync() : undefined;
    }, [sound]);
    useMemo(
        async () => {
            if (permissionResponse?.status !== 'granted') {
                await requestPermission();
            }
            const id = await MediaLibrary.getAlbumAsync('Music');
            const { assets } = await MediaLibrary.getAssetsAsync({
                mediaType: 'audio',
                album: id,
                first: 100,
                sortBy: 'default'
            });
            let ss = assets.map(i => Object.assign({}, { 'uri': i.uri }, { 'duration': (+i.duration).toFixed(0) }, { 'filename': i.filename }));

            setSongs(ss);

        }, []
    );
    
   
    async function playMusic(a = 1) {
        if (fileIndex.current + 1 === songs.length) {
            fileIndex.current = 0;
        };
        if (timepause === 0) {
            fileIndex.current = a
        };       
        const { sound } = await Audio.Sound.createAsync(
            { uri: songs[fileIndex.current]['uri'] },
            {
                shouldPlay: true,
                volume: volume / 10,
                progressUpdateIntervalMillis: 10000,
                positionMillis: timepause
            }
        );
        await sound.playAsync();
        setSound(sound);
        setTimeOut(10);
        sound.setOnPlaybackStatusUpdate((status) => {
            if ('didJustFinish' in status && status.didJustFinish) {
                setTimePause(0);
                playNextMusic(1);
                return;
            } else if (status.isLoaded) {
                // setStatus(status.positionMillis)
                // console.log(status)
                // setTimeOut(status.durationMillis - status.positionMillis);

            }
        });
        setTimePause(0);
    };
    async function playSelectMusic(a) {       
        setTimePause(0);
        fileIndex.current = a;
        // stopMusic();
        playMusic(a);
    };

    const Item = ({ title, index }: { title: { filename: string, duration: string }, index: number }) => (
        <TouchableHighlight 
            onPress={() => playSelectMusic(index)}
            underlayColor="#ccc"
        >
            <View style={[styles.song_wrapper]} >
                <Text
                    style={index === fileIndex.current && timefrombegin ? styles.song_active : styles.song}
                >
                    {(title.filename.replace(".mp3", '')).substring(0, 30)}
                </Text>
                {index === fileIndex.current && timefrombegin  ?
                    <Text
                        style={[styles.song_active, { textAlign: 'right' }]}
                    >
                        {SecToMin((+title.duration).toFixed(0))}
                    </Text>
                    :
                    <Text style={styles.song_time}>
                        {SecToMin((+title.duration).toFixed(0))}
                    </Text>
                }
            </View>
        </TouchableHighlight>);

    function stopMusic() {
        sound?.unloadAsync()
        setSound(null)
    };
    async function pauseMusic() {       
        let s = await sound?.getStatusAsync();
        setTimePause(s.positionMillis);       
        await sound?.pauseAsync();
    };
    async function setMuted() {
        if (volume !== 0) {
            return await setPlayVolume(0);
        }
        await setPlayVolume(5);
    }
    function playNextMusic(a: number) {
        stopMusic();
        setTimePause(0);
        let s = fileIndex.current === songs.length-1 ?  0 : fileIndex.current + a
        
        playMusic(s);
    };
    async function setPlayVolume(a) {
        setVolume(a);
        await sound?.setVolumeAsync(a/10);
    };
    function viewVolumePanel() {
        Animated.timing(opacity, {
            toValue: opacity._value === 1 ? 0 : 1,
            duration: 500,
            useNativeDriver: true,
        }).start();
    };
    const shufleListMusic = () => {
        const ss = songs.sort(() => Math.random() - 0.5);
        setSongs([...ss]);
    };
    return (
        <View style={styles.main_block}>
            <View style={styles.wrap_block}>                
                <FlatList
                    data={songs}
                    numColumns={1}
                    initialNumToRender={20}
                    style={{ paddingVertical: 5 }}                    
                    ListHeaderComponent={()=><Songs songs={songs.length} />}
                    ListEmptyComponent={() => <Text style={styles.empty}>The folder 'Music' is empty</Text>}
                    keyExtractor={item => item.filename}
                    renderItem={({ item, index }) => <Item title={item} index={index} />}
                />                
            </View>
                {songs.length === 0 ?
                <Text></Text>
                :
                <View style={styles.player}>
                    <Ionicons name='play-skip-back' onPress={() => playNextMusic(-1)} size={40} color="#ae3bec" />
                    {timefrombegin === 0 || timepause > 0 ?
                        <Ionicons name='play-circle-outline' onPress={() => playMusic(fileIndex.current)} size={50} color="#ae3bec" />
                        :
                        <Ionicons name='pause-circle-outline' onPress={pauseMusic} size={50} color="#ae3bec" />
                    }
                    <Ionicons name='play-skip-forward' onPress={() => playNextMusic(1)} size={40} color="#ae3bec" />
                    <Ionicons
                        name='shuffle'
                        onPress={shufleListMusic}
                        onLongPress={setMuted}
                        size={45}
                        color="#ae3bec"
                    />
                    <Ionicons
                        name={volume !== 0.0 ? 'volume-medium-outline' : 'volume-mute-outline'}
                        onPress={viewVolumePanel}
                        onLongPress={setMuted}
                        size={45}
                        color="#ae3bec"
                    />
                    <Animated.View style={[styles.volume, { opacity }]}>
                        <Ionicons name='add-outline' onPress={() => setPlayVolume(volume >= 10 ? 10 : volume + 1)} size={45} color="#fff" />
                        <Text style={styles.text_volume}>{volume}</Text>
                        <Ionicons name='remove-sharp' onPress={() => setPlayVolume(volume <= 1 ? 0 : volume - 1)} size={45} color="#fff" />
                    </Animated.View>
                </View>}
        </View>
    );
}
export default SongsPlayer;
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
    wrap_block: {
        paddingHorizontal: 5,
        borderRadius: 10,
        width: '100%',
        height: '85%',
        backgroundColor: "#ddd",
        paddingBottom: 10
    },

    song_wrapper: {

        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    song: {

        textTransform: 'lowercase',
        color: "#ae3bec",
        fontSize: 18,
        textAlign: 'left',
    },
    song_active: {
        fontWeight: 'bold',
        textTransform: 'lowercase',
        color: "#46431a",
        
        fontSize: 18,
        textAlign: 'left',

    },
    song_time: {
        color: "#ae3bec",
        fontSize: 18,
        width: 40,
        textAlign: 'right',
    },
    player: {
        position: 'absolute',
        bottom: 60,
        backgroundColor: "#ddd",
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
        right: 5,
        bottom: 60,
        width: 60,
        height: 200,

        borderRadius: 30,
        backgroundColor: '#ae3bec',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderColor: '#ae3bec',
        borderWidth: 3
    },
    text_volume: {
        fontSize: 35,
        fontWeight: 'bold',
        color: '#fff'
    }
});
