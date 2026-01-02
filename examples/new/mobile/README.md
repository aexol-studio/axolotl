# Mobile App Placeholder

This folder is a placeholder for the Expo React Native mobile application.

## Setup Instructions

1. **Install Expo CLI** (if not already installed):

   ```bash
   npm install -g @expo/cli
   ```

2. **Initialize Expo project** in this directory:

   ```bash
   cd mobile
   npx create-expo-app@latest . --template blank-typescript
   ```

3. **Install Zeus for GraphQL**:

   ```bash
   npm install graphql-zeus
   ```

4. **Copy the Zeus client** from the frontend:
   - The Zeus client generated for the frontend can be reused
   - Copy `frontend/src/zeus/` to `mobile/src/zeus/`
   - Or configure axolotl.json to generate Zeus client here as well

5. **Configure the API endpoint**:
   - Update the GraphQL endpoint in your API client to point to your backend
   - For local development: `http://localhost:4002/graphql`
   - For production: Your deployed backend URL

## Recommended Packages

```bash
npm install @react-navigation/native @react-navigation/native-stack
npm install react-native-screens react-native-safe-area-context
npm install zustand
```

## Project Structure (Suggested)

```
mobile/
  src/
    api/           # Zeus GraphQL client (copy from frontend)
    components/    # Reusable UI components
    screens/       # App screens
    stores/        # Zustand stores (can share logic with frontend)
    navigation/    # React Navigation setup
  App.tsx
  app.json
```

## Running the App

```bash
npx expo start
```

Press:

- `i` to open iOS simulator
- `a` to open Android emulator
- Scan QR code with Expo Go app on your phone
