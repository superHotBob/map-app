import {
    View, Text, TextInput,
    TouchableHighlight, StyleSheet,
    Button
} from "react-native";
import { useFonts } from 'expo-font';
import { useState } from "react";
import { useDispatch } from "react-redux";
import { setname, addpoint, settype } from "@/reduser";
import * as Location from 'expo-location';
import { useRouter } from "expo-router";
import { Path_date } from "@/scripts/functions";


const Start: React.FC = () => {   
    const router = useRouter();
    const dispatch = useDispatch();  
    // const [typemove, setTypeMove ] = useState('running');
    const [name, setName] = useState(Path_date(Date.now(),'ru-RU'));     
    const [] = useFonts({
        'SpaceMono': require('../assets/fonts/SpaceMono-Regular.ttf'),        
    });
    const StartPath = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();       
        if (status !== 'granted') {            
            return;
        };        
        const { coords : { speed,  latitude, longitude}} = await Location.getCurrentPositionAsync({accuracy: 5});       
       
        const first_point = [
            latitude ,
            longitude ,            
            'running',
            speed
        ];       
        dispatch(addpoint(first_point));
        dispatch(setname(name.trimEnd()));  
        // dispatch(settype(typemove));
        router.push('/(tabs)/map');
        setName('');           
    };
    function setDateName() {
        setName("" + Date.now())
    };
    
    return (
        <View style={styles.mainBlock}>
            {/* <Text style={styles.mainText}>Select</Text>
            <View style={styles.selector}>                
                <Text 
                    onPress={()=>setTypeMove('walking')} 
                    style={[
                        styles.btnText,
                        {
                            backgroundColor: typemove === 'walking' ? '#ff7fff' : '#ddd',
                            color: typemove === 'walking' ? '#fff' : '#ff7fff' ,
                        }
                    ]}
                >
                    WALKING
                </Text>
                <Text 
                    onPress={()=>setTypeMove('running')} 
                    style={[
                        styles.btnText,
                        {
                            backgroundColor: typemove === 'running' ? '#ff7fff' : '#ddd',
                            color: typemove === 'running' ? '#fff' : '#ff7fff',
                        }
                    ]}
                >
                    RUNNING
                </Text>
            </View>             */}
            <Text style={{fontFamily: 'SpaceMono', fontSize: 28 }}>Enter path name or</Text>
            <Button   onPress={setDateName} title="Set name how date" />
            <TextInput
                style={styles.input}
                value={Number(name) ? Path_date(Date.now(),'ru-RU') : name}
                placeholder="My best walk"
                autoFocus
                defaultValue={Path_date(Date.now(),'ru-RU')}
                maxLength={18}
                cursorColor="blue"
                onChangeText={setName}
                inputMode="text"
                autoCapitalize='sentences'                
            />
            <TouchableHighlight disabled={name.length < 5} style={{ width: '90%',borderRadius: 28 }} onPress={StartPath}>
                <Text style={[styles.btnText,{width: '100%'}]}>start movie </Text>
            </TouchableHighlight>
        </View>
    );
};
export default Start;
const styles = StyleSheet.create({
    selector: {
        flexDirection: 'row',
        width: '90%',
        justifyContent: 'space-between'       
    },
    mainText: {
        fontFamily: 'SpaceMono', 
        fontSize: 28 
    },
    input: {
        height: 60,
        width: '90%',
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: '#ff7fff',
        color: '#ff7fff',
        borderWidth: 1,
        paddingHorizontal: 25,
        borderRadius: 28,
        fontSize: 22,
        fontFamily: 'SpaceMono',
    },
    mainBlock: {        
        flex: 1,
        paddingTop: 10,
        justifyContent: 'flex-start',
        alignItems: 'center',        
        gap: 16,
        backgroundColor: '#f3ecec'
    },
    btnText: {
        fontSize: 25,
        fontWeight: 'bold',
        textAlign: 'center',
        backgroundColor: '#ff7fff',
        lineHeight: 60,
        height: 60,
        color: '#fff',
        borderRadius: 28,
        width: '47%',
        letterSpacing: 1.3,
        textTransform: 'uppercase'
    }
});