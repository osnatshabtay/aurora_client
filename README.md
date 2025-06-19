# Aurora Client

Aurora is a mobile application that provides emotional support through a personalized experience, including an AI chatbot, enrichment content, and a shared social space. This repository contains the **React Native client**, built using **Expo**.

## Features

- Chatbot for emotional guidance and support  
- Personalized enrichment content (videos, music, articles) based on a user questionnaire  
- Community sharing and connection with similar users  

## Tech Stack

- **React Native** with **Expo**
- **JavaScript (ES6+)**
- **Axios** for API calls
- **AsyncStorage** for local storage
- **React Navigation** for screen transitions
- **.env** configuration using `react-native-dotenv`

## Folder Structure

├── App.js
├── README.md
├── app.json
├── assets
│   ├── adaptive-icon.png
│   ├── favicon.png
│   ├── icon.png
│   └── splash.png
├── babel.config.js
├── node_modules
├── package-lock.json
├── package.json
└── src
    ├── api.js
    ├── assets
    ├── components
    ├── core
    ├── helpers
    ├── navigation
    └── screens

## How to use?

1. Download or clone this repo.

2. Install dependencies.

```js
npm install
// or
yarn install
```

3. Run project on iOS / Android.

```js
 npm run ios // npm run android
 // or
 yarn ios // yarn android
```

