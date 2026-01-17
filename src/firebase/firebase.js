// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  sendSignInLinkToEmail, 
  isSignInWithEmailLink, 
  signInWithEmailLink
} from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCpLVv44sMlAOIWM07dE5JJY3uSmPMBOHk",
  authDomain: "brain-9086c.firebaseapp.com",
  projectId: "brain-9086c",
  storageBucket: "brain-9086c.firebasestorage.app",
  messagingSenderId: "592095771636",
  appId: "1:592095771636:web:c93dda8a01cc1adb7497a1",
  measurementId: "G-EXKTL29Q87"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Function to sign in with Google
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error("Error signing in with Google:", error);
    throw error;
  }
};

// Function to send sign in link to email
export const sendLoginLink = async (email) => {
  const actionCodeSettings = {
    // URL you want to redirect back to after email sign-in
    url: window.location.origin + '/login',
    handleCodeInApp: true,
  };

  try {
    await sendSignInLinkToEmail(auth, email, actionCodeSettings);
    // Save the email locally to complete sign-in after clicking the email link
    window.localStorage.setItem('emailForSignIn', email);
    return true;
  } catch (error) {
    console.error("Error sending sign in link:", error);
    throw error;
  }
};

// Function to complete sign in with email link
export const completeSignInWithEmailLink = async () => {
  if (isSignInWithEmailLink(auth, window.location.href)) {
    let email = window.localStorage.getItem('emailForSignIn');
    if (!email) {
      // User opened the link on a different device
      email = window.prompt('Please provide your email for confirmation');
    }
    
    try {
      const result = await signInWithEmailLink(auth, email, window.location.href);
      // Clear email from storage
      window.localStorage.removeItem('emailForSignIn');
      return result.user;
    } catch (error) {
      console.error("Error completing sign in with email link:", error);
      throw error;
    }
  }
  return null;
};

export { auth };