import { Link } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Text, StyleSheet } from "react-native";
import { Colors } from '@/constants/Colors';
const color = Colors.light.background;
import { useFonts } from '@expo-google-fonts/inter';

export default function MyLink({ path }: { path: string }) {
    const [loaded, error] = useFonts({
        'SpaceMono-Bold': require('../assets/fonts/SpaceMono-Bold.ttf'),
    });
    if (!loaded || error) {
       
        return null;
    }
    return (
        <Link href={'/' + path}>
            <LinearGradient
                style={styles.btn1}
                colors={color}
            >
                <Text style={[styles.textButton, {fontFamily: 'SpaceMono-Bold'}]}>{path}</Text>
            </LinearGradient>
        </Link>
    )
};
const styles = StyleSheet.create({
    textButton: {
        color: '#fff',
        fontSize: 30,
        textTransform: 'uppercase',
       
        letterSpacing: 1.4,
       
    },
    btn1: {
        width: 250,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 140,
        height: 120,
        opacity: 0.9,
        borderWidth: 6,
        borderColor: '#fff'
    }
});
