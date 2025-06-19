import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Dimensions,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Svg, Path, Circle, G, Text as SvgText } from 'react-native-svg';
import { useSharedValue, withTiming } from 'react-native-reanimated';
import { Avatar, Card, Button, Title, IconButton } from 'react-native-paper';
import * as SecureStore from 'expo-secure-store';
import { URL } from '@env';
import { api } from '../api';
import { getAvatarImage } from '../helpers/avatar';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';



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
    { icon: 'account-search', label: 'מצא חבר', screen: 'SocialGraphScreen' },
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
const SERVER_URL = `${URL}:8000`;

export default function HomeScreen({ navigation }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentTab, setCurrentTab] = useState('בית');
  const [selectedEmotionIndex, setSelectedEmotionIndex] = useState(0);
  const [darkMode, setDarkMode] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState([]);
const [senderImages, setSenderImages] = useState({});

    useEffect(() => {
      const fetchCurrentUser = async () => {
        try {
          const token = await SecureStore.getItemAsync('access_token');
          if (!token) return;
          const res = await fetch(`${SERVER_URL}/users/me`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const data = await res.json();
          if (data.username) {
            setCurrentUser({ username: data.username });
          }
        } catch (err) {
          console.error('Error fetching user:', err);
        }
      };
  
      fetchCurrentUser();
    }, []);
  
useFocusEffect(
  useCallback(() => {
    const fetchUnread = async () => {
      try {
        const data = await api('/chat/unread');
        const fromUsers = (data.messages || []).map(msg => msg.from);
        const uniqueUsernames = [...new Set(fromUsers)];

        const params = new URLSearchParams();
        uniqueUsernames.forEach(username => params.append('usernames', username));

        const res = await fetch(`${SERVER_URL}/users/multiple?${params.toString()}`);
        const userInfos = await res.json();

        const userImageMap = {};
        userInfos.forEach(user => {
          userImageMap[user.username] = user.selectedImage;
        });

        setUnreadCount(data.count);
        setUnreadMessages(data.messages);
        setSenderImages(userImageMap);
      } catch (error) {
        console.log('Error fetching unread:', error.message);
        Alert.alert('Error', 'Failed to fetch unread.');
      }
    };

    fetchUnread();
  }, [])
);





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

  const handleNavigateToChat = (targetUser) => {
    setShowDropdown(false);
    console.log("TTTTTTTTTTTTTTTTTTT");
    console.log("CURRENTUSER: " , currentUser.username);
    console.log("TARGETUSER: " , targetUser);
    // navigation.navigate('ChatScreen', {
    //   currentUser: currentUser.username,
    //   targetUser,
    // });
      navigation.navigate('מצא חבר', {
  screen: 'ChatScreen',
  params: { currentUser: currentUser.username , targetUser: targetUser }
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

  const styles = StyleSheet.create({
    container: { flex: 1 },
    logoutButton: { position: 'absolute', top: 50, left: 20, zIndex: 1 },
    inboxIcon: { position: 'absolute', top: 50, right: 20, zIndex: 10, elevation: 10,padding:5},
    badge: {
      position: 'absolute',
      top: -6,
      right: -6,
      backgroundColor: 'red',
      borderRadius: 10,
      width: 20,
      height: 20,
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 50,
    },
    badgeText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
    dropdown: {
      position: 'absolute',
      top: 60,
      right: 10,
      backgroundColor: '#fff',
      padding: 10,
      borderRadius: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
      maxHeight: 200,
      zIndex: 20,
    },
    dropdownItem: { fontSize: 16, paddingVertical: 6 },
    scrollContent: { flexGrow: 1, padding: 20 },
    headerContainer: { alignItems: 'flex-end', marginBottom: 32, marginTop: 20, padding: 20 },
    greeting: { fontSize: 32, fontWeight: 'bold', color: '#2D3748', marginBottom: 8 },
    subtitle: { fontSize: 18, color: '#718096', textAlign: 'right' },
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
  });

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

  const handleLogout = async () => {
    try {
      console.log("here")
      await SecureStore.deleteItemAsync('access_token');
      navigation.reset({
        index: 0,
        routes: [{ name: 'LoginScreen' }],
      });
    } catch (error) {
      console.error('Logout failed:', error);
      alert('התרחשה שגיאה ביציאה מהמערכת');
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background}]}> 
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={30} color="#718096" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.inboxIcon} onPress={() => setShowDropdown(!showDropdown)}>
        <Ionicons name="mail-outline" size={30} color="#560CCE" />
        {unreadCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{unreadCount}</Text>
          </View>
        )}
      </TouchableOpacity>

{showDropdown && (
<View style={{   position: 'absolute',
  top: 70,
  right: 20,
  width: 250,
  backgroundColor: '#fff',
  borderRadius: 12,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.15,
  shadowRadius: 6,
  elevation: 8,
  zIndex: 1000,
  paddingVertical: 10,
  maxHeight: 300}}>


  <FlatList
    data={unreadMessages}
    keyExtractor={(item, index) => index.toString()}
    renderItem={({ item }) => (
      <TouchableOpacity
        style={{  flexDirection: 'row-reverse',
  alignItems: 'center',
  paddingHorizontal: 15,
  paddingVertical: 12,
  borderBottomWidth: 1,
  borderBottomColor: '#f0f0f0',}}
        onPress={() => handleNavigateToChat(item.from)}
      >        
        <Image
          source={getAvatarImage(senderImages[item.from])}
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            marginRight: 10,
          }}
        />

<View style={{ flex: 1 }}>
  <Text style={{
    fontWeight: 'bold',
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
    marginBottom: 2, 
  }}>
    {item.from}
  </Text>
  <Text style={{
    fontSize: 13,
    color: '#666',
    textAlign: 'center', 
  }} numberOfLines={1}>
    {item.message}
  </Text>
</View>

      </TouchableOpacity>
    )}
  />
</View>

)}



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
          {[
            { id: 1, title: 'צ׳אט בוט', image: require('../assets/chatbot.png'), description: 'שוחחו עם הבוט שלנו', backgroundColor: '#FFF5F5' },
            { id: 2, title: 'קהילה שיתופית', image: require('../assets/community.png'), description: 'הצטרפו לקהילה שלנו', backgroundColor: '#f1e9f5' },
            { id: 3, title: 'תוכן העשרה', image: require('../assets/contant.png'), description: 'גלו תוכן חדש ומעניין', backgroundColor: '#F7FAFC' },
            { id: 4, title: 'מצא חבר', image: require('../assets/talkWithFriend.png'), description: 'מצאו חברים חדשים', backgroundColor: '#FFF5F5' },
          ].map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[styles.categoryCard, { backgroundColor: category.backgroundColor }]}
              onPress={() => {
                if (category.id === 1) navigation.navigate("צ'אט בוט", { screen: 'ChatBotScreen' });
                else if (category.id === 2) navigation.navigate('CommunityScreen');
                else if (category.id === 3) navigation.navigate('EnrichmentContent');
                else if (category.id === 4) navigation.navigate('מצא חבר', { screen: 'SocialGraphScreen' });
              }}
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
  container: { flex: 1 , paddingTop:400},
  scrollContent: { flexGrow: 1, padding: 20 },
  headerContainer: { alignItems: 'flex-end', marginBottom: 32, marginTop: 20, padding: 20 },
  greeting: { fontSize: 32, fontWeight: 'bold', color: '#2D3748', marginBottom: 8 },
  subtitle: { fontSize: 18, color: '#718096', textAlign: 'right' },
  logoutButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 999,
    elevation: 10,
    backgroundColor: 'transparent', 
    padding: 10,
  },
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
dropdownItem: {
  paddingVertical: 10,
  paddingHorizontal: 12,
  borderBottomColor: '#ddd',
  borderBottomWidth: 1,
  textAlign: 'right',
},
notificationDropdown: {
  position: 'absolute',
  top: 70,
  right: 20,
  width: 280,
  backgroundColor: 'red',
  borderRadius: 12,
  shadowColor: 'red',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.15,
  shadowRadius: 6,
  elevation: 8,
  zIndex: 1000,
  paddingVertical: 10,
  maxHeight: 100,
},

notificationHeader: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingHorizontal: 15,
  paddingBottom: 8,
  borderBottomWidth: 1,
  borderBottomColor: '#eee',
},

notificationTitle: {
  fontSize: 16,
  fontWeight: 'bold',
  color: '#333',
},

notificationBadge: {
  backgroundColor: '#3B82F6',
  borderRadius: 12,
  paddingHorizontal: 6,
  paddingVertical: 2,
},

notificationBadgeText: {
  color: '#fff',
  fontSize: 13,
  fontWeight: 'bold',
},

notificationItem: {
  flexDirection: 'row',
  alignItems: 'center',
  paddingHorizontal: 15,
  paddingVertical: 12,
  borderBottomWidth: 1,
  borderBottomColor: '#f2f2f2',
},

notificationAvatar: {
  width: 36,
  height: 36,
  borderRadius: 18,
  marginRight: 10,
},

notificationTextContainer: {
  flex: 1,
},

notificationUser: {
  fontSize: 14,
  fontWeight: 'bold',
  color: '#222',
  marginBottom: 2,
},

notificationMessage: {
  fontSize: 13,
  color: '#666',
},


});