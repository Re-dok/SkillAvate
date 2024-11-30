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
import MyClients from "../Pages/TrainerPages/MyClients";
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
        let courseGradesExist = false;
        let updatedCourseGrades = userData.Grades.map((course) => {
            // FIXME make it such that the grades corresponding to the course id are updated
            if (course.courseId === courseId) {
                courseGradesExist = true;
                const newUnit = [
                    prevProgress[0],
                    prevProgress[1],
                    prevProgress[2],
                ].toString();
                let unitExsists = false;
                course.courseGrades = course.courseGrades.map((grade) => {
                    if (grade.unit === newUnit) {
                        unitExsists = true;
                        // only alter grade if the anser was correct or wrong on the last attemp,i.e,prevProgress!=0
                        let newGrade = grade.unitGrade;
                        if (prevProgress.length) {
                            newGrade += "," + prevProgress[3].toString();
                        }

                        return { ...grade, unitGrade: newGrade };
                    } else return grade;
                });
                // only add grade if the anser was correct or wrong on the last attemp,i.e,prevProgress!=0
                if (!unitExsists && prevProgress.length) {
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
        // if this is the first time a course is being graded, add the grades to it
        if (!courseGradesExist) {
            const newUnit = [
                prevProgress[0],
                prevProgress[1],
                prevProgress[2],
            ].toString();
            let newCourseGrads = [];
            newCourseGrads.push({
                unit: newUnit,
                unitGrade: prevProgress[3],
            });
            updatedCourseGrades.push({
                courseId: courseId,
                courseGrads: newCourseGrads,
            });
        }
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
async function markCourseAsComplete(email, courseId) {
    const q = query(usersRef, where("email", "==", email));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        const userRef = userDoc.ref;
        const userData = userDoc.data();
        let updatedCourses = userData.courses.map((course) => {
            if (course.courseId === courseId) {
                console.log({ ...course, isComplete: true });
                return { ...course, isComplete: true };
            } else {
                console.log("hi");
                return course;
            }
        });
        try {
            await updateDoc(userRef, {
                courses: updatedCourses,
            });
            return updatedCourses;
        } catch (error) {
            throw new Error(error.message);
        }
    } else {
        throw new Error("Problem marking course as complete!");
    }
}
async function getUserData(email) {
    const q = query(usersRef, where("email", "==", email));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        const userData = userDoc.data();
        const {isTrainer,isAdmin}=userData;
        if(!isTrainer&&!isAdmin){
            return {
                isTrainer: userData.isTrainer,
                isAdmin: userData.isAdmin,
                isPersistant: userData.isPersistant,
                email: email,
                courses: userData.courses,
            };
        }
        else if(isTrainer){
            return{
                isTrainer: userData.isTrainer,
                isAdmin: userData.isAdmin,
                isPersistant: userData.isPersistant,
                email: email,
                courses: userData.courses,
                myClients:userData.myClients
            }
        }
    } else {
        throw new Error("User not found");
    }
}

export { getUserData, addUserToDB, updateProgress, markCourseAsComplete };
