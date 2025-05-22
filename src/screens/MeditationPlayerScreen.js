import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
  Animated,
  Easing,
} from 'react-native';
import { Audio } from 'expo-av';
import { AntDesign } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRoute } from '@react-navigation/native';
import BackButton from '../components/BackButton'; 
import { useNavigation } from '@react-navigation/native';


const { width } = Dimensions.get('window');

const MeditationPlayerScreen = () => {
  const navigation = useNavigation();
  
  const route = useRoute();
  const { selectedTrack } = route.params || {};

    if (!selectedTrack) {
      return (
        <View style={styles.container}>
          <Text style={{ color: 'red' }}>לא נבחרה מדיטציה</Text>
        </View>
      );
    }

  const [sound, setSound] = useState(null);
  const soundRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [positionMillis, setPositionMillis] = useState(0);
  const [durationMillis, setDurationMillis] = useState(1);
  const waveAnimsRef = useRef(null);
  const waveAnimations = useRef([]);
  const intervalRef = useRef(null);

  useEffect(() => {
  (async () => {
    await Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      allowsRecordingIOS: false,
      staysActiveInBackground: false,
      interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
      shouldDuckAndroid: true,
      interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
      playThroughEarpieceAndroid: false,
    });
  })();

  return () => {
    if (soundRef.current) soundRef.current.unloadAsync();   // ④
    clearInterval(intervalRef.current);
    stopWaveAnimation();
  };
}, []);


  if (!waveAnimsRef.current) {
    waveAnimsRef.current = [...Array(5)].map(() => new Animated.Value(0));
  }
  const waveAnims = waveAnimsRef.current;

  const startWaveAnimation = () => {
    waveAnims.forEach((anim, index) => {
      const animation = Animated.loop(
        Animated.sequence([
          Animated.timing(anim, {
            toValue: 1,
            duration: 800,
            delay: index * 150,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0,
            duration: 800,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
        ])
      );
      animation.start();
      waveAnimations.current.push(animation);
    });
  };

  const stopWaveAnimation = () => {
    waveAnimations.current.forEach(anim => anim.stop());
    waveAnimations.current = [];
  };

const handlePlayPause = async () => {
  try {
    if (soundRef.current && isPlaying) {
      await soundRef.current.pauseAsync();
      setIsPlaying(false);
      stopWaveAnimation();
      clearInterval(intervalRef.current);
    } else if (soundRef.current && !isPlaying) {
      await soundRef.current.playAsync();
      setIsPlaying(true);
      startWaveAnimation();
      startProgressUpdater(soundRef.current);
    } else {
      const { file } = selectedTrack;
      const { sound: newSound, status } = await Audio.Sound.createAsync(
        file,
        { shouldPlay: true }
      );
      console.log('Sound status after load:', status);
      soundRef.current = newSound;           // ③
      setIsPlaying(true);
      startWaveAnimation();
      startProgressUpdater(newSound);
    }
  } catch (err) {
    console.error('Playback error:', err);
  }
};


const startProgressUpdater = (targetSound) => {   // ②
  intervalRef.current = setInterval(async () => {
    const status = await targetSound.getStatusAsync();
    if (status.isLoaded) {
      setPositionMillis(status.positionMillis);
      setDurationMillis(status.durationMillis || 1);
    }
  }, 1000);
};

  const formatTime = (millis) => {
    const totalSeconds = Math.floor(millis / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const getWaveStyle = (anim) => ({
    transform: [
      {
        scaleY: anim.interpolate({
          inputRange: [0, 1],
          outputRange: [1, 2.2],
        }),
      },
    ],
  });

  return (
    <LinearGradient colors={['#f3f2e9', '#d5d8c8']} style={styles.container}>

              <BackButton goBack={navigation.goBack} />
        
      <View style={styles.imageWrapper}>
        <Image
          source={selectedTrack.image}
          style={styles.image}
        />
      </View>
      <Text style={styles.title}>{selectedTrack.title}</Text>
      <Text style={styles.author}>{selectedTrack.subtitle}</Text>
      <View style={styles.waveform}>
        {waveAnims.map((anim, index) => (
          <Animated.View
            key={index}
            style={[styles.animatedWave, getWaveStyle(anim)]}
          />
        ))}
      </View>

      <Text style={styles.timerText}>{formatTime(positionMillis)} / {formatTime(durationMillis)}</Text>

      <View style={styles.controls}>
        {/* <TouchableOpacity>
          <AntDesign name="banckward" size={24} color="#4f684e" />
        </TouchableOpacity> */}
        <TouchableOpacity onPress={handlePlayPause} style={styles.playBtn}>
          <AntDesign
            name={isPlaying ? 'pausecircle' : 'play'}
            size={48}
            color="#4f684e"
          />
        </TouchableOpacity>
        {/* <TouchableOpacity>
          <AntDesign name="forward" size={24} color="#4f684e" />
        </TouchableOpacity> */}
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 60,
  },
  imageWrapper: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
  },
  image: {
    width: width * 0.85,
    height: 300,
    borderRadius: 50,
    marginTop:50,
    marginBottom:20,
  },
  label: {
    fontSize: 12,
    color: '#6c6c6c',
    marginTop: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2f4f4f',
    marginTop: 4,
    marginBottom: 7,
  },
  author: {
    fontSize: 14,
    color: '#4f684e',
    marginBottom: 20,
  },
  waveform: {
    height: 80,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
    flexDirection: 'row',
    gap: 8,
  },
  animatedWave: {
    width: 10,
    height: 40,
    backgroundColor: '#a0c7a2',
    borderRadius: 6,
  },
  controls: {
    flexDirection: 'row',
    width: '60%',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 20,
  },
  playBtn: {
    paddingHorizontal: 10,
  },
  timerText: {
    marginTop: 10,
    fontSize: 14,
    color: '#4f684e',
  },
});

export default MeditationPlayerScreen;
