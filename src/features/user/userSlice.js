import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
    doSignInUser,
    doSignUpUser,
    doUserPasswordReset,
} from "../../Firbase/fireaseConfig";

const initialState = {
    loading: false,
    userCredentials: {
        email: null,
        password: null,
    },
    isTrainer: false,
    authToken: null,
    error: "",
    success: "",
};
const doSignUp = createAsyncThunk(
    "/user/signUpUser",
    async ({ email, password, isTrainer }) => {
        try {
            const response = await doSignUpUser({ email, password, isTrainer });
            return response;
        } catch (error) {
            throw new Error(error.message);
        }
    }
);
// TODO add singout
const doSignIn = createAsyncThunk(
    "/user/signInUser",
    async ({ email, password }) => {
        try {
            const resp = await doSignInUser({ email, password });
            return resp;
        } catch (error) {
            throw new Error(error.message);
        }
    }
);
const doPasswordReset = createAsyncThunk(
    "/user/resetPassword",
    async ({ email }) => {
        try {
            // alert("hi2");
            const resp = await doUserPasswordReset({ email });
            //   alert("hi5");
            return resp;
        } catch (err) {
            //   alert("hi6");
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
            })
            .addCase(doSignUp.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(doSignIn.pending, (state) => {
                state.loading = true;
                state.error = "";
            })
            .addCase(doSignIn.fulfilled, (state, action) => {
                state.loading = false;
                state.authToken = action.payload.token;
                state.isTrainer = action.payload.isTrainer;
                state.success = "Login Successfull!";
            })
            .addCase(doSignIn.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(doPasswordReset.pending, (state) => {
                state.loading = true;
                state.error = "";
            })
            .addCase(doPasswordReset.fulfilled, (state, action) => {
                state.loading = false;
                state.success = action.payload;
            })
            .addCase(doPasswordReset.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});
export default userSlice.reducer;
export const { passwordChanged, emailChanged, toggleUserRole } =
    userSlice.actions;
export { doSignUp, doSignIn, doPasswordReset };
