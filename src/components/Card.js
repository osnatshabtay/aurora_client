import React from 'react';
import { View, StyleSheet } from 'react-native';

const Card = ({ children, style }) => {
  return <View style={[styles.card, style]}>{children}</View>;
};

const CardHeader = ({ children, style }) => {
  return <View style={[styles.header, style]}>{children}</View>; // Removed <Text>
};

const CardContent = ({ children, style }) => {
  return <View style={[styles.content, style]}>{children}</View>; // Removed <Text>
};

const CardFooter = ({ children, style }) => {
  return <View style={[styles.footer, style]}>{children}</View>; // Removed <Text>
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    elevation: 3,
    padding: 16,
    backgroundColor: '#FFFFFF',
    marginVertical: 8,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
  },
  header: {
    paddingBottom: 8,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  content: {
    paddingVertical: 10,
  },
  footer: {
    paddingTop: 8,
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
});


export { Card, CardHeader, CardContent, CardFooter };
