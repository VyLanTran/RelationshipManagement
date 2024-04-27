// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: 'AIzaSyA76jwA_ZfjswQJbAM3PWbFraJvvNDHGkw',
    // apiKey: process.env.API_KEY,
    authDomain: 'relationshipmanagement-4f1c1.firebaseapp.com',
    projectId: 'relationshipmanagement-4f1c1',
    storageBucket: 'relationshipmanagement-4f1c1.appspot.com',
    messagingSenderId: '855986100249',
    appId: '1:855986100249:web:97d163b1f4de5b6bc5f288',
}

// Initialize Firebase
export const app = initializeApp(firebaseConfig)
