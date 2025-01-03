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
    borderRadius: 8,
    elevation: 2,
    padding: 16,
    backgroundColor: '#fff',
    margin: 10,
  },
  header: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom: 8,
  },
  content: {
    paddingVertical: 10,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    paddingTop: 8,
  },
});

export { Card, CardHeader, CardContent, CardFooter };
