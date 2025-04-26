import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Background from '../components/Background';
import Logo from '../components/Logo';
import Header from '../components/Header';
import { theme } from '../core/theme';
import {imageMapping} from '../helpers/avatar';
import { URL } from '@env';
import { api } from '../api';


const QuestionnaireScreen = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showTraumaQuestions, setShowTraumaQuestions] = useState(false);
  const [imageSelect, setImageSelect] = useState(null);

  const navigation = useNavigation();
  

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch(`${URL}:8000/users/questions`);
        if (!response.ok) {
          throw new Error('Failed to fetch questions');
        }
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
    const isGenderQuestion = currentQuestion.index === 1;  // "איך תרצה שנפנה אלייך? "
    const isTraumaQuestion = currentQuestion.index === 35; // "האם חווית אירוע טראומטי?"
    const isImage = option.endsWith('.png');

    // Save the selected image to state
    if (isImage) {
      setImageSelect(option);
    }
  

    if (isGenderQuestion) {
      setQuestions((prevQuestions) => {
        // Remove both image selection questions first
        const filteredQuestions = prevQuestions.filter((q) => q.index !== 44 && q.index !== 45);
    
        // Add the relevant image selection question based on gender
        if (option === "זכר") {
          filteredQuestions.push({
            index: 45,
            question: "תבחר עבורך תמונה :)",
            options: ["boy_avatar1.png", "boy_avatar2.png", "boy_avatar3.png", "boy_avatar4.png", "boy_avatar5.png", "boy_avatar6.png", "boy_avatar7.png", "boy_avatar8.png"],
            multiple: false,
            trauma: false
          });
        } else if (option === "נקבה") {
          filteredQuestions.push({
            index: 44,
            question: "תבחרי עבורך תמונה :)",
            options: ["girl_avatar1.png", "girl_avatar2.png", "girl_avatar3.png", "girl_avatar4.png", "girl_avatar5.png", "girl_avatar6.png", "girl_avatar7.png", "girl_avatar8.png", "girl_avatar9.png", "girl_avatar10.png", "girl_avatar11.png", "girl_avatar12.png"],
            multiple: false,
            trauma: false
          });
        }
    
        return filteredQuestions;
      });
    }
            
    // Handle trauma-specific questions
    if (isTraumaQuestion) {
      setShowTraumaQuestions(option === "כן");
    }

    // Update answers
    if (currentQuestion.multiple) {
      const currentAnswers = answers[currentQuestionIndex] || [];
    
      // Toggle the selected option
      if (currentAnswers.includes(option)) {
        setAnswers((prevAnswers) => ({
          ...prevAnswers,
          [currentQuestionIndex]: currentAnswers.filter((item) => item !== option),
        }));
      } else {
        setAnswers((prevAnswers) => ({
          ...prevAnswers,
          [currentQuestionIndex]: [...currentAnswers, option],
        }));
      }
    } else {
      setAnswers((prevAnswers) => ({
        ...prevAnswers,
        [currentQuestionIndex]: option,
      }));
    }
  };

  const getFilteredQuestions = () => {
    if (showTraumaQuestions) {
      return questions;
    }
    return questions.filter((q) => !q.trauma);
  };

  const filteredQuestions = getFilteredQuestions();

  const renderOption = (option) => {
    const isImage = option.endsWith('.png');
    const currentAnswer = answers[currentQuestionIndex];
    
    // Check if the option is selected
    const isSelected = Array.isArray(currentAnswer)
      ? currentAnswer.includes(option)
      : currentAnswer === option;
  
    if (isImage && imageMapping[option]) {
      return (
        <Image
          source={imageMapping[option]}
          style={styles.optionImage}
        />
      );
    }
  
    return (
      <Text
        style={[
          styles.optionText,
          isSelected && styles.selectedOptionText,
        ]}
      >
        {option}
      </Text>
    );
  };
         
  const handleNextQuestion = async () => {
    if (currentQuestionIndex < filteredQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } 
    else {
      const genderAnswer = answers[questions.findIndex(q => q.question === "איך תרצה שנפנה אלייך? ")];
  
      const formattedAnswers = filteredQuestions.map((question, index) => ({
        question: question.question,
        answers: answers[index],
      }));
  
      const payload = {
        answers: formattedAnswers,
        gender: genderAnswer,
        selectedImage: imageSelect,
        };

      try {
        await api('/users/questions', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
      
        Alert.alert('איזה כיף', 'ברוך הבא אלינו');
        navigation.reset({
          index: 0,
          routes: [{ name: 'HomeScreen' }],
        });
      
      } catch (error) {
        console.error('Error saving answers:', error.message);
        Alert.alert('Error', error.message);
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
              Array.isArray(answers[currentQuestionIndex])
                ? answers[currentQuestionIndex]?.includes(option) && styles.selectedOption
                : answers[currentQuestionIndex] === option && styles.selectedOption,
            ]}
            onPress={() => handleAnswerSelect(option)}
          >
            {renderOption(option)}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  questionContainer: {
    marginVertical: 20,
    alignItems: 'center',
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
  optionImage: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
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