import { store } from '../store';
import { Provider } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import {  Alert } from 'react-native';
import 'react-native-reanimated';
import {  useGlobalSearchParams} from 'expo-router';

// Prevent the splash screen from auto-hiding before asset loading is complete.
// SplashScreen.preventAutoHideAsync();

export default function RootLayout() { 
  const [loaded, error] = useFonts({
    'SpaceMono': require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  const { filename } = useGlobalSearchParams();  
 
  useEffect(() => {    
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }
  const showAlert = () =>
    Alert.alert(
      'Помощь',
      'Сам себе помоги',      
      [
        {
          text: 'Закрыть',          
          style: 'default',
        }
       
      ],
      {
        cancelable: true,
        onDismiss: () => console.log("Closed")
          
      },
    );
    
  return (
    <Provider store={store}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen 
          name="photo" 
          options={{
            headerTintColor: 'blue', 
            headerTitleAlign: 'center', 
            title: 'Photos', 
            headerTitleStyle:{color: 'blue',fontSize: 22, fontFamily: 'SpaceMono'},  
            headerShown: false
          }} 
        />
        <Stack.Screen 
          name="statistic" 
          options={{
            headerTintColor: 'blue', 
            
            headerTitleAlign: 'center', 
            title: 'Statistic', 
            headerTitleStyle:{color: 'blue',fontSize: 22, fontFamily: 'SpaceMono'},  
            headerShown: true
          }} 
        />
         <Stack.Screen 
          name="paths" 
          options={{
            headerTintColor: 'blue', 
            headerTitleAlign: 'center', 
            title: 'My paths', 
            headerTitleStyle:{color: 'blue',fontSize: 22, fontFamily: 'SpaceMono'},  
            headerShown: true
          }} 
        /> 
         <Stack.Screen 
          name="enter" 
          options={{
            headerTintColor: 'blue', 
            headerTitleAlign: 'center', 
            title: 'Begin path', 
            headerTitleStyle:{color: 'blue',fontSize: 22, fontFamily: 'SpaceMono'},  
            headerShown: true
          }} 
        />   
       
        <Stack.Screen name="+not-found" />
      </Stack>
    </Provider>
  );
}
