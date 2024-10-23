# AUT_Playground

## Overview

AUT PlayGround is a React Native social app where users can connect interactively by playing mini games on Campus
with eachother. Recieving tokens that can be redeemed to win awards or coupons which can be used on campus.

## Feautures

- **User Authentication**: Firebase Authentication for secure sign-up and login.
- **Profile Management**: Users can view and edit their profile, including name, email, and bio.
- **Mini-Games**: Users can play a variety of mini-games with friends on campus and recieve tokens to redeem.
- **Cross-Platform**: Works on iOS, Android, and web.
- **Live Map**: Map showing location of event which user can use to access the game.
- **Home Page**: Users can view upcoming events and news about games on the home page.
- **Wallet System**: Wallet System for users to retain their wins through tokens.
- **Reward System**: Tokens won from games can be used for tickets or vouchers that can be used on campus.

### Step-by-Step Guide

1.  **Clone the repository**:

```bash

git clone https://github.com/shanayeen/AUT_Playground.git

cd yourproject

```

2.  **Install dependencies**:

Install all the required packages by running the following command inside your project directory:

```bash

npm install
```

3.  **Set up Firebase**:

To integrate Firebase Authentication into your app, follow these steps:

- Go to Firebase Console.

- Create a new Firebase project.

- Enable Email/Password Authentication under the Authentication section.

- After enabling Authentication, go to your project settings and obtain your Firebase configuration details.

- Create a new file called firebaseConfig.js in your project and paste the following content, replacing the values with your Firebase project details:

```js
export const firebaseConfig = {
  apiKey: "AIzaSyBGIKtYX7TJBvrjQMVzsei6fynEZ2BC-PM",
  authDomain: "aut-playground.firebaseapp.com",
  projectId: "aut-playground",
  storageBucket: "aut-playground.appspot.com",
  messagingSenderId: "731605926574",
  appId: "1:731605926574:web:20b685e88682c1576ca33f",
};
```

Running the project:

On mobile devices (using Expo Go): Run the following command to start the Expo bundler and scan the QR code using the Expo Go app:

```bash

npx expo start

```

For web: To start the project in your web browser, use this command:

```bash

npx expo start --web
```

Firebase Authentication Setup:
In your code, make sure you've imported Firebase and initialized the app using the configuration from firebaseConfig.js. This can be done in your app's initialization file (like App.js or a dedicated Firebase setup file):

```js
import { initializeApp } from "firebase/app";

import { firebaseConfig } from "./firebaseConfig";

const app = initializeApp(firebaseConfig);
```

Clearing Cache and Troubleshooting:
If you face issues with dependencies or Metro Bundler, clear the cache and try running the app again:

```bash

npx expo start -c
```
