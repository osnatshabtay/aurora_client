import React from 'react';
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

const { width } = Dimensions.get('window');
const cardWidth = (width - 60) / 2;

export default function HomeScreen({ navigation }) {
  const categories = [
    {
      id: 1,
      title: 'צ׳אט בוט',
      image: require('../assets/chatbot.png'),
      description: 'שוחח עם הבוט שלנו',
      backgroundColor: '#FFF5F5',
    },
    {
      id: 2,
      title: 'קהילה שיתופית',
      image: require('../assets/community.png'),
      description: 'הצטרף לקהילה שלנו',
      backgroundColor: '#f1e9f5',
    },
    {
      id: 3,
      title: 'תוכן העשרה',
      image: require('../assets/contant.png'),
      description: 'גלה תוכן חדש ומעניין',
      backgroundColor: '#F7FAFC',
    },
    {
      id: 4,
      title: 'מצא חבר',
      image: require('../assets/talkWithFriend.png'),
      description: 'גלה חברים חדשים',
      backgroundColor: '#FFF5F5',
    },
  ];

  const handleCategoryPress = (id) => {
    if (id === 1) {
      navigation.navigate('ChatBotScreen');
    } else if (id === 2) {
      navigation.navigate('CommunityScreen');
    } else if (id === 3) {
      navigation.navigate('EnrichmentContent');
    } else if (id === 4) {
      navigation.navigate('SocialGraph');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.logoutButton} onPress={() => {}}>
        <Ionicons name="log-out-outline" size={30} color="#718096" />
      </TouchableOpacity>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerContainer}>
          <Text style={styles.greeting}>שלום לך</Text>
          <Text style={styles.subtitle}>במה נוכל לעזור לך היום?</Text>
        </View>

        <View style={styles.categoriesContainer}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[styles.categoryCard, { backgroundColor: category.backgroundColor }]}
              onPress={() => handleCategoryPress(category.id)}
            >
              <View style={styles.imageContainer}>
                <Image
                  source={category.image}
                  style={styles.categoryImage}
                  resizeMode="contain"
                />
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.categoryTitle}>{category.title}</Text>
                <Text style={styles.categoryDescription}>
                  {category.description}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF9F6',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  headerContainer: {
    alignItems: 'flex-end',
    marginBottom: 32,
    marginTop: 20,
    padding: 20,
  },
  greeting: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2D3748',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#718096',
    textAlign: 'right',
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 20,
  },
  categoryCard: {
    width: cardWidth,
    borderRadius: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  imageContainer: {
    width: '100%',
    height: 120,
    marginBottom: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryImage: {
    width: '80%',
    height: '80%',
  },
  textContainer: {
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2D3748',
    marginBottom: 4,
    textAlign: 'center',
  },
  categoryDescription: {
    fontSize: 14,
    color: '#718096',
    textAlign: 'center',
    lineHeight: 20,
  },
  logoutButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 1,
  },
});