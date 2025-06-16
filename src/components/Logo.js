import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

export default function Logo() {
  return (
    <View style={styles.logoContainer}>
      <Image source={require('../assets/logo.png')} style={styles.image} />
    </View>
  );
}

const styles = StyleSheet.create({
  logoContainer: {
    alignItems: 'center', 
    marginTop: -200, 
    marginBottom: -50      
  },
  image: {
    width: 300,
    height: 400,
  },
});
