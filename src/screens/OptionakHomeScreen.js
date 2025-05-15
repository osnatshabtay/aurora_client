import React, { useState } from 'react';
import { View, ScrollView, Image, StyleSheet, I18nManager } from 'react-native';
import { Text, Avatar, Card, Button, Title, IconButton } from 'react-native-paper';

I18nManager.forceRTL(true);

const recommended = [
  {
    title: 'סתיו גשום',
    duration: '3-20 דקות',
    image: require('../assets/rain.jpg'),
  },
  {
    title: 'מקדש בשקיעה',
    duration: '10-14 דקות',
    image: require('../assets/temple.jpg'),
  },
  {
    title: 'חופי חול',
    duration: '5-10 דקות',
    image: require('../assets/sand.jpg'),
  },
];

const BottomBar = ({ currentTab, setCurrentTab }) => {
  const tabs = [
    { icon: 'home', label: 'בית' },
    { icon: 'bed', label: 'שינה' },
    { icon: 'meditation', label: 'מדיטציה' },
    { icon: 'run', label: 'תנועה' },
    { icon: 'target', label: 'פוקוס' },
  ];

  return (
    <View style={styles.bottomBar}>
      {tabs.map((tab, index) => (
        <View key={index} style={styles.tabItem}>
          <IconButton
            icon={tab.icon}
            size={24}
            onPress={() => setCurrentTab(tab.label)}
            iconColor={currentTab === tab.label ? '#4CAF50' : '#888'}
          />
          <Text style={[styles.tabLabel, currentTab === tab.label && styles.tabLabelActive]}>{tab.label}</Text>
        </View>
      ))}
    </View>
  );
};

export default function OptinalHomeScreen() {
  const [currentTab, setCurrentTab] = useState('בית');

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Avatar.Image size={40} source={require('../assets/avatar.jpg')} />
          <IconButton icon="menu" size={24} onPress={() => {}} />
        </View>

        <View style={styles.greeting}>
          <Text style={styles.title}>בוקר טוב, ג׳סיקה</Text>
          <Text style={styles.subtitle}>בואי נתחיל את היום הזה כמו שצריך</Text>
        </View>

        <Card style={styles.cardHighlight}>
          <Card.Content style={styles.row}>
            <View style={{ flex: 1 }}>
              <Text>רוגע יומי עם צ׳לסי טמרה</Text>
              <Text style={styles.grayText}>פעילות מודעת</Text>
            </View>
            <Image source={require('../assets/yoga.jpg')} style={styles.cardImage} />
          </Card.Content>
        </Card>

        <Text style={styles.sectionTitle}>התחילי את היום שלך</Text>

        <Card style={styles.cardPlay}>
          <Card.Content style={styles.row}>
            <View style={{ flex: 1 }}>
              <Text style={styles.playTitle}>לברוח מהמחשבות</Text>
              <Text style={styles.grayText}>מדיטציה • 3-20 דקות</Text>
            </View>
            <IconButton icon="play" size={28} onPress={() => {}} />
          </Card.Content>
        </Card>

        <View style={styles.recommendHeader}>
          <Text style={styles.sectionTitle}>מומלץ עבורך</Text>
          <IconButton icon="chevron-left" size={20} onPress={() => {}} />
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {recommended.map((item, index) => (
            <Card key={index} style={styles.recommendCard}>
              <Card.Cover source={item.image} style={{ height: 100 }} />
              <Card.Content>
                <Text>{item.title}</Text>
                <Text style={styles.grayText}>מדיטציה • {item.duration}</Text>
              </Card.Content>
            </Card>
          ))}
        </ScrollView>

        <View style={{ height: 30 }} />
      </ScrollView>
      <BottomBar currentTab={currentTab} setCurrentTab={setCurrentTab} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF7F0',
    paddingHorizontal: 16,
    paddingTop: 40,
  },
  header: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  greeting: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'right',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'right',
  },
  cardHighlight: {
    backgroundColor: '#fff2dc',
    borderRadius: 16,
    marginBottom: 20,
  },
  cardImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  cardPlay: {
    backgroundColor: '#e1eddc',
    borderRadius: 16,
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
  },
  playTitle: {
    fontWeight: '500',
    fontSize: 16,
    textAlign: 'right',
  },
  grayText: {
    color: '#777',
    fontSize: 12,
    textAlign: 'right',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'right',
  },
  recommendHeader: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
    marginBottom: 8,
  },
  recommendCard: {
    width: 140,
    marginLeft: 12,
    borderRadius: 12,
  },
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
    flex: 1,
  },
  tabLabel: {
    fontSize: 12,
    color: '#888',
  },
  tabLabelActive: {
    color: '#4CAF50',
    fontWeight: '600',
  },
});
