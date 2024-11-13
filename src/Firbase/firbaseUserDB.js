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
async function updateProgress(email, courseId, newProgress, prevProgress) {
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
        let updatedCourseGrades = userData.Grades.map((course) => {
            if (course.courseId === courseId) {
                const newUnit = [
                    prevProgress[0],
                    prevProgress[1],
                    prevProgress[2],
                ].toString();
                let unitExsists = false;
                course.courseGrades = course.courseGrades.map((grade) => {
                    if (grade.unit === newUnit) {
                        unitExsists = true;
                        let newGrade = grade.unitGrade + "," + prevProgress[3];
                        return { ...grade, unitGrade: newGrade };
                    } else return grade;
                });
                if (!unitExsists) {
                    course.courseGrades.push({
                        unit: newUnit,
                        unitGrade: prevProgress[3],
                    });
                }
                return course;
            } else {
                return course;
            }
        });
        try {
            // Attempt to update Firestore with modified data
            await updateDoc(userRef, {
                courses: updatedCourses,
                Grades: updatedCourseGrades,
            });
        } catch (error) {
            throw new Error(error.message);
        }
    } else {
        throw new Error("Problem updating course progress");
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
