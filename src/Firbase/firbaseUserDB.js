// code rel to userDB
import {
    collection,
    addDoc,
    query,
    where,
    getDocs,
    updateDoc,
    writeBatch,
} from "firebase/firestore";
import { db } from "./firebaseConfig";
const usersRef = collection(db, "users");
// FIXME add other things to init
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
            // DONE make it such that the grades corresponding to the course id are updated
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
                return { ...course, isComplete: true };
            } else {
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
        const { isTrainer, isAdmin } = userData;
        if (!isTrainer && !isAdmin) {
            return {
                isTrainer: userData.isTrainer,
                isAdmin: userData.isAdmin,
                isPersistant: userData.isPersistant,
                email: email,
                courses: userData.courses,
            };
        } else if (isTrainer) {
            return {
                isTrainer: userData.isTrainer,
                isAdmin: userData.isAdmin,
                isPersistant: userData.isPersistant,
                email: email,
                courses: userData.courses,
                myClients: userData.myClients,
            };
        }
    } else {
        throw new Error("User not found");
    }
}
async function addCourseToUser(email, courseId, firstUnit, trainerEmail) {
    const q = query(usersRef, where("email", "in", [email, trainerEmail]));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0].data().isTrainer
            ? querySnapshot.docs[1]
            : querySnapshot.docs[0];
        const trainerDoc = querySnapshot.docs[0].data().isTrainer
            ? querySnapshot.docs[0]
            : querySnapshot.docs[1];
        const userData = userDoc.data();
        const trainerData = trainerDoc.data();
        if (
            // we make sure the client isnt already enrolled according to his records
            userData.courses.filter((course) => course.courseId === courseId)
                .length === 0 &&
            // we make sure that the client isnt already enrolled
            trainerData.myClients.filter(
                (client) =>
                    client.clientEmail === email &&
                    client.courses.filter((course) => course === courseId)
                        .length === 0
            ).length === 1
        ) {
            const userRef = userDoc.ref;
            let courseProgress = [...firstUnit];
            const updatedCourses = userData.courses;
            const updatedGrades = userData.Grades;
            courseProgress.push(...[0, 0, false]);
            updatedCourses.push({
                courseId: courseId,
                courseProgress: courseProgress,
                isComplete: false,
            });
            updatedGrades.push({
                courseId: courseId,
                courseGrades: [],
            });
            const trainerRef = trainerDoc.ref;
            let updatedClients = trainerData.myClients.map((client) => {
                if (client.clientEmail === email) {
                    client.courses.push(courseId);
                }
                return client;
            });
            try {
                const batch = writeBatch(db);
                batch.update(userRef, {
                    courses: updatedCourses,
                    Grades: updatedGrades,
                });
                batch.update(trainerRef, { myClients: updatedClients });
                await batch.commit();
            } catch (error) {
                throw new Error(error.message);
            }
            return updatedClients;
        }
    } else {
        throw new Error("Users not found!");
    }
}
async function removeCourseFromUser(email, courseId, trainerEmail) {
    const q = query(usersRef, where("email", "in", [email, trainerEmail]));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0].data().isTrainer
            ? querySnapshot.docs[1]
            : querySnapshot.docs[0];
        const trainerDoc = querySnapshot.docs[0].data().isTrainer
            ? querySnapshot.docs[0]
            : querySnapshot.docs[1];
        const userRef = userDoc.ref;
        const trainerRef = trainerDoc.ref;
        const userData = userDoc.data();
        const trainerData = trainerDoc.data();
        const updatedClients = trainerData.myClients.map((client) => {
            if (client.clientEmail === email) {
                client.courses = client.courses.filter(
                    (course) => course !== courseId
                );
            }
            return client;
        });
        const updatedCourses = userData.courses.filter(
            (course) => course.courseId !== courseId
        );
        const updatedGrades = userData.Grades.filter(
            (course) => course.courseId !== courseId
        );
        try {
            const batch = writeBatch(db);
            batch.update(userRef, {
                courses: updatedCourses,
                Grades: updatedGrades,
            });
            batch.update(trainerRef, { myClients: updatedClients });
            await batch.commit();
        } catch (error) {
            throw new Error(error.message);
        }
        return updatedClients;
    } else {
        throw new Error("Users not found!");
    }
}
export {
    getUserData,
    addUserToDB,
    updateProgress,
    markCourseAsComplete,
    addCourseToUser,
    removeCourseFromUser,
};
