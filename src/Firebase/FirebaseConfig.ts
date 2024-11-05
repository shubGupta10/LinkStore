import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';


const firebaseConfig = {
  apiKey: "AIzaSyCdZEbphIc1k8mwGb5wYNcmPdcPjKOqCCw",
  authDomain: "pingbackend.firebaseapp.com",
  projectId: "pingbackend",
  storageBucket: "pingbackend.appspot.com",
  messagingSenderId: "906029839091",
  appId: "1:906029839091:web:e12b57b80a7b54ae8b3d86"
};

export const firebaseApp = initializeApp(firebaseConfig);
export const auth = getAuth(firebaseApp);
