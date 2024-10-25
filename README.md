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
#Bounty Hunter Server Setup 

## Overview

This section explains how to set up and run the Bounty Hunter server using the provided files, and how to replace the IP address in your configuration and test files.

## Prerequisites

Make sure the following tools are installed before proceeding:
 - **Node.js (v14.x or higher): Download here.
 - **npm: Comes with Node.js. Check if it's installed by running:
   ```bash
   npm -v
   ```
- **Postman or VSCode REST Client (optional): For testing API requests.

## Server Setup 

1.  **Install Dependecies**:
    First, navigate to your server directory and install the necessary dependencies:

    ```bash
    npm install
    ```
    
2.  **Set up Environment Variables**:
    Ensure that the .env file is correctly set up with the necessary variables. Here's an example .env file:
    PORT=3000
    This ensures that the server will run on port 3000.

3.  **Update IP Adress in config.js**:
    You need to replace the IP address in your config.js file with the current local IP address of your machine. Follow these steps:
    - **Open the config/config.js file.**
    - **Find the BASE_URL variable.**
    - **Replace the placeholder IP address (or localhost) with your machine's local IP address.**

    For example:
    ```js
    export const BASE_URL = 'http://192.168.x.x:3000'; // Replace with your local IP address
    ```
    Make sure to replace 192.168.x.x with your actual local IP address.

4.  **Update Ip Address in test-event.http**
    Similarly, update the IP address in your test-event.http file to reflect your local machine's IP. Open the test-event.http file and update the requests to use your local IP address.
    ```http
    POST http://192.168.x.x:3000/create-event
     Content-Type: application/json

     {
       "name": "Bounty Hunter Test Event",
       "description": "This is a test event for the Bounty Hunter game.",
       "startTime": "2024-10-30T14:00:00Z"
     }
    ```
5.  **Running the Server**
    To run the server, navigate to the server directory and run the following command:
    ```bash
    node server/server.js
    ```

    You should see the following output, indicating that the server is running:
    ```arduino
    Server running on http://192.168.x.x:3000
    ```

# Testing the Server and games with test-event.http and test-event2.http

If you're using VSCode, you can use the REST Client extension to test the HTTP requests in the test-event.http file. To do so:

1.**Open test-event.http or test-event2.http in VSCode.**

  test-event.http is for running our first game, Bounty Hunter and test-event2.http is for running our second game Know Your Campus! Depending on which you would like to 
  try, go to the respective files. 
  
2.**Ensure that the IP addresses are replaced with your local IP (as explained above).**
3.**Adjust the event time for when you want the event to start.**
4.**Run the requests directly from the file by clicking on "Send Request" (available when the REST Client extension is installed).**

Alternatively, you can use Postman or cURL to send the same HTTP requests.


# Common Issues and Solutions

- **Server Not Running on the Correct IP**
Ensure that you've updated the IP address in the config.js, test-event.http, and that your machine's firewall or security settings allow connections to port 3000.

- **Testing Issues**
If you're using Postman or any other tool, ensure that the URLs use the correct IP address and port number. Ensure your machine's local network supports this IP-based connection if testing from multiple devices.

# Conclusion
After following these steps, you should have both AUT Playground and Bounty Hunter server up and running. You can now test and deploy your project seamlessly!
