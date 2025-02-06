import { store } from '../store';
import { Provider } from 'react-redux';
import 'expo-dev-client';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, Suspense } from 'react';
import { Alert, useColorScheme, View, Text, StyleSheet, Button } from 'react-native';
import { Colors } from '@/constants/Colors';
import ErrorBoundary from 'react-native-error-boundary'


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
 
  const CustomFallback = (props: { error: Error, resetError: Function }) => (
    <View style={{flex: 1, alignItems: 'center', justifyContent:'center'}}>
      <Text style={{fontSize: 30}}>Error</Text>
      <Text style={{ width: '80%',marginVertical: 20, fontSize: 20}}>{props.error.toString()}</Text>
      <Button  title='back' onPress={()=>props.resetError()}/>
    </View>
  )

  return (
    <Provider store={store}>
      <Suspense fallback={<Text>Loading...</Text>}>
      <ErrorBoundary FallbackComponent={CustomFallback}>
        <Stack
          screenOptions={{
            headerStyle: {
              backgroundColor: '#fff',
            },
            headerTintColor: color.tint,
            headerTitleAlign: 'center',
            headerTitleStyle: {
              fontSize: 23,
              fontFamily: 'SpaceMono',
              color: color.tint
            }
          }}
        >
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="notification"
            options={{              
              title: 'Photos',
              headerShown: false
            }}
          />
          <Stack.Screen
            name="statistic"
            options={{              
              title: 'Statistic',
              headerShown: true
            }}
          />
          <Stack.Screen
            name="pathmap"
            options={{              
              title: 'map',
              headerLargeTitle: true,
              headerShown: true
            }}
          />
          <Stack.Screen
            name="background"
            options={{             
              title: 'Select background'              
            }}
          />
          <Stack.Screen
            name="paths"
            options={{             
              title: 'My paths'              
            }}
          />
          <Stack.Screen
            name="start"
            options={{             
              title: 'Begin new path',
              headerShown: true
            }}
          />
          <Stack.Screen name="+not-found" />
        </Stack>
      </ErrorBoundary>
      </Suspense>
    </Provider>
  );
}

