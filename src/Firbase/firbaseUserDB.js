// code rel to userDB
import {
    collection,
    query,
    where,
    getDocs,
    updateDoc,
    writeBatch,
    doc,
} from "firebase/firestore";
import { db } from "./firebaseConfig";
import { coursesRef } from "./firebaseCourseDB";
const usersRef = collection(db, "users");
// FIXME add other things to init
const addUserToDB = async ({ email, isTrainer }) => {
    if (isTrainer) {
        const batch = writeBatch(db);
        // Add a new trainer document to the users collection
        const newTrainerRef = doc(usersRef);
        batch.set(newTrainerRef, { email, isTrainer, myClients: [] });
        // Query to find the admin user
        const q = query(usersRef, where("isAdmin", "==", true));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            const trainerDoc = querySnapshot.docs[0]; // Assuming there's only one admin
            const trainerRef = trainerDoc.ref;
            // Update trainers field for the admin
            let updatedTrainers = trainerDoc.data().trainers || [];
            updatedTrainers.push({ trainerEmail: email, clients: [] });
            batch.update(trainerRef, { trainers: updatedTrainers });
        } else {
            throw new Error("No admin found");
        }
        // Commit the batch
        await batch.commit();
    } else {
        const batch = writeBatch(db);
        // Add a new user document to the users collection
        const newUserRef = doc(usersRef);
        batch.set(newUserRef, { email, isTrainer, courses: [], Grades: [] });
        // Query to find the admin user
        const q = query(usersRef, where("isAdmin", "==", true));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            const userDoc = querySnapshot.docs[0]; // Assuming there's only one admin
            const userRef = userDoc.ref;
            // Update users field for the admin
            let updatedUsers = userDoc.data().myClients || [];
            updatedUsers.push({
                clientEmail: email,
                courses: [],
                unAssgined: true,
            });
            batch.update(userRef, { myClients: updatedUsers });
        } else {
            throw new Error("No admin found");
        }
        await batch.commit();
        // await addDoc(usersRef, { email, isTrainer, courses: [], Grades: [] });
    }
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
        } else if (isAdmin) {
            return {
                isTrainer: userData.isTrainer,
                isAdmin: userData.isAdmin,
                isPersistant: userData.isPersistant,
                email: email,
                courses: userData.courses,
                myClients: userData.myClients,
                trainers: userData.trainers,
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
            : querySnapshot.docs[0].data().isAdmin
            ? querySnapshot.docs[1]
            : querySnapshot.docs[0];
        const trainerDoc = querySnapshot.docs[0].data().isTrainer
            ? querySnapshot.docs[0]
            : querySnapshot.docs[0].data().isAdmin
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
            : querySnapshot.docs[0].data().isAdmin
            ? querySnapshot.docs[1]
            : querySnapshot.docs[0];
        const trainerDoc = querySnapshot.docs[0].data().isTrainer
            ? querySnapshot.docs[0]
            : querySnapshot.docs[0].data().isAdmin
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
async function addClientToTrainer({ currentTrainer, currentClient }) {
    const batch = writeBatch(db);
    // Add a new trainer document to the users collection
    const q = query(usersRef, where("email", "==", currentTrainer));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) throw new Error("Trainer Not Found");
    const trainerDoc = querySnapshot.docs[0];
    const trainerRef = trainerDoc.ref;
    let updatedClients = trainerDoc.data().myClients;
    updatedClients.push({ clientEmail: currentClient, courses: [] });
    batch.update(trainerRef, { myClients: updatedClients });

    const q2 = query(usersRef, where("isAdmin", "==", true));
    const querySnapshot2 = await getDocs(q2);
    if (querySnapshot2.empty) throw new Error("Admin Not Found");
    const adminDoc = querySnapshot2.docs[0];
    const adminRef = adminDoc.ref;
    let updatedAdminClients = adminDoc.data().myClients;
    updatedAdminClients = updatedAdminClients.map((client) => {
        if (client.clientEmail === currentClient) {
            client.unAssigned = false;
        }
        return client;
    });
    let updatedAdminTrainers = adminDoc.data().trainers;
    updatedAdminTrainers = updatedAdminTrainers.map((trainer) => {
        if (trainer.trainerEmail === currentTrainer) {
            trainer.clients.push(currentClient);
        }
        return trainer;
    });
    batch.update(adminRef, {
        myClients: updatedAdminClients,
        trainers: updatedAdminTrainers,
    });
    batch.commit();
    return { myClients: updatedAdminClients, trainers: updatedAdminTrainers };
}
async function removeClientFromTrainer({ currentTrainer, currentClient }) {
    const batch = writeBatch(db);
    const q2 = query(usersRef, where("isAdmin", "==", true));
    const querySnapshot2 = await getDocs(q2);
    if (querySnapshot2.empty) throw new Error("Admin Not Found");
    const adminDoc = querySnapshot2.docs[0];
    const adminRef = adminDoc.ref;
    // change admin clinets list to true
    let updatedAdminClients = adminDoc.data().myClients;
    const adminEmail = adminDoc.data().email;
    updatedAdminClients = updatedAdminClients.map((client) => {
        if (client.clientEmail === currentClient) {
            client.unAssigned = true;
        }
        return client;
    });
    // remove from dmins trainer list
    let updatedAdminTrainers = adminDoc.data().trainers.map((trainer) => {
        if (trainer.trainerEmail === currentTrainer) {
            const i = trainer.clients.indexOf(currentClient);
            if (i > -1) {
                trainer.clients.splice(i, 1);
            }
        }
        return trainer;
    });
    batch.update(adminRef, {
        myClients: updatedAdminClients,
        trainers: updatedAdminTrainers,
    });
    const q = query(
        usersRef,
        where("email", "in", [currentTrainer, currentClient])
    );
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) throw new Error("Users Not Found!");
    const userDoc = querySnapshot.docs[0].data().isTrainer
        ? querySnapshot.docs[1]
        : querySnapshot.docs[0];
    const trainerDoc = querySnapshot.docs[0].data().isTrainer
        ? querySnapshot.docs[0]
        : querySnapshot.docs[1];
    const userData = userDoc.data();
    const trainerData = trainerDoc.data();
    const trainerRef = trainerDoc.ref;
    const userRef = userDoc.ref;
    let updatedClients = trainerData?.myClients?.filter(
        (client) => client.clientEmail !== currentClient
    );
    batch.update(trainerRef, { myClients: updatedClients });
    const q3 = query(coursesRef, where("createrEmail", "==", adminEmail));
    const querySnapshot3 = await getDocs(q3);
    let coursesNotToRemove = [];
    if (!querySnapshot3.empty) {
        querySnapshot3.docs.map((doc) => {
            const courseId = doc.data().courseId;
            coursesNotToRemove.push(courseId);
        });
    }
    let updatedGrades = userData.Grades.filter((grade) =>
        coursesNotToRemove.includes(grade.courseId)
    );
    let updatedCourses = userData.courses?.filter((course) =>
        coursesNotToRemove.includes(course.courseId)
    );
    batch.update(userRef, { Grades: updatedGrades, courses: updatedCourses });
    batch.commit();
    return { myClients: updatedAdminClients, trainers: updatedAdminTrainers };
}
export {
    getUserData,
    addUserToDB,
    updateProgress,
    markCourseAsComplete,
    addCourseToUser,
    removeCourseFromUser,
    addClientToTrainer,
    removeClientFromTrainer,
};
