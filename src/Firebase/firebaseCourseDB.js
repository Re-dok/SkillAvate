import {
    getDocs,
    query,
    where,
    collection,
    addDoc,
    doc,
    updateDoc,
    deleteDoc,
    serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebaseConfig";
import { v4 as uuidv4 } from "uuid";
const coursesRef = collection(db, "courses");
async function getCourseDetails(courseId) {
    const q = query(coursesRef, where("courseId", "==", courseId));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
        const courseData = querySnapshot.docs[0].data();
        return {
            courseData,
        };
    } else {
        throw new Error("Course not found");
    }
}
async function getMyCourses(createrEmail, isAdmin) {
    let q;
    if (isAdmin) q = coursesRef;
    else q = query(coursesRef, where("createrEmail", "==", createrEmail));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
        let coursesData = querySnapshot.docs.map((doc) => doc.data());
        coursesData = coursesData.filter(
            (course) =>
                course.createrEmail === createrEmail ||
                course.isPublished === true
        );
        return {
            coursesData,
        };
    } else {
        return { coursesData: [] };
    }
}
async function updateCourseDetails(courseId, newCourse) {
    try {
        // Create a query to find the course by courseId
        const q = query(coursesRef, where("courseId", "==", courseId));
        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) {
            throw new Error("Course not found");
        }
        const docSnapshot = querySnapshot.docs[0];
        const courseDocRef = doc(db, "courses", docSnapshot.id);
        // Update the document with newCourse data
        await updateDoc(courseDocRef, newCourse);

        return newCourse;
    } catch (error) {
        throw new Error("Error updating basic course Info:", error);
    }
}
async function addCourse(course) {
    course.courseId = uuidv4();
    course.createdAt = serverTimestamp();
    await addDoc(coursesRef, course);
    return course;
}
async function removeCourse(courseId) {
    const q = query(coursesRef, where("courseId", "==", courseId));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
        throw new Error(`Course with ID ${courseId} not found.`);
    }

    const courseDoc = querySnapshot.docs[0];

    await deleteDoc(courseDoc.ref);

    return { success: true };
}
export {
    getCourseDetails,
    addCourse,
    updateCourseDetails,
    getMyCourses,
    coursesRef,
    removeCourse,
};
