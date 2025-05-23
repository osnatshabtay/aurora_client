import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

export default function UserCard({ username, gender, selectedImage }) {
  return (
    <View style={styles.card}>
      <Image source={{ uri: selectedImage }} style={styles.avatar} />
      <View style={styles.info}>
        <Text style={styles.name}>{username}</Text>
        <Text style={styles.gender}>{gender}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row', padding: 10, marginVertical: 6, borderWidth: 1, borderColor: '#ccc', borderRadius: 10 },
  avatar: { width: 50, height: 50, borderRadius: 25, marginRight: 12 },
  info: { justifyContent: 'center' },
  name: { fontSize: 16, fontWeight: 'bold' },
  gender: { fontSize: 14, color: '#555' },
});
