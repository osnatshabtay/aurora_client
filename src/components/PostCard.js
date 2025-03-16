import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert, Image } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { getAvatarImage } from "../helpers/avatar"; 

export function PostCard({ post, onApprove, onDelete }) {
  const confirmAction = (action, postId) => {
    const message = action === "approve" ? "האם אתה בטוח שברצונך לאשר את הפוסט?" : "האם אתה בטוח שברצונך למחוק את הפוסט?";
    const successMessage = action === "approve" ? "הפוסט אושר בהצלחה! כעת הוא יופיע לכלל משתמשי האפליקציה" : "הפוסט נמחק בהצלחה";

    Alert.alert("אישור פעולה", message, [
      { text: "ביטול", style: "cancel" },
      {
        text: "אישור",
        onPress: () => {
          if (action === "approve") {
            onApprove(postId);
          } else {
            onDelete(postId);
          }
          Alert.alert("הצלחה", successMessage);
        },
      },
    ]);
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Image source={getAvatarImage(post.user_image)} style={styles.avatar} />
        <Text style={styles.username}>{post.user}</Text>
      </View>
      <Text style={styles.content}>{post.text}</Text>
      <View style={styles.actions}>
        <TouchableOpacity onPress={() => confirmAction("approve", post._id)} style={styles.buttonApprove}>
          <MaterialIcons name="check-circle" size={24} color="#fff" />
          <Text style={styles.buttonText}>אישור</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => confirmAction("delete", post._id)} style={styles.buttonDelete}>
          <MaterialIcons name="cancel" size={24} color="#fff" />
          <Text style={styles.buttonText}>מחיקה</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 16,
    marginBottom: 16,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  username: {
    fontSize: 16,
    fontWeight: "bold",
  },
  content: {
    fontSize: 14,
    color: "#333",
    marginBottom: 12,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  buttonApprove: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 8,
  },
  buttonDelete: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E53935",
    padding: 10,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    marginLeft: 5,
    fontWeight: "bold",
  },
});
