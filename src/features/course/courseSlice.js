import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getCourseDetails } from "../../Firbase/firebaseCourseDB";

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
            });
    },
});
export default courseSlice.reducer;
export const { resetCourseMessages, clearOtherUserCoursesInfo } =
    courseSlice.actions;
export { doGetCourseDetails };
