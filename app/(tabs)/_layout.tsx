import { Tabs } from 'expo-router';
import React from 'react';

import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
      }}>
      <Tabs.Screen
        name="index"       
        options={{
          tabBarShowLabel: false,
          tabBarActiveBackgroundColor: '#ddd',         
          tabBarIcon: ({ focused }) => (
            <TabBarIcon name={focused ? 'home' : 'home-outline'} color='#192f6a' />
          ),
        }}
      />
       
      <Tabs.Screen
        name="map"
        options={{          
          tabBarShowLabel: false,
          tabBarActiveBackgroundColor: '#ddd',
          tabBarIcon: ({ focused }) => (
            <TabBarIcon name={focused ? 'map' : 'map-outline'} color='#192f6a' />
          ),
        }}
      />
       <Tabs.Screen
        name="camera"
        options={{          
          tabBarShowLabel: false,
          tabBarActiveBackgroundColor: '#ddd',
          tabBarIcon: ({ focused }) => (
            <TabBarIcon name={focused ? 'camera' : 'camera-outline'} color='#192f6a' />
          ),
        }}
      />
      <Tabs.Screen
        name="setting"       
        options={{
          tabBarShowLabel: false,
          tabBarActiveBackgroundColor: '#ddd',         
          tabBarIcon: ({ focused }) => (
            <TabBarIcon name={focused ? 'settings' : 'settings-outline'} color='#192f6a' />
          ),
        }}
      />
    </Tabs>
  );
}
