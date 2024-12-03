import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
    doSignInUser,
    doSignoutUser,
    doSignUpUser,
    doUserPasswordReset,
} from "../../Firbase/firbaseAuth";
import {
    addCourseToUser,
    getUserData,
    markCourseAsComplete,
    removeCourseFromUser,
    updateProgress,
} from "../../Firbase/firbaseUserDB";
const initialState = {
    loading: false,
    error: "",
    success: "",

    userCredentials: {
        email: null,
        password: null,
    },

    isAdmin: false,
    isTrainer: false,
    isPersistent: false,

    courses: null,
    courseGrades: null,

    myClients: null,

    isLoggedIn: false,
    initialURL: null,
};
const doSignUp = createAsyncThunk(
    "user/signUpUser",
    async (_, { getState }) => {
        try {
            const state = getState();
            const { email, password } = state.user.userCredentials;
            const isTrainer = state.user.isTrainer;
            const response = await doSignUpUser({
                email,
                password,
                isTrainer,
            });
            await doSignoutUser();
            return response;
        } catch (error) {
            throw new Error(error.message);
        }
    }
);
const doUpdateCourseProgress = createAsyncThunk(
    "user/updateProgressAndGrades",
    async ({ newProgress, courseId, prevProgress }, { getState }) => {
        try {
            const state = getState();
            const { email } = state.user.userCredentials;
            // console.log("Hi");//
            await updateProgress(email, courseId, newProgress, prevProgress);
            // console.log("Hi2");
            return newProgress;
        } catch (error) {
            throw new Error(error.message);
        }
    }
);
const doMarkCourseAsComplete = createAsyncThunk(
    "user/markCourseAsComplete",
    async (courseId, { getState }) => {
        try {
            const state = getState();
            const { email } = state.user.userCredentials;
            const resp = await markCourseAsComplete(email, courseId);
            return resp;
        } catch (error) {
            throw new Error(error.message);
        }
    }
);
const doSignOut = createAsyncThunk("user/signOutUser", async () => {
    try {
        await doSignoutUser();
    } catch (err) {
        throw new Error(err.message);
    }
});
const doSignIn = createAsyncThunk(
    "user/signInUser",
    async (_, { getState }) => {
        try {
            const state = getState();
            const { email, password } = state.user.userCredentials;
            const isPersistent = state.user.isPersistent;
            const resp = await doSignInUser({ email, password, isPersistent });
            return resp;
        } catch (error) {
            throw new Error(error.message);
        }
    }
);
const doPasswordReset = createAsyncThunk(
    "user/resetPassword",
    async (_, { getState }) => {
        try {
            const email = getState().user.userCredentials.email;
            const resp = await doUserPasswordReset({ email });
            return resp;
        } catch (err) {
            throw new Error(err.message);
        }
    }
);
const doGetUserData = createAsyncThunk(
    "user/getUserData",
    async (Email, { getState }) => {
        try {
            let email = getState().user.userCredentials.email;
            if (!email) email = Email;
            const resp = await getUserData(email);
            return resp;
        } catch (err) {
            throw new Error(err.message);
        }
    }
);
const doAddCourseToUser = createAsyncThunk(
    "user/addCourseToUser",
    async ({ currentClient, currentCourse, courseProgress }, { getState }) => {
        try {
            const state = getState();
            const trainerEmail = state.user.userCredentials.email;
            const resp = await addCourseToUser(
                currentClient,
                currentCourse,
                courseProgress,
                trainerEmail
            );
            return resp;
        } catch (err) {
            throw new Error(err.message);
        }
    }
);
const doRemoveCourseFromUser = createAsyncThunk(
    "user/removeCourseFromUser",
    async ({ currentClient, currentCourse }, { getState }) => {
        try {
            const state = getState();
            const trainerEmail = state.user.userCredentials.email;
            const resp = await removeCourseFromUser(
                currentClient,
                currentCourse,
                trainerEmail
            );
            return resp;
        } catch (err) {
            throw new Error(err.message);
        }
    }
);
const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        passwordChanged: (state, action) => {
            state.userCredentials.password = action.payload;
        },
        emailChanged: (state, action) => {
            state.userCredentials.email = action.payload;
        },
        toggleUserRole: (state) => {
            state.isTrainer = !state.isTrainer;
        },
        togglePersistent: (state) => {
            state.isPersistent = !state.isPersistent;
        },
        setInitialURL: (state, action) => {
            state.initialURL = action.payload;
        },
        resetMessages: (state) => {
            if (state.error !== "") state.error = "";
            if (state.success !== "") state.success = "";
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(doSignUp.pending, (state) => {
                state.loading = true;
                state.error = "";
            })
            .addCase(doSignUp.fulfilled, (state, action) => {
                state.loading = false;
                state.success = action.payload;
                state.userCredentials.password = null;
            })
            .addCase(doSignUp.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
                state.userCredentials.password = null;
            })
            .addCase(doSignIn.pending, (state) => {
                state.loading = true;
                state.error = "";
                // state.success=
            })
            .addCase(doSignIn.fulfilled, (state, action) => {
                state.loading = false;
                state.userCredentials.password = null;
                state.isLoggedIn = true;
                // handles the null case
                state.success = "Login Successfull!";
            })
            .addCase(doSignIn.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
                state.userCredentials.password = null;
            })
            .addCase(doPasswordReset.pending, (state) => {
                state.loading = true;
                state.error = "";
            })
            .addCase(doPasswordReset.fulfilled, (state, action) => {
                state.loading = false;
                state.success = action.payload;
                state.userCredentials.password = null;
            })
            .addCase(doPasswordReset.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
                state.userCredentials.password = null;
            })
            .addCase(doGetUserData.pending, (state) => {
                state.loading = true;
                state.error = "";
            })
            .addCase(doGetUserData.fulfilled, (state, action) => {
                state.loading = false;
                // FIXME might need to change wayyy later when courses are added
                state.userCredentials.email = action.payload.email;
                state.isTrainer = action.payload.isTrainer;
                // TODO check if the courses now carries both the progress,and the courseId
                state.courses = action.payload.courses;
                // handles the null case
                state.isAdmin = action.payload.isAdmin === true ? true : false;
                state.success = "data fetch Successfull!";
                state.isLoggedIn = true;
                // FIXME make it such that everones in my clients
                if (action.payload.isAdmin || action.payload.isTrainer)
                    state.myClients = action.payload.myClients;
            })
            .addCase(doGetUserData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(doSignOut.pending, (state) => {
                state.loading = true;
            })
            .addCase(doSignOut.fulfilled, () => {
                return initialState;
            })
            .addCase(doSignOut.rejected, (state, action) => {
                state.error = action.error.message;
                state.loading = false;
            })
            .addCase(doUpdateCourseProgress.pending, (state) => {
                state.loading = true;
            })
            .addCase(doUpdateCourseProgress.fulfilled, (state, action) => {
                state.loading = false;

                // Find the index of the course with the matching courseId
                const courseIndex = state.courses.findIndex(
                    (course) => course.courseId === action.meta.arg.courseId
                );
                if (courseIndex !== -1) {
                    state.courses[courseIndex].courseProgress = action.payload;
                }
            })
            .addCase(doUpdateCourseProgress.rejected, (state, action) => {
                state.error = action.error.message;
                state.loading = false;
            })
            .addCase(doMarkCourseAsComplete.pending, (state) => {
                state.loading = true;
            })
            .addCase(doMarkCourseAsComplete.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(doMarkCourseAsComplete.fulfilled, (state, action) => {
                state.loading = false;
                state.courses = action.payload;
            })
            .addCase(doAddCourseToUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(doAddCourseToUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(doAddCourseToUser.fulfilled, (state, action) => {
                state.loading = false;
                if(action.payload)
                state.myClients = action.payload;
            })
            .addCase(doRemoveCourseFromUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(doRemoveCourseFromUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(doRemoveCourseFromUser.fulfilled, (state, action) => {
                state.loading = false;
                if(action.payload)
                state.myClients = action.payload;
            });
    },
});
export default userSlice.reducer;
export const {
    passwordChanged,
    emailChanged,
    toggleUserRole,
    togglePersistent,
    setInitialURL,
    resetMessages,
    updatedMyClients,
} = userSlice.actions;
export {
    doSignUp,
    doSignIn,
    doPasswordReset,
    doGetUserData,
    doSignOut,
    doUpdateCourseProgress,
    doMarkCourseAsComplete,
    doAddCourseToUser,
    doRemoveCourseFromUser
};
