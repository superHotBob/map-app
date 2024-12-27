import { useCallback, useState, useRef, useEffect } from 'react';
import { Text } from 'react-native';
import { SecToMin } from '@/scripts/functions';
interface time {
    duration: number,
    style: Object,
    sound: number
}

export function TimerSong({ duration, sound, style }: time) {
    const [timeLeft, setTimeLeft] = useState(duration);
    let timeRef = useRef('');    

    useEffect(() => {
        if (timeLeft < 1) {
            clearInterval(timeRef.current);
            return;
        }    
        timeRef.current = setInterval(() => {
            setTimeLeft(timeLeft - 1);
        }, 1000);
        if ( sound != 0.0) clearInterval(timeRef.current);
        return () => clearInterval(timeRef.current);
        // add timeLeft as a dependency to re-rerun the effect
        // when we update it
    }, [timeLeft,sound]);

    return (
        <Text style={style}>-{SecToMin(timeLeft - Math.ceil(sound/1000))}</Text>
    )
}
