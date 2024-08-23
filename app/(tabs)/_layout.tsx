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
          tabBarLabelStyle: {color: 'blue',fontSize: 0},
          
          tabBarIcon: ({ focused }) => (
            <TabBarIcon name={focused ? 'home' : 'home-outline'} color='blue' />
          ),
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          
          tabBarLabelStyle: {color: 'blue',fontSize: 0},
          tabBarIcon: ({ focused }) => (
            <TabBarIcon name={focused ? 'map' : 'map-outline'} color='blue' />
          ),
        }}
      />
    </Tabs>
  );
}
