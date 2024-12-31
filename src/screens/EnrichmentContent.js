import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import BackButton from '../components/BackButton'; 
import Background from '../components/Background';

const categories = [
  {
    icon: '🌬️',
    titleHe: 'תרגול נשימה והרפיה',
    titleEn: 'תרגולים שיעזרו לך להירגע ולשחרר מתח נפשי',
    image: require('../assets/1.jpeg'),
    color: ['#E1F5FE', '#BBDEFB'],
    content: [
      { type: 'text', value: 'בואו ללמוד כיצד לבצע תרגול נשימה פשוט שמסייע בהרפיה של הגוף והנפש' },
      { type: 'video', value: 'https://www.youtube.com/embed/bnCuQRO5xjE' },
      { type: 'text', value: 'בנוסף, תוכלו לצפות בשיטת 4-7-8, שיטה ייחודית לנשימה מודעת ונכונה' },
      { type: 'video', value: 'https://www.youtube.com/embed/n8luVodumAE' },
    ]
  },
  {
    icon: '💪',
    titleHe: 'העצמה אישית והתמודדות עם פחדים',
    titleEn: 'כלים להתמודדות עם פחדים, חרדות והעצמת הביטחון העצמי',
    image: require('../assets/2.jpeg'),
    color: ['#e2d5f5'],
    content: [
      { type: 'text', value: 'תרגיל "דמיון מודרך" להתמודדות עם פחדים' },
      { type: 'video', value: 'https://www.youtube.com/embed/SYrpH4CnfKQ' },
    ]
  },
  {
    icon: '🌿',
    titleHe: 'התמודדות עם טראומה ודיכאון',
    titleEn: 'כלים וטכניקות להתמודדות עם טראומה ודיכאון, להקל על ההתמודדות היומיומית',
    image: require('../assets/3.jpeg'),
    color: ['#E1F5FE', '#BBDEFB'],
    content: [
      { type: 'text', value: 'תרגילי יוגה לעידוד תחושת רוגע' },
      { type: 'video', value: 'https://www.youtube.com/embed/8TuRYV71Rgo' },
    ]
  },
  {
    icon: '🧘‍♀️',
    titleHe: 'מדיטציה ומיינדפולנס',
    titleEn: 'תרגולי מדיטציה ומיינדפולנס לשיפור הרוגע הפנימי',
    image: require('../assets/4.jpeg'),
    color: ['#e2d5f5'],
    content: [
      { type: 'text', value: 'מדיטציית מיינדפולנס של 5 דקות - לרגיעה ושלווה מיידיים' },
      { type: 'video', value: 'https://www.youtube.com/embed/TENB02x_cig' },
    ]
  },
];

export default function EnrichmentContent({ navigation }) {
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
    backgroundColor: '#F4F7FC',  // Lighter background that fits with the app theme
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
