import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getCourseDetails } from "../../Firbase/firebaseCourseDB";

const initialState = {
    course: null,
    currentCourse: null,
    courseLoading: false,
    courseError: "",
    courseSuccess: "",
};
const doGetCourseDetails = createAsyncThunk(
    "courses/getCoursesDetails",
    async (courseId, { getState }) => {
        try {
            //TODO add firebase logic here,also to check if
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
        setCurrentCourse: (state, action) => {
            state.currentCourse = action.payload;
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
                state.course = action.payload;
            })
            .addCase(doGetCourseDetails.rejected, (state, action) => {
                state.courseLoading = false;
                state.courseError = action.error.message;
            });
    },
});
export default courseSlice.reducer;
export const { resetCourseMessages, setCurrentCourse } = courseSlice.actions;
export { doGetCourseDetails };
