# Sort Out 💚

A relationship wellness app for couples — powered by AI, built with Expo & Supabase.

Sort Out helps partners strengthen their bond through guided assessments, conflict resolution tools, shared journaling, and AI-powered insights — all in a modern, mobile-first experience.

---

## ✨ Features

| Feature | Description |
|---|---|
| **Love Score Assessment** | Take a relationship quiz across categories like trust, communication, and intimacy — then see your calculated Love Score |
| **Requirements Matcher** | Compare what each partner values most and uncover areas of alignment or mismatch |
| **Drift Detector** | Track emotional distance trends over time and get alerted before small gaps become big ones |
| **Sort Out (Conflict Resolution)** | A guided, step-by-step flow for working through disagreements in a healthy way |
| **Shared Notes / Journal** | A private space for couples to write, reflect, and share thoughts together |
| **AI Replier** | Get fun, AI-generated reply suggestions powered by OpenAI |
| **Partner Pairing** | Link your account with your partner's via a pairing code |
| **Onboarding Flow** | A multi-step onboarding experience to personalize the app on first launch |
| **Daily Tips** | Get a fresh relationship tip every day on your home screen |
| **Profile & Settings** | Manage your profile, partner connection, and app preferences |

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Expo SDK 54](https://expo.dev/) + React Native 0.81 |
| Language | TypeScript |
| Routing | [Expo Router v6](https://docs.expo.dev/router/introduction/) (file-based) |
| Styling | [NativeWind v4](https://www.nativewind.dev/) (Tailwind CSS for RN) |
| State Management | [Zustand v5](https://zustand-demo.pmnd.rs/) |
| Server State | [TanStack React Query v5](https://tanstack.com/query) |
| Auth & Database | [Supabase](https://supabase.com/) (Auth, Postgres, Realtime) |
| AI | [OpenAI API](https://platform.openai.com/) |
| Animations | React Native Reanimated 4 |
| Local Storage | AsyncStorage + Expo Secure Store |

---

## 📁 Project Structure

```
sort-out/
├── app/                        # Expo Router screens (file-based routing)
│   ├── _layout.tsx             # Root layout with auth guard
│   ├── index.tsx               # Entry redirect
│   ├── (auth)/                 # Auth group
│   │   ├── login.tsx           # Email/password login
│   │   ├── signup.tsx          # Account registration
│   │   └── onboarding.tsx      # Multi-step onboarding
│   ├── (tabs)/                 # Main tab navigator
│   │   ├── home.tsx            # Dashboard — Love Score, Drift Detector, Tips
│   │   ├── notes.tsx           # Shared journal / notes
│   │   ├── sortout.tsx         # Conflict resolution launcher
│   │   ├── play.tsx            # Fun & interactive features
│   │   └── me.tsx              # Profile & settings
│   ├── sortout/                # Sort Out sub-screens
│   ├── assessment.tsx          # Relationship assessment quiz
│   ├── ai-replier.tsx          # AI-generated reply suggestions
│   └── pairing.tsx             # Partner pairing flow
├── components/                 # Shared UI components
│   ├── LoveScoreCircle.tsx     # Animated circular score display
│   ├── RequirementsMatcher.tsx # Partner requirements comparison
│   ├── DriftDetector.tsx       # Emotional drift tracker
│   ├── DailyTipCard.tsx        # Daily relationship tip card
│   └── PartnerStatus.tsx       # Partner connection status
├── config/                     # App configuration
│   ├── supabase.ts             # Supabase client init
│   └── firebase.ts             # Firebase config (legacy)
├── services/                   # Business logic & API calls
│   ├── auth.ts                 # Supabase auth (sign in, sign up, sign out)
│   └── openai.ts               # OpenAI API integration
├── store/                      # Global state
│   └── userStore.ts            # Zustand store (user, partner, assessments)
├── types/                      # TypeScript type definitions
│   └── index.ts                # Shared interfaces (User, etc.)
└── assets/                     # Images, fonts, icons
```

---

## �️ Database Schema

The app uses a robust Postgres schema with Row Level Security (RLS) to ensure data privacy and shared collaboration.

- **Profiles**: Manages user identity and partner linking.
- **Shared Collaboration**: `Notes`, `Love Scores`, and `Conflict Sessions` have **Realtime** enabled for live updates.
- **Assessments**: Tracks `Requirements`, `Drift Logs`, and `Assessments` data.
- **Daily Tips**: Provides daily guidance via a reference table.

---

## �🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [Expo CLI](https://docs.expo.dev/get-started/installation/) (`npm install -g expo-cli`)
- iOS Simulator, Android Emulator, or the [Expo Go](https://expo.dev/go) app on your phone

### 1. Clone & Install

```bash
git clone https://github.com/pranish07/sort-out.git
cd sort-out
yarn install
```

### 2. Configure Environment

Copy the example env file and fill in your credentials:

```bash
cp .env.example .env
```

You'll need:

| Service | What to set up |
|---|---|
| **Supabase** | Create a project at [supabase.com](https://supabase.com) → copy the **Project URL** and **Anon Key** |
| **OpenAI** | Get an API key from [platform.openai.com](https://platform.openai.com/) |

Your `.env` should look like:

```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

EXPO_PUBLIC_OPENAI_API_KEY=your-openai-key
```

### 3. Run the App

```bash
yarn start
```

Then:
- Press **`i`** → iOS Simulator
- Press **`a`** → Android Emulator
- Scan the QR code with **Expo Go** on your phone

---

## 📱 App Navigation

The app uses a **5-tab bottom navigation** layout:

| Tab | Icon | Screen |
|---|---|---|
| **Home** | 🏠 | Dashboard with Love Score, partner status, drift detector, and daily tips |
| **Notes** | 📖 | Shared journal for couples |
| **Sort Out** | ⚡ | Highlighted center FAB — launches conflict resolution flow |
| **Play** | ✨ | Fun interactive features and games |
| **Me** | 👤 | Profile management and settings |

---

## 📄 License

MIT
