import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import { Text, View, StyleSheet, TextInput, Button } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Setting = ({settingView}) => {
    const [time, timeSet] = useState<number>(1);
    useEffect(()=>{
       async function ReadStorage() {
        try {
            const value = await AsyncStorage.getItem('time');          
            timeSet(Number(value));           
          } catch (e) {           
          }
        };
        ReadStorage();
    },[])
    const storeData = async() => {
        try {
          await AsyncStorage.setItem('time', time.toString());
          settingView(false)  
        } catch (e) {
          // saving error
        }
    };
    return (
        <View style={styles.main}>
            <View>
                <Text style={styles.mainText}>Setting</Text>
                <View style={styles.timeBlock}>
                    <Text style={styles.timeText} >Time step (min)</Text>
                    <View style={{alignItems: 'center', flexDirection: 'row', justifyContent: 'center'}}>
                    <LinearGradient style={styles.plusBtn} colors={['#4c669f', '#3b5998', '#192f6a']}>
                        <Ionicons onPress={()=>timeSet(time === 1 ? 1 : time - 1)}  name="remove-sharp" size={35} color="#fff" />
                    </LinearGradient>
                    <Text  style={styles.timeText}>{time}</Text>
                    <LinearGradient style={styles.plusBtn} colors={['#4c669f', '#3b5998', '#192f6a']}>
                        <Ionicons onPress={()=>timeSet(time + 1)} name="add" size={35} color="#fff" />
                    </LinearGradient>
                    </View>
                </View>
            </View>
            <LinearGradient  style={styles.saveBtn} colors={['#4c669f', '#3b5998', '#192f6a']}>
                <Ionicons onPress={storeData} name="save" size={35} color="#fff" />
            </LinearGradient>

        </View>
    )
};
export default Setting;

const styles = StyleSheet.create({
    main: {
        width: '100%',
        height: 500,
        backgroundColor: '#fff',
        borderRadius: 8,
        marginTop: 8,
        padding: 10,
        justifyContent: 'space-between'
    },
    mainText: {
        textAlign: 'center',
        fontSize: 22,
        fontWeight: 'bold'
    },
    timeBlock: {
       
        alignContent: 'center',
        marginTop: 10,
        width: '100%',
        alignItems: 'center'
    },
    timeText: {
        fontSize: 22,
        marginHorizontal: 20,
        fontWeight: 'bold',
        color: 'violet'
    },
    minus: {
        color: '#fff',
        fontSize: 30
    },
    saveBtn: {
        height: 50,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center'
    },
    plusBtn: {
        height: 50,
        borderRadius: 50,
        alignItems: 'center',
        width: 50,
        justifyContent: 'center'
    }
});