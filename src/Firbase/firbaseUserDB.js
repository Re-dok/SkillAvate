// code rel to userDB
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { db } from "./firebaseConfig";
const usersRef = collection(db, "users");

const addUserToDB = async ({ email, isTrainer }) => {
    await addDoc(usersRef, { email, isTrainer });
};
async function getUserData(email) {
    const q = query(usersRef, where("email", "==", email));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        const userData = userDoc.data();
        return {
            isTrainer: userData.isTrainer,
            isAdmin: userData.isAdmin,
            isPersistant: userData.isPersistant,
            email: email,
        };
    } else {
        throw new Error("User not found");
    }
}
export { getUserData, addUserToDB };
