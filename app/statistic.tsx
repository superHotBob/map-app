import { StyleSheet, View, Text, Pressable, FlatList } from "react-native";
import { useCallback, useState } from "react";
import { useFocusEffect, useRouter } from 'expo-router';
import * as SQLite from 'expo-sqlite';
import { Path_date } from "@/scripts/functions";
import { Duration } from "@/hooks/useDB";


interface MyArray {
    name: string,
    path: number,
    begintime: number,
    endtime: number,
    images: number,
    idpath: number,
    type: string
};


function Statistic() {
    const router = useRouter();
    const [path, setPath] = useState<MyArray[]>([]);
    const [type, setType] = useState('all')

    useFocusEffect(
        useCallback(() => {
            async function GetPaths() {
                
                const db = await SQLite.openDatabaseAsync('tracker', {
                    useNewConnection: true
                });
            
                const tab = await db.getAllAsync('SELECT name FROM sqlite_master WHERE type = "table"');
                if (tab.length === 0) {
                    return;
                };
                const paths = await db.getAllAsync('SELECT * FROM paths ORDER BY begintime DESC');

                let my_path = [...paths];
                if (type === 'all') {
                    return setPath(paths)
                }
                let new_path = my_path.filter(i => i.type === type)

                setPath(new_path)
               const dir =  db.serializeAsync('tracker');
                console.log(dir)

            };
            GetPaths();
        }, [])
    );
    type Image = {
        begintime: number,
        endtime: number,
        type: string,
        name: string,
        id: number,
        path: number,
        images: number,
        interval: number
    }
    function getFilter(i:string) {        
        if( i === 'Path') {
            let so = path.sort((a,b)=>a.path - b.path);           
            setPath([...so])
        } else if (i === 'Time') {
            let so = path.sort((a,b)=>(a.begintime -  a.endtime) - (b.begintime -  b.endtime));
           
            setPath([...so])
        } else {
            let so = path.sort((a,b)=>(b.begintime - a.begintime));
           
            setPath([...so])
        }
       
    }
    function ViewImage(i: Image) {
        router.push({
            pathname: i.type === 'walking' ? '/pathwalk' : "/pathrunning",
            params: {
                start: i.begintime,
                end: i.endtime,
                type: i.type,
                name: i.name,
                id: i.id,
                path: i.path,
                interval: i.interval
            }
        })
    };
    const Item = ({ i, index }: { i: Image, index: number }) => (
        <Pressable key={i.endtime} onPress={() => ViewImage(i)} style={[styles.pathBlock, { backgroundColor: index % 2 ? '#fff' : '#ddd' }]}>
            <Text style={[styles.text, { width: '50%', fontSize: 15 }]}>
                {Number(i.name) ? Path_date(i.name, 'en-GB') : i.name}
            </Text>
            <Text style={styles.text}>{Duration(i.begintime, i.endtime)}</Text>
            <Text style={styles.text}>{i.path} m</Text>
        </Pressable>
    );
    
    const Header = () => (
        <View style={styles.pathBlock}>
            {['Name', 'Time', 'Path'].
                map(i => <Text key={i} onPress={() => getFilter(i)} style={[styles.date, { width: i === 'Name' ? '50%' : '25%' }]}>{i}</Text>)}
        </View>
    );

    return (
        <View style={styles.mainBlock}>
            <FlatList
                data={path}
                ListHeaderComponent={() =><Header/>}
                ListEmptyComponent={<Text style={styles.nodata}>NO DATA</Text>}
                keyExtractor={item => item.endtime + ''}
                renderItem={({ item, index }) => <Item i={item} index={index} />}
            />
        </View>
    )
}
export default Statistic;
const styles = StyleSheet.create({
    mainBlock: {
        width: '100%',
        backgroundColor: '#f3ecec',
        paddingTop: 30,
        paddingBottom: 25,
        flex: 1,
    },
    pathBlock: {
        paddingVertical: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    nodata: {
        textAlign: 'center',
        fontSize: 30,
        marginTop: 100
    },
    date: {
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 25,
        color: 'blue',
        letterSpacing: 1.4,
        fontFamily: 'Roboto'
    },
    text: {
        width: '25%',
        textAlign: 'center',
        letterSpacing: 1.2,
        fontSize: 20
    }
})