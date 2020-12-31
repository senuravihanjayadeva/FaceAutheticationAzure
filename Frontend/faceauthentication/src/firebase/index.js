import firebase from "firebase/app";
import "firebase/storage";

// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyCZnPrEXb0u0EIYXkJNcEapqub0T4il9sQ",
  authDomain: "fitnessclub-1324e.firebaseapp.com",
  databaseURL: "https://fitnessclub-1324e.firebaseio.com",
  projectId: "fitnessclub-1324e",
  storageBucket: "fitnessclub-1324e.appspot.com",
  messagingSenderId: "624098864422",
  appId: "1:624098864422:web:3876b4b3eab552792825e7",
  measurementId: "G-B8YM9RJBJH",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const storage = firebase.storage();

export { storage, firebase as default };
