// code rel to userDB
import {
    collection,
    query,
    where,
    getDocs,
    updateDoc,
    writeBatch,
    doc,
    Timestamp
} from "firebase/firestore";
import { db } from "./firebaseConfig";
import { coursesRef } from "./firebaseCourseDB";
import * as XLSX from "xlsx";

const usersRef = collection(db, "users");
// import { getDocs, collection } from "firebase/firestore";
// import { db } from "./firebase"; // Your Firebase setup
// import * as XLSX from "xlsx";

// Function to convert timestamp to "Month Year" format
const formatTimestamp = (timestamp) => {
    if (timestamp?.seconds) {
        const date = new Date(timestamp.seconds * 1000); // Convert to milliseconds
        const month = date.toLocaleString("default", { month: "long" }); // Full month name
        const year = date.getFullYear();
        return `${month} ${year}`;
    }
    return "";
};

// Function to flatten and transform data
const flattenObject = (obj, parent = "", res = {}) => {
    for (let key in obj) {
        const propName = parent ? `${parent}.${key}` : key;
        if (
            key === "createdAt" &&
            typeof obj[key] === "object" &&
            obj[key] !== null
        ) {
            // Format the createdAt timestamp
            res[propName] = formatTimestamp(obj[key]);
        } else if (typeof obj[key] === "object" && obj[key] !== null) {
            if (Array.isArray(obj[key])) {
                res[propName] = JSON.stringify(obj[key]); // Convert arrays to JSON strings
            } else {
                flattenObject(obj[key], propName, res); // Recursively flatten nested objects
            }
        } else {
            res[propName] = obj[key];
        }
    }
    return res;
};

export const downloadMultipleCollectionsAsExcel = async () => {
    try {
        const workbook = XLSX.utils.book_new(); // Create a new workbook
        const collectionNames = ["users", "courses"]; // Collection names to export

        for (const collectionName of collectionNames) {
            // Fetch data from Firestore
            const querySnapshot = await getDocs(collection(db, collectionName));
            const data = querySnapshot.docs.map((doc) => {
                const rawData = { id: doc.id, ...doc.data() };
                return flattenObject(rawData); // Flatten and transform the document data
            });

            if (data.length === 0) {
                console.warn(
                    `No data found in the collection: ${collectionName}`
                );
                continue;
            }

            // Create a worksheet for the current collection
            const worksheet = XLSX.utils.json_to_sheet(data);

            // Append the worksheet to the workbook
            XLSX.utils.book_append_sheet(workbook, worksheet, collectionName);
        }

        // Export the workbook as an Excel file
        XLSX.writeFile(workbook, `All_Collections_Data.xlsx`);
    } catch (error) {
        console.error("Error downloading data:", error);
    }
};

