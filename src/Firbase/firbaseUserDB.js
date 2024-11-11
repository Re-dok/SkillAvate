// code rel to userDB
import {
    collection,
    addDoc,
    query,
    where,
    getDocs,
    updateDoc,
} from "firebase/firestore";
import { db } from "./firebaseConfig";
const usersRef = collection(db, "users");

const addUserToDB = async ({ email, isTrainer }) => {
    await addDoc(usersRef, { email, isTrainer });
};
async function updateProgress(email, courseId, newProgress) {
    const q = query(usersRef, where("email", "==", email));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        const userRef = userDoc.ref;
        const userData = userDoc.data();


        let updatedCourses = userData.courses.map((course) => {
            if (course.courseId === courseId) {
                return { ...course, courseProgress: newProgress };
            } else {
                return course;
            }
        });


        try {
            // Attempt to update Firestore with modified data
            await updateDoc(userRef, { courses: updatedCourses });
        } catch (error) {
            throw new Error(error.message);
        }
    } else {
        throw new Error("User not found");
    }
}

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
            courses: userData.courses,
        };
    } else {
        throw new Error("User not found");
    }
}

export { getUserData, addUserToDB, updateProgress };
