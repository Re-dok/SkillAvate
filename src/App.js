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
    // doGetUserData,
    resetMessages,
    setInitialURL,
} from "./features/user/userSlice";
import { connect } from "react-redux";
import withRouter from "./Components/WithRouter";
import NotFound from "./Pages/NotFound";
import MyCourses from "./Pages/MyCourses";
// import ViewCourse from "./Pages/ViewCourse";
import ViewCourse from "./Pages/ViewCourse";
import ExplorePage from "./Pages/ExplorePage";
import ViewCourse2 from "./Pages/ViewCourse2";
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
                {!this.props.isLoggedIn ? null : <ToolBar />}
                <Routes>
                    <Route path="/" exact element={<LoginPage />} />
                    <Route
                        path="/admin"
                        exact
                        element={
                            <AdminRoute>
                                <>Admin</>
                            </AdminRoute>
                        }
                    />
                    {/* TODO remove me before you merge this branch */}
                    <Route
                        path="/test/:courseId"
                        exact
                        element={
                            <ClientRoute>
                                <ViewCourse2/>
                            </ClientRoute>
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
                        path="/viewCourse/:courseId"
                        exact
                        element={
                            <ClientRoute>
                                <ViewCourse />
                            </ClientRoute>
                        }
                    />
                    <Route
                        path="/explore"
                        exact
                        element={
                            <ClientRoute>
                                <ExplorePage/>
                            </ClientRoute>
                        }
                    />
                    <Route
                        path="/settings"
                        exact
                        element={
                            <ClientRoute>
                                <>settings</>
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
