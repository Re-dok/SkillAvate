import { initializeApp } from "firebase/app";
import {
    getAuth,
    createUserWithEmailAndPassword,
    sendEmailVerification,
    signInWithEmailAndPassword,
    sendPasswordResetEmail,
    browserLocalPersistence,
    setPersistence,
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
export const auth = getAuth(app);
setPersistence(auth, browserLocalPersistence).catch((error) => {
    //TODO Handle Errors better.
    console.log("probelm seting perst");
});
const db = getFirestore();
const usersRef = collection(db, "users");

const addUserToDB = async ({ email, isTrainer }) => {
    await addDoc(usersRef, { email, isTrainer });
};
export async function doGetUserData(email) {
    const q = query(usersRef, where("email", "==", email));
    const querySnapshot = await getDocs(q); // fetch the documents matching the query

    if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0]; // assuming there's only one user with the given email
        const userData = userDoc.data(); // get user data
        return {
            isTrainer: userData.isTrainer,
            isAdmin: userData.isAdmin,
            isPersistant: userData.isPersistant,
            email: email,
        };
    } else {
        console.log("bi4");
        throw new Error("User not found");
    }
}
export async function doSignoutUser() {
    await auth.signOut();
    console.log("singed out");
    return "Signed Out!";
}
export async function doSignUpUser({
    email,
    password,
    isTrainer,
    isPersistant,
}) {
    const userCreds = await createUserWithEmailAndPassword(
        auth,
        email,
        password
    );
    const user = userCreds.user;
    if (user) {
        await sendEmailVerification(user);
        await addUserToDB({ email, isTrainer, isPersistant });
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
    await user.reload();
    const updatedUser = auth.currentUser; // Get the refreshed user
    const isVerified = updatedUser.emailVerified;
    if (!isVerified) throw new Error("user not verified!");
    const token = await updatedUser.getIdToken();
    // const userDetails = await doGetUserData({ email });
    return "SIGNIN IN ";
    // token,
    // isTrainer: userDetails.isTrainer,
    // isAdmin: userDetails.isAdmin,
}
export async function doUserPasswordReset({ email }) {
    await sendPasswordResetEmail(auth, email);
    return "Reset Link sent to your mail!";
}
export default app;