async function getUsersByMonthAndYear() {
    try {
        // Fetch all users
        const querySnapshot = await getDocs(usersRef);

        // Initialize a nested map for user counts by year and month
        const userCounts = {};

        // Iterate over all users
        querySnapshot.docs.forEach((doc) => {
            const user = doc.data();

            // Ensure `createdAt` exists and is a Firestore Timestamp
            if (user.createdAt && user.createdAt.toDate) {
                const createdAt = user.createdAt.toDate();
                const year = createdAt.getFullYear();
                const month = createdAt.getMonth();

                // Initialize the year in the map if not already present
                if (!userCounts[year]) {
                    userCounts[year] = Array(12).fill(0); // Array of 12 months
                }

                // Increment the count for the respective month
                userCounts[year][month]++;
            }
        });

        // Convert the userCounts object into a single array
        const sortedYears = Object.keys(userCounts).sort((a, b) => a - b);
        const flattenedCounts = [];

        sortedYears.forEach((year) => {
            userCounts[year].forEach((count, month) => {
                flattenedCounts.push({ year: parseInt(year), month, count });
            });
        });

        return flattenedCounts;
    } catch (error) {
        console.error("Error fetching user data:", error);
        return [];
    }
}
const addUserToDB = async ({ email, isTrainer, name, phoneNumber }) => {
    if (isTrainer) {
        const batch = writeBatch(db);
        // Add a new trainer document to the users collection
        const newTrainerRef = doc(usersRef);
        batch.set(newTrainerRef, {
            email,
            isTrainer,
            myClients: [],
            name,
            phoneNumber,
        });
        // Query to find the admin user
        const q = query(usersRef, where("isAdmin", "==", true));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            const trainerDoc = querySnapshot.docs[0]; // Assuming there's only one admin
            const trainerRef = trainerDoc.ref;
            // Update trainers field for the admin
            let updatedTrainers = trainerDoc.data().trainers || [];
            const createdAt=Timestamp.fromDate(new Date());
            updatedTrainers.push({
                trainerEmail: email,
                clients: [],
                createdAt: createdAt,
            });
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
        const createdAt=Timestamp.fromDate(new Date());

        batch.set(newUserRef, {
            email,
            isTrainer,
            courses: [],
            Grades: [],
            createdAt: createdAt,
            name,
            phoneNumber,
        });
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
            batch.update(userRef, {
                myClients: updatedUsers,
            });
        } else {
            throw new Error("No admin found");
        }
        await batch.commit();
        // await addDoc(usersRef, { email, isTrainer, courses: [], Grades: [] });
    }
};
async function setUserName(email, name) {
    const q = query(usersRef, where("email", "==", email));
    const querySnapshot = await getDocs(q);
    const userDoc = querySnapshot.docs[0];
    const userRef = userDoc.ref;
    try {
        // Attempt to update Firestore with modified data
        await updateDoc(userRef, {
            name: name,
        });
        return name;
    } catch (error) {
        throw new Error(error.message);
    }
}
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
            const adminQuery = query(usersRef, where("isAdmin", "==", true));
            const adminSnapshot = await getDocs(adminQuery);
            if (adminSnapshot.empty) {
                throw new Error("Admin not found");
            }
            const isUnAssigned = adminSnapshot.docs[0]
                .data()
                .myClients.filter(
                    (client) => client.clientEmail === email
                )[0].unAssigned;
            return {
                isTrainer: userData.isTrainer,
                isAdmin: userData.isAdmin,
                isPersistant: userData.isPersistant,
                email: email,
                courses: userData.courses,
                name: userData?.name,
                unAssigned: isUnAssigned,
            };
        } else if (isTrainer) {
            return {
                isTrainer: userData.isTrainer,
                isAdmin: userData.isAdmin,
                isPersistant: userData.isPersistant,
                email: email,
                courses: userData.courses,
                myClients: userData.myClients,
                name: userData?.name,
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
                name: userData.name,
            };
        }
    } else {
        throw new Error("User not found");
    }
}
async function getAdminCourses(enrolledCourses) {
    const adminQuery = query(usersRef, where("isAdmin", "==", true));
    const adminSnapshot = await getDocs(adminQuery);

    if (adminSnapshot.empty) {
        throw new Error("Admin not found");
    }

    const adminDoc = adminSnapshot.docs[0]; // Assuming there is at least one admin
    const adminEmail = adminDoc.data().email; // Extract admin's email

    // Step 2: Query for courses created by the admin and published
    const coursesQuery = query(
        coursesRef,
        where("createrEmail", "==", adminEmail),
        where("isPublished", "==", true)
    );

    const coursesSnapshot = await getDocs(coursesQuery);
    if (coursesSnapshot.empty) {
        return {
            coursesData: [],
            message: "No published courses found for the admin.",
        };
    }

    let coursesData = coursesSnapshot.docs.map((doc) => ({
        ...doc.data(),
    }));
    if (enrolledCourses && enrolledCourses.length) {
        const excludeId = enrolledCourses.map((c) => c.courseId);
        coursesData = coursesData.filter(
            (course) => !excludeId.includes(course.courseId)
        );
    }
    return { courses: coursesData };
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
            // we make sure the client isn't already enrolled according to his records
            userData.courses.filter((course) => course.courseId === courseId)
                .length === 0 &&
            // we make sure that the client isn't already enrolled
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
    // change admin clients list to true
    let updatedAdminClients = adminDoc.data().myClients;
    const adminEmail = adminDoc.data().email;
    updatedAdminClients = updatedAdminClients.map((client) => {
        if (client.clientEmail === currentClient) {
            client.unAssigned = true;
        }
        return client;
    });
    // remove from admins trainer list
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
async function courseUnpublish(updatedCourse, email) {
    const { courseId } = updatedCourse;
    if (!courseId || !email) {
        throw new Error(
            "invalid-argument",
            "The function must be called with the 'updatedCourse' and 'email' parameters."
        );
    }

    try {
        // Update the "courses" collection
        // const coursesRef = db.collection("courses");
        const courseQuery = query(
            coursesRef,
            where("courseId", "==", courseId)
        );
        const courseSnapshot = await getDocs(courseQuery);

        if (courseSnapshot.empty) {
            throw new Error(
                "not-found",
                "Course not found in the 'courses' collection."
            );
        }

        const trainerQuery = query(
            usersRef,
            where("email", "==", updatedCourse.createrEmail)
        );
        const trainerSnapshot = await getDocs(trainerQuery);

        // Fetch the trainer's data
        // const usersRef = db.collection("users");
        if (trainerSnapshot.empty) {
            throw new Error(
                "not-found",
                "Trainer not found in the 'users' collection."
            );
        }

        const trainerDoc = trainerSnapshot.docs[0];
        const courseDoc = courseSnapshot.docs[0];

        const trainerData = trainerSnapshot.docs[0].data();
        const enrolledClients = trainerData.myClients.filter((client) =>
            client.courses.includes(courseId)
        );

        // Update enrolled clients and their data
        // const batch = db.batch();
        const batch = writeBatch(db);

        batch.update(courseDoc.ref, updatedCourse);

        for (const client of enrolledClients) {
            const clientEmail = client.clientEmail;
            const clientQuery = query(
                usersRef,
                where("email", "==", clientEmail)
            );

            const clientSnapshot = await getDocs(clientQuery);

            if (!clientSnapshot.empty) {
                const clientDoc = clientSnapshot.docs[0];
                const clientData = clientDoc.data();

                // Remove courseId from client's courses array
                const updatedCourses = clientData.courses.filter(
                    (course) => course.courseId !== courseId
                );

                // Remove courseId from client's grades array
                const updatedGrades = clientData.Grades.filter(
                    (grade) => grade.courseId !== courseId
                );

                batch.update(clientDoc.ref, {
                    courses: updatedCourses,
                    Grades: updatedGrades,
                });
            }
        }

        // Update trainer's myClients array
        const updatedMyClients = trainerData.myClients.map((client) => {
            if (client.courses.includes(courseId)) {
                return {
                    ...client,
                    courses: client.courses.filter((id) => id !== courseId),
                };
            }
            return client;
        });

        batch.update(trainerDoc.ref, { myClients: updatedMyClients });

        // Commit batch updates
        await batch.commit();

        return {
            success: true,
            message: "Course unpublished and users updated successfully.",
        };
    } catch (error) {
        throw new Error("internal", error.message);
    }
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
    getAdminCourses,
    setUserName,
    getUsersByMonthAndYear,
    courseUnpublish,
};
