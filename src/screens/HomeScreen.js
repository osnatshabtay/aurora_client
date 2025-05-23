import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Svg, Path, Circle, G, Text as SvgText } from 'react-native-svg';
import { useSharedValue, withTiming } from 'react-native-reanimated';
import { Avatar, Card, Button, Title, IconButton } from 'react-native-paper';

const emotions = [
  { id: 1, name: "שמחה", color: "#FFD700", quote: "השמחה היא בחירה. בחרת נכון היום!", icon: "😊" },
  { id: 2, name: "עצב", color: "#6495ED", quote: "גם בעצב יש יופי, הוא מלמד אותנו להעריך את הרגעים הטובים.", icon: "😢" },
  { id: 3, name: "כעס", color: "#FF6347", quote: "נשום עמוק. הכעס הוא רק אורח זמני בחייך.", icon: "😠" },
  { id: 4, name: "חרדה", color: "#9370DB", quote: "אתה חזק יותר מהחרדות שלך. צעד אחר צעד.", icon: "😰" },
  { id: 5, name: "תקווה", color: "#98FB98", quote: "התקווה היא המצפן שמוביל אותנו קדימה.", icon: "🌈" },
  { id: 6, name: "אהבה", color: "#FF69B4", quote: "אהבה היא הכוח החזק ביותר. התחל באהבה עצמית.", icon: "❤️" },
  { id: 7, name: "גאווה", color: "#FFA500", quote: "יש לך כל סיבה להיות גאה בעצמך ובדרך שעברת.", icon: "💪" },
  { id: 8, name: "רוגע", color: "#87CEEB", quote: "הרוגע הוא מתנה שאתה נותן לעצמך. תיהנה ממנה.", icon: "🧘‍♀️" },
];

