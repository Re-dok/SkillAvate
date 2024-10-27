import { configureStore } from "@reduxjs/toolkit";
import { createLogger } from "redux-logger";
import userReducer from "../features/user/userSlice";
import courseReducer from "../features/course/courseSlice";
const logger = createLogger();
const store = configureStore({
    reducer: {
        user: userReducer,
        course: courseReducer,
    },
    middleware: (getDefaultMiddleware) => {
        return getDefaultMiddleware();
        // concat(logger)
    },
});

export default store;
