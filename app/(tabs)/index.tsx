import { 
  ImageBackground,
  StatusBar,
  StyleSheet,
  Text,  
} from 'react-native';
import MyLink from '@/components/Link';
import { useCallback, useState, useRef, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from 'expo-router';
import * as FileSystem from 'expo-file-system';
import { StorageAccessFramework } from 'expo-file-system';

const HomeScreen = () => { 
  const [back , setBack] = useState<string|null>('forest');
  
 
  

  useFocusEffect(
    useCallback(() => {     
      async function ReadStorage() {  
        // const permissions = await StorageAccessFramework.requestDirectoryPermissionsAsync();

        // if (permissions.granted) {
        //   // Gets SAF URI from response
        //   const uri = permissions.directoryUri;
        
        //   // Gets all files inside of selected directory
        //   const files = await StorageAccessFramework.readDirectoryAsync(uri);
        //   console.log(`Files inside ${uri}:\n\n${JSON.stringify(files)}`);
        // }
                   
        const background = await AsyncStorage.getItem('background');            
        setBack(background);      
      };
      ReadStorage();
     
      

    }, [])
  );
  const image = { uri : `https://superbob.pythonanywhere.com/image?name=${back}`}
  
  return (
    <ImageBackground
      style={styles.main_block}
      source={image}         
    >
      <StatusBar  barStyle="dark-content"  />    
      <MyLink path="paths" />
      <MyLink path="statistic" />
      <MyLink path="start" />     
    </ImageBackground>
  );
}
export default HomeScreen;
const styles = StyleSheet.create({
  main_block: {
    flex: 1,
    backgroundColor: '#ae3bec',
    justifyContent: 'space-around',
    alignItems: 'center',    
    alignContent: 'center'
  } 
});
