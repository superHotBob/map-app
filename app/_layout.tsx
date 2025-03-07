import { store } from '../store';
import { Provider } from 'react-redux';
import 'expo-dev-client';
import { useFonts } from 'expo-font';
import { router, Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, Suspense } from 'react';
import {useColorScheme,  Text } from 'react-native';
import { Colors } from '@/constants/Colors';
import ErrorBoundary from 'react-native-error-boundary'
import { Ionicons } from '@expo/vector-icons';
import CustomFallback from '@/components/CustomFallBack';

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
            name="pathdata"
            options={{              
              title: 'Path data',
              headerShown: true,
              headerRight: () => <Ionicons color={color.tint} name='bar-chart-outline' size={35} onPress={() => router.push('/statistic')}  />,
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
            name="statistic"
            options={{              
              title: 'Statistics',
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

