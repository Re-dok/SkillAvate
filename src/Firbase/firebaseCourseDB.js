import { getDocs, query, where, collection, addDoc } from "firebase/firestore";
import { db } from "./firebaseConfig";
import { v4 as uuidv4 } from "uuid";
const coursesRef = collection(db, "courses");
async function getCourseDetails(courseId) {
    const q = query(coursesRef, where("courseId", "==", courseId));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
        const courseDoc = querySnapshot.docs[0];
        const courseData = courseDoc.data();
        return {
            courseData,
        };
    } else {
        throw new Error("Course not found");
    }
}
async function addCourse() {
    const course = {
        courseId: uuidv4(),
        courseName: "course 2",
        createrName: "creater 2",
        courseDiscp:
            "Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book",
        // this keeps helps keep track of progress later needs to me made, auto cal
        modules: [
            {
                moduleName: "this is a module",
                moduleDiscp:
                    "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries",
                headings: [
                    {
                        headingName: "this is a heading",
                        subheadings: [
                            {
                                subheadingFileType: 1,
                                // 1 ->video, 2-> doc Link, 3-> write up
                                subheadingName: "test 1",
                                subheadingDisc: "this is the discription 1",
                                subheadingLink:
                                    "https://youtu.be/GQe7YHqGe8c?si=eRazvGV9Bzl5-U-8",
                                question: "this is a '?'",
                                options: ["one", "two", "three", "four"],
                                answer: [1, 3],
                            },
                        ],
                    },
                    {
                        headingName: "this is a heading 2",
                        subheadings: [
                            {
                                subheadingFileType: 1,
                                // 1 ->video, 2-> doc Link, 3-> write up
                                subheadingName: "test 2",
                                subheadingDisc: "this is the discription 2",
                                subheadingLink:
                                    "https://youtu.be/GQe7YHqGe8c?si=eRazvGV9Bzl5-U-8",
                                question: "this is a '?'",
                                options: ["one", "two", "three", "four"],
                                answer: [1, 3],
                            },
                        ],
                    },
                ],
            },
            {
                moduleName: "this is a module 2 ",
                moduleDiscp:
                    "Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum",
                headings: [
                    {
                        headingName: "this is another heading",
                        subheadings: [
                            {
                                subheadingFileType: 1,
                                // 1 ->video, 2-> doc Link, 3-> write up
                                subheadingName: "test 1",
                                subheadingDisc: "this is the discription 1",
                                subheadingLink:
                                    "https://youtu.be/GQe7YHqGe8c?si=eRazvGV9Bzl5-U-8",
                                question: "this is a '?'",
                                options: ["one", "two", "three", "four"],
                                answer: [1, 3],
                            },
                        ],
                    },
                    {
                        headingName: "this is another heading 2",
                        subheadings: [
                            {
                                subheadingFileType: 1,
                                // 1 ->video, 2-> doc Link, 3-> write up
                                subheadingName: "test 2",
                                subheadingDisc: "this is the discription 2",
                                subheadingLink:
                                    "https://youtu.be/GQe7YHqGe8c?si=eRazvGV9Bzl5-U-8",
                                question: "this is a '?'",
                                options: ["one", "two", "three", "four"],
                                answer: [1, 3],
                            },
                        ],
                    },
                ],
            },
        ],
    };
    await addDoc(coursesRef, course);
    return "courese added!";
}
export { getCourseDetails, addCourse };
