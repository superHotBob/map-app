import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import { Text, View, StyleSheet, Switch } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Colors } from "@/constants/Colors";
import { useDispatch, UseDispatch } from "react-redux";
import { settime } from "@/reduser"; 

const color = Colors.light.background;

const Setting = ({ settingView }) => {
    const [time, timeSet] = useState<number>(0.5);
    const [weight, weightSet] = useState(70);
    const [isEnabled, setIsEnabled] = useState(false);
    const dispatch = useDispatch();
    const toggleSwitch = () => setIsEnabled(previousState => !previousState);
    useEffect(() => {
        async function ReadStorage() {
            const time = await AsyncStorage.getItem('time');
            const weight = await AsyncStorage.getItem("weight");
            timeSet(Number(time));
            weightSet(Number(weight));
        };
        ReadStorage();
    }, [])
    const storeData = async () => {
        try {
            await AsyncStorage.multiSet([['weight', weight.toString()], ['time', time.toString()]]);
            const t = await AsyncStorage.getItem('time');
            dispatch(settime(time));
            settingView(false)
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
                            <Ionicons onPress={() => timeSet(time === 0.5 ? 0.5 : time - 0.5)} name="remove-sharp" size={35} color="#fff" />
                        </LinearGradient>
                        <Text style={[styles.timeText, { width: 40 }]}>{time}</Text>
                        <LinearGradient style={styles.plusBtn} colors={color}>
                            <Ionicons onPress={() => timeSet(time + 0.5)} name="add" size={35} color="#fff" />
                        </LinearGradient>
                    </View>
                </View>
                <View style={styles.timeBlock}>
                    <Text style={styles.timeText} >Weight (kg)</Text>
                    <View style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'center' }}>
                        <LinearGradient style={styles.plusBtn} colors={color}>
                            <Ionicons onPress={() => weightSet(weight === 20 ? 20 : weight - 1)} name="remove-sharp" size={35} color="#fff" />
                        </LinearGradient>
                        <Text style={[styles.timeText, { width: 40 }]}>{weight}</Text>
                        <LinearGradient style={styles.plusBtn} colors={color}>
                            <Ionicons onPress={() => weightSet(weight + 1)} name="add" size={35} color="#fff" />
                        </LinearGradient>
                    </View>
                </View>
                <View style={styles.timeBlock}>
                <Text style={styles.timeText} >Have fintess braslet ?</Text>
                    <Switch
                        trackColor={{ false: '#767577', true: '#4c669f' }}
                        thumbColor={isEnabled ? '#192f6a' : '#f4f3f4'}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={toggleSwitch}
                        style={{ transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }] }}
                        value={isEnabled}
                    />
                </View>           
            {/* <LinearGradient  style={styles.saveBtn} colors={color}> */}
            <Ionicons style={styles.saveBtn} onPress={storeData} name="save" size={45} color="violet" />
            {/* </LinearGradient> */}
        </View>
    )
};
export default Setting;

const styles = StyleSheet.create({
    main: {
        width: '100%',
        height: 500,
        backgroundColor: '#fff',
        borderRadius: 28,
        padding: 10,
        alignItems: "center",
        gap: 10       
    },
    mainText: {
        textAlign: 'center',
        fontSize: 22,
       
        fontWeight: 'bold'
    },
    timeBlock: {
        alignContent: 'center',       
        width: '100%',
        alignItems: 'center'
    },
    timeText: {
        fontSize: 22,
        marginHorizontal: 20,
        marginVertical: 5,       
        color: 'violet',
        textAlign: 'center'
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
        position: 'absolute',
        bottom: 10
    },
    plusBtn: {
        height: 50,
        borderRadius: 50,
        alignItems: 'center',
        width: 100,
        justifyContent: 'center'
    }
});