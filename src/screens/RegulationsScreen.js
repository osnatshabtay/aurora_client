import React from 'react';
import { ScrollView, StyleSheet, View, I18nManager } from 'react-native';
import { Text } from 'react-native-paper';
import Background from '../components/Background';
import Header from '../components/Header';
import Button from '../components/Button';

export default function RegulationsScreen({ navigation }) {
  return (
    <Background>
      <Header style={styles.header}>תקנון</Header>
      <ScrollView style={styles.scrollView}>
        <Text style={styles.sectionTitle}>• שמירה על פרטיות ואנונימיות:</Text>
        <Text style={styles.regulationsText}>
          - אנו מחויבים לשמירה על פרטיותכם. המידע האישי שתספקו לנו יישמר בסביבה מאובטחת ותחת אמצעי הגנה מתקדמים.
          {"\n"}
          - המערכת תאפשר לכם לקבל שירותים בצורה אנונימית, מבלי לחשוף את זהותכם האמיתית.
          {"\n"}
          - כל מידע שתספקו ישמש אך ורק למתן שירותים מותאמים אישית במסגרת המערכת, ולא יועבר או יימסר לגורם חיצוני.
        </Text>

        <Text style={styles.sectionTitle}>• אפשרויות שמירת מידע:</Text>
        <Text style={styles.regulationsText}>
          - בעת ההרשמה, תוכלו לבחור בין שתי אפשרויות:
          {"\n"}
          {"    "}1. שירות מותאם אישית (שמירת מידע):
          {"\n"}
          {"        "}- המערכת תשמור נתונים מסוימים, כמו שאלות, תוצאות, ותיעוד העדפותיכם.
          {"\n"}
          {"        "}- שמירת המידע תאפשר לספק שירותים מותאמים אישית ומדויקים.
          {"\n"}
          {"    "}2. שירות אנונימי (ללא שמירת מידע):
          {"\n"}
          {"        "}- המערכת לא תשמור שום מידע אישי עליכם.
          {"\n"}
          {"        "}- במצב זה, לא ניתן לספק שירותים מותאמים אישית.
        </Text>

        <Text style={styles.sectionTitle}>• אבטחת מידע:</Text>
        <Text style={styles.regulationsText}>
          - כל המידע האישי יאוחסן בצורה מאובטחת וייחשף רק לצורך מתן השירות.
          {"\n"}
          - אנו מתחייבים לעמידה בתקני אבטחת מידע מחמירים ולביצוע ביקורות תקופתיות.
        </Text>

        <Text style={styles.sectionTitle}>• בחירה ושקיפות:</Text>
        <Text style={styles.regulationsText}>
          - במהלך ההרשמה, תתבקשו לבחור בין שמירת מידע או שירות אנונימי.
          {"\n"}
          - הבחירה שלכם ניתנת לשינוי בכל שלב בהגדרות המשתמש.
        </Text>

        <Text style={styles.sectionTitle}>• הסכמת המשתמש:</Text>
        <Text style={styles.regulationsText}>
          - בעת הרשמתכם, תתבקשו לאשר שקראתם את התקנון ושאתם מסכימים למדיניות הפרטיות.
        </Text>
      </ScrollView>
      <Button
        mode="contained"
        onPress={() => {
          navigation.navigate('RegisterScreen', { acceptedTerms: true });
        }}
        style={styles.button}
      >
        אישור והמשך
      </Button>

    </Background>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    marginVertical: 20,
    paddingHorizontal: 15,
    direction: I18nManager.isRTL ? 'rtl' : 'ltr',
  },
  regulationsText: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'right',
    marginBottom: 10,
    color: '#333',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
    color: '#4A90E2',
    textAlign: 'right',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#6A1B9A',
    marginBottom: 10,
  },
  button: {
    marginTop: 24,
    backgroundColor: '#6A1B9A',
  },
});