const BottomBar = ({ currentTab, setCurrentTab, navigation }) => {
  const tabs = [
    { icon: 'home', label: 'בית', screen: 'HomeScreen' },
    { icon: 'account-group', label: 'קהילה', screen: 'CommunityScreen' },
    { icon: 'robot-outline', label: "צ'אט בוט", screen: 'ChatBotScreen' },
    { icon: 'book-open-variant', label: 'תוכן העשרה', screen: 'EnrichmentContent' },
    { icon: 'account-search', label: 'מצא חבר', screen: 'SocialGraph' },
  ];

  const handleTabPress = (label, screen) => {
    setCurrentTab(label);
    navigation.navigate(screen);
  };

  return (
    <View style={styles.bottomBar}>
      {tabs.map((tab, index) => (
        <TouchableOpacity
          key={index}
          style={styles.tabItem}
          onPress={() => handleTabPress(tab.label, tab.screen)}
        >
          <IconButton
            icon={tab.icon}
            size={24}
            iconColor={currentTab === tab.label ? '#007BFF' : '#888'}
          />
          {currentTab === tab.label && (
            <View style={styles.activeDot} />
          )}
          <Text style={[styles.tabLabel, currentTab === tab.label && styles.tabLabelActive]}>
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};


const { width } = Dimensions.get('window');
const cardWidth = (width - 60) / 2;
const radius = 180;

export default function HomeScreen({ navigation }) {
  const [currentTab, setCurrentTab] = useState('בית');
  const [selectedEmotionIndex, setSelectedEmotionIndex] = useState(0);
  const [darkMode, setDarkMode] = useState(false);
  const [dailyTip] = useState([
    "הקדש 5 דקות ביום למדיטציה",
    "שתה לפחות 8 כוסות מים ביום",
    "צא להליכה קצרה באוויר הפתוח",
    "רשום 3 דברים שאתה מודה עליהם",
    "התקשר לחבר או בן משפחה",
  ][Math.floor(Math.random() * 5)]);

  const angle = 180 / emotions.length;
  const pointerAngle = useSharedValue(0);

  const handlePress = (index) => {
    setSelectedEmotionIndex(index);
    pointerAngle.value = withTiming(index * angle, { duration: 500 });
  };

  const renderEmotionPie = () => {
    let startAngle = 0;
    return emotions.map((emotion, index) => {
      const endAngle = startAngle + angle;
      const largeArc = angle > 180 ? 1 : 0;

      const x1 = radius + radius * Math.cos(Math.PI * startAngle / 180);
      const y1 = radius + radius * Math.sin(Math.PI * startAngle / 180);
      const x2 = radius + radius * Math.cos(Math.PI * endAngle / 180);
      const y2 = radius + radius * Math.sin(Math.PI * endAngle / 180);

      const pathData = `
        M ${radius} ${radius}
        L ${x1} ${y1}
        A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}
        Z
      `;

      const midAngle = (startAngle + endAngle) / 2;
      const labelX = radius + (radius - 50) * Math.cos(Math.PI * midAngle / 180);
      const labelY = radius + (radius - 50) * Math.sin(Math.PI * midAngle / 180);

      startAngle = endAngle;

      return (
        <G key={emotion.id}>
          <Path
            d={pathData}
            fill={emotion.color}
            onPress={() => handlePress(index)}
            stroke={selectedEmotionIndex === index ? '#000' : 'transparent'}
            strokeWidth={selectedEmotionIndex === index ? 3 : 0}
          />
        <SvgText
          x={labelX}
          y={labelY - 10}
          fill="#000"
          fontSize="16"
          textAnchor="middle"
          transform={`rotate(180, ${labelX}, ${labelY - 10})`}
        >
          {emotion.icon}
        </SvgText>
        <SvgText
          x={labelX}
          y={labelY + 10}
          fill="#000"
          fontSize="13"
          fontWeight="bold"
          textAnchor="middle"
          transform={`rotate(180, ${labelX}, ${labelY + 10})`}
        >
          {emotion.name}
        </SvgText>
        </G>
      );
    });
  };

  const selectedEmotion = emotions[selectedEmotionIndex];

  const theme = {
    background: darkMode ? "#121212" : selectedEmotion.color + '15',
    card: darkMode ? "#1E1E1E" : "#FFFFFF",
    text: darkMode ? "#E1E1E1" : "#333333",
    subtext: darkMode ? "#AAAAAA" : "#666666",
    accent: "#6A0DAD",
  };

  const categories = [
    { id: 1, title: 'צ׳אט בוט', image: require('../assets/chatbot.png'), description: 'שוחח עם הבוט שלנו', backgroundColor: '#FFF5F5' },
    { id: 2, title: 'קהילה שיתופית', image: require('../assets/community.png'), description: 'הצטרף לקהילה שלנו', backgroundColor: '#f1e9f5' },
    { id: 3, title: 'תוכן העשרה', image: require('../assets/contant.png'), description: 'גלה תוכן חדש ומעניין', backgroundColor: '#F7FAFC' },
    { id: 4, title: 'מצא חבר', image: require('../assets/talkWithFriend.png'), description: 'גלה חברים חדשים', backgroundColor: '#FFF5F5' },
  ];

  const handleCategoryPress = (id) => {
    if (id === 1) {
      navigation.navigate("צ'אט בוט");
    } else if (id === 2) {
      navigation.navigate('קהילה');
    } else if (id === 3) {
      navigation.navigate('תוכן העשרה');
    } else if (id === 4) {
      navigation.navigate("מצא חבר");
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}> 
      <TouchableOpacity style={styles.logoutButton} onPress={() => {}}>
        <Ionicons name="log-out-outline" size={30} color="#718096" />
      </TouchableOpacity>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerContainer}>
          <Text style={styles.greeting}>שלום לך</Text>
          <Text style={styles.subtitle}>מה מצב הרוח שלך היום?</Text>
        </View>

        <View style={{ alignItems: 'center', marginBottom: 0 }}>
        <Svg width={radius * 2} height={radius + 40}>
            <G rotation={-180} origin={`${radius}, ${radius}`}>
              {renderEmotionPie()}
              <Circle cx={radius} cy={radius} r={6} fill="#333" />
              <Path
                d={`M ${radius} ${radius} L ${radius} ${radius - 100}`}
                stroke="#333"
                strokeWidth={4}
                strokeLinecap="round"
                transform={`rotate(${selectedEmotionIndex * angle + 90}, ${radius}, ${radius})`}
              />
            </G>
          </Svg>
        </View>

        <View style={{
          backgroundColor: selectedEmotion.color + '20',
          borderColor: selectedEmotion.color,
          borderWidth: 1,
          borderStyle: 'dashed',
          borderRadius: 15,
          padding: 20,
          marginTop: 0,
          marginBottom: 40,
        }}>
          <Text style={styles.quoteText}>{selectedEmotion.quote}</Text>
        </View>

        <View style={[styles.tipCard, { backgroundColor: theme.card }]}>
          <Text style={[styles.tipTitle, { color: theme.text },]}>טיפ יומי:</Text>
          <Text style={[styles.tipText, { color: theme.subtext }]}>{dailyTip}</Text>
        </View>

        <View style={styles.categoriesContainer}>
          {categories.map((category) => (
            <TouchableOpacity
            key={category.id}
            style={[styles.categoryCard, { backgroundColor: category.backgroundColor }]}
            onPress={() => handleCategoryPress(category.id)}
            >
              <View style={styles.imageContainer}>
                <Image source={category.image} style={styles.categoryImage} resizeMode="contain" />
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.categoryTitle}>{category.title}</Text>
                <Text style={styles.categoryDescription}>{category.description}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      
      

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { flexGrow: 1, padding: 20 },
  headerContainer: { alignItems: 'flex-end', marginBottom: 32, marginTop: 20, padding: 20 },
  greeting: { fontSize: 32, fontWeight: 'bold', color: '#2D3748', marginBottom: 8 },
  subtitle: { fontSize: 18, color: '#718096', textAlign: 'right' },
  logoutButton: { position: 'absolute', top: 20, left: 20, zIndex: 1 },
  quoteText: { fontSize: 16, fontWeight: '500', textAlign: 'center', marginTop: 12, lineHeight: 24 },
  tipCard: { borderRadius: 15, padding: 20, marginBottom: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 3 },
  tipTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 8, textAlign: 'right' },
  tipText: { fontSize: 16, textAlign: 'right', lineHeight: 22 },
  categoriesContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 20 },
  categoryCard: { width: cardWidth, borderRadius: 20, padding: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 12, elevation: 3 },
  imageContainer: { width: '100%', height: 120, marginBottom: 12, justifyContent: 'center', alignItems: 'center' },
  categoryImage: { width: '80%', height: '80%' },
  textContainer: {},
  categoryTitle: { fontSize: 18, fontWeight: '700', color: '#2D3748', marginBottom: 4, textAlign: 'center' },
  categoryDescription: { fontSize: 14, color: '#718096', textAlign: 'center', lineHeight: 20 },
    bottomBar: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-around',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
  },
  tabItem: {
  alignItems: 'center',
  justifyContent: 'center',
  },
  activeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#007BFF',
    marginTop: -6,
    marginBottom: 4,
  },

});