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
import { URL } from '@env';
import * as SecureStore from 'expo-secure-store';
import { api } from '../api';



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
      const result = await api('/users/login', {
        method: 'POST',
        body: JSON.stringify({
          username: name.value,
          password: password.value,
        }),
      });

      console.log('Server response:', result);

      await SecureStore.setItemAsync('access_token', result.access_token);
            
      if (result.is_admin) {
        navigation.reset({
          index: 0,
          routes: [{ name: 'HomeScreenManager' }],
        });
      } else {
        navigation.reset({
          index: 0,
          routes: [{ name: 'MainTabs' }],
        });
      }

      
    } catch (error) {
      console.error('Error during log in:', error.message);
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