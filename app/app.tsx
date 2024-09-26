import { NavigationContainer } from "@react-navigation/native";
import HomeScreen from "./(tabs)";

import { createNativeStackNavigator } from '@react-navigation/native-stack';






const Stack = createNativeStackNavigator();

export default function App() {


  return (
    <NavigationContainer>
      <HomeScreen/>
    </NavigationContainer>
  );
}
