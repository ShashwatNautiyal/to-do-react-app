import firebase from "firebase";

const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyC0VCcmO_zyOAlmt2LoIaB-smJSpTVSW-s",
  authDomain: "to-do-react-64e2d.firebaseapp.com",
  projectId: "to-do-react-64e2d",
  storageBucket: "to-do-react-64e2d.appspot.com",
  messagingSenderId: "260745286653",
  appId: "1:260745286653:web:3de35a4aea30af89dd3f94",
  measurementId: "G-VS85FP17J3",
});

const db = firebaseApp.firestore();

export default db;
