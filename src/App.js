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
import { resetMessages, setInitialURL } from "./Features/user/userSlice";
import { connect } from "react-redux";
import withRouter from "./Components/WithRouter";
import NotFound from "./Pages/NotFound";
import MyCourses from "./Pages/MyCourses";
import ExplorePage from "./Pages/ExplorePage";
import ViewCourse from "./Pages/ViewCourse";
import TrainerCourses from "./Pages/TrainerPages/TrainerCourses";
import MyClients from "./Pages/TrainerPages/MyClients";
import EditCourse from "./Pages/TrainerPages/EditCourse";
import ViewTrainerCourse from "./Pages/TrainerPages/ViewTrainerCourse";
import Dashboard from "./Pages/TrainerPages/Dashboard";
import Settings from "./Pages/Settings";
// FIXME make urls from base like the one sir did
// the answers are stored as numbers in unpublished courses, once published the anser string is encoded and then stored.
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
                {!this.props.isLoggedIn ? null : <ToolBar />}
                <Routes>
                    <Route path="/" exact element={<LoginPage />} />
                    <Route
                        path="/dashboard"
                        exact
                        element={
                            <AdminRoute>
                                <Dashboard />
                            </AdminRoute>
                        }
                    />
                    <Route
                        path="/myCourses"
                        exact
                        element={
                            <ClientRoute>
                                <MyCourses />
                            </ClientRoute>
                        }
                    />
                    <Route
                        path="/courses"
                        exact
                        element={
                            <TrainerRoute>
                                <TrainerCourses />
                            </TrainerRoute>
                        }
                    />
                    <Route
                        path="/myClients"
                        exact
                        element={
                            <TrainerRoute>
                                <MyClients />
                            </TrainerRoute>
                        }
                    />
                    <Route
                        path="/viewCourse/:courseId"
                        exact
                        element={
                            <ClientRoute>
                                <ViewCourse />
                            </ClientRoute>
                        }
                    />
                    <Route
                        path="/view/:courseId"
                        exact
                        element={
                            <TrainerRoute>
                                <ViewTrainerCourse />
                            </TrainerRoute>
                        }
                    />
                    <Route
                        path="/editCourse/:courseId"
                        exact
                        element={
                            <TrainerRoute>
                                <EditCourse />
                            </TrainerRoute>
                        }
                    />
                    <Route
                        path="/explore"
                        exact
                        element={
                            <ClientRoute>
                                <ExplorePage />
                            </ClientRoute>
                        }
                    />
                    <Route
                        path="/settings"
                        exact
                        element={
                            <ClientRoute>
                                <Settings />
                            </ClientRoute>
                        }
                    />
                    <Route
                        path="/mySettings"
                        exact
                        element={
                            <TrainerRoute>
                                <Settings />
                            </TrainerRoute>
                        }
                    />
                    <Route path="/resetPassword" element={<ResetPassword />} />
                    <Route path="/notFound" element={<NotFound />} />
                    <Route path="*" element={<NotFound />} />
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
    // doGetUserData,
    setInitialURL,
    resetMessages,
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(App));
