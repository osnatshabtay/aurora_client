import React from 'react';
import { View, Text, StyleSheet, ScrollView, Linking, TouchableOpacity } from 'react-native';
import { WebView } from 'react-native-webview';
import BackButton from '../components/BackButton'; 
import { useNavigation } from '@react-navigation/native';

export default function CategoryContent({ route }) {
  const { titleHe, titleEn, icon, content } = route.params;
  const navigation = useNavigation();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      
      <BackButton goBack={navigation.goBack} />
      
      <Text style={styles.icon}>{icon}</Text>
      <Text style={styles.title}>{titleHe}</Text>
      <Text style={styles.subtitle}>{titleEn}</Text>

      {content.map((item, index) => {
        if (item.type === 'text') {
          return (
            <Text key={index} style={styles.textContent}>
              {item.value}
            </Text>
          );
        }

        if (item.type === 'video') {
          return (
            <WebView
              key={index}
              source={{ uri: item.value }}
              style={styles.videoContent}
            />
          );
        }
        if (item.type === 'website') {
          return (
            <View key={index} style={styles.websiteContainer}>
              <WebView
                source={{ uri: item.value }}
                style={styles.websitePreview}
                startInLoadingState
                scalesPageToFit={true}
              />
              <TouchableOpacity
                onPress={() => Linking.openURL(item.value)}
                style={styles.websiteButton}
              >
                <Text style={styles.websiteLink}>🌐 צפייה באתר המלא</Text>
              </TouchableOpacity>
            </View>
          );
        }
                
      return null; 
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F8E9',
    padding: 16,
    direction: 'rtl',  
  },
  icon: {
    fontSize: 64,
    textAlign: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#37474F',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#607D8B',
    textAlign: 'center',
    marginBottom: 16,
  },
  textContent: {
    fontSize: 14,
    color: '#455A64',
    textAlign: 'center', 
    marginBottom: 16,
    writingDirection: 'rtl', 
  },  
  videoContent: {
    height: 200,
    marginBottom: 16,
  },
  websiteContainer: {
    marginBottom: 24,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    height: 200,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  
  websitePreview: {
    height: 300,
  },
  
  websiteButton: {
    backgroundColor: '#E3F2FD',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#BBDEFB',
    alignItems: 'center',
  },
  
  websiteLink: {
    color: '#1E88E5',
    fontSize: 16,
    fontWeight: 'bold',
  }  
});

