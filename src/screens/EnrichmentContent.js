import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import BackButton from '../components/BackButton'; 
import Background from '../components/Background'


const categories = [
  {
    icon: '🌬️',
    titleHe: 'תרגול נשימה והרפיה',
    titleEn: 'תרגולים שיעזרו לך להירגע ולשחרר מתח נפשי',
    image: require('../assets/placeholder.png'),
    color: ['#E1F5FE', '#BBDEFB'],
  },
  {
    icon: '💪',
    titleHe: 'העצמה אישית והתמודדות עם פחדים',
    titleEn: 'כלים להתמודדות עם פחדים, חרדות והעצמת הביטחון העצמי',
    image: require('../assets/placeholder.png'),
    color: ['#FFEBEE', '#FFCDD2'],
  },
  {
    icon: '🌿',
    titleHe: 'התמודדות עם טראומה ודיכאון',
    titleEn: 'כלים וטכניקות להתמודדות עם טראומה ודיכאון, להקל על ההתמודדות היומיומית',
    image: require('../assets/placeholder.png'),
    color: ['#E1F5FE', '#BBDEFB'],
  },
  {
    icon: '🧘‍♀️',
    titleHe: 'מדיטציה ומיינדפולנס',
    titleEn: 'תרגולי מדיטציה ומיינדפולנס לשיפור הרוגע הפנימי',
    image: require('../assets/placeholder.png'),
    color: ['#FFEBEE', '#FFCDD2'],
  },
];

export default function CategoryGrid({ navigation }) {
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
        {categories.map((category, index) => (
          <TouchableOpacity key={index} style={[styles.card, { backgroundColor: category.color[0] }]}>
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
    backgroundColor: '#F1F8E9',
    paddingVertical: 16,
    paddingHorizontal: 12,
    direction: 'rtl', // הגדרת כיוון כתיבה מימין לשמאל ברמה הכללית
    fontFamily: 'Poppins', // שימוש בגופן פופולרית יותר
  },
  header: {
    marginBottom: 20,
    alignItems: 'flex-start', // שורה מימין לשמאל
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#37474F',
    textAlign: 'right', // כיוון הכתוב מצד ימין
    fontFamily: 'Poppins',
  },
  subtitle: {
    fontSize: 16,
    color: '#607D8B',
    textAlign: 'right', // כיוון הכתוב מצד ימין
    fontFamily: 'Poppins',
  },
  scrollViewContent: {
    paddingHorizontal: 8,
  },
  card: {
    width: 280, // קוביות יותר צרות
    borderRadius: 15,
    marginHorizontal: 10,
    padding: 16,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
    backgroundColor: '#FFFFFF', // צבע רקע
    height: 300, // גובה הקוביה מופחת
    direction: 'rtl', // כיוון כתיבה מימין לשמאל בכרטיס
  },
  cardHeader: {
    flexDirection: 'row-reverse', // סידור מימין לשמאל
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
    textAlign: 'right', // כיוון הכתוב מצד ימין
    fontFamily: 'Poppins',
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
    textAlign: 'right',
    fontFamily: 'Poppins',
  },
  cardDescription: {
    fontSize: 14,
    color: '#455A64',
    marginBottom: 12,
    textAlign: 'right',
    fontFamily: 'Poppins',
  },
  imageContainer: {
    height: 120,
    borderRadius: 15,
    overflow: 'hidden',
    marginTop: 8,
  },
  image: {
    width: '100%',
    height: '100%',
  },
});
