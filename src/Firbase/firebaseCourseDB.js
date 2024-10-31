import { getDocs, query, where, collection, addDoc } from "firebase/firestore";
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
async function addCourse() {
    const course = {
        courseId: uuidv4(),
        courseName: "Strength Training Advanced",
        createrName: "John Doe 2",
        courseDiscp:
            "An introductory course on strength training techniques and exercises for beginners.",
        modules: [
            {
                moduleName: "Fundamentals of Strength Training",
                moduleDiscp:
                    "Learn the core principles behind strength training, including muscle development and rest cycles.",
                headings: [
                    {
                        headingName: "Introduction to Muscle Groups",
                        subheadings: [
                            {
                                subheadingName: "Muscle Anatomy Overview",
                                subheadingDisc:
                                    "A quick look into key muscle groups used during workouts.\nSit dolore anim ut nisi sint duis veniam culpa duis velit. Cupidatat cillum ut culpa veniam. Amet proident minim anim officia eu velit. Fugiat sit deserunt quis labore ullamco exercitation ut anim nisi sint.\nFugiat proident ullamco ut in non ut nostrud sunt irure ex id consequat. Lorem ea voluptate ea voluptate aute exercitation do id Lorem sunt. Velit excepteur dolor veniam enim velit non ipsum fugiat officia dolor sunt voluptate ad. Adipisicing ea nostrud nisi est velit sint. Ea aliqua nisi culpa anim minim eu dolor dolor mollit ut labore nisi.\nMollit irure eu adipisicing laborum excepteur veniam. Aliqua ullamco adipisicing nulla pariatur sunt laboris. Ex ad eiusmod quis laborum ullamco aute consequat velit ex exercitation nostrud. Magna ex nulla veniam cillum officia exercitation amet cillum consectetur do.",
                                subheadingFileType: 1,
                                subheadingLink: "https://youtu.be/abc123",
                                test: [
                                    {
                                        question:
                                            "Which muscle group is targeted by squats?",
                                        options: [
                                            "Chest",
                                            "Back",
                                            "Legs",
                                            "Shoulders",
                                        ],
                                        answer: 2,
                                    },
                                    {
                                        question:
                                            "Which muscle group is primarily worked by deadlifts?",
                                        options: [
                                            "Legs",
                                            "Back",
                                            "Arms",
                                            "Core",
                                        ],
                                        answer: 13, // Multi-correct
                                    },
                                    {
                                        question:
                                            "How long should a beginner rest between sets?",
                                        options: [
                                            "30 seconds",
                                            "1-2 minutes",
                                            "3-5 minutes",
                                            "10 minutes",
                                        ],
                                        answer: 1, // Single correct
                                    },
                                    {
                                        question:
                                            "What is the purpose of progressive overload?",
                                        options: [
                                            "To prevent injury",
                                            "To increase the weight or intensity over time",
                                            "To shorten workout time",
                                            "To build endurance",
                                        ],
                                        answer: 1, // Single correct
                                    },
                                ],
                            },
                            {
                                subheadingName: "Protein Intake Guide",
                                subheadingDisc:
                                    "How much protein should you consume based on your goals?\nSit dolore anim ut nisi sint duis veniam culpa duis velit. Cupidatat cillum ut culpa veniam. Amet proident minim anim officia eu velit. Fugiat sit deserunt quis labore ullamco exercitation ut anim nisi sint.\nFugiat proident ullamco ut in non ut nostrud sunt irure ex id consequat. Lorem ea voluptate ea voluptate aute exercitation do id Lorem sunt. Velit excepteur dolor veniam enim velit non ipsum fugiat officia dolor sunt voluptate ad. Adipisicing ea nostrud nisi est velit sint. Ea aliqua nisi culpa anim minim eu dolor dolor mollit ut labore nisi.\nMollit irure eu adipisicing laborum excepteur veniam. Aliqua ullamco adipisicing nulla pariatur sunt laboris. Ex ad eiusmod quis laborum ullamco aute consequat velit ex exercitation nostrud. Magna ex nulla veniam cillum officia exercitation amet cillum consectetur do.",
                                subheadingFileType: 2,
                                subheadingLink:
                                    "https://docs.google.com/document/d/xyz",
                                test: [
                                    {
                                        question:
                                            "What is the ideal protein intake for muscle gain?",
                                        options: [
                                            "0.8g/kg",
                                            "1.2g/kg",
                                            "1.6g/kg",
                                            "2.2g/kg",
                                        ],
                                        answer: 23,
                                    },
                                ],
                            },
                        ],
                    },
                ],
            },
            {
                moduleName: "Creating a Brand Identity advanced",
                moduleDiscp:
                    "How to build a recognizable and authentic personal brand.",
                headings: [
                    {
                        headingName: "Finding Your Niche",
                        subheadings: [
                            {
                                subheadingName:
                                    "Identifying Your Target Audience.",
                                subheadingDisc:
                                    "Learn how to analyze trends and narrow down your niche.\nSit dolore anim ut nisi sint duis veniam culpa duis velit. Cupidatat cillum ut culpa veniam. Amet proident minim anim officia eu velit. Fugiat sit deserunt quis labore ullamco exercitation ut anim nisi sint.\nFugiat proident ullamco ut in non ut nostrud sunt irure ex id consequat. Lorem ea voluptate ea voluptate aute exercitation do id Lorem sunt. Velit excepteur dolor veniam enim velit non ipsum fugiat officia dolor sunt voluptate ad. Adipisicing ea nostrud nisi est velit sint. Ea aliqua nisi culpa anim minim eu dolor dolor mollit ut labore nisi.\nMollit irure eu adipisicing laborum excepteur veniam. Aliqua ullamco adipisicing nulla pariatur sunt laboris. Ex ad eiusmod quis laborum ullamco aute consequat velit ex exercitation nostrud. Magna ex nulla veniam cillum officia exercitation amet cillum consectetur do.",
                                subheadingFileType: 1,
                                subheadingLink:
                                    "https://youtu.be/swXWUfufu2w?si=Sss35Wl__DTMoPnv",
                                test: [
                                    {
                                        question:
                                            "Which platform is most suitable for fitness trainers?",
                                        options: [
                                            "Facebook",
                                            "Instagram",
                                            "LinkedIn",
                                            "Snapchat",
                                        ],
                                        answer: 1,
                                    },
                                    {
                                        question:
                                            "Which food is highest in protein?",
                                        options: [
                                            "Chicken breast",
                                            "Rice",
                                            "Apple",
                                            "Olive oil",
                                        ],
                                        answer: 1, // Single correct
                                    },
                                    {
                                        question:
                                            "What happens if you consume too little protein?",
                                        options: [
                                            "Muscle loss",
                                            "Improved endurance",
                                            "Weight gain",
                                            "Faster recovery",
                                        ],
                                        answer: 1, // Single correct
                                    },
                                    {
                                        question:
                                            "Which of these are complete protein sources?",
                                        options: [
                                            "Soy",
                                            "Quinoa",
                                            "Whey",
                                            "Peanut butter",
                                        ],
                                        answer: 12, // Multi-correct
                                    },
                                ],
                            },
                        ],
                    },
                    {
                        headingName: "Daily Water Intake",
                        subheadings: [
                            {
                                subheadingName: "Hydration for Performance",
                                subheadingDisc:
                                    "Guidelines for staying hydrated before, during, and after workouts.",
                                subheadingFileType: 1,
                                subheadingLink:
                                    "https://youtu.be/swXWUfufu2w?si=Sss35Wl__DTMoPnv",
                                test: [
                                    {
                                        question:
                                            "How much water should an athlete drink per day?",
                                        options: [
                                            "1 liter",
                                            "2 liters",
                                            "3 liters",
                                            "4 liters",
                                        ],
                                        answer: 23, // Multi-correct
                                    },
                                    {
                                        question:
                                            "What are signs of dehydration?",
                                        options: [
                                            "Fatigue",
                                            "Headache",
                                            "Improved performance",
                                            "Dry mouth",
                                        ],
                                        answer: 123, // Multi-correct
                                    },
                                    {
                                        question:
                                            "Which of these beverages helps rehydrate quickly?",
                                        options: [
                                            "Water",
                                            "Sports drinks",
                                            "Soda",
                                            "Energy drinks",
                                        ],
                                        answer: 12, // Multi-correct
                                    },
                                ],
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
