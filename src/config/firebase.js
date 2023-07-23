// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyBlHfYZtvsHcl2JYD_SjsAqxUX2PfEGou8',
  authDomain: 'file-manager-44491.firebaseapp.com',
  projectId: 'file-manager-44491',
  storageBucket: 'file-manager-44491.appspot.com',
  messagingSenderId: '349160490849',
  appId: '1:349160490849:web:7b9fd1eb1d11f33b692720',
  measurementId: 'G-C2N216W8TJ',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
