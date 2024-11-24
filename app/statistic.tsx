import { StyleSheet, View, Text, Pressable, FlatList } from "react-native";
import { useCallback,  useState } from "react";
import { useFocusEffect, useRouter } from 'expo-router';
import * as SQLite from 'expo-sqlite';
import { Path_date } from "@/scripts/functions";

interface MyArray {
    name: string,
    path: number,
    begintime: number,
    endtime: number,
    images: number,
    idpath: number
};

function Statistic() {
    const router = useRouter();
    const [path, setPath] = useState<MyArray[]>([]);
    useFocusEffect(
        useCallback(() => {
            async function GetPaths() {
                const db = await SQLite.openDatabaseAsync('tracker', {
                    useNewConnection: true
                });
                const tab = await db.getAllAsync('SELECT name FROM sqlite_master WHERE type = "table"');
                if (tab.length === 0 ) {
                    return ;
                };
                const paths = await db.getAllAsync('SELECT * FROM paths ORDER BY begintime DESC');           
                setPath(paths); 
                                      
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
        
    }
    function ViewImage(i: Image) {
        router.push({
            pathname: '/path',
            params: {
                start: i.begintime,
                end: i.endtime,
                type: i.type,
                name: i.name,
                id: i.id,
                path: i.path
            }
        })
    };
    const Item = ({ i, index }:{i:Image, index: number}) => (
        <Pressable key={i.endtime} onPress={() => ViewImage(i)} style={[styles.pathBlock, { backgroundColor: index % 2 ? '#fff' : '#ddd' }]}>
            <Text style={[styles.text, { paddingHorizontal: 5}]}>{i.name}</Text>
            <Text style={styles.text}>{Path_date(i.begintime, 'ru-RU')}</Text>
            <Text style={styles.text}>{i.type}</Text>
            <Text style={styles.text}>{i.images}</Text>
        </Pressable>
    );    
    return (
        <View style={styles.mainBlock}>           
            <View style={styles.pathBlock}>
                {['Name', 'Date', 'Type', 'Photo'].
                    map(i => <Text key={i} style={[styles.date,{width: i=== 'Name'? '25%': '25%'}]}>{i}</Text>)}
            </View>
            <FlatList               
                data={path}                
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
        backgroundColor: '#fff',
        paddingTop: 30,
        paddingBottom: 25,
        flex: 1,        
    },    
    pathBlock: {
        paddingVertical: 15,
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
        width: '25%',
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 22,
        color: 'blue',
        letterSpacing: 1.4
    },    
    text: {
        width: '25%',
        textAlign: 'center',
        letterSpacing: 1.2
    }
})