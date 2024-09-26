import { Dimensions, StyleSheet, View, Text, Pressable, FlatList } from "react-native";

import { useEffect, useState } from "react";
import { useRouter } from 'expo-router';
import * as SQLite from 'expo-sqlite';

const Path_date = (i: number) => new Date(i).toLocaleString('en-US',
    { dateStyle: 'short', year: '2-digit' });

const Time_path = (a: number, b: number) => {
    return ((b - a) / 1000 / 60).toFixed(2).replace('.', 'm ') + 'c';
}
const { height } = Dimensions.get('window');
interface MyArray {
    name: string,
    path: number,
    begintime: number,
    endtime: number,
    images: number,
    idpath: number
}

function Statistic() {
    const router = useRouter();
    const [path, setPath] = useState<MyArray[]>([]);

    useEffect(() => {
        async function GetPaths() {
            const db = await SQLite.openDatabaseAsync('tracker', {
                useNewConnection: true
            });
            const paths = await db.getAllAsync(`SELECT * FROM paths ORDER BY 'modificationTime' DESC`);

            setPath(paths);
        };
        GetPaths();
    }, []);
    type Image = {
        begintime: number,
        endtime: number,
    }
    function ViewImage(i: Image) {
        router.push({
            pathname: '/photo',
            params: {
                start: i.begintime,
                end: i.endtime,
            }
        })
    }
    type ItemProps = { i: Object };

    const Item = ({ i, index }) => (
        <Pressable key={i.endtime} onPress={() => ViewImage(i)} style={[styles.pathBlock, { backgroundColor: index % 2 ? '#fff' : '#ddd' }]}>
            <Text style={[styles.text, { paddingHorizontal: 2 }]}>{i.name}</Text>
            <Text style={styles.text}>{Path_date(i.begintime)}</Text>
            <Text style={styles.text}>{Time_path(i.begintime, i.endtime)}</Text>
            <Text style={styles.text}>{i.path} m</Text>
            <Text style={styles.text}>{i.images}</Text>
        </Pressable>
    );
   
    
    return (
        <View style={styles.mainBlock}>
            <Text style={styles.headerText}>Statistics</Text>
            <View style={styles.pathBlock}>
                {['Name', 'Date', 'Time', 'Path', 'Photo'].
                    map(i => <Text key={i} style={styles.date}>{i}</Text>)}
            </View>
            <FlatList
               
                data={path}
                keyExtractor={item => item.endtime}
                renderItem={({ item, index }) => <Item i={item} index={index} />}
            />
        </View>
    )
}
export default Statistic;
const styles = StyleSheet.create({
    mainBlock: {
        width: '100%',
        backgroundColor: '#fff',
        borderRadius: 28,
        paddingBottom: 25,
        height: height -225
    },
    headerText: {
        textAlign: 'center',
        paddingTop: 10,
        fontSize: 22,
        fontWeight: 'bold',
    },
    pathBlock: {
        paddingVertical: 15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    date: {
        width: '20%',
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 17,
        color: 'blue'
    },
    text: {
        width: '20%',
        textAlign: 'center'
    }
})