import { Tabs } from 'expo-router';
import React from 'react';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { useSelector } from 'react-redux';

export default function TabLayout() {
  const { name } = useSelector(state => state.track)
  return (
    <Tabs screenOptions={{headerShown: false}}>
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
        name = "map"               
        options={{  
          href: name.length > 0 ? '/(tabs)/map' : null  ,              
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
