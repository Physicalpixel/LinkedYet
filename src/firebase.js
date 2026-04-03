import {initializeApp} from "firebase/app"
import {getFirestore} from "firebase/firestore"

// TODO: Replace with your actual Firebase project configuration
const firebaseConfig = {
	apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
	authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
	projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
	appId: import.meta.env.VITE_FIREBASE_APP_ID,
	storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET_ID,
	messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
	measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app)
