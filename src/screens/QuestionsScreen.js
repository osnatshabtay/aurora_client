import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Background from '../components/Background';
import Logo from '../components/Logo';
import Header from '../components/Header';
import { theme } from '../core/theme'; 

const QuestionnaireScreen = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showTraumaQuestions, setShowTraumaQuestions] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/users/questions');
        const data = await response.json();
        setQuestions(data.questions);
      } catch (error) {
        console.error('Failed to fetch questions:', error);
        Alert.alert('Error', 'Failed to load questions.');
      }
    };

    fetchQuestions();
  }, []);

  const handleAnswerSelect = (option) => {
    const currentQuestion = questions[currentQuestionIndex];
    const isTraumaQuestion =
      currentQuestion.question === "האם חווית אירוע טראומטי?";

    if (isTraumaQuestion && option === "כן") {
      setShowTraumaQuestions(true);
    } else if (isTraumaQuestion && option === "לא") {
      setShowTraumaQuestions(false);
    }

    if (currentQuestion.multiple) {
      const currentAnswers = answers[currentQuestionIndex] || [];
      if (currentAnswers.includes(option)) {
        setAnswers({
          ...answers,
          [currentQuestionIndex]: currentAnswers.filter((item) => item !== option),
        });
      } else {
        setAnswers({
          ...answers,
          [currentQuestionIndex]: [...currentAnswers, option],
        });
      }
    } else {
      setAnswers({
        ...answers,
        [currentQuestionIndex]: option,
      });
    }
  };

  const getFilteredQuestions = () => {
    if (showTraumaQuestions) {
      return questions;
    }
    return questions.filter((q) => !q.trauma);
  };

  const filteredQuestions = getFilteredQuestions();

  const handleNextQuestion = async () => {
    if (currentQuestionIndex < filteredQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);

    } else {
      const formattedAnswers = filteredQuestions.map((question, index) => ({
        question: question.question,
        answers: answers[index],
      }));

      try {
        const response = await fetch('http://127.0.0.1:8000/users/questions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            answers: formattedAnswers
          }),
        });

        if (!response.ok) {
          const errorMessage = await response.text();
          throw new Error(errorMessage || 'Failed to save answers.');
        }

        const result = await response.json();
  
        Alert.alert('Success', 'Answers saved successfully!');

        navigation.reset({
          index: 0,
          routes: [{ name: 'HomeScreen' }],
        });
        
      } catch (error) {
        console.error('Error saving answers:', error.message);
        Alert.alert('Error', 'Failed to save answers.');
      }
    }
  };
  

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const isNextDisabled = () => {
    if (currentQuestionIndex >= filteredQuestions.length) {
      return true;
    }
    const currentAnswer = answers[currentQuestionIndex];
    const currentQuestion = filteredQuestions[currentQuestionIndex];
    return currentQuestion.multiple
      ? !currentAnswer || currentAnswer.length === 0
      : !currentAnswer;
  };

  if (questions.length === 0) {
    return (
      <Background>
        <View style={styles.loadingContainer}>
          <Text>טוען שאלות...</Text>
        </View>
      </Background>
    );
  }

  return (
    <Background>
      <Logo />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Header>{`שאלה ${currentQuestionIndex + 1} מתוך ${filteredQuestions.length}`}</Header>
        <View style={styles.questionContainer}>
          <Header>{filteredQuestions[currentQuestionIndex].question}</Header>
          {filteredQuestions[currentQuestionIndex].multiple && (
            <Text style={styles.infoText}>ניתן לבחור מספר תשובות</Text>
          )}
        </View>
        <View style={styles.optionsContainer}>
          {filteredQuestions[currentQuestionIndex].options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.optionButton,
                answers[currentQuestionIndex]?.includes(option) && styles.selectedOption,
              ]}
              onPress={() => handleAnswerSelect(option)}
            >
              <Text
                style={[
                  styles.optionText,
                  answers[currentQuestionIndex]?.includes(option) && styles.selectedOptionText,
                ]}
              >
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            onPress={handlePreviousQuestion}
            disabled={currentQuestionIndex === 0}
          >
            <Text
              style={[
                styles.link,
                currentQuestionIndex === 0 && styles.disabledLink,
              ]}
            >
              חזור
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleNextQuestion}
            disabled={isNextDisabled()}
          >
            <Text
              style={[
                styles.link,
                isNextDisabled() && styles.disabledLink,
              ]}
            >
              {currentQuestionIndex < filteredQuestions.length - 1 ? 'הבא' : 'סיים'}
            </Text>
            <Text> 

            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </Background>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 5,
    paddingVertical: 10,
  },

  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  questionContainer: {
    marginVertical: 20, 
    alignItems: 'center',
  },

  _question: {
    fontSize: 20,
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  
  get question() {
    return this._question;
  },
  set question(value) {
    this._question = value;
  },
  infoText: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 10,
    textAlign: 'center',
  },
  optionsContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 30,
  },

  optionButton: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: theme.colors.primary,
    borderRadius: 8,
    padding: 15,
    marginVertical: 10,
    width: '80%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  selectedOption: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.secondary,
  },
  optionText: {
    fontSize: 16,
    color: theme.colors.primary,
    textAlign: 'center',
  },
  selectedOptionText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginTop: 20,
    marginVertical: 20,
  },
  link: {
    fontWeight: 'bold',
    color: theme.colors.primary,
    fontSize: 16,
    textAlign: 'center',
  },
  disabledLink: {
    color: '#d3d3d3',
  },
});

export default QuestionnaireScreen;
