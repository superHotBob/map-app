import { View, Image, Alert, Text, StyleSheet, Dimensions, TouchableOpacity, ScrollView, ImageBackground } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import * as MediaLibrary from 'expo-media-library';
import { useState, useRef } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
} from 'react-native-reanimated';

const { width, height: myheight } = Dimensions.get('window');
function clamp(val, min, max) {
    return Math.min(Math.max(val, min), max);
}
const Modal = () => {
    const [result, setResult] = useState(false);

    const scale = useSharedValue(1);
    const startScale = useSharedValue(1);
    const translationX = useSharedValue(0);
    const translationY = useSharedValue(0);
    const prevTranslationX = useSharedValue(0);
    const prevTranslationY = useSharedValue(0);
    const { filename, id, date = Date.now(), height, uri } = useLocalSearchParams();
    const path_date = (new Date(+date)).toLocaleString('ru-RU',
        { dateStyle: 'short', timeStyle: 'short', timeZone: "Europe/Minsk" }
    );
    const imagefilename = filename.split('_');
    console.log(imagefilename)
    const animatedStyles = useAnimatedStyle(() => ({
        transform: [
            { scale: scale.value },
            { translateX: translationX.value },
            { translateY: translationY.value },
        ],
    }));
    async function DeletePath() {
        const result = await MediaLibrary.deleteAssetsAsync([id]);
        setResult(result);
    };
    const Delete = () =>
        Alert.alert('Удалить маршрут?', '', [
           
            {
                text: 'Нет',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
            },
            { text: 'Да', onPress: () => DeletePath() },
        ]);


    const dragGesture = Gesture.Pan()
        .minDistance(1)
        .onStart(() => {
            prevTranslationX.value = translationX.value;
            prevTranslationY.value = translationY.value;
        })
        .onUpdate((event) => {
            const maxTranslateX = width / 2 - 100;
            const maxTranslateY = height / 2 - 160;

            translationX.value = scale.value === 1 ? null : clamp(
                prevTranslationX.value + event.translationX,
                -maxTranslateX,
                maxTranslateX
            );
            translationY.value = clamp(
                prevTranslationY.value + event.translationY,
                -maxTranslateY,
                maxTranslateY
            );
        })
        .runOnJS(true);
    const singleTap = Gesture.Tap()
        .maxDuration(250)
        .onStart(() => {
            scale.value = 2;
        });

    const doubleTap = Gesture.Tap()
        .maxDuration(250)
        .numberOfTaps(2)
        .onStart(() => {
            console.log('Double tap!');
            scale.value = 1;
            translationX.value = 0;
            translationY.value = 0;
        });
    const zoomGesture = Gesture.Pinch()
        .onStart(() => {
            startScale.value = scale.value;
        })
        .onUpdate((event) => {
            scale.value = startScale.value * event.scale < 1 ?
                1 : startScale.value * event.scale;

        })

    const composed = Gesture.Simultaneous(
        dragGesture, Gesture.Exclusive(doubleTap, singleTap),
        Gesture.Simultaneous(zoomGesture)
    );
    return (
        <View style={styles.mainBlock}>
            <Text style={styles.data}>
                {path_date} , {imagefilename[0]} 
            </Text>
            <View style={{overflow: 'hidden', height: +height, width: width }}>
            <GestureHandlerRootView >
                <GestureDetector gesture={composed}>
                    <Animated.Image
                        style={[styles.image,animatedStyles, { height: +height, opacity: result ? 0.3 : 1 }]}
                        source={{ uri: uri }}
                        resizeMode='stretch'
                    />
                </GestureDetector>
            </GestureHandlerRootView>
            </View>
            <LinearGradient
                style={styles.btnDelete}
                colors={['#4c669f', '#3b5998', '#192f6a']}
            >
                <TouchableOpacity style={styles.btnDelete} disabled={result} onPress={Delete}>
                    <Text style={styles.delete_text}>
                        {result ? 'УДАЛЕНО' : 'УДАЛИТЬ'}
                    </Text>
                </TouchableOpacity>
            </LinearGradient>

        </View>
    );
}
const styles = StyleSheet.create({
    mainBlock: {
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 15,
        width: '100%',
    },
    image: {
        width: '100%'
    },
    data: {
        marginTop: 20,
        fontSize: 18,
        fontWeight: 'bold',
        fontFamily: 'SpaceMono'
    },
    btnDelete: {
        width: '98%',
        borderRadius: 8,
        height: 50
    },
    delete_text: {
        textAlign: 'center',
        fontSize: 18,
        color: '#fff',
        lineHeight: 50,
        fontWeight: 'bold'
    }
})
export default Modal;