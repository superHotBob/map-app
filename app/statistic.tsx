import { Button, StyleSheet, Text, View } from "react-native";
import * as SQLite from 'expo-sqlite';
import { useCallback, useState } from "react";
import { useFocusEffect } from "expo-router";
import ChartStatistics from '@/components/ChartStatistics';
import { Converter, ConverterToDay } from "@/scripts/functions";

const Statistic = () => {
    const [paths, setPaths] = useState([]);
    const [calories, setCalories] = useState(0)
    const [periodNum, setPeriodNum] = useState(0);
    const [period, setPeriod] = useState(1);

    const dataDistance = paths.map(i => i.path)
    const map1 = new Map()
    const dataPath = paths.map(i=>map1.set(i.path,  ConverterToDay(i.begintime)));
    console.log(dataPath)
    const dataDuration = paths.map(i => +((i.endtime - i.begintime) / 1000 / 60).toFixed(0))

    const dayDistance = dataDistance.reduce((a, acu) => acu + a, 0)
    const dayDuration = dataDuration.reduce((a, acu) => acu + a, 0)
    const labels = paths.map(i => Converter(i.begintime, 0, period));

    const dd = new Date();
    const day = 86400000;
    const Day = dd.getDay() === 0 ? 7 : dd.getDay() - 1;
    const millsec = (period === 1 ?
        0 : period === 7 ?
            Day * day : ((dd.getDate() - 1) * day)) + dd.getHours() * 3600000 + dd.getMinutes() * 60 * 1000;
    const interval = periodNum === 0 ? day - millsec : day;

    const begin = Date.now() - millsec - interval * period * periodNum;
    const end = Date.now() - (periodNum === 0 ? 0 : millsec + interval * period * (periodNum - 1) + (period === 7 ? interval : 0));

    useFocusEffect(
        useCallback(() => {
            async function GetAssets() {
                const db = await SQLite.openDatabaseAsync('tracker', {
                    useNewConnection: true
                });
                const paths = await db
                    .getAllAsync('SELECT * FROM paths WHERE begintime > ? AND  begintime < ? ', begin, end);
                setPaths(paths);
                const runs = await db
                    .getAllAsync('SELECT calories FROM run WHERE begintime > ? AND  begintime < ? ', begin, end);
                const calories = runs.reduce((acu, a) => acu + a.calories, 0)
                setCalories(calories);
            };
            GetAssets();
        }, [period, periodNum])
    );
    const SetPeriod = (a: number) => {
        setPeriod(a);
        setPeriodNum(0);
    }

    function StartSwipe(a) {        
        if (a === 1) {
           return  setPeriodNum(prev => prev - 1)
        }
        setPeriodNum(prev => prev + 1)
    }
    return (
        <View style={styles.wrap_block}>
            <View style={styles.header_block}>
                <Button
                    onPress={() => SetPeriod(1)}
                    color={period === 1 ? "red" : ''}
                    title=" Day "
                />
                <Button
                    onPress={() => SetPeriod(7)}
                    color={period === 7 ? "red" : ''}
                    title=" weak "
                />
                <Button
                    onPress={() => SetPeriod(30)}
                    color={period === 30 ? "red" : ''}
                    title=" mounth "
                />
            </View>
           
            <View style={{
                flexDirection: 'row', 
                width: '90%',
               
                justifyContent: 'center',gap: 15, 
                alignItems: 'center'
            }}>
                <Button  color="green" onPress={() => StartSwipe(-1)} title="prev" />
                <Text style={[styles.chart_header, { marginBottom: 0,  paddingHorizontal: 10,   fontSize: 23, color: "maroon" }]}>

                    {period === 1 ? Converter(Date.now() - 86400000 * periodNum, 1, period) :
                        <> {Converter(begin, 0, period)} - {Converter(end, 0, period)}</>
                    }
                </Text>
                <Button color="blue" disabled={periodNum === 0} onPress={() => StartSwipe(1)} title="next" />
            </View>
            
            <ChartStatistics data={dataDuration} labels={labels} />
            <Text style={styles.chart_header}>Duration (min) - {dayDuration}</Text>
            
            <ChartStatistics data={dataDistance} labels={labels} />
            <Text style={styles.chart_header}>Distance (m) - {dayDistance}</Text>
            <Text style={[styles.chart_header, styles.calories]}>Calories (kcal) - {calories.toFixed(2)}</Text>

        </View>
    )
}
const styles = StyleSheet.create({
    wrap_block: {
        paddingTop: 10,
        
        alignItems: 'center'
    },
    header_block: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        gap: 15,
        margin: 10
    },
    header_text: {
        fontSize: 20,
        fontWeight: 'bold',
        width: '30%',
        marginVertical: 20,
        borderBottomWidth: 1,
        padding: 2,
        textAlign: 'center'
    },
    chart_header: {
        fontSize: 20,
        marginTop: 5,
        marginBottom: 15,
        fontWeight: 'bold',
    },
    calories: {
        color: 'red',
        marginTop: 30,
        fontSize: 30
    }
})
export default Statistic;
