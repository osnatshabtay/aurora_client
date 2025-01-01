import React, { useState } from 'react'
import { TouchableOpacity, StyleSheet, View } from 'react-native'
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


export default function LoginScreen({ navigation }) {
  const [name, setName] = useState({ value: '', error: '' })
  const [password, setPassword] = useState({ value: '', error: '' })

  const onLoginPressed = async () => {
    const nameError = nameValidator(name.value);
    const passwordError = passwordValidator(password.value);

    if (passwordError || nameError) {
      setName({ ...name, error: nameError });
      setPassword({ ...password, error: passwordError });
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: name.value,
          password: password.value, 
          agreement: true,
        }),
      });
  
      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage || 'Failed to sign up. Please try again.');
      }
  
      const result = await response.json();
      console.log('Server response:', result);
  
      navigation.reset({
        index: 0,
        routes: [{ name: 'HomeScreen' }],
      });
      
    } catch (error) {
      console.error('Error during sign up:', error.message);
      alert('Error: ' + error.message);
    }
  };

  return (
    <Background>
      <BackButton goBack={navigation.goBack} />
      <Logo />
      <Header>ברוכים הבאים</Header>
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
      <View style={styles.forgotPassword}>
        <TouchableOpacity
          onPress={() => navigation.navigate('StartScreen')}
        >
          <Text style={styles.forgot}>שכחת את הסיסמא ?</Text>
        </TouchableOpacity>
      </View>
      <Button mode="contained" onPress={onLoginPressed}>
        התחבר
      </Button>
      <View style={styles.row}>
      <TouchableOpacity onPress={() => navigation.replace('RegisterScreen')}>
          <Text style={styles.link}> הירשם </Text>
        </TouchableOpacity>
        <Text> עדיין אין לך חשבון ?  </Text>
      </View>
    </Background>
  )
}

const styles = StyleSheet.create({
  forgotPassword: {
    width: '100%',
    alignItems: 'flex-end',
    marginBottom: 24,
  },
  row: {
    flexDirection: 'row',
    marginTop: 4,
  },
  forgot: {
    fontSize: 13,
    color: theme.colors.secondary,
  },
  link: {
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
})




