import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export function PostDetailsModal({ post, onClose }) {
  return (
    <View style={styles.modalContainer}>
      <View style={styles.modalContent}>
        <Text style={styles.modalTitle}>{post.title}</Text>
        <Text style={styles.modalDetail}>
          <Text style={styles.label}>תוכן: </Text>
          {post.content}
        </Text>
        <Text style={styles.modalDetail}>
          <Text style={styles.label}>מאת: </Text>
          {post.author}
        </Text>
        <Text style={styles.modalDetail}>
          <Text style={styles.label}>תאריך: </Text>
          {new Date(post.createdAt).toLocaleDateString()}
        </Text>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeButtonText}>סגור</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: { width: '80%', padding: 16, backgroundColor: '#fff', borderRadius: 8 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  modalDetail: { fontSize: 14, marginBottom: 8 },
  label: { fontWeight: 'bold' },
  closeButton: { padding: 12, backgroundColor: '#007BFF', borderRadius: 8, marginTop: 16 },
  closeButtonText: { color: '#fff', textAlign: 'center' },
});
