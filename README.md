Usage Guidelines

Hello and thanks for your interest in this repository! I encourage you to fork this repository rather than cloning it directly. Forking allows for better tracking of changes and collaboration. Your understanding and cooperation are much appreciated!

*To Do App*
Link to the app trailer - https://www.youtube.com/watch?v=IkISV0GGR3s

This is a React native application made for android.
It utilizes Firestore authentication, phones local memory and BoredApi. 
BoredApi is used to fetch messages to give user some break activities after completing task.

What the app does it will store privately users tasks, and it will manage the time of the task. One task takes 1 hour on default and if there are too many tasks it will notify the user. 
User can choose when he wants to attack the created list, Morning, day, evening or use full day for it. User can also prioritize tasks and choose how much time he needs for it.
Settings page is created for the user to logout and delete the account and data linked to the account.

*Note for lecturer or students who grade this*
How to run this in your environment.

1. Install Visual studio code.
2. Open the project
3. Run in Vs code terminal - Npm install
4. Build .env file to root -
     FIREBASE_API_KEY= xxx
     FIREBASE_AUTH_DOMAIN= xxx
     FIREBASE_PROJECT_ID= xxx
     FIREBASE_STORAGE_BUCKET= xxx
     FIREBASE_MESSAGING_SENDER_ID= xxx
     FIREBASE_APP_ID= xxx
5. Build firebase project, Cloud firestore and authentication (Email/password)
6. Paste the code you get from configing cloud firestore to .env file
7. Use your phone as a mobile hotspot and connect your computer to it
8. Run in Vs code terminal - npx expo start
9. Download Expo go from appstore
10. Open up Expo go and scan Qr code, which will pop up after npx expo start command.
11. 
