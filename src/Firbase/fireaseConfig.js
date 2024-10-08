import { initializeApp } from "firebase/app";
import {
    getAuth,
    createUserWithEmailAndPassword,
    sendEmailVerification,
    signInWithEmailAndPassword,
    sendPasswordResetEmail,
} from "firebase/auth";
import {
    collection,
    getFirestore,
    addDoc,
    query,
    where,
    getDocs,
} from "firebase/firestore";
const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGEBUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGEING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const db = getFirestore();
const usersRef = collection(db, "users");

const addUserToDB = async ({ email, isTrainer }) => {
    await addDoc(usersRef, { email, isTrainer });
};
const getUserDetails = async ({ email }) => {
    const q = query(usersRef, where("email", "==", email));
    const querySnapshot = await getDocs(q); // fetch the documents matching the query

    if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0]; // assuming there's only one user with the given email
        const userData = userDoc.data(); // get user data
        return userData.isTrainer; // return the age field
    } else {
        throw new Error("User not found");
    }
};
export async function doSignUpUser({ email, password, isTrainer }) {
    const userCreds = await createUserWithEmailAndPassword(
        auth,
        email,
        password
    );
    const user = userCreds.user;
    if (user) {
        await sendEmailVerification(user);
        await addUserToDB({ email, isTrainer });
        return "Verification email sent! Please verify and sign in.";
    } else {
        throw new Error("Problem Signing up, please try again!");
    }
}
export async function doSignInUser({ email, password }) {
    const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
    );
    const user = userCredential.user;
    const verf = user.emailVerified;
    if (!verf) throw new Error("user not verified!");
    const token = await user.getIdToken();
    const isTrainer = await getUserDetails({ email });
    return { token, isTrainer };
}
export async function doUserPasswordReset({ email }) {
    // alert("hi3");
    await sendPasswordResetEmail(auth, email);
    // alert("hi4");
    return "Reset Link sent to your mail!";
}
export default app;
