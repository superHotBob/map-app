import { Tabs } from 'expo-router';
import React from 'react';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { useSelector } from 'react-redux';


export default function TabLayout() {
  const { name } = useSelector(state => state.track);  
  return (
    <Tabs screenOptions={{      
        headerShown: false,       
        tabBarStyle: {
          backgroundColor: 'transparent', 
          position: 'absolute' ,
          elevation: 0,
          borderTopWidth: 0,          
          left: 0,
          right: 0,
          bottom: 0,
          height: 60          
        },
        tabBarShowLabel: false,             
      }}
    >
      <Tabs.Screen
        name="index"       
        options={{ 
                          
          tabBarIcon: ({ focused }) => (
            <TabBarIcon  name={focused ? 'home' : 'home-outline'}/>
          )
        }}
      />       
      <Tabs.Screen
        name = "map"               
        options={{  
          href: name.length > 0 ? '/(tabs)/map' : null ,          
          tabBarIcon: ({ focused }) => (
            <TabBarIcon name={focused ? 'map' : 'map-outline'} />
          ),
        }}
      />
       <Tabs.Screen
        name="camera"
        options={{  
          href: name.length > 0 ? '/(tabs)/camera' : null,          
          tabBarIcon: ({ focused }) => (
            <TabBarIcon name={focused ? 'camera' : 'camera-outline'}/>
          ),
        }}
      />
      <Tabs.Screen
        name="media"       
        options={{                   
          tabBarIcon: ({ focused }) => (
            <TabBarIcon name={focused ? 'musical-notes' : 'musical-notes-outline'}  />
          ),
        }}
      />
      <Tabs.Screen
        name="setting"       
        options={{                   
          tabBarIcon: ({ focused }) => (
            <TabBarIcon name={focused ? 'settings' : 'settings-outline'}  />
          ),
        }}
      />
    </Tabs>
  );
}
