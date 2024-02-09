import firebase from 'firebase/compat/app'
import'firebase/compat/storage'
const firebaseConfig = {
    apiKey: "AIzaSyDn0AHLFYbv5x5C4W0GHCXLX5JdIGZ5Dv0",
    authDomain: "mediaupload-b553d.firebaseapp.com",
    projectId: "mediaupload-b553d",
    storageBucket: "mediaupload-b553d.appspot.com",
    messagingSenderId: "494136906794",
    appId: "1:494136906794:web:29b49479877a8299b71f53"
  };
  if(!firebase.apps.length){
  firebase.initializeApp(firebaseConfig);
   }
   console.log('hello')
export{firebase}