import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
    doSignInUser,
    doSignUpUser,
    doUserPasswordReset,
    doGetUserData,
} from "../../Firbase/fireaseConfig";
import { act } from "react";

const initialState = {
    loading: false,
    userCredentials: {
        email: null,
        password: null,
    },
    isTrainer: null,
    isPersistent: false,
    isAdmin: null,
    error: "",
    success: "",
};
const doSignUp = createAsyncThunk(
    // TODO might need to add logic to add user to db and then store his data on signUp make sure that you DONT add 'isAdmin' state let it be null
    "user/signUpUser",
    async ({ email, password, isTrainer, isPersistent }) => {
        try {
            const response = await doSignUpUser({
                email,
                password,
                isTrainer,
                isPersistent,
            });
            return response;
        } catch (error) {
            throw new Error(error.message);
        }
    }
);
// TODO add singout
const doSignIn = createAsyncThunk(
    "user/signInUser",
    async ({ email, password }) => {
        try {
            const resp = await doSignInUser({ email, password });
            // FIXME remove the password state after success
            return resp;
        } catch (error) {
            throw new Error(error.message);
        }
    }
);
const doPasswordReset = createAsyncThunk(
    "user/resetPassword",
    async ({ email }) => {
        try {
            const resp = await doUserPasswordReset({ email });
            return resp;
        } catch (err) {
            throw new Error(err.message);
        }
    }
);
const getUserData = createAsyncThunk("user/getUserData", async (email) => {
    try {
        const resp = await doGetUserData(email);
        return resp;
    } catch (err) {
        throw new Error(err.message);
    }
});
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
                // state.success=
            })
            .addCase(doSignIn.fulfilled, (state, action) => {
                state.loading = false;
                state.isTrainer = action.payload.isTrainer;
                // handles the null case
                state.isAdmin = action.payload.isAdmin === true ? true : false;
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
            })
            .addCase(getUserData.pending, (state) => {
                state.loading = true;
                state.error = "";
            })
            .addCase(getUserData.fulfilled, (state, action) => {
                state.loading = false;
                // FIXME might need to change
                state.isTrainer = action.payload.isTrainer;
                state.userCredentials.email = action.payload.email;
                // handles the null case
                state.isAdmin = action.payload.isAdmin === true ? true : false;
                state.success = "data fetch Successfull!";
                // state.success = action.payload;
            })
            .addCase(getUserData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});
export default userSlice.reducer;
export const {
    passwordChanged,
    emailChanged,
    toggleUserRole,
    togglePersistent,
} = userSlice.actions;
export { doSignUp, doSignIn, doPasswordReset, getUserData };
