import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, TextInput, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const questions = [
  'What is your favorite color?',
  'What is your hobby?',
  'What is your dream job?'
];

const QuestionnaireScreen = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const navigation = useNavigation();

  const handleAnswerChange = (text) => {
    setAnswers({
      ...answers,
      [currentQuestionIndex]: text,
    });
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      console.log('User answers:', answers);
      alert('Thank you for completing the questionnaire!');
      navigation.reset({
        index: 0,
        routes: [{ name: 'Dashboard' }],
      });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.question}>{questions[currentQuestionIndex]}</Text>
      <TextInput
        style={styles.input}
        placeholder="Your answer"
        value={answers[currentQuestionIndex] || ''}
        onChangeText={handleAnswerChange}
      />
      <Button title="Continue" onPress={handleNextQuestion} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  question: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    width: '100%',
    marginBottom: 20,
    paddingHorizontal: 8,
  },
});

export default QuestionnaireScreen;
