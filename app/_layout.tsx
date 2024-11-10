import { store } from '../store';
import { Provider } from 'react-redux';

import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import {  Alert, useColorScheme } from 'react-native';
import { Colors } from '@/constants/Colors';



// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() { 
  const sheme = useColorScheme();
  
  const color = Colors[sheme];  
  const [loaded, error] = useFonts({
    'SpaceMono': require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  
 
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
    const styleHeader = {
      color: color.tint,
      fontSize: 22, 
      fontFamily: 'SpaceMono',
      fontWeight: 'bold'
    };
    
  return (
    <Provider store={store}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen 
          name="path" 
          options={{
            headerTintColor: color.tint, 
            headerTitleAlign: 'center', 
            title: 'Photos', 
            headerTitleStyle:  styleHeader ,  
            headerShown: false
          }} 
        />
        <Stack.Screen 
          name="statistic" 
          options={{
            headerTintColor: color.tint,            
            headerTitleAlign: 'center', 
            title: 'Statistic', 
            headerLargeTitle: true,
            headerTitleStyle: styleHeader,  
            headerShown: true
          }} 
        />
        <Stack.Screen 
          name="background" 
          options={{
            headerTintColor: color.tint,            
            headerTitleAlign: 'center', 
            title: 'Select background', 
            headerLargeTitle: true,
            headerTitleStyle: styleHeader,  
            headerShown: true
          }} 
        />
         <Stack.Screen 
          name="paths" 
          options={{
            headerTintColor: color.tint, 
            headerTitleAlign: 'center', 
            title: 'My paths', 
            headerTitleStyle: styleHeader,  
            headerShown: true
          }} 
        />
       
         <Stack.Screen 
          name="start" 
          options={{
            headerTintColor: color.tint, 
            headerTitleAlign: 'center', 
            title: 'Begin path', 
            headerTitleStyle: styleHeader,  
            headerShown: true
          }} 
        />   
       
        <Stack.Screen name="+not-found" />
      </Stack>
    </Provider>
  );
}
