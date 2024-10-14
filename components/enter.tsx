import {
    View, Text, TextInput,
    TouchableHighlight, StyleSheet
} from "react-native";
import { useFonts } from 'expo-font';
import { useState } from "react";
import { useDispatch,useSelector } from "react-redux";
import { setname, addpoint, settime, settype } from "@/reduser";
import * as Location from 'expo-location';
import AsyncStorage from "@react-native-async-storage/async-storage";

function Enter() {
    const [typemove, setTypeMove ] = useState('walking');
    const [name, setName] = useState('')
    const dispatch = useDispatch();   
    const [loaded, error] = useFonts({
        'SpaceMono': require('../assets/fonts/SpaceMono-Regular.ttf'),        
    });
    const StartPath = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            console.log('Permission to access location was denied');
            return;
        };
        const data = await Location.getCurrentPositionAsync({});
        const first_point = {
            longitude: data.coords.longitude ,
            latitude: data.coords.latitude ,
            type: typemove
        };
        const interval = await AsyncStorage.getItem('time');
        dispatch(settime(interval));
        dispatch(addpoint(first_point));
        dispatch(setname(name));  
        dispatch(settype(typemove));     
    };
    
    return (
        <View style={styles.mainBlock}>
            <Text style={{fontFamily: 'SpaceMono', fontSize: 22 }}>Select type</Text>
            <View style={styles.selector}>                
                <Text 
                    onPress={()=>setTypeMove('walking')} 
                    style={[
                        styles.btnText,
                        {width: 150, backgroundColor: typemove === 'walking' ? 'green' : '#ddd'}]}
                >WALK</Text>
                <Text 
                onPress={()=>setTypeMove('running')} 
                style={[
                    styles.btnText,
                    {width: 150,backgroundColor: typemove === 'running' ? 'green' : '#ddd'}]}
                >RUN</Text>
            </View>
            <Text style={{fontFamily: 'SpaceMono', fontSize: 22 }}>Enter path name</Text>
            <TextInput
                style={styles.input}
                value={name}
                autoFocus
                cursorColor="blue"
                onChangeText={setName}
                autoCapitalize='sentences'                
            />
            <TouchableHighlight disabled={name.length < 5} style={{ width: '80%',borderRadius: 28 }} onPress={StartPath}>
                <Text style={styles.btnText}>START {typemove} </Text>
            </TouchableHighlight>
        </View>
    );
};
export default Enter;
const styles = StyleSheet.create({
    selector: {
        flexDirection: 'row',
        width: '80%',
        justifyContent: 'space-between',
        marginVertical: 20
    },
    input: {
        height: 60,
        width: '80%',
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: 'blue',
        color: 'blue',
        borderWidth: 1,
        paddingHorizontal: 25,
        borderRadius: 28,
        fontSize: 22,
        fontFamily: 'SpaceMono',
    },
    mainBlock: {        
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',        
        gap: 16,
    },
    btnText: {
        fontSize: 25,
        fontWeight: 'bold',
        textAlign: 'center',
        backgroundColor: 'blue',
        lineHeight: 55,
        height: 60,
        color: '#fff',
        borderRadius: 28,
       
    }
});