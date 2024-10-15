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

//FIXME FIND a way such that alerts close on there own, maybe can add it here in OnUpdate
class App extends Component {
    constructor(props) {
        super(props);
        const currentLoc = window.location.pathname;
        if (this.props.initialURL === null) {
            this.props.setInitialURL(currentLoc);
        }
    }

    render() {
        return (
            <div>
                <ToolBar />
                <Routes>
                    <Route path="/" exact element={<LoginPage />} />
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
});
const mapDispatchToProps = {
    doGetUserData,
    setInitialURL,
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(App));
