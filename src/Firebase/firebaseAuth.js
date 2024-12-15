// all auth rel code is here
import {
    createUserWithEmailAndPassword,
    sendEmailVerification,
    signInWithEmailAndPassword,
    sendPasswordResetEmail,
    browserLocalPersistence,
    setPersistence,
    browserSessionPersistence,
    signOut,
} from "firebase/auth";
import { addUserToDB } from "./firebaseUserDB";
import { auth } from "./firebaseConfig";
async function doSignoutUser() {
    await auth.signOut();
    return "Signed Out!";
}
async function doSignUpUser({ email, password, isTrainer,name }) {
    const userCreds = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
    );
    const user = userCreds.user;
    if (user) {
        await sendEmailVerification(user);
        console.log("hi",name);
        await addUserToDB({ email, isTrainer,name });
        await signOut(auth);
        return "Verification email sent! Please verify and sign in.";
    } else {
        throw new Error("Problem Signing up, please try again!");
    }
}
async function doSignInUser({ email, password, isPersistent }) {
    if (isPersistent) {
        setPersistence(auth, browserLocalPersistence);
    } else {
        setPersistence(auth, browserSessionPersistence);
    }
    const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
    );
    const user = userCredential.user;
    await user.reload();
    const updatedUser = auth.currentUser;
    const isVerified = updatedUser.emailVerified;
    if (!isVerified) {await signOut(auth);throw new Error("user not verified!");}
    return "SIGNIN IN ";
}
async function doUserPasswordReset({ email }) {
    await sendPasswordResetEmail(auth, email);
    return "Reset Link sent to your mail!";
}
export { doUserPasswordReset, doSignInUser, doSignUpUser, doSignoutUser };
export default auth;
