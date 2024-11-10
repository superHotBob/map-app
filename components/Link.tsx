import { Link } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Text, StyleSheet } from "react-native";
import { Colors } from '@/constants/Colors';
const color = Colors.light.background;


export default function MyLink({path}:{path:string}) {
    return (
        <Link href = {'/' + path}>
            <LinearGradient
            style={styles.btn1}
            colors={color}
            >
                <Text style={styles.textButton}>{path}</Text>
            </LinearGradient>
        </Link>
    )
};
const styles = StyleSheet.create({  
    textButton: {
      color: '#fff',
      fontSize: 30,
      textTransform: 'uppercase',
      fontWeight: 'bold',
      letterSpacing: 1.4
    },
    btn1: {      
      width: 200,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 140,
      height: 150,
      opacity: 0.9,
      borderWidth: 6,
      borderColor: '#fff'
    }
});
  