import Checkbox from 'expo-checkbox';
import React, { useState , useEffect } from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import { Text } from 'react-native-paper'
import Background from '../components/Background'
import Logo from '../components/Logo'
import Header from '../components/Header'
import Button from '../components/Button'
import TextInput from '../components/TextInput'
import BackButton from '../components/BackButton'
import { theme } from '../core/theme'
import { passwordValidator } from '../helpers/passwordValidator'
import { nameValidator } from '../helpers/nameValidator'
import { api } from '../api';
import { URL } from '@env';
import * as SecureStore from 'expo-secure-store';


export default function RegisterScreen({ navigation, route}) {
  const [name, setName] = useState({ value: '', error: '' })
  const [password, setPassword] = useState({ value: '', error: '' })
  const [isChecked, setChecked] = useState(false);

  const { params } = route || {};

  // Use useEffect to check for the navigation parameter
  useEffect(() => {
    if (route.params?.acceptedTerms) {
      setChecked(true); // Automatically check the box
    }
  }, [route.params]);

  const onSignUpPressed = async () => {
    const nameError = nameValidator(name.value);
    const passwordError = passwordValidator(password.value);
    if (passwordError || nameError) {
      setName({ ...name, error: nameError });
      setPassword({ ...password, error: passwordError });
      return;
    }

    if (!isChecked) {
      alert('עליך להסכים לתנאים ולהגבלות כדי להירשם');
      return;
    }
  
    try {
      const result = await api('/users/register', {
        method: 'POST',
        body: JSON.stringify({
          username: name.value,
          password: password.value,
          agreement: isChecked,
        }),
      });
      
      console.log('Server response:', result);

      await SecureStore.setItemAsync('access_token', result.access_token);
  
      // Navigate to the Dashboard on success
      navigation.reset({
        index: 0,
        routes: [{ name: 'QuestionsScreen' }],
      });
            
    } catch (error) {
      console.error('Error during sign up:', error.message);
      alert(error.message);
    }
  };
  
  return (
    <Background>
      <BackButton goBack={navigation.goBack} />
      <Logo />
      <Header>יצירת חשבון</Header>
      <TextInput
        label="שם משתמש"
        returnKeyType="next"
        value={name.value}
        onChangeText={(text) => setName({ value: text, error: '' })}
        error={!!name.error}
        errorText={name.error}
      />
      <TextInput
        label="סיסמא"
        returnKeyType="done"
        value={password.value}
        onChangeText={(text) => setPassword({ value: text, error: '' })}
        error={!!password.error}
        errorText={password.error}
        secureTextEntry
      />
      <View style={styles.checkboxRow}>
        <Checkbox
          value={isChecked}
          onValueChange={setChecked}
          color={isChecked ? theme.colors.primary : undefined}
        />
        <Text style={styles.checkboxText}> אני מסכים לתנאים ולהגבלות </Text>
      </View>
      <Button
        mode="contained"
        onPress={onSignUpPressed}
        style={{ marginTop: 24 }}
        disabled={!isChecked}
      >
        המשך
      </Button>
      <View style={styles.row}>
      <TouchableOpacity onPress={() => navigation.navigate('RegulationsScreen')}>
        <Text style={styles.link}>תקנון משתמשים </Text>
      </TouchableOpacity>
      </View>
      <View style={styles.row}>
      <TouchableOpacity onPress={() => navigation.replace('LoginScreen')}>
          <Text style={styles.link}> התחבר </Text>
        </TouchableOpacity>
        <Text>יש לך כבר חשבון ?  </Text>
      </View>
    </Background>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    marginTop: 4,
  },
  link: {
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  checkboxText: {
    fontSize: 16,
    alignSelf: 'flex-start', 
    marginLeft: 8,          
  },
})
