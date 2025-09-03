# 🚇 SmartCommute — Smarter Journeys, Seamless Lives

> _"Empowering commuters with intelligent, real-time public transport guidance for the cities of tomorrow."_

![SmartCommute Thumbnail](../assets/SmartCommute_Logo.png)

<p align="center">
  <a href="https://github.com/softwarelab3/2006-SCEX-L1/tree/main/application/frontend">Frontend</a> |
  <a href="https://github.com/softwarelab3/2006-SCEX-L1/tree/main/application/backend">Backend</a> |
  <a href="https://www.youtube.com/watch?v=S7B_koAZyYg">Demo Video</a>
</p>

SmartCommute is a mobile-first travel companion that optimizes your daily commute using real-time transport data. Designed for Singapore commuters, including students, working professionals, and the elderly. SmartCommute offers intelligent route suggestions, multilingual support, and seamless cab integration.

This project was built for NTU SC2006 Software Engineering, demonstrating robust architecture, modular design, and practical integration with public APIs like OneMap and LTA.

---

## 📄 Table of Contents

- [Installation Setup](#-installation-setup)
- [Documentation](#-documentation)
- [App Design](#-app-design)
- [Design Patterns](#-design-patterns)
- [SOLID Principles](#-solid-principles)
- [Tech Stack](#-tech-stack)
- [Contributors](#-contributors)
- [License](#-license)
- [Acknowledgments](#-acknowledgments)

---

## ⚙️ Installation Setup

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

> Scan the QR code using the Expo Go app to preview the application on your mobile device.

---

## 📚 Documentation

- 📄 `README.md` – Project overview & setup
- 🧪 Unit Tests – Located under `backend/src/tests/`
- 📜 API Endpoints – `/routes` directory includes all endpoints for buses, trains, taxi, weather, chatbot, etc.
- 🌐 i18n Support – JSON translation files under `frontend/data/locales`
- 📦 Data Files – MRT station coordinates, fare estimations, stored in `/data`

---

## 🧩 App Design

### Overview

SmartCommute uses a full-stack modular architecture to separate business logic, API layers, and user interface components.

### 📱 Frontend (React Native)

- `/components/` – UI components (e.g., map layouts, modals, bus/taxi/train cards)
- `/screens/` – Main pages like Homepage, FareRouteMap, Loginpage, etc.
- `/styling/` – Tailwind + TS styling files
- `/services/` – i18n and utility integrations

### 🌐 Backend (Node.js + Express)

- `/controllers/` – Handles logic for transit, chatbot, fare, and more
- `/routes/` – API route definitions
- `/middleware/` – Auth/session control
- `/services/` – External API handlers (OneMap)
- `/models/` – User schema (MongoDB)
- `/data/` – Static datasets like `fares.json`, `mrtStations.csv`

---

## 🧠 Design Patterns

- **Facade Pattern** – Used in controller-service structure to abstract logic
- **Modular Routing** – Decouples route handling from controller logic
- **Strategy Pattern** – (e.g., fare calculation, route selection modes)
- **Observer Pattern** – (potential for session timeout or map listener features)

---

## 🏛️ SOLID Principles

- **S** – Each controller/service handles a single responsibility (e.g., `fareRouteController.ts`)
- **O** – Easily extensible via modular `services/` and `routes/`
- **L** – Component reusability respected in screens/layouts
- **I** – Interfaces separate frontend types (`types/`) and backend models
- **D** – Backend depends on abstract logic in `services/`, not low-level API calls directly

---

## 🧰 Tech Stack

**Frontend:**
- React Native
- TypeScript
- Expo

**Backend:**
- Node.js
- Express.js
- TypeScript
- MongoDB (via Mongoose)

**External APIs:**
- OneMap Routing & Geolocation API
- LTA DataMall for transport timings
- OpenWeatherAPI for weathers

---

## 👥 Contributors

| Name                  | Role                        |
|-----------------------|-----------------------------|
| Amanda Rae Josephine  | Admin, Logo & Branding      |
| Aw Yong Wing Kian     | Full Stack, Backend         |
| Chan Zi Hao           | Database, Backend           |
| Ivan Cheng Li Hao     | Testing, Frontend           |
| Jace Seow Wen Hui     | Refactoring, Frontend       |

---

## 📜 License

This project is protected under the **Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License**.  
You must **credit the SmartCommute Team** and **request permission** before copying, modifying, or redistributing any part of the project.  
For more details, see the [LICENSE](http://creativecommons.org/licenses/by-nc-nd/4.0/).

---

## 🙏 Acknowledgments

- OneMap.sg – Routing & location APIs  
- LTA DataMall – Real-time bus/train/taxi data  
- MongoDB – User data storage  
- SC2006 Course Team – Project mentorship  
- Open Source Community – React Native, Expo, Tailwind

---

> _"Built with intent. Designed for movement. This is SmartCommute."_
