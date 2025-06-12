import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Dimensions,
} from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const cardWidth = (width - 60) / 2;

export default function HomeScreenManager({ navigation }) {
  const categories = [
    {
    id: 1,
    title: 'אישור פוסטים',
    image: require('../assets/posts.png'),
    description: 'ראה פוסטים הממתינים לאישורך',
    backgroundColor: '#F7FAFC',
    },
    {
      id: 2,
      title: 'קהילה שיתופית',
      image: require('../assets/community.png'),
      description: 'צפה בפעילות הקהילה',
      backgroundColor: '#f1e9f5',
    },
  ];

  const handleCategoryPress = (id) => {
    if (id === 1) {
      navigation.navigate('PostApprovalScreen');
    } else if (id === 2) {
      navigation.navigate('CommunityScreenAdmin');
    }
  };

    const handleLogout = async () => {
      try {
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
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={30} color="#718096" />
      </TouchableOpacity>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerContainer}>
          <Text style={styles.greeting}>שלום מנהל</Text>
          <Text style={styles.subtitle}>מה תרצה לעשות היום?</Text>
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
  logoutButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 999,
    elevation: 10,
    backgroundColor: 'transparent', 
    padding: 10, 
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
});