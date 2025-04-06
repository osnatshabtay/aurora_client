import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import BackButton from '../components/BackButton'; 
import Background from '../components/Background';
import { categories } from '../helpers/category';
import { URL } from '@env';

export default function EnrichmentContent({ navigation }) {
  const [userCategories, setUserCategories] = useState([]);

  useEffect(() => {
    const fetchUserCategories = async () => {
      try {
        const response = await fetch(`${URL}:8000/recommendations/user_enrichment`);
        const data = await response.json();

        if (data.classified_profile) {
          // שלוף רק את הקטגוריות שהן true
          const relevant = Object.entries(data.classified_profile)
            .filter(([_, value]) => value === true)
            .map(([key]) => key);
          setUserCategories(relevant);
        }
      } catch (error) {
        console.error('Error fetching user enrichment:', error);
      }
    };

    fetchUserCategories();
  }, []);

  // מסנן רק את הקטגוריות המתאימות
  const filteredCategories = categories.filter(category =>
    userCategories.includes(category.category)
  );

  return (
    <View style={styles.container}>
      <BackButton goBack={navigation.goBack} />
        
      <View style={styles.header}>
        <Text style={styles.title}>טוב לראות אותך כאן!</Text>
        <Text style={styles.subtitle}>מה מתאים לך לעשות היום?</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}
      >
        {filteredCategories.map((category, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.card, { backgroundColor: category.color[0] }]}
            onPress={() => navigation.navigate('CategoryContent', {
              titleHe: category.titleHe,
              titleEn: category.titleEn,
              icon: category.icon,
              content: category.content, 
            })}
          >
            <View style={styles.cardHeader}>
              <View style={styles.cardTitleContainer}>
                <Text style={styles.cardTitle}>{category.titleHe}</Text>
              </View>
              <View style={styles.iconContainer}>
                <Text style={styles.icon}>{category.icon}</Text>
              </View>
            </View>
            <Text style={styles.cardSubtitle}>{category.titleEn}</Text>
            <Text style={styles.cardDescription}>{category.description}</Text>
            <View style={styles.imageContainer}>
              <Image
                source={category.image}
                style={styles.image}
                resizeMode="cover"
              />
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>    
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF9F6',  
    paddingVertical: 16,
    paddingHorizontal: 12,
    direction: 'rtl', 
    fontFamily: 'Rubik', 
  },
  header: {
    marginBottom: 20,
    alignItems: 'flex-start', 
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#37474F',
    textAlign: 'right', 
    fontFamily: 'Rubik', 
  },
  subtitle: {
    fontSize: 16,
    color: '#607D8B',
    textAlign: 'right',
    fontFamily: 'Rubik', 
  },
  scrollViewContent: {
    paddingHorizontal: 8,
  },
  card: {
    width: 280, 
    borderRadius: 15,
    marginHorizontal: 10,
    padding: 16,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
    height: 400, 
    direction: 'rtl', 
    justifyContent: 'space-between',
  },
  cardHeader: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitleContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#37474F',
    textAlign: 'right', 
    fontFamily: 'Rubik',  
  },
  iconContainer: {
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderRadius: 50,
    marginLeft: 10,
    marginRight: 0,
  },
  icon: {
    fontSize: 24,
    textAlign: 'center',
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#607D8B',
    textAlign: 'center',
    fontFamily: 'Rubik',  
  },
  cardDescription: {
    fontSize: 14,
    color: '#455A64',
    marginBottom: 12,
    textAlign: 'center',
    fontFamily: 'Rubik',  
  },
  imageContainer: {
    height: 200,
    borderRadius: 15,
    overflow: 'hidden',
    marginTop: 0,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
});
