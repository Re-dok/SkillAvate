import React, { Component } from "react";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import LoginPage from "./Pages/LoginPage";
import {
    AdminRoute,
    ClientRoute,
    TrainerRoute,
} from "./Components/PrivateRoutes";
import ResetPassword from "./Pages/ResetPassword";
import ToolBar from "./Components/Toolbar";
import {
    doGetUserData,
    resetMessages,
    setInitialURL,
} from "./features/user/userSlice";
import { connect } from "react-redux";
import withRouter from "./Components/WithRouter";
// FIXME make urls from base like the one sir did
class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isResetingMessage: false,
        };
        const currentLoc = window.location.pathname;
        if (this.props.initialURL === null) {
            this.props.setInitialURL(currentLoc);
        }
    }
    componentDidUpdate() {
        // clears messages throughout the app after 5 secs
        const { error, success } = this.props;
        if (!this.state.isResetingMessage && (error !== "" || success !== "")) {
            this.setState((state) => (state.isResetingMessage = true));
            setTimeout(() => {
                this.props.resetMessages();
                this.setState((state) => (state.isResetingMessage = true));
            }, 5000);
        }
    }
    render() {
        return (
            <div>
                {
                    !this.props.isLoggedIn?null:
                        <ToolBar />
                }
                <Routes>
                    <Route path="/" exact element={<LoginPage />} />
                    <Route
                        path="/admin"
                        exact
                        element={
                            <AdminRoute>
                                <>
                                    Admin
                                </>
                            </AdminRoute>
                        }
                    />
                    <Route
                        path="/myCourses"
                        exact
                        element={
                            <AdminRoute>
                                <>Courses</>
                            </AdminRoute>
                        }
                    />
                    <Route
                        path="/explore"
                        exact
                        element={
                            <AdminRoute>
                                <>explore</>
                            </AdminRoute>
                        }
                    />
                    <Route
                        path="/client"
                        exact
                        element={
                            <ClientRoute>
                                <>client</>
                            </ClientRoute>
                        }
                    />
                    <Route
                        path="/trainer"
                        exact
                        element={
                            <TrainerRoute>
                                <>trainer</>
                            </TrainerRoute>
                        }
                    />
                    <Route path="/resetPassword" element={<ResetPassword />} />
                    <Route path="/NOTFOUND" element={<>PLEAD</>} />
                </Routes>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    isAdmin: state.user.isAdmin,
    isTrainer: state.user.isTrainer,
    initialURL: state.user.initialURL,
    isLoggedIn: state.user.isLoggedIn,
    success: state.user.success,
    error: state.user.error,
});
const mapDispatchToProps = {
    doGetUserData,
    setInitialURL,
    resetMessages,
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(App));
