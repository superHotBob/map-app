import { View,  Image, Text } from 'react-native';
import { Link, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useLocalSearchParams } from 'expo-router';

export default function Modal() {
    const params = useLocalSearchParams() 
 
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
     
      <Image 
        style={{height: +params.height ,width: '100%'}} 
        source={{uri: params.uri}} 
        
      />
    
    </View>
  );
}