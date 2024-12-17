import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useCallback, useState } from "react";
import { Text, View, StyleSheet, Switch, TouchableHighlight, ImageBackground } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Colors } from "@/constants/Colors";
import { useDispatch, useSelector } from "react-redux";
import { settime, setweight, setsound } from "@/reduser";
import { useFonts } from "expo-font";
import { Link, useFocusEffect } from "expo-router";
const color = Colors.light.background;
import Toast , { BaseToast} from 'react-native-toast-message';

const Setting = () => {   
    const dispatch = useDispatch();
    const [sound, isSound ] = useState(true)
    const [back, setBack] = useState('forest');
    const { time, weight } = useSelector(state => state.track);   
    const [] = useFonts({
        'SpaceMono': require('../../assets/fonts/SpaceMono-Regular.ttf'),
    });
    useFocusEffect(
        useCallback(() => {            
            async function ReadStorage() {
                const dd = await AsyncStorage.multiGet(['time', 'weight', 'background']);
                let data = Object.fromEntries(dd);               
                if (time === null) return;
                setBack(data['background']);
                dispatch(settime(Number(data['time']??time)));
                dispatch(setweight(Number(data['weight']??weight)));                
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
            dispatch(setsound(sound));
            Toast.show({
                type: 'success',
                text1: 'Saved',
                topOffset: 150
            });

        } catch (e) {
            // saving error
        }
    };
    const toastConfig = {
        /*
          Overwrite 'success' type,
          by modifying the existing `BaseToast` component
        */
        success: (props) => (
          <BaseToast
            {...props}
            style={{ borderLeftColor: 'pink' }}
            contentContainerStyle={{ paddingHorizontal: 15 }}
            text1Style={{
              fontSize: 35,
              fontWeight: '400',
              color: '#000',
              textAlign: 'center'
            }}
          />
        )
    };
    return (
        <ImageBackground style={styles.main} source={image}>
            <Text style={styles.mainText}>Settings</Text>
            <View style={styles.timeBlock}>
                <Text style={styles.timeText} >Time step (sec)</Text>
                <View style={{borderRadius: 25, width: '100%',  flexDirection: 'row',  justifyContent: 'space-between', backgroundColor: 'blue' }} >
                    <LinearGradient style={styles.plusBtn} colors={color}>
                        <Ionicons onPress={() => dispatch(settime(time === 15000 ? 15000 : time - 15000))} name="remove-sharp" size={35} color="#fff" />
                    </LinearGradient>
                    <Text style={[styles.timeText, { width: 70 }]}>{(time / 1000).toFixed(0)}</Text>
                    <LinearGradient style={styles.plusBtn} colors={color}>
                        <Ionicons onPress={() => dispatch(settime(time + 15000))} name="add" size={35} color="#fff" />
                    </LinearGradient>
                </View>
            </View>
            <View style={styles.timeBlock}>
                <Text style={styles.timeText} >Weight (kg)</Text>
                <View style={{ backgroundColor: 'blue',borderRadius: 25, width: '100%', flexDirection: 'row', justifyContent: 'space-between' }}>
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
                <Text style={[styles.timeText, { marginHorizontal: 5 }]} >Stop sound</Text>
                <Switch
                    trackColor={{ false: '#767577', true: '#4c669f' }}
                    thumbColor={sound ? '#192f6a' : '#f4f3f4'}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={()=>isSound(!sound)}
                    style={{ transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }] }}
                    value={sound}
                />
            </View>
            <LinearGradient style={[styles.plusBtn, {marginTop: 5, width: '80%' }]} colors={color}>
                <Link href='/background' style={styles.link}>SET BACKGROUND IMAGE</Link>
            </LinearGradient>
            <TouchableHighlight
                activeOpacity={0.6}
                onPress={storeData}
            >
                <Ionicons style={styles.saveBtn} name="save" size={65} color="#4c669f" />
            </TouchableHighlight>
            <Toast config={toastConfig} />
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
        width: '80%',
        alignItems: 'center',      
    },
    timeText: {
        fontSize: 28,        
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