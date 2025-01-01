import React from 'react'
import Background from '../components/Background'
import Logo from '../components/Logo'
import Header from '../components/Header'
import Button from '../components/Button'
import Paragraph from '../components/Paragraph'

export default function StartScreen({ navigation }) {
  return (
    <Background>
      <Logo />
      <Header>ברוכים הבאים</Header>
      <Paragraph>
        לכתוב משהווו מרגש
      </Paragraph>
      <Button
        mode="contained"
        onPress={() => navigation.navigate('LoginScreen')}
      >
        התחברות
      </Button>
      <Button
        mode="outlined"
        onPress={() => navigation.navigate('RegisterScreen')}
      >
        הרשמה
      </Button>

      <Button
        mode="outlined"
        onPress={() => navigation.navigate('EnrichmentContent')}
      >
        תכני העשרה
      </Button>

    </Background>
  )
}
