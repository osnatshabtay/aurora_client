import React from 'react';
import { StyleSheet, KeyboardAvoidingView, View } from 'react-native';

export default function Background({ children }) {
  return (
    <View style={styles.background}>
      <KeyboardAvoidingView style={styles.container} behavior="padding">
        {children}
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    backgroundColor: '#FAF9F6', 
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    width: '100%',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
