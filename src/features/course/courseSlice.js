import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
    addCourse,
    getCourseDetails,
    getMyCourses,
    updateCourseDetails,
} from "../../Firbase/firebaseCourseDB";

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
                    "Unautherised! You are not an admin or a trainer!"
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
                    "Unautherised! You are not an admin or a trainer!"
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
                    "Unautherised! You are not an admin or a trainer!"
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
            const resp = await getMyCourses(createrEmail);
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
                    "Unautherised! You are not an admin or a trainer!"
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
                state.courseSuccess = "Courses data retrived";
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
};
