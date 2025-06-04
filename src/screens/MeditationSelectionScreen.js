import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';
import { Audio } from 'expo-av';

const tracks = [
  {
    id: 'sunset',
    title: 'מדיטציה לטיפול בחרדה',
    subtitle: 'מדיטציה מונחית שמסייעת להרגעה והפחתת חרדה 🧘‍♀️',
    image: require('../assets/anxiety1.jpeg'),
    file: require('../assets/audio/medAnxiety.mp3'),
    minutes: '11 דקות',
  },
  {
    id: 'nature',
    title: 'מדיטציה ומיינדפולנס עבור טראומה',
    subtitle: 'תרגול מיינדפולנס עדין לחיזוק התחושת ביטחון פנימית 🌿',
    image: require('../assets/trauma.jpeg'),
    file: require('../assets/audio/medTrauma.mp3'),
    minutes: '12 דקות',
  },
  {
    id: 'beach',
    title: 'מדיטציה לטיפול בלחץ וסטרס',
    subtitle: 'מדיטציה עמוקה לשחרור מתחים ולחצים מהגוף והנפש 🌊',
    image: require('../assets/stress.jpeg'),
    file: require('../assets/audio/medStress.mp3'),
    minutes: '18 דקות',
  },
];

const MeditationSelectionScreen = () => {
  const navigation = useNavigation();

  const handleSelect = (track) => {
    navigation.navigate('MeditationPlayerScreen', {
      selectedTrack: track,
    });
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.headerWrapper}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <AntDesign name="arrowleft" size={24} color="#4f684e" />
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>בחרי מדיטציה</Text>
        {tracks.map((track) => (
          <TouchableOpacity
            key={track.id}
            style={styles.card}
            onPress={() => handleSelect(track)}
          >
            <Image source={track.image} style={styles.image} />
            <View style={styles.textContainer}>
              <Text style={styles.trackTitle}>{track.title}</Text>
              <Text style={styles.subtitle}>{track.subtitle}</Text>

              <View style={styles.durationBox}>
                <AntDesign name="clockcircleo" size={14} color="#4f684e" style={{ marginLeft: 6 }} />
                <Text style={styles.durationText}>{track.minutes}</Text>
              </View>

            </View>

            <Text style={styles.arrow}>{'<'}</Text>

       


          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  headerWrapper: {
    paddingHorizontal: 20,
    paddingTop: 100,
  },
  backButton: {
    position: 'absolute',
    marginTop:50,
    top: 20,
    left: 20,
    zIndex: 10,
  },
  backArrow: {
    fontSize: 24,
    color: '#4f684e',
  },
  container: {
    flex: 1,
    padding: 16,
    direction: 'rtl',  
    backgroundColor: '#f9f7f1',
  },
  title: {
    fontSize: 23,
    fontWeight: '600',
    color: '#2f4f4f',
    marginBottom: 20,
    textAlign: 'center',
  },
  card: {
    flexDirection: 'row',
    paddingVertical: 12,
    marginBottom: 16,
    alignItems: 'center'
  },
  image: {
    width: 100,
    height: 90,
    borderRadius: 12,
    marginRight: 12,
    marginLeft:20,
  },
  textContainer: {
    flex: 1,
  },
  trackTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2f4f4f',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 13,
    color: '#888',
  },
  arrow: {
    fontSize: 25,
    color: '#bbb',
    paddingHorizontal: 6,
  },
  durationBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#dce9d0',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    marginTop: 10,
    alignSelf: 'flex-start', 
  },
  durationText: {
    fontSize: 13,
    color: '#4f684e',
  },
});

export default MeditationSelectionScreen;
