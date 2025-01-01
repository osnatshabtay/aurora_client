import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { WebView } from 'react-native-webview';

export default function CategoryContent({ route }) {
  const { titleHe, titleEn, icon, content } = route.params;

  return (
    <ScrollView contentContainerStyle={styles.container}>
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
});

