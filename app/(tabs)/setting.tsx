import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import { Text, View, StyleSheet, Switch, StatusBar } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Colors } from "@/constants/Colors";
import { useDispatch, useSelector } from "react-redux";
import { setbraslet, settime, setweight } from "@/reduser";
import { useFonts } from "expo-font";
const color = Colors.light.background;

const Setting = () => {

    const [isEnabled, setIsEnabled] = useState(false);
    const dispatch = useDispatch();
    const { time, weight, braslet } = useSelector(state => state.track);
    const toggleSwitch = () => dispatch(setbraslet(!braslet));
    const [loaded, error] = useFonts({
        'SpaceMono': require('../../assets/fonts/SpaceMono-Regular.ttf'),
    });
    useEffect(() => {
        async function ReadStorage() {
            const time = await AsyncStorage.getItem('time');
            const weight = await AsyncStorage.getItem("weight");
            dispatch(settime(Number(time)));
            dispatch(setweight(Number(weight)));
            console.log(time, weight, braslet);
        };
        ReadStorage();
    }, [])
    const storeData = async () => {
        try {
            await AsyncStorage.multiSet([['weight', weight.toString()], ['time', time.toString()]]);
            const t = await AsyncStorage.getItem('time');
            dispatch(settime(t));
           
        } catch (e) {
            // saving error
        }
    };
    return (
        <View style={styles.main}>
            <Text style={styles.mainText}>Settings</Text>
            <View style={styles.timeBlock}>
                <Text style={styles.timeText} >Time step (min)</Text>
                <View style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'center' }}>
                    <LinearGradient style={styles.plusBtn} colors={color}>
                        <Ionicons onPress={() => dispatch(settime(time === 0.5 ? 0.5 : time - 0.5))} name="remove-sharp" size={35} color="#fff" />
                    </LinearGradient>
                    <Text style={[styles.timeText, { width: 50 }]}>{time}</Text>
                    <LinearGradient style={styles.plusBtn} colors={color}>
                        <Ionicons onPress={() => dispatch(settime(time + 0.5))} name="add" size={35} color="#fff" />
                    </LinearGradient>
                </View>
            </View>
            <View style={styles.timeBlock}>
                <Text style={styles.timeText} >Weight (kg)</Text>
                <View style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'center' }}>
                    <LinearGradient style={styles.plusBtn} colors={color}>
                        <Ionicons onPress={() => dispatch(setweight(weight === 20 ? 20 : weight - 1))} name="remove-sharp" size={35} color="#fff" />
                    </LinearGradient>
                    <Text style={[styles.timeText, { width: 40 }]}>{weight}</Text>
                    <LinearGradient style={styles.plusBtn} colors={color}>
                        <Ionicons onPress={() => dispatch(setweight(weight + 1))} name="add" size={35} color="#fff" />
                    </LinearGradient>
                </View>
            </View>
            <View style={styles.timeBlock}>
                <Text style={[styles.timeText,{marginHorizontal: 5}]} >Have fitness bracelet ?</Text>
                <Switch
                    trackColor={{ false: '#767577', true: '#4c669f' }}
                    thumbColor={isEnabled ? '#192f6a' : '#f4f3f4'}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={toggleSwitch}
                    style={{ transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }] }}
                    value={braslet}
                />
            </View>
            <Ionicons style={styles.saveBtn} onPress={storeData} name="save" size={55} color="#4c669f" />

        </View>
    )
};
export default Setting;

const styles = StyleSheet.create({
    main: {
        width: '100%',
        flex: 1,
        backgroundColor: '#ddd',
        justifyContent: 'center',
        padding: 10,
        alignItems: "center",
        marginTop: StatusBar.currentHeight,
        gap: 10
    },
    mainText: {
        textAlign: 'center',
        fontSize: 24,
        fontWeight: 'bold'
    },
    timeBlock: {
        alignContent: 'center',
        width: '100%',
        alignItems: 'center'
    },
    timeText: {
        fontSize: 24,
        marginHorizontal: 10,
        marginVertical: 5,
        color: 'violet',
        textAlign: 'center',
        fontFamily: 'SpaceMono'
    },
    minus: {
        color: '#fff',
        fontSize: 30
    },
    saveBtn: {
        height: 52,
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20
    },
    plusBtn: {
        height: 50,
        borderRadius: 50,
        alignItems: 'center',
        width: 100,
        justifyContent: 'center'
    }
});