import { Dimensions, StyleSheet, View, Text, Pressable, FlatList } from "react-native";
import React from "react";
import { useEffect, useState } from "react";
import { useRouter } from 'expo-router';
import * as SQLite from 'expo-sqlite';

const Path_date = (i: number) => new Date(i).toLocaleString('en-US',
    { dateStyle: 'short', year: '2-digit' });


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
            const paths = await db.getAllAsync('SELECT * FROM paths ORDER BY begintime DESC');           
            setPath(paths);
           
            
        }
        GetPaths();
    }, []);
    type Image = {
        begintime: number,
        endtime: number,
        type: string,
        name: string,
        id: number,
        path: number
    }
    function ViewImage(i: Image) {
        router.push({
            pathname: '/photo',
            params: {
                start: i.begintime,
                end: i.endtime,
                type: i.type,
                name: i.name,
                id: i.id,
                path: i.path
            }
        })
    }
    type ItemProps = { i: Object };

    const Item = ({ i, index }:{i: ItemProps}) => (
        <Pressable key={i.endtime} onPress={() => ViewImage(i)} style={[styles.pathBlock, { backgroundColor: index % 2 ? '#fff' : '#ddd' }]}>
            <Text style={[styles.text, { paddingHorizontal: 2, width: '30%' }]}>{i.name}</Text>
            <Text style={styles.text}>{Path_date(i.begintime)}</Text>
            <Text style={styles.text}>{i.type ? i.type : 'walking'}</Text>
            <Text style={styles.text}>{i.images}</Text>
        </Pressable>
    );
   
    
    return (
        <View style={styles.mainBlock}>
            <Text style={styles.headerText}>Statistics</Text>
            <View style={styles.pathBlock}>
                {['Name', 'Date', 'Type', 'Photo'].
                    map(i => <Text key={i} style={[styles.date,{width: i=== 'Name'? '30%': '23%'}]}>{i}</Text>)}
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
        width: '25%',
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 17,
        color: 'blue'
    },
    
    text: {
        width: '23%',
        textAlign: 'center',
        
    }
})