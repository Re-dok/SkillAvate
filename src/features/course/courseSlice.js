import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
    addCourse,
    getCourseDetails,
    getMyCourses,
    updateCourseDetails,
    removeCourse,
} from "../../Firebase/firebaseCourseDB";
import bcrypt from "bcryptjs";
import { courseUnpublish } from "../../Firebase/firebaseUserDB";

const initialState = {
    course: [],
    courseLoading: false,
    courseError: "",
    courseSuccess: "",
};
const doCreateCourse = createAsyncThunk(
    "courses/createCourse",
    async ({ courseName, courseDiscp }, { getState }) => {
        try {
            const state = getState();
            if (!state.user.name)
                throw new Error(
                    "Please make sure you have filled your basic details in settings page, before creating a course!"
                );
            const courseDate = {
                courseName,
                courseDiscp,
                createrName: state.user.name,
                isPublished: false,
                createrEmail: state.user.userCredentials.email,
                modules: [],
            };
            const resp = await addCourse(courseDate);
            return resp;
        } catch (err) {
            throw new Error(err.message);
        }
    }
);
const doGetCourseDetails = createAsyncThunk(
    "courses/getCourseDetails",
    async (courseId) => {
        try {
            const courseData = await getCourseDetails(courseId);
            return courseData.courseData;
        } catch (err) {
            throw new Error(err.message);
        }
    }
);
const doPublishCourse = createAsyncThunk(
    "courses/publish",
    async (courseId, { getState }) => {
        try {
            const state = getState();
            const { isAdmin, isTrainer } = state.user;
            const course = state.course.course.find(
                (c) => c.courseId === courseId
            );

            if (!(isTrainer || isAdmin)) {
                throw new Error(
                    "Unauthorized! You are not an admin or a trainer!"
                );
            }

            if (!course) {
                throw new Error("Course not found!");
            }

            // Deep clone the course object
            const newCourse = structuredClone(course);

            // Function to hash test answers using a loop
            const hashAnswers = async (test) => {
                if (!test) return [];
                for (let i = 0; i < test.length; i++) {
                    const question = test[i];
                    question.answer = await bcrypt.hash(
                        question.options[question.answer],
                        10
                    );
                }
                return test;
            };

            // Process the modules, headings, and subheadings using loops
            for (let i = 0; i < newCourse.modules.length; i++) {
                const module = newCourse.modules[i];

                if (module.content) {
                    if (module.content.test) {
                        await hashAnswers(module.content.test);
                    }
                }

                if (module.headings) {
                    for (let j = 0; j < module.headings.length; j++) {
                        const heading = module.headings[j];

                        if (heading.content && heading.content.test) {
                            await hashAnswers(heading.content.test);
                        }

                        if (heading.subheadings) {
                            for (
                                let k = 0;
                                k < heading.subheadings.length;
                                k++
                            ) {
                                const subheading = heading.subheadings[k];

                                if (
                                    subheading.content &&
                                    subheading.content.test
                                ) {
                                    await hashAnswers(subheading.content.test);
                                }
                            }
                        }
                    }
                }
            }

            newCourse.isPublished = true;

            const resp = await updateCourseDetails(courseId, newCourse);
            // Return the processed course or perform API updates as needed
            return newCourse;
        } catch (error) {
            throw new Error(error.message);
        }
    }
);
const doUnpublishCourse = createAsyncThunk(
    "courses/unpublish",
    async (courseId, { getState }) => {
        try {
            const state = getState();
            const { isAdmin, isTrainer } = state.user;
            const email = state.user.userCredentials.email;
            const course = state.course.course.find(
                (c) => c.courseId === courseId
            );

            if (!(isTrainer || isAdmin)) {
                throw new Error(
                    "Unauthorized! You are not an admin or a trainer!"
                );
            }

            if (!course) {
                throw new Error("Course not found!");
            }
            if (course.createrEmail !== email && !isAdmin) {
                throw new Error(
                    "Unauthorized! You are not allowed to unpublish this course!"
                );
            }
            // Deep clone the course object
            const updatedCourse = structuredClone(course);

            // Function to hash test answers using a loop
            const findCorrectAnswerIndex = async (test) => {
                for (let i = 0; i < test.length; i++) {
                    const question = test[i];
                    const hashedAnswer = question.answer;
                    for (let j = 0; j < question.options.length; j++) {
                        const option = question.options[j];
                        const isMatch = await bcrypt.compare(
                            option,
                            hashedAnswer
                        );
                        if (isMatch) {
                            question.answer = j; // Set the answer to the correct index
                            break;
                        }
                    }
                }
            };

            // Process the modules, headings, and subheadings using loops
            for (let i = 0; i < updatedCourse.modules.length; i++) {
                const module = updatedCourse.modules[i];

                if (module.content && module.content.test) {
                    await findCorrectAnswerIndex(module.content.test);
                }

                if (module.headings) {
                    for (let j = 0; j < module.headings.length; j++) {
                        const heading = module.headings[j];

                        if (heading.content && heading.content.test) {
                            await findCorrectAnswerIndex(heading.content.test);
                        }

                        if (heading.subheadings) {
                            for (
                                let k = 0;
                                k < heading.subheadings.length;
                                k++
                            ) {
                                const subheading = heading.subheadings[k];

                                if (
                                    subheading.content &&
                                    subheading.content.test
                                ) {
                                    await findCorrectAnswerIndex(
                                        subheading.content.test
                                    );
                                }
                            }
                        }
                    }
                }
            }

            updatedCourse.isPublished = false;

            const resp = await courseUnpublish(updatedCourse,email);
            // Return the processed course or perform API updates as needed
            return updatedCourse;
        } catch (error) {
            throw new Error(error.message);
        }
    }
);
const doUpdateCourseUnit = createAsyncThunk(
    "courses/updateCourseUnit",
    async (
        { newContent, headingName, moduleDiscp, moduleIndex },
        { getState }
    ) => {
        try {
            const state = getState();
            const { isAdmin, isTrainer } = state.user;
            if (!(isTrainer || isAdmin)) {
                throw new Error(
                    "Unauthorized! You are not an admin or a trainer!"
                );
            }
            const courseId = state.course?.course[0].courseId;
            let newCourseData = structuredClone(state.course?.course[0]);
            let done = false;
            if (moduleIndex[2] !== -1) {
                newCourseData.modules[moduleIndex[0]].headings[
                    moduleIndex[1]
                ].subheadings[moduleIndex[2]].content = newContent;
                newCourseData.modules[moduleIndex[0]].headings[
                    moduleIndex[1]
                ].subheadings[moduleIndex[2]].subheadingName = headingName;
                done = true;
            } else if (!done && moduleIndex[1] !== -1) {
                newCourseData.modules[moduleIndex[0]].headings[
                    moduleIndex[1]
                ].content = newContent;
                newCourseData.modules[moduleIndex[0]].headings[
                    moduleIndex[1]
                ].headingName = headingName;
                done = true;
            } else if (!done) {
                newCourseData.modules[moduleIndex[0]].content = newContent;
                newCourseData.modules[moduleIndex[0]].moduleName = headingName;
                newCourseData.modules[moduleIndex[0]].moduleDiscp = moduleDiscp;
            }
            const resp = await updateCourseDetails(courseId, newCourseData);
            return resp;
        } catch (error) {
            throw new Error(error.message);
        }
    }
);
const doUpdateCourseInfo = createAsyncThunk(
    "courses/updateCourseBasicInfo",
    async ({ courseName, courseDiscp }, { getState }) => {
        try {
            const state = getState();
            const { isAdmin, isTrainer } = state.user;
            if (!(isTrainer || isAdmin)) {
                throw new Error(
                    "Unauthorized! You are not an admin or a trainer!"
                );
            }
            const courseId = state.course?.course[0].courseId;
            let newCourseData = structuredClone(state.course?.course[0]);
            newCourseData.courseName = courseName;
            newCourseData.courseDiscp = courseDiscp;
            const resp = await updateCourseDetails(courseId, newCourseData);
            return resp;
        } catch (err) {
            throw new Error(err.message);
        }
    }
);
const doUpdateHeadingName = createAsyncThunk(
    "courses/doUpdateHeadingName",
    async ({ newName, moduleNumber, headingNumber }, { getState }) => {
        try {
            const state = getState();
            const { isAdmin, isTrainer } = state.user;
            if (!(isTrainer || isAdmin)) {
                throw new Error(
                    "Unauthorized! You are not an admin or a trainer!"
                );
            }
            const courseId = state.course?.course[0].courseId;
            let newCourseData = structuredClone(state.course?.course[0]);
            if (headingNumber === null)
                newCourseData.modules[moduleNumber].moduleName = newName;
            else
                newCourseData.modules[moduleNumber].headings[
                    headingNumber
                ].headingName = newName;
            const resp = await updateCourseDetails(courseId, newCourseData);
            return resp;
        } catch (err) {
            throw new Error(err.message);
        }
    }
);
const doGetMyCourses = createAsyncThunk(
    "course/getMyCourses",
    async (_, { getState }) => {
        try {
            const state = getState();
            const createrEmail = state.user.userCredentials.email;
            const isAdmin = state.user?.isAdmin || false;
            const resp = await getMyCourses(createrEmail, isAdmin);
            return resp;
        } catch (err) {
            throw new Error(err.message);
        }
    }
);
const doAddCourseUnit = createAsyncThunk(
    "courses/addCourseUnit",
    async (
        { headings, unitCoordinates, unitDiscp, newContent },
        { getState }
    ) => {
        try {
            const state = getState();
            const { isAdmin, isTrainer } = state.user;
            if (!(isTrainer || isAdmin)) {
                throw new Error(
                    "Unauthorized! You are not an admin or a trainer!"
                );
            }
            const courseId = state.course?.course[0].courseId;
            let newCourseData = structuredClone(state.course?.course[0]);
            let modules = newCourseData.modules || [];
            const moduleName = headings[0];
            const headingName = headings[1];
            const subheadingName = headings[2];
            if (unitCoordinates[2] === -1) {
                if (unitCoordinates[1] === -1) {
                    // appending to module
                    if (subheadingName) {
                        // add with subheading,heading
                        let subheadings = [];
                        subheadings.push({
                            subheadingName: subheadingName,
                            content: newContent,
                        });
                        let headings = [];
                        headings.push({
                            headingName: headingName,
                            subheadings: subheadings,
                        });
                        modules.push({
                            moduleName: moduleName,
                            moduleDiscp: unitDiscp,
                            headings: headings,
                        });
                    } else if (headingName) {
                        // add with heading
                        let headings = [];
                        headings.push({
                            headingName: headingName,
                            content: newContent,
                        });
                        modules.push({
                            moduleName: moduleName,
                            moduleDiscp: unitDiscp,
                            headings: headings,
                        });
                    } else {
                        modules.push({
                            moduleName: moduleName,
                            moduleDiscp: unitDiscp,
                            content: newContent,
                        });
                    }
                } else {
                    // appending to headings
                    if (subheadingName) {
                        // add with subheading
                        let subheadings = [];
                        subheadings.push({
                            subheadingName: subheadingName,
                            content: newContent,
                        });
                        modules[unitCoordinates[0]].headings.push({
                            headingName: headingName,
                            subheadings: subheadings,
                        });
                    } else {
                        modules[unitCoordinates[0]].headings.push({
                            headingName: headingName,
                            content: newContent,
                        });
                    }
                }
            } else {
                // appending to subheading
                modules[unitCoordinates[0]].headings[
                    unitCoordinates[1]
                ].subheadings.push({
                    subheadingName: subheadingName,
                    content: newContent,
                });
            }
            const resp = await updateCourseDetails(courseId, newCourseData);
            return resp;
        } catch (error) {
            throw new Error(error.message);
        }
    }
);
const doRemoveCourseUnit = createAsyncThunk(
    "course/removeCourseUnit",
    async ({ i, j, k }, { getState }) => {
        try {
            const state = getState();
            const { isAdmin, isTrainer } = state.user;
            if (!(isTrainer || isAdmin)) {
                throw new Error(
                    "Unautherised! You are not an admin or a trainer!"
                );
            }
            const courseId = state.course?.course[0].courseId;
            let newCourseData = structuredClone(state.course?.course[0]);
            let modules = newCourseData.modules || [];
            // based on the nodes posstion, a node is delelted
            // if the node is the only child to its parents then their parents are also deleted
            if (j === -1) {
                // return [i, -1, -1];
                modules.splice(i, 1);
            } else if (k === -1) {
                modules[i].headings.length > 1
                    ? modules[i].headings.splice(j, 1)
                    : // [i, j, -1]
                      // [i, -1, -1];
                      modules.splice(i, 1);
            } else {
                if (modules[i].headings[j].subheadings.length > 1) {
                    // return [i, j, k];
                    modules[i].headings[j].subheadings.splice(k, 1);
                } else {
                    modules[i].headings.length > 1
                        ? modules[i].headings.splice(j, 1)
                        : //  [i, j, -1]
                          //  [i, -1, -1];
                          modules.splice(i, 1);
                }
            }
            const resp = await updateCourseDetails(courseId, newCourseData);
            return resp;
        } catch (error) {
            throw new Error(error.message);
        }
    }
);
const doRemoveCourse = createAsyncThunk(
    "courses/removeCourse",
    async (_, { getState }) => {
        try {
            const state = getState();
            const { isAdmin, isTrainer } = state.user;
            const { email } = state.user.userCredentials;
            if (!(isTrainer || isAdmin)) {
                throw new Error(
                    "Unautherised! You are not an admin or a trainer!"
                );
            }
            const { courseId, createrEmail } = state.course?.course[0];
            if (createrEmail !== email)
                throw new Error("Unautherised!Not your course!");
            const resp = await removeCourse(courseId);
            return resp;
        } catch (err) {
            throw new Error(
                "issue occured while trying to delete course!",
                err.message
            );
        }
    }
);
const courseSlice = createSlice({
    name: "course",
    initialState,
    reducers: {
        resetCourseMessages: (state) => {
            if (state.courseError !== "") state.courseError = "";
            if (state.courseSuccess !== "") state.courseSuccess = "";
        },
        clearOtherUserCoursesInfo: (state, action) => {
            const currentcourseId = action.payload;
            if (currentcourseId === null) {
                state.course = [];
                return;
            }
            state.course = state.course.filter(
                (c) => c.courseId === currentcourseId
            );
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(doGetCourseDetails.pending, (state) => {
                state.courseLoading = true;
                state.courseError = "";
            })
            .addCase(doGetCourseDetails.fulfilled, (state, action) => {
                state.courseLoading = false;
                state.courseSuccess = "Courses data retrieved";
                state.course.push(action.payload);
            })
            .addCase(doGetCourseDetails.rejected, (state, action) => {
                state.courseLoading = false;
                state.courseError = action.error.message;
            })
            .addCase(doUpdateCourseUnit.pending, (state) => {
                state.courseLoading = true;
            })
            .addCase(doUpdateCourseUnit.rejected, (state, action) => {
                state.courseLoading = false;
                state.courseError = action.error.message;
            })
            .addCase(doUpdateCourseUnit.fulfilled, (state, action) => {
                state.courseLoading = false;
                if (action.payload) state.course[0] = action.payload;
                state.courseSuccess = "Courses data updated";
            })
            .addCase(doUpdateCourseInfo.pending, () => {})
            .addCase(doUpdateCourseInfo.rejected, (state, action) => {
                state.courseError = action.error.message;
            })
            .addCase(doUpdateCourseInfo.fulfilled, (state, action) => {
                if (action.payload) state.course[0] = action.payload;
                state.courseSuccess = "Courses data updated";
            })
            .addCase(doUpdateHeadingName.pending, () => {})
            .addCase(doUpdateHeadingName.rejected, (state, action) => {
                state.courseError = action.error.message;
            })
            .addCase(doUpdateHeadingName.fulfilled, (state, action) => {
                if (action.payload) state.course[0] = action.payload;
                state.courseSuccess = "Courses data updated";
            })
            .addCase(doCreateCourse.pending, () => {})
            .addCase(doCreateCourse.rejected, (state, action) => {
                state.courseError = action.error.message;
            })
            .addCase(doCreateCourse.fulfilled, (state, action) => {
                state.course.push(action.payload);
            })
            .addCase(doGetMyCourses.pending, (state) => {
                state.courseLoading = true;
            })
            .addCase(doGetMyCourses.rejected, (state) => {
                state.courseLoading = false;
                state.course = [];
            })
            .addCase(doGetMyCourses.fulfilled, (state, action) => {
                state.courseLoading = false;
                state.course = action.payload.coursesData;
            })
            .addCase(doAddCourseUnit.pending, (state) => {
                state.courseLoading = true;
            })
            .addCase(doAddCourseUnit.rejected, (state, action) => {
                state.courseLoading = false;
                state.courseError = action.error.message;
            })
            .addCase(doAddCourseUnit.fulfilled, (state, action) => {
                state.courseLoading = false;
                if (action.payload) state.course[0] = action.payload;
                state.courseSuccess = "Unit added";
            })
            .addCase(doRemoveCourseUnit.pending, (state) => {
                state.courseLoading = true;
            })
            .addCase(doRemoveCourseUnit.rejected, (state, action) => {
                state.courseLoading = false;
                state.courseError = action.error.message;
            })
            .addCase(doRemoveCourseUnit.fulfilled, (state, action) => {
                state.courseLoading = false;
                if (action.payload) state.course[0] = action.payload;
                state.courseSuccess = "Unit added";
            })
            .addCase(doRemoveCourse.pending, (state) => {
                state.courseLoading = true;
            })
            .addCase(doRemoveCourse.rejected, (state, action) => {
                state.courseLoading = false;
                state.courseError = action.error.message;
            })
            .addCase(doRemoveCourse.fulfilled, (state) => {
                state.courseLoading = false;
                // if (action.payload) state.course[0] = action.payload;
                state.courseSuccess = "course removed";
            })
            .addCase(doPublishCourse.pending, () => {})
            .addCase(doPublishCourse.fulfilled, (state, action) => {
                state.course = state.course.map((c) => {
                    if (c.courseId === action.payload.courseId) {
                        return action.payload; // Return the updated course object
                    }
                    return c; // Return the unmodified course object
                });
            })
            .addCase(doPublishCourse.rejected, (state, action) => {
                state.courseError = action.error.message;
            })
            .addCase(doUnpublishCourse.pending, () => {})
            .addCase(doUnpublishCourse.fulfilled, (state, action) => {
                state.course = state.course.map((c) => {
                    if (c.courseId === action.payload.courseId) {
                        return action.payload; // Return the updated course object
                    }
                    return c; // Return the unmodified course object
                });
            })
            .addCase(doUnpublishCourse.rejected, (state, action) => {
                state.courseError = action.error.message;
            });
    },
});
export default courseSlice.reducer;
export const { resetCourseMessages, clearOtherUserCoursesInfo } =
    courseSlice.actions;
export {
    doGetCourseDetails,
    doUpdateCourseUnit,
    doUpdateCourseInfo,
    doUpdateHeadingName,
    doGetMyCourses,
    doCreateCourse,
    doAddCourseUnit,
    doRemoveCourseUnit,
    doRemoveCourse,
    doPublishCourse,
    doUnpublishCourse,
};
