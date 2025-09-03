# 🌟 Project Title — *SmartCommute*

> _"Empowering commuters with intelligent, real-time public transport guidance for the cities of tomorrow."_

## 🚀 Overview

Welcome to **SmartCommute**, a thoughtfully engineered solution developed as part of the SC2006 Software Engineering coursework. This application showcases a blend of creativity and rigor, embodying key software engineering principles through real-world functionality.

At its core, this project aims to:
- Provide real-time transit planning for commuters in Singapore
- Daily commuters seeking smarter, cost-effective travel options, especially students, working adults and elderlies

## ✨ Key Features

- 🚉 **Fare & Duration Routing**: Get up to 5 route options optimized by fare, time, and crowd levels.
- 📍 **Interactive Map Views**: Tap instructions to highlight corresponding segments on the map.
- 🚖 **Cab Mode**: Switch to drive-only routes with estimated fares based on distance.
- 🌐 **Multi-language Support**: English, Chinese, Malay, Tamil localization.
- 🤖 **Integrated Chatbot**: Assist users with navigation and FAQs.
- 📄 **Profile & Feedback Management**: Secure login/signup, feedback form, and admin pages.
- 🎨 **Dynamic Theming**: Light/dark mode toggle with adaptive UI.
- 📱 **Optimized for Mobile (React Native)**: Cross-platform support via Expo.

## 🏗️ Project Structure
```bash
SmartCommute/
├── backend/                     # Node.js + Express + TypeScript API
│   ├── src/
│   │   ├── controllers/         # Handles logic (bus, fareRoute, taxi, train, etc.)
│   │   ├── routes/              # RESTful routes per controller
│   │   ├── models/              # User model
│   │   ├── middleware/          # Auth/session logic
│   │   ├── services/            # External API interaction (OneMap)
│   │   ├── data/                # Static datasets (fares.json, etc.)
│   │   └── types/               # Type declarations
│   ├── tests/                   # Unit tests for controllers
│   └── server.ts                # Main entry point
├── frontend/                    # React Native app with Expo
│   ├── components/              # Reusable components and layout
│   ├── screens/                 # Screens (Homepage, Loginpage, FareRouteMap, etc.)
│   ├── styling/                 # Stylesheets (Tailwind + custom TS)
│   ├── data/                    # Localization (EN, MS, ZH, TA), fare data
│   ├── assets/                  # Icons, images, splash screens
│   ├── services/                # i18n setup and helpers
│   └── App.tsx                  # Root component
```
## ⚙️ Installation & Setup

### Prerequisites

- Node.js (v18+)
- Expo CLI
- TypeScript
- npm or yarn

### 🔧 Backend Setup

```bash
cd backend
npm install
npm run build
npm start
```

### 📱 Frontend Setup

```bash
cd frontend
npm install
npx expo start
```

> Scan the QR code in your Expo Go app to preview the app on your mobile device.

## 📡 Tech Stack

- **Frontend**: React Native, TypeScript, Tailwind CSS (NativeWind), Expo  
- **Backend**: Node.js, Express, TypeScript, REST APIs  
- **APIs**: OneMap Singapore for route planning, geolocation, fare data  
- **Testing**: Jest for controller unit tests  
- **Data**: MRT station coordinates, fare tables, multilingual strings  

## 👥 Contributors

- **AMANDA RAE JOSEPHINE** 
- **AW YONG WING KIAN, ALVIN** 
- **CHAN ZI HAO** 
- **IVAN CHENG LI HAO**
- **JACE SEOW WEN HUI** 

## 🔮 Future Roadmap

- 🔐 Store User routes, chat session 
- 📍 Include Cycling as a mode feature 
- 📱 Publish to Google Play Store and Apple Store
 
## 📜 License

This project is protected under the **Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License**.  
You must **credit the SmartCommute Team** and **request permission** before copying, modifying, or redistributing any part of the project.

For more details, see the [LICENSE](http://creativecommons.org/licenses/by-nc-nd/4.0/) link.

## 🙏 Acknowledgments

- OneMap.sg – Routing & location APIs
- LTA DATAMALL - Bus, Train and Taxi Data
- MongoDB - User storage  
- SC2006 Course Team – Project supervision  
- React Native + Open Source Community
