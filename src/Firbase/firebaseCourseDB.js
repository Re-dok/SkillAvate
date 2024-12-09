import {
    getDocs,
    query,
    where,
    collection,
    addDoc,
    doc,
    updateDoc,
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
async function getMyCourses(createrEmail) {
    const q = query(coursesRef, where("createrEmail", "==", createrEmail));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
        const coursesData = querySnapshot.docs.map((doc) => doc.data());
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
    await addDoc(coursesRef, course);
    return course;
}
export {
    getCourseDetails,
    addCourse,
    updateCourseDetails,
    getMyCourses,
    coursesRef,
};
