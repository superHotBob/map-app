import {
    View, Text, TextInput,
    TouchableHighlight, StyleSheet
} from "react-native";
import { useFonts } from 'expo-font';
import { useState } from "react";
import { useDispatch } from "react-redux";
import { setname, addpoint } from "@/reduser";


function Enter({typemove}:{typemove: string}) {
    const [name, setName] = useState('')
    const dispatch = useDispatch();   
    const [loaded, error] = useFonts({
        'SpaceMono': require('../assets/fonts/SpaceMono-Regular.ttf'),        
    });
    const StartPath = async () => {
        // let { status } = await Location.requestForegroundPermissionsAsync();
        // if (status !== 'granted') {
        //     console.log('Permission to access location was denied');
        //     return;
        // };
        // const data = await Location.getCurrentPositionAsync({});
        // const point = {
        //     longitude: data.coords.longitude + (0.01 - Math.random() / 50),
        //     latitude: data.coords.latitude + (0.01 + Math.random() / 50),
        //     type: typemove
        // };
        // dispatch(addpoint(point));
        dispatch(setname(name));       
    };
    return (
        <View style={styles.mainBlock}>
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
                <Text style={styles.btnText}>Start {typemove} </Text>
            </TouchableHighlight>
        </View>
    );
};
export default Enter;
const styles = StyleSheet.create({
    input: {
        height: 50,
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
        color: '#fff',
        borderRadius: 28,
       
    }
});