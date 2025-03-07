import {View, Text, StyleSheet,StatusBar, Button } from 'react-native';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useState, useCallback, useEffect } from 'react';
import * as SQLite from 'expo-sqlite';
import { Stack } from 'expo-router';
import * as FileSystem from 'expo-file-system';
import Toast from 'react-native-toast-message';
import { useFonts } from 'expo-font';
import { DeletePath, Path_date } from '../scripts/functions';
import { Ionicons } from '@expo/vector-icons';
import { Duration } from '@/hooks/useDB';
import { Colors } from '@/constants/Colors';
import Chart from '@/components/chart';


const color = Colors.light.tint;
interface thisPath {
    speed: number,
    calories: number
}
const Carusel = () => {

    const [thispath, setThisPath] = useState<thisPath>({ speed: 0, calories: 0 })
    const [] = useFonts({
        'SpaceMono': require('../assets/fonts/SpaceMono-Regular.ttf'),
    });


    const { start, end, name, id: id_path, path, interval } = useLocalSearchParams();
    const gifDir = FileSystem.documentDirectory
    const [data, setData] = useState([]);
    const [labels, setLabels] = useState([]);
    const params = useLocalSearchParams();
    useFocusEffect(useCallback(() => {
        async function ReadPath() {
            const dirInfo = await FileSystem.getInfoAsync(gifDir);
            const mypath = await FileSystem.readAsStringAsync(dirInfo.uri + '/'+ name + '.txt', {encoding: 'utf8'})
            const path = JSON.parse(mypath);          
            const labels = Array.from({ length: path.length*Number(interval)/60000 })
                .map((i, index) => Array.from({length: 60000/Number(interval)})
                .map((i,indexa)=> index + '.' + indexa * Number(interval)/1000)
            );           
            setLabels(labels);
            const data = path.map(i => i[3]);
            setData(data);
        }
        ReadPath();
    }, []));
    useFocusEffect(
        useCallback(() => {
            async function GetAssets() {
                const db = await SQLite.openDatabaseAsync('tracker', {
                    useNewConnection: true
                });
                const path = await db.getAllAsync('SELECT * FROM run WHERE name =  ? ', name);

                setThisPath(path[0]);                
            };
            GetAssets();
        }, [])
    );

    async function DeleteMyPath() {
        DeletePath(name);
        Toast.hide();
        router.back();
    };

    const Speed = (path, end, start) => {
        const speed = (path / 1000) / ((end - start) / (1000 * 3600))
        return speed.toFixed(1);
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
            <Stack.Screen            
               options={{
                
                title: Number(params.name) ? Path_date(params.name) : params.name,
                headerTitleAlign: 'center',
                headerRight: () => <Ionicons onPress={showToast} name="trash-outline" color={color} size={35} />
              }}
            />           
            <Text style={styles.data}>{Path_date(start, 'ru-RU')}</Text>
            <Text style={styles.data}><Text style={styles.keys}>Duration:</Text> {Duration(+start, +end)}</Text>
            <Text style={styles.data}><Text style={styles.keys}>Distance:</Text> {path} m</Text>
            <Text style={styles.data}><Text style={styles.keys}>Speed:</Text> {Speed(path, end, start)} km/h</Text>
            <Text style={styles.data}><Text style={styles.keys}>Calories:</Text> {thispath['calories'].toFixed(2)} K </Text>

            <Text style={{ fontSize: 25, fontWeight: 'bold', marginTop: 20 }}>Speed</Text>
           
            {data.length > 0 ? <Chart interval={interval} new_data={data} new_labels={labels} /> : <Text>AWAIT</Text>}
            
            <Toast config={toastConfig} />
            <StatusBar backgroundColor="#fff" barStyle="dark-content" />
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
        paddingTop: 10       
    },
    
    name: {
        fontSize: 28,
        color: color,
        fontFamily: 'SpaceMono',
        verticalAlign: 'middle'
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