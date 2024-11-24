import {
    View, Text, TextInput,
    TouchableHighlight, StyleSheet
} from "react-native";
import { useFonts } from 'expo-font';
import { useState } from "react";
import { useDispatch } from "react-redux";
import { setname, addpoint, settype } from "@/reduser";
import * as Location from 'expo-location';
import { useRouter } from "expo-router";







function Enter() {
   
    const router = useRouter();
    const dispatch = useDispatch();  
    const [typemove, setTypeMove ] = useState('walking');
    const [name, setName] = useState('');     
    const [] = useFonts({
        'SpaceMono': require('../assets/fonts/SpaceMono-Regular.ttf'),        
    });
    const StartPath = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        let { status: status_back} = await Location.requestBackgroundPermissionsAsync()
        if (status !== 'granted') {            
            return;
        };
        if (status_back !== 'granted') {            
            return;
        };
        
        const {coords} = await Location.getCurrentPositionAsync({accuracy: 5});
       
        const first_point = {
            longitude: coords.longitude ,
            latitude: coords.latitude ,
            type: typemove,
            speed: 0
        };       
        dispatch(addpoint(first_point));
        dispatch(setname(name.trimEnd()));  
        dispatch(settype(typemove));
        router.push('/(tabs)/map');
        setName('');           
    };
    
    return (
        <View style={styles.mainBlock}>
            <Text style={{fontFamily: 'SpaceMono', fontSize: 24 }}>Select movie</Text>
            <View style={styles.selector}>                
                <Text 
                    onPress={()=>setTypeMove('walking')} 
                    style={[styles.btnText,
                        {backgroundColor: typemove === 'walking' ? 'green' : '#ddd'}]}
                >WALK</Text>
                <Text 
                    onPress={()=>setTypeMove('running')} 
                    style={[styles.btnText,
                    {backgroundColor: typemove === 'running' ? 'green' : '#ddd'}]}
                >RUN</Text>
            </View>            
            <Text style={{fontFamily: 'SpaceMono', fontSize: 22 }}>Enter path name</Text>
            <TextInput
                style={styles.input}
                value={name}
                placeholder="My best walk"
                autoFocus
                maxLength={15}
                cursorColor="blue"
                onChangeText={setName}
                inputMode="text"
                autoCapitalize='sentences'                
            />
            <TouchableHighlight disabled={name.length < 5} style={{ width: '80%',borderRadius: 28 }} onPress={StartPath}>
                <Text style={[styles.btnText,{width: '100%'}]}>start {typemove} </Text>
            </TouchableHighlight>
        </View>
    );
};
export default Enter;
const styles = StyleSheet.create({
    selector: {
        flexDirection: 'row',
        width: '80%',
        justifyContent: 'space-between'       
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
        paddingTop: 100,
        justifyContent: 'flex-start',
        alignItems: 'center',        
        gap: 16,
        backgroundColor: '#fff'
    },
    btnText: {
        fontSize: 25,
        fontWeight: 'bold',
        textAlign: 'center',
        backgroundColor: 'blue',
        lineHeight: 60,
        height: 60,
        color: '#fff',
        borderRadius: 28,
        width: 120,
        letterSpacing: 1.3,
        textTransform: 'uppercase'
    }
});