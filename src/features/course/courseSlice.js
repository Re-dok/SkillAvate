import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
    getCourseDetails,
    updateCourseDetails,
} from "../../Firbase/firebaseCourseDB";

const initialState = {
    course: [],
    courseLoading: false,
    courseError: "",
    courseSuccess: "",
};
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
            // console.log(newCourseData);
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
                state.course[0] = action.payload;
                state.courseSuccess = "Courses data updated";
            });
    },
});
export default courseSlice.reducer;
export const { resetCourseMessages, clearOtherUserCoursesInfo } =
    courseSlice.actions;
export { doGetCourseDetails, doUpdateCourseUnit };
