# Knot App

A complete, production-ready Expo app for couples to improve their relationship through AI-powered guidance.

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env` and fill in your credentials:

```bash
cp .env.example .env
```

You'll need:
- **Firebase**: Create a project at [Firebase Console](https://console.firebase.google.com/)
  - Enable Authentication (Email/Password, Google, Apple)
  - Create Firestore Database
  - Create Realtime Database
  - Enable Storage
- **OpenAI**: Get an API key from [OpenAI Platform](https://platform.openai.com/)

### 3. Add Font Files

Download Inter font from [Google Fonts](https://fonts.google.com/specimen/Inter) and place the following files in `assets/fonts/`:
- `Inter-Regular.ttf`
- `Inter-Medium.ttf`
- `Inter-SemiBold.ttf`
- `Inter-Bold.ttf`

### 4. Create Placeholder Assets

Create the following placeholder images in the `assets/` directory:
- `icon.png` (1024x1024)
- `splash.png` (1284x2778)
- `adaptive-icon.png` (1024x1024)
- `favicon.png` (48x48)
- `notification-icon.png` (96x96)

### 5. Run the App

```bash
npm start
```

Then:
- Press `i` for iOS simulator
- Press `a` for Android emulator
- Scan QR code with Expo Go app on your phone

## Features

- ✅ Authentication (Email/Password, Google, Apple)
- ✅ Multi-step onboarding
- ✅ Dashboard with Love Score, Requirements Matcher, Drift Detector
- ✅ Shared journal with reminders
- ✅ Sort Out feature for conflict resolution
- ✅ Educational guides and quizzes
- ✅ Partner pairing with QR codes
- ✅ AI Replier for fun responses
- ✅ Settings and profile management

## Tech Stack

- Expo SDK 52
- React Native with TypeScript
- NativeWind (Tailwind CSS)
- Firebase (Auth, Firestore, Realtime DB)
- TanStack Query
- Zustand
- OpenAI API
- React Native Reanimated 3
- Moti

## Project Structure

```
sort-out/
├── app/                    # Expo Router screens
│   ├── (auth)/            # Authentication screens
│   ├── (tabs)/            # Main tab screens
│   ├── sortout/           # Sort Out feature screens
│   └── ...                # Other screens
├── components/            # Reusable components
├── config/                # Configuration files
├── services/              # API and service layers
├── store/                 # Zustand stores
├── types/                 # TypeScript types
└── assets/                # Images, fonts, etc.
```

## License

MIT
