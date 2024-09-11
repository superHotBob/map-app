import { ScrollView, StyleSheet, View, Text } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Animated, {
    useSharedValue,
    withTiming,
    useAnimatedStyle,
    Easing,
  } from 'react-native-reanimated';
import { useEffect, useState } from "react";
import { Link } from "expo-router";
import * as SQLite from 'expo-sqlite';

const Path_date = (i: number) => new Date(i).toLocaleString('en-US',
    { dateStyle: 'short', year: '2-digit' });

const Time_path = (a:number, b:number) => {
    console.log(((b - a)/1000/60).toFixed(2).replace('.','m'))
    return ((b - a)/1000/60).toFixed(2).replace('.','m ') + 'c';
} 

interface MyArray  {
    name: string,
    path: number,
    begintime: number,
    endtime: number,
    images: number,
    idpath: number
}

function Statistic() {
    
    const [path, setPath] = useState<MyArray[]>([]);
    const viewHeight = useSharedValue(200);

    const config = {
      duration: 1000,
      easing: Easing.bezier(0.5, 0.01, 0, 1),
    };
  
    const style = useAnimatedStyle(() => {
      return {
        height: withTiming(viewHeight.value, config),
      };
    });
    useEffect(() => {
        async function GetPaths() {
            const db = await SQLite.openDatabaseAsync('tracker',{
                useNewConnection: true
              }); 
          
            const paths = await db.getAllAsync('SELECT * FROM paths');
            console.log(paths);
            setPath([...paths]);            
        };
        GetPaths();
    }, []);

    return (
        <ScrollView style={styles.main}>
            <Animated.View style={[styles.mainBlock,style]}>
                <Text style={styles.headerText}>Statistic</Text>
                <View style={styles.pathBlock}>
                    <Text>№</Text>
                    {['Имя','Дата','Time','Путь','Фото'].
                    map(i=><Text key={i} style={styles.date}>{i}</Text>)}                    
                </View>
                {path.map((i,index) => <View 
                    style={[styles.pathBlock,{backgroundColor: index%2?'#fff':'#ddd'}]} key={i.id}>
                    <Text >{index+1}.</Text>
                    <Text style={styles.text}>{i.name}</Text>
                    <Text style={styles.text}>{Path_date(i.begintime)}</Text>
                    <Text style={styles.text}>{Time_path(i.begintime,i.endtime)}</Text>
                    <Text style={styles.text}>{i.path} m</Text>
                    <Link href={{ pathname: '/photo', params: {before: i.begintime, after: i.endtime}}} style={styles.text}>
                        <Text style={{textAlign: 'center',width: '100%'}}>{i.images}</Text>
                    </Link>
                   
                </View>
                )}
            </Animated.View>
        </ScrollView>
    )
}
export default Statistic;

const styles = StyleSheet.create({
    main: {
        width: '100%'
    },
    mainBlock: {
        width: '100%',
        backgroundColor: '#fff',
        marginTop: 8,
        borderRadius: 8,
        paddingBottom: 10
    },
    headerText: {
        textAlign: 'center',
        paddingTop: 10,
        fontSize: 22,
        fontWeight: 'bold'
    },
    pathBlock: {        
        padding: 8,
        flexDirection: 'row',
        alignItems:'center',
        justifyContent: 'space-between',
        gap: 10
    },
    date: {
        width: '16%',
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 17
    },
    text: {
        width: '16%',
        textAlign: 'center'
    }
})