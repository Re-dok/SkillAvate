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
    // const course = {
    //     courseId: uuidv4(),
    //     courseName: "Strength Training Advanced",
    //     createrName: "John Doe 2",
    //     courseDiscp:
    //         "An introductory course on strength training techniques and exercises for beginners.",
    //     modules: [
    //         {
    //             moduleName: "Fundamentals of Strength Training",
    //             moduleDiscp:
    //                 "Learn the core principles behind strength training, including muscle development and rest cycles.",
    //             headings: [
    //                 {
    //                     headingName: "Introduction to Muscle Groups",
    //                     subheadings: [
    //                         {
    //                             subheadingName: "Muscle Anatomy Overview",
    //                             subheadingDisc:
    //                                 "A quick look into key muscle groups used during workouts.\nSit dolore anim ut nisi sint duis veniam culpa duis velit. Cupidatat cillum ut culpa veniam. Amet proident minim anim officia eu velit. Fugiat sit deserunt quis labore ullamco exercitation ut anim nisi sint.\nFugiat proident ullamco ut in non ut nostrud sunt irure ex id consequat. Lorem ea voluptate ea voluptate aute exercitation do id Lorem sunt. Velit excepteur dolor veniam enim velit non ipsum fugiat officia dolor sunt voluptate ad. Adipisicing ea nostrud nisi est velit sint. Ea aliqua nisi culpa anim minim eu dolor dolor mollit ut labore nisi.\nMollit irure eu adipisicing laborum excepteur veniam. Aliqua ullamco adipisicing nulla pariatur sunt laboris. Ex ad eiusmod quis laborum ullamco aute consequat velit ex exercitation nostrud. Magna ex nulla veniam cillum officia exercitation amet cillum consectetur do.",
    //                             subheadingFileType: 1,
    //                             subheadingLink: "https://youtu.be/abc123",
    //                             test: [
    //                                 {
    //                                     question:
    //                                         "Which muscle group is targeted by squats?",
    //                                     options: [
    //                                         "Chest",
    //                                         "Back",
    //                                         "Legs",
    //                                         "Shoulders",
    //                                     ],
    //                                     answer: 2,
    //                                 },
    //                                 {
    //                                     question:
    //                                         "Which muscle group is primarily worked by deadlifts?",
    //                                     options: [
    //                                         "Legs",
    //                                         "Back",
    //                                         "Arms",
    //                                         "Core",
    //                                     ],
    //                                     answer: 13, // Multi-correct
    //                                 },
    //                                 {
    //                                     question:
    //                                         "How long should a beginner rest between sets?",
    //                                     options: [
    //                                         "30 seconds",
    //                                         "1-2 minutes",
    //                                         "3-5 minutes",
    //                                         "10 minutes",
    //                                     ],
    //                                     answer: 1, // Single correct
    //                                 },
    //                                 {
    //                                     question:
    //                                         "What is the purpose of progressive overload?",
    //                                     options: [
    //                                         "To prevent injury",
    //                                         "To increase the weight or intensity over time",
    //                                         "To shorten workout time",
    //                                         "To build endurance",
    //                                     ],
    //                                     answer: 1, // Single correct
    //                                 },
    //                             ],
    //                         },
    //                         {
    //                             subheadingName: "Protein Intake Guide",
    //                             subheadingDisc:
    //                                 "How much protein should you consume based on your goals?\nSit dolore anim ut nisi sint duis veniam culpa duis velit. Cupidatat cillum ut culpa veniam. Amet proident minim anim officia eu velit. Fugiat sit deserunt quis labore ullamco exercitation ut anim nisi sint.\nFugiat proident ullamco ut in non ut nostrud sunt irure ex id consequat. Lorem ea voluptate ea voluptate aute exercitation do id Lorem sunt. Velit excepteur dolor veniam enim velit non ipsum fugiat officia dolor sunt voluptate ad. Adipisicing ea nostrud nisi est velit sint. Ea aliqua nisi culpa anim minim eu dolor dolor mollit ut labore nisi.\nMollit irure eu adipisicing laborum excepteur veniam. Aliqua ullamco adipisicing nulla pariatur sunt laboris. Ex ad eiusmod quis laborum ullamco aute consequat velit ex exercitation nostrud. Magna ex nulla veniam cillum officia exercitation amet cillum consectetur do.",
    //                             subheadingFileType: 2,
    //                             subheadingLink:
    //                                 "https://docs.google.com/document/d/xyz",
    //                             test: [
    //                                 {
    //                                     question:
    //                                         "What is the ideal protein intake for muscle gain?",
    //                                     options: [
    //                                         "0.8g/kg",
    //                                         "1.2g/kg",
    //                                         "1.6g/kg",
    //                                         "2.2g/kg",
    //                                     ],
    //                                     answer: 23,
    //                                 },
    //                             ],
    //                         },
    //                     ],
    //                 },
    //             ],
    //         },
    //         {
    //             moduleName: "Creating a Brand Identity advanced",
    //             moduleDiscp:
    //                 "How to build a recognizable and authentic personal brand.",
    //             headings: [
    //                 {
    //                     headingName: "Finding Your Niche",
    //                     subheadings: [
    //                         {
    //                             subheadingName:
    //                                 "Identifying Your Target Audience.",
    //                             subheadingDisc:
    //                                 "Learn how to analyze trends and narrow down your niche.\nSit dolore anim ut nisi sint duis veniam culpa duis velit. Cupidatat cillum ut culpa veniam. Amet proident minim anim officia eu velit. Fugiat sit deserunt quis labore ullamco exercitation ut anim nisi sint.\nFugiat proident ullamco ut in non ut nostrud sunt irure ex id consequat. Lorem ea voluptate ea voluptate aute exercitation do id Lorem sunt. Velit excepteur dolor veniam enim velit non ipsum fugiat officia dolor sunt voluptate ad. Adipisicing ea nostrud nisi est velit sint. Ea aliqua nisi culpa anim minim eu dolor dolor mollit ut labore nisi.\nMollit irure eu adipisicing laborum excepteur veniam. Aliqua ullamco adipisicing nulla pariatur sunt laboris. Ex ad eiusmod quis laborum ullamco aute consequat velit ex exercitation nostrud. Magna ex nulla veniam cillum officia exercitation amet cillum consectetur do.",
    //                             subheadingFileType: 1,
    //                             subheadingLink:
    //                                 "https://youtu.be/swXWUfufu2w?si=Sss35Wl__DTMoPnv",
    //                             test: [
    //                                 {
    //                                     question:
    //                                         "Which platform is most suitable for fitness trainers?",
    //                                     options: [
    //                                         "Facebook",
    //                                         "Instagram",
    //                                         "LinkedIn",
    //                                         "Snapchat",
    //                                     ],
    //                                     answer: 1,
    //                                 },
    //                                 {
    //                                     question:
    //                                         "Which food is highest in protein?",
    //                                     options: [
    //                                         "Chicken breast",
    //                                         "Rice",
    //                                         "Apple",
    //                                         "Olive oil",
    //                                     ],
    //                                     answer: 1, // Single correct
    //                                 },
    //                                 {
    //                                     question:
    //                                         "What happens if you consume too little protein?",
    //                                     options: [
    //                                         "Muscle loss",
    //                                         "Improved endurance",
    //                                         "Weight gain",
    //                                         "Faster recovery",
    //                                     ],
    //                                     answer: 1, // Single correct
    //                                 },
    //                                 {
    //                                     question:
    //                                         "Which of these are complete protein sources?",
    //                                     options: [
    //                                         "Soy",
    //                                         "Quinoa",
    //                                         "Whey",
    //                                         "Peanut butter",
    //                                     ],
    //                                     answer: 12, // Multi-correct
    //                                 },
    //                             ],
    //                         },
    //                     ],
    //                 },
    //                 {
    //                     headingName: "Daily Water Intake",
    //                     subheadings: [
    //                         {
    //                             subheadingName: "Hydration for Performance",
    //                             subheadingDisc:
    //                                 "Guidelines for staying hydrated before, during, and after workouts.",
    //                             subheadingFileType: 1,
    //                             subheadingLink:
    //                                 "https://youtu.be/swXWUfufu2w?si=Sss35Wl__DTMoPnv",
    //                             test: [
    //                                 {
    //                                     question:
    //                                         "How much water should an athlete drink per day?",
    //                                     options: [
    //                                         "1 liter",
    //                                         "2 liters",
    //                                         "3 liters",
    //                                         "4 liters",
    //                                     ],
    //                                     answer: 23, // Multi-correct
    //                                 },
    //                                 {
    //                                     question:
    //                                         "What are signs of dehydration?",
    //                                     options: [
    //                                         "Fatigue",
    //                                         "Headache",
    //                                         "Improved performance",
    //                                         "Dry mouth",
    //                                     ],
    //                                     answer: 123, // Multi-correct
    //                                 },
    //                                 {
    //                                     question:
    //                                         "Which of these beverages helps rehydrate quickly?",
    //                                     options: [
    //                                         "Water",
    //                                         "Sports drinks",
    //                                         "Soda",
    //                                         "Energy drinks",
    //                                     ],
    //                                     answer: 12, // Multi-correct
    //                                 },
    //                             ],
    //                         },
    //                     ],
    //                 },
    //             ],
    //         },
    //     ],
    // };

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
                content: {
                    writeUp:
                        "A quick look into key muscle groups used during workouts.\nThis module covers the fundamental exercises and the proper form to prevent injuries.\nFugiat proident ullamco ut in non ut nostrud sunt irure ex id consequat.",
                    docLink: "",
                    videoLink: "https://youtu.be/swXWUfufu2w?si=Sss35Wl__DTMoPnv",
                    test: [
                        {
                            question: "Which muscle group is targeted by squats?",
                            options: ["Chest", "Back", "Legs", "Shoulders"],
                            answer: 2,
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
                            answer: 1,
                        },
                    ],
                },
            },
            {
                moduleName: "Strength Training Advanced",
                moduleDiscp:
                    "Dive deeper into strength training with a focus on advanced techniques for seasoned athletes.",
                headings: [
                    {
                        headingName: "High-Intensity Interval Training (HIIT)",
                        content: {
                            writeUp:
                                "A powerful approach combining strength training and cardio, HIIT helps in burning fat efficiently.\nAnim irure in do labore ad laboris ullamco.",
                            docLink: "https://example.com/HIIT",
                            videoLink: "https://youtu.be/abc123HIIT",
                            test: [
                                {
                                    question: "What is the benefit of HIIT?",
                                    options: [
                                        "Increases stamina",
                                        "Burns fat quickly",
                                        "Improves flexibility",
                                        "Builds muscle",
                                    ],
                                    answer: 12,
                                },
                                {
                                    question: "What is a key feature of HIIT?",
                                    options: [
                                        "Long-duration workouts",
                                        "Short, intense bursts",
                                        "Slow, steady pace",
                                        "Low intensity",
                                    ],
                                    answer: 2,
                                },
                            ],
                        },
                    },
                    {
                        headingName: "Progressive Overload Techniques",
                        subheadings: [
                            {
                                subheadingName: "Increasing Load Gradually",
                                content: {
                                    writeUp:
                                        "The principle of progressive overload involves gradually increasing the load on muscles to build strength.\nThis subheading explores techniques for beginners and advanced athletes alike.",
                                    docLink: "",
                                    videoLink:
                                        "https://youtu.be/progressive_overload",
                                    test: [
                                        {
                                            question:
                                                "Which is a method of progressive overload?",
                                            options: [
                                                "Increasing reps",
                                                "Increasing sets",
                                                "Reducing rest time",
                                                "All of the above",
                                            ],
                                            answer: 4,
                                        },
                                    ],
                                },
                            },
                            {
                                subheadingName: "Volume and Frequency Adjustment",
                                content: {
                                    writeUp:
                                        "Learn how adjusting workout volume and frequency helps in optimizing muscle growth.",
                                    docLink: "",
                                    videoLink: "https://youtu.be/volume_frequency",
                                    test: [
                                        {
                                            question:
                                                "What does increasing workout frequency involve?",
                                            options: [
                                                "Adding more workout days",
                                                "Increasing workout duration",
                                                "Reducing rest periods",
                                                "All of the above",
                                            ],
                                            answer: 1,
                                        },
                                    ],
                                },
                            },
                        ],
                    },
                ],
            },
            {
                moduleName: "Recovery and Rest",
                moduleDiscp:
                    "Understanding the importance of rest days and active recovery for better performance.",
                headings: [
                    {
                        headingName: "Importance of Sleep for Muscle Recovery",
                        content: {
                            writeUp:
                                "A deep dive into how quality sleep aids in muscle repair and overall recovery.\nSleep is crucial for optimal performance.",
                            docLink: "",
                            videoLink: "https://youtu.be/sleep_recovery_tips",
                            test: [
                                {
                                    question:
                                        "What stage of sleep is vital for muscle recovery?",
                                    options: [
                                        "REM sleep",
                                        "Stage 1",
                                        "Stage 2",
                                        "Stage 3/Deep sleep",
                                    ],
                                    answer: 4,
                                },
                                {
                                    question:
                                        "How many hours of sleep are recommended for athletes?",
                                    options: [
                                        "4-5 hours",
                                        "6-7 hours",
                                        "7-9 hours",
                                        "10+ hours",
                                    ],
                                    answer: 3,
                                },
                            ],
                        },
                    },
                    {
                        headingName: "Active Recovery Exercises",
                        subheadings: [
                            {
                                subheadingName: "Low-Intensity Cardio",
                                content: {
                                    writeUp:
                                        "Activities such as walking, cycling, or swimming can be great for active recovery, reducing soreness and aiding in flexibility.",
                                    docLink: "",
                                    videoLink: "https://youtu.be/active_recovery",
                                    test: [
                                        {
                                            question:
                                                "Which of these is an example of low-intensity cardio?",
                                            options: [
                                                "Sprinting",
                                                "Jogging",
                                                "Swimming",
                                                "Weightlifting",
                                            ],
                                            answer: 3,
                                        },
                                    ],
                                },
                            },
                            {
                                subheadingName: "Stretching and Mobility",
                                content: {
                                    writeUp:
                                        "Flexibility training, such as yoga or dynamic stretching, promotes muscle recovery and reduces stiffness.",
                                    docLink: "https://example.com/stretching",
                                    videoLink:
                                        "https://youtu.be/stretching_mobility",
                                    test: [
                                        {
                                            question:
                                                "What is the primary benefit of stretching?",
                                            options: [
                                                "Increases endurance",
                                                "Prevents muscle stiffness",
                                                "Builds muscle",
                                                "Increases calorie burn",
                                            ],
                                            answer: 2,
                                        },
                                    ],
                                },
                            },
                        ],
                    },
                ],
            },
            {
                moduleName: "Advanced Nutrition Strategies",
                moduleDiscp:
                    "Learn advanced nutritional techniques to fuel intense workouts and aid in recovery.",
                headings: [
                    {
                        headingName: "Hydration Strategies",
                        subheadings: [
                            {
                                subheadingName: "Electrolyte Balance",
                                content: {
                                    writeUp:
                                        "Maintaining electrolyte balance is crucial for avoiding dehydration and muscle cramps during workouts.",
                                    docLink: "",
                                    videoLink:
                                        "https://youtu.be/electrolyte_balance",
                                    test: [
                                        {
                                            question:
                                                "Which minerals are key electrolytes?",
                                            options: [
                                                "Calcium",
                                                "Magnesium",
                                                "Sodium",
                                                "All of the above",
                                            ],
                                            answer: 4,
                                        },
                                    ],
                                },
                            },
                        ],
                    },
                    {
                        headingName: "Pre-Workout Nutrition",
                        content: {
                            writeUp:
                                "Optimizing your nutrition before workouts can improve endurance and performance. Carbohydrates and protein play a key role here.",
                            docLink: "https://example.com/preworkout-nutrition",
                            videoLink: "https://youtu.be/preworkout_nutrition",
                            test: [
                                {
                                    question: "What is a good pre-workout meal?",
                                    options: [
                                        "High-fat meal",
                                        "High-carb, moderate protein",
                                        "High-sugar snack",
                                        "Low-calorie snack",
                                    ],
                                    answer: 2,
                                },
                            ],
                        },
                    },
                ],
            },
        ],
    };
    await addDoc(coursesRef, course);
    return "courese added!";
}
export { getCourseDetails, addCourse };
