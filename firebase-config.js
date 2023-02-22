import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth"

const firebaseConfig = {
    apiKey: "AIzaSyAQqmUBkuiTOBVX3bY085QUDv2MKrtTHvk",
    authDomain: "blyamba-57970.firebaseapp.com",
    projectId: "blyamba-57970",
    storageBucket: "blyamba-57970.appspot.com",
    messagingSenderId: "1026887705409",
    appId: "1:1026887705409:web:fe152e4e70081ca1b8b7c0"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app)
const auth = getAuth(app)

export { db, auth } 