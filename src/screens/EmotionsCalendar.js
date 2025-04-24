import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Calendar } from 'react-native-calendars';

// דוגמה של רגשות לפי תאריך (במקום זה תשתמשי בנתונים מהדאטה של המשתמש)
const initialEmotions = {
  '2025-04-21': '😊',
  '2025-04-22': '😢',
  '2025-04-23': '😡',
};

export default function EmotionsCalendar() {
  const [emotionsByDate, setEmotionsByDate] = useState(initialEmotions);

  // פונקציה שמחזירה אובייקט של תאריכים עם אימוג'ים
  const getMarkedDates = () => {
    const marked = {};
    Object.entries(emotionsByDate).forEach(([date, emoji]) => {
      marked[date] = {
        customStyles: {
          container: { backgroundColor: '#f0f8ff' },
          text: { fontSize: 16 },
        },
        marked: true,
        dotColor: 'transparent',
        customText: emoji,
      };
    });
    return marked;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>לוח השנה הרגשי שלי</Text>
      <Calendar
        markingType={'custom'}
        markedDates={getMarkedDates()}
        dayComponent={({ date, state }) => {
          const emotion = emotionsByDate[date.dateString];
          return (
            <View style={styles.day}>
              <Text style={{ color: state === 'disabled' ? 'gray' : 'black' }}>
                {date.day}
              </Text>
              {emotion && <Text style={styles.emoji}>{emotion}</Text>}
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingTop: 50,
    backgroundColor: '#fff',
    flex: 1,
  },
  title: {
    fontSize: 22,
    marginBottom: 16,
    textAlign: 'center',
    fontWeight: '600',
  },
  day: {
    alignItems: 'center',
  },
  emoji: {
    fontSize: 18,
  },
});
