import React, { Component } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import "./App.css";
import LoginPage from "./Pages/LoginPage";
import {
    AdminRoute,
    ClientRoute,
    TrainerRoute,
} from "./Components/PrivateRoutes";
import ResetPassword from "./Pages/ResetPassword";
import ToolBar from "./Components/Navbar1";
import { getUserData } from "./features/user/userSlice";
import { auth } from "./Firbase/fireaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { connect } from "react-redux"; // To connect Redux state
import { bindActionCreators } from "redux"; // To dispatch actions
import withRouter from "./Components/WithRouter";
class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            authStateChangedIsEnabled: true,
        };
    }

    componentDidMount() {
        this.unsubscribe = onAuthStateChanged(auth, async (user) => {
            const { authStateChangedIsEnabled } = this.state;
            const { dispatchGetUserData, navigate } = this.props;

            if (authStateChangedIsEnabled) {
                if (user) {
                    try {
                        await dispatchGetUserData(user.email);
                        const { isAdmin, isTrainer } = this.props;

                        navigate(
                            isAdmin
                                ? "/admin"
                                : isTrainer
                                ? "/trainer"
                                : "/client"
                        );
                        console.log(
                            "runs for 1st: " +
                                authStateChangedIsEnabled +
                                isAdmin +
                                isTrainer
                        );
                    } catch (err) {
                        console.error("Error fetching user data:", err.message);
                    }
                } else {
                    console.log("No user is signed in");
                }
            }
        });
    }

    componentWillUnmount() {
        // Clean up the listener when the component unmounts
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
                                // navigate={this.props.navigate}
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

// Map Redux state to props
const mapStateToProps = (state) => ({
    isAdmin: state.user.isAdmin,
    isTrainer: state.user.isTrainer,
});

// Map Redux actions to props
const mapDispatchToProps = (dispatch) => ({
    dispatchGetUserData: bindActionCreators(getUserData, dispatch),
});

// Wrap the component with connect() to bind Redux
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(App));
