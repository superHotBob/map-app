import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useCallback, useEffect, useState } from "react";
import { Text, View, StyleSheet, Switch, StatusBar, TouchableHighlight, ImageBackground } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Colors } from "@/constants/Colors";
import { useDispatch, useSelector } from "react-redux";
import { setbraslet, settime, setweight } from "@/reduser";
import { useFonts } from "expo-font";
import { Link, useFocusEffect } from "expo-router";
const color = Colors.light.background;

const Setting = () => {

    const [isEnabled, setIsEnabled] = useState(false);
    const dispatch = useDispatch();
    const [back, setBack] = useState('forest');
    const { time, weight, braslet } = useSelector(state => state.track);
    const toggleSwitch = () => dispatch(setbraslet(!braslet));
    const [loaded, error] = useFonts({
        'SpaceMono': require('../../assets/fonts/SpaceMono-Regular.ttf'),
    });
    useFocusEffect(
        useCallback(() => {
            async function ReadStorage() {           
                const dd = await AsyncStorage.multiGet(['time','weight','background']);
                let data = Object.fromEntries(dd);           
                if (time === null) return;
                setBack(data['background']);
                dispatch(settime(Number(data['time'])));
                dispatch(setweight(Number(data['weight'])));
            };
            ReadStorage();
        }, [])
    );
   
    
    const image = { uri: 'https://superbob.pythonanywhere.com/image?name=' + back }
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
        <ImageBackground style={styles.main} source={image}>
            <Text style={styles.mainText}>Settings</Text>
            <View style={styles.timeBlock}>
                <Text style={styles.timeText} >Time step (min)</Text>
                <View style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'center' }}>
                    <LinearGradient style={styles.plusBtn} colors={color}>
                        <Ionicons onPress={() => dispatch(settime(time === 30000 ? 30000 : time - 30000))} name="remove-sharp" size={35} color="#fff" />
                    </LinearGradient>
                    <Text style={[styles.timeText, { width: 70 }]}>{(time / 60000).toFixed(1)}</Text>
                    <LinearGradient style={styles.plusBtn} colors={color}>
                        <Ionicons onPress={() => dispatch(settime(time + 30000))} name="add" size={35} color="#fff" />
                    </LinearGradient>
                </View>
            </View>
            <View style={styles.timeBlock}>
                <Text style={styles.timeText} >Weight (kg)</Text>
                <View style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'center' }}>
                    <LinearGradient style={styles.plusBtn} colors={color}>
                        <Ionicons onPress={() => dispatch(setweight(weight === 20 ? 20 : weight - 1))} name="remove-sharp" size={35} color="#fff" />
                    </LinearGradient>
                    <Text style={[styles.timeText, { width: 70 }]}>{weight}</Text>
                    <LinearGradient style={styles.plusBtn} colors={color}>
                        <Ionicons onPress={() => dispatch(setweight(weight + 1))} name="add" size={35} color="#fff" />
                    </LinearGradient>
                </View>
            </View>
            <View style={styles.timeBlock}>
                <Text style={[styles.timeText, { marginHorizontal: 5 }]} >Have fitness bracelet?</Text>
                <Switch
                    trackColor={{ false: '#767577', true: '#4c669f' }}
                    thumbColor={isEnabled ? '#192f6a' : '#f4f3f4'}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={toggleSwitch}
                    style={{ transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }] }}
                    value={braslet}
                />
            </View>
            <LinearGradient style={[styles.plusBtn, { width: 300 }]} colors={color}>
                <Link href='/background' style={styles.link}>SET BACKGROUND IMAGE</Link>
            </LinearGradient>
            <TouchableHighlight
                activeOpacity={0.6}
                
                onPress={storeData}
            >
                <Ionicons style={styles.saveBtn} name="save" size={65} color="#4c669f" />
            </TouchableHighlight>
        </ImageBackground>
    )
};
export default Setting;

const styles = StyleSheet.create({
    main: {
        width: '100%',
        flex: 1,
        backgroundColor: '#ddd',
        justifyContent: 'center',       
        alignItems: "center",
        marginTop: StatusBar.currentHeight,
        gap: 10
    },
    mainText: {
        textAlign: 'center',
        fontSize: 36,
        fontWeight: 'bold',
        color: '#fff'
    },
    timeBlock: {
        alignContent: 'center',
        width: '100%',
        alignItems: 'center'
    },
    timeText: {
        fontSize: 28,
        marginHorizontal: 10,
        marginVertical: 5,       
        textAlign: 'center',
        fontFamily: 'SpaceMono',
        color: '#fff'
    },
    minus: {
        color: '#fff',
        fontSize: 30
    },
    saveBtn: {
        height: 70,
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20
    },
    plusBtn: {
        height: 50,
        borderRadius: 50,
        alignItems: 'center',
        width: 120,
        justifyContent: 'center'
    },
    link: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
        letterSpacing: 1.2,

    }
});