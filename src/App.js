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
import ToolBar from "./Components/Navbar1";
import { doGetUserData, setInitialURL } from "./features/user/userSlice";
import { connect } from "react-redux";
import withRouter from "./Components/WithRouter";

import { auth } from "./Firbase/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
//FIXME FIND a way such that alerts close on there own, maybe can add it here in OnUpdate
class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            authStateChangedIsEnabled: true,
        };
        const currentLoc = window.location.pathname;
        if (this.props.initialURL === null) {
            this.props.setInitialURL(currentLoc);
        }
    }

    componentDidMount() {
        // check if the state isLoggedIn is true
        // no
        if (!this.props.isLoggedIn) {
            // run check Auth
            this.unsubscribe = onAuthStateChanged(auth, async (user) => {
                const { authStateChangedIsEnabled } = this.state;

                if (authStateChangedIsEnabled) {
                    // not signed in
                    if (!user) {
                        // if the url is not for login save the intended url, given it isnt signUp/forgot password and then use it at login page to redirect after login
                        this.props.navigate("/");
                        // wait for login(so do nothing here)
                    } else {
                        // signed in?
                        // fetch details,nav as normal via intended nav,will need to set is logged in as true
                        await this.props.doGetUserData(user.email);
                        const { isAdmin, isTrainer } = this.props;
                        if (
                            this.props.initialURL === "/" ||
                            this.props.initialURL === "/resetPassword" ||
                            this.props.initialURL === null
                        ) {
                            this.props.navigate(
                                isAdmin
                                    ? "/admin"
                                    : isTrainer
                                    ? "/trainer"
                                    : "/client"
                            );
                        } else {
                            this.props.navigate(this.props.initialURL);
                            if (this.props.initialURL)
                                this.props.setInitialURL(null);
                        }
                    }
                }
            });
        } else {
            // WILL never occur
            //{ WONT occur idealy since on load or reload, the logIn is always false, and this code run only on load or reload}
            // fetch details, if hes dirctly trying to reach a subdomain, then you need not navigate, else hes on login page redirect to home
            const currentLoc = window.location.pathname;
            const { isAdmin, isTrainer } = this.props;
            if (currentLoc === "/" || currentLoc === "/resetPassword") {
                this.props.navigate(
                    isAdmin ? "/admin" : isTrainer ? "/trainer" : "/client"
                );
            }
        }
    }

    componentWillUnmount() {
        if (this.unsubscribe) {
            this.unsubscribe();
        }
    }

    setAuthStateChangedIsEnabled = (enabled) => {
        this.setState({ authStateChangedIsEnabled: enabled });
    };

    render() {
        const { authStateChangedIsEnabled } = this.state;

        return (
            <div>
                <ToolBar />
                <Routes>
                    <Route
                        path="/"
                        exact
                        element={
                            <LoginPage
                                enabledAuth={authStateChangedIsEnabled}
                                setEnableAuth={
                                    this.setAuthStateChangedIsEnabled
                                }
                            />
                        }
                    />
                    <Route
                        path="/admin"
                        exact
                        element={
                            <AdminRoute>
                                <>admin</>
                            </AdminRoute>
                        }
                    />
                    <Route
                        path="/home"
                        exact
                        element={
                            <AdminRoute>
                                <>home</>
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
});
const mapDispatchToProps = {
    doGetUserData,
    setInitialURL,
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(App));
