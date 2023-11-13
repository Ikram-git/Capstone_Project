
import firebase from 'firebase/app'
import 'firebase/auth'

import 'firebase/auth';        // for authentication
import 'firebase/storage';     // for storage
import 'firebase/database';    // for realtime database
import 'firebase/firestore';   // for cloud firestore
import 'firebase/messaging';   // for cloud messaging
import 'firebase/functions';   // for cloud functions
const firebaseConfig = {
  apiKey: "AIzaSyDRnofMMsV9Uj7YkYVsxGdA4Jlk80N6U8I",
  authDomain: "food-blocks-23e80.firebaseapp.com",
  projectId: "food-blocks-23e80",
  storageBucket: "food-blocks-23e80.appspot.com",
  messagingSenderId: "1012586025143",
  appId: "1:1012586025143:web:b5f1818db279cf2eb9fd32",
  measurementId: "G-521H0WSXHG"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const fs = firebase.firestore();
const storage = firebase.storage();


export {auth,fs,storage}
