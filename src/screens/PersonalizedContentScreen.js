import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  Image,
  Animated,
  TouchableOpacity,
} from 'react-native';
import LottieView from 'lottie-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { LineChart } from 'react-native-chart-kit';
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';


const { width } = Dimensions.get('window');

const PersonalizedContentScreen = () => {
  const navigation = useNavigation();
  const [fadeAnim] = useState(new Animated.Value(0));
  const [userName, setUserName] = useState('הילה');
  const [emotion, setEmotion] = useState('שמחה');
  const [quote, setQuote] = useState('השמחה היא בחירה. בחרת נכון היום!');
  const [emotionData, setEmotionData] = useState([2, 3, 4, 2, 5]);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  const recommendations = [
    {
      title: 'מדיטציה מותאמת אישית',
      subtitle: 'תרגול נשימה להרפיה',
      image: require('../assets/meditation.png'),
      color: ['#FFDEE9', '#B5FFFC'],
    },
    {
      title: 'סרטון השראה',
      subtitle: 'איך לחזק ביטחון עצמי',
      image: require('../assets/motivation.png'),
      color: ['#C6FFDD', '#FBD786'],
    },
    {
      title: 'אתגר יומי',
      subtitle: 'דקה של חיוך מול המראה',
      image: require('../assets/challenge.png'),
      color: ['#FEC8D8', '#FFDFD3'],
    },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>      
      {/* <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
        <LottieView
          source={require('../assets/lottie/flower.json')}
          autoPlay
          loop
          style={styles.lottie}
        />
      </Animated.View> */}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>המלצות בשבילך</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {recommendations.map((item, index) => (
            <LinearGradient
              key={index}
              colors={item.color}
              style={styles.card}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Image source={item.image} style={styles.cardImage} />
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardSubtitle}>{item.subtitle}</Text>
            </LinearGradient>
          ))}
        </ScrollView>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>איך הרגשת השבוע?</Text>
        <LineChart
          data={{
            labels: ['יום 1', 'יום 2', 'יום 3', 'יום 4', 'יום 5'],
            datasets: [
              {
                data: emotionData,
              },
            ],
          }}
          width={width - 40}
          height={220}
          yAxisSuffix=""
          chartConfig={{
            backgroundColor: '#ffffff',
            backgroundGradientFrom: '#fff',
            backgroundGradientTo: '#fff',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(255, 105, 180, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: {
              borderRadius: 16,
            },
            propsForDots: {
              r: '5',
              strokeWidth: '2',
              stroke: '#ffa726',
            },
          }}
          style={{
            marginVertical: 8,
            borderRadius: 16,
          }}
        />
      </View>




      <View style={styles.breathingSection}>
        <Text style={styles.sectionTitle}>תרגול נשימה</Text>
          <TouchableOpacity
          style={styles.breathingCard}
          onPress={() => navigation.navigate('MeditationSelectionScreen')}
          >
          <View style={styles.playButtonWrapper}>
            <View style={styles.playButtonCircle}>
              <AntDesign name="play" size={30} color="#4f684e" />
            </View>
          </View>
          <Text style={styles.breathingTitle}>קחי נשימה עמוקה</Text>
          <Text style={styles.breathingSubtitle}>הירגעי ושחררי מתחים</Text>
          <Text style={styles.breathingTip}>הכניסי אוויר עמוק דרך האף עד הבטן ✨</Text>
          <View style={styles.durationBox}>
            <AntDesign name="clockcircleo" size={14} color="#4f684e" />
            <Text style={styles.durationText}> 14 דקות</Text>
          </View>
        </TouchableOpacity>
      </View>




    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
header: {
  padding: 20,
  alignItems: 'center',
  minHeight: 180, 
  justifyContent: 'center',
},
  greeting: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
  },
  quote: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 10,
  },
  lottie: {
    width: 150,
    height: 150,
    marginTop: 10,
  },
  section: {
    marginTop: 30,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 10,
    marginTop:50,
    direction:'rtl',
  },
  card: {
    width: width * 0.6,
    height: 180,
    borderRadius: 16,
    padding: 15,
    marginRight: 15,
    justifyContent: 'space-between',
  },
  cardImage: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#222',
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#444',
  },
  breathingSection: {
    marginTop: 40,
    paddingHorizontal: 20,
  },
  breathingCard: {
    backgroundColor: '#eaf0e6',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
  },
  playButtonWrapper: {
    marginBottom: 16,
  },
  playButtonCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#d1e2c4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  breathingTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#2f4f4f',
  },
  breathingSubtitle: {
    fontSize: 14,
    color: '#4f684e',
    marginBottom: 10,
  },
  breathingTip: {
    fontSize: 13,
    color: '#4f684e',
    marginBottom: 16,
    textAlign: 'center',
  },
  durationBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#dce9d0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  durationText: {
    fontSize: 13,
    color: '#4f684e',
  },
});

export default PersonalizedContentScreen;
