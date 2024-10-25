import React, { Component } from "react";
import { Link } from "react-router-dom";
import {
    Button,
    Input,
    InputGroup,
    Label,
    InputGroupText,
    FormGroup,
    Alert,
} from "reactstrap";
import {
    doSignIn,
    emailChanged,
    passwordChanged,
    toggleUserRole,
    togglePersistent,
    doGetUserData,
    doSignUp,
    setInitialURL,
    doSignOut,
} from "../features/user/userSlice";
import { connect } from "react-redux";

import { auth } from "../Firbase/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";

//check multiple signups with same email is possible
//nop
// prevent from adding to db if theres already an acc

import withRouter from "../Components/WithRouter";

class LoginPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLogin: true,
            passwordType: "password",
        };
    }

    componentDidMount() {
        // the isLoggedIn is false,
        if (!this.props.isLoggedIn) {
            // this means we have to check persitence
            this.unsubscribe = onAuthStateChanged(auth, async (user) => {
                const authStateChangedIsEnabled = this.props.email;

                if (authStateChangedIsEnabled === null) {
                    // if signedOut: do nothing
                    // else if signedIn: navigate to the initalURL or to home
                    //         // run check Auth
                    // not signed in
                    if (!user) {
                    } else {
                        // signed in?
                        // fetch details,nav as normal via intended nav,will need to set is logged in as true
                        await this.props.doGetUserData(user.email);
                        const { isAdmin, isTrainer } = this.props;
                        if (
                            this.props.initialURL === "/" ||
                            this.props.initialURL === "/resetPassword" ||
                            this.props.initialURL === null ||
                            this.props.initialURL === "/notFound"
                        ) {
                            this.props.navigate(
                                isAdmin === true
                                    ? "/admin"
                                    : isTrainer
                                    ? "/trainer"
                                    : "/myCourses"
                            );
                            this.props.setInitialURL(null);
                        } else {
                            this.props.navigate(this.props.initialURL);
                            if (this.props.initialURL)
                                this.props.setInitialURL(null);
                        }
                    }
                }
            });
        } else {
            // if true make it go to home,since this meant that the user already logged in and came here only by accedent
            const { isAdmin, isTrainer } = this.props;
            this.props.navigate(
                isAdmin === true
                    ? "/admin"
                    : isTrainer
                    ? "/trainer"
                    : "/myCourses"
            );
        }
    }

    componentWillUnmount() {
        if (this.unsubscribe) {
            this.unsubscribe();
        }
    }

    handleSubmit = async () => {
        // this.props.setEnableAuth(false);
        if (!this.state.isLogin) {
            await this.props.doSignUp();
        } else {
            const { email, password } = this.props;
            if (!email || !password) return;
            await this.props.doSignIn();
            const { success } = this.props;
            if (success) {
                await this.props.doGetUserData(email);
                const { isTrainer, isAdmin, navigate } = this.props;
                if (
                    this.props.initialURL === "/" ||
                    this.props.initialURL === null ||
                    this.props.initialURL === "/resetPassword" ||
                    this.props.initialURL === "/notFound"
                ) {
                    navigate(
                        isAdmin === true
                            ? "/admin"
                            : isTrainer
                            ? "/trainer"
                            : "/myCourses"
                    );
                    this.props.setInitialURL(null);
                } else {
                    navigate(this.props.initialURL);
                    this.props.setInitialURL(null);
                }
            }
        }
    };
    toggleFormType = () => {
        if (this.state.isLogin) this.setState({ isLogin: false });
        else this.setState({ isLogin: true });
    };
    togglePasswordType = () => {
        const newState =
            this.state.passwordType === "password" ? "text" : "password";
        this.setState({ passwordType: newState });
    };
    toggleUserRole = () => {
        this.props.toggleUserRole();
    };
    togglePersistent = () => {
        this.props.togglePersistent();
    };
    handleChange = (e) => {
        if (e.target.name === "password")
            this.props.passwordChanged(e.target.value);
        else this.props.emailChanged(e.target.value);
    };
    render() {
        const isDisabled =
            !this.props.email || !this.props.password || this.props.isLoading;

        return (
            <div className="d-flex min-vh-100 justify-content-center align-items-center">
                <div
                    className="border rounded shadow p-5 mx-auto justify-content-center align-items-center w-lg-25 d-flex flex-column gap-3"
                    style={{ width: "30%", minWidth: "340px" }}
                >
                    <h2>{this.state.isLogin ? "Login" : "Sign Up"}</h2>
                    <InputGroup className="gap-0 d-flex flex-column ">
                        <Label>Email address</Label>
                        <Input
                            name="email"
                            onChange={(e) => this.handleChange(e)}
                            className="w-100 input-focus-none"
                        />
                    </InputGroup>
                    <InputGroup className="gap-0 d-flex flex-column">
                        <Label>Password</Label>
                        <InputGroup className="d-flex flex-row border rounded border-2">
                            <Input
                                name="password"
                                onChange={(e) => this.handleChange(e)}
                                type={this.state.passwordType}
                                className="border-0 input-focus-none"
                            />
                            <InputGroupText
                                style={{ cursor: "pointer" }}
                                onClick={this.togglePasswordType}
                                className="bg-transparent border-0"
                            >
                                {this.state.passwordType === "password" ? (
                                    <i className="bi bi-eye-fill"></i>
                                ) : (
                                    <i className="bi bi-eye-slash-fill"></i>
                                )}
                            </InputGroupText>
                        </InputGroup>
                    </InputGroup>
                    {this.state.isLogin ? (
                        <InputGroup className="d-flex mt-1 flex-lg-row flex-column align-content-center justify-content-between">
                            <div className="gap-2 d-flex align-content-center">
                                <Input
                                    type="checkbox"
                                    onChange={this.togglePersistent}
                                />
                                Stay connected
                            </div>
                            <div className="gap-2 d-flex align-content-center">
                                <Link
                                    to="/resetPassword"
                                    className="text-decoration-none"
                                >
                                    Forgot your password?
                                </Link>
                            </div>
                        </InputGroup>
                    ) : (
                        <InputGroup className="d-flex mt-1 flex-lg-row flex-column align-content-center justify-content-between">
                            <Label className="mt-1">Sign Up As a :</Label>
                            <div className="w-100 mb-3 d-flex flex-row justify-content-start align-content-center gap-3">
                                <FormGroup check inline>
                                    <Input
                                        type="checkbox"
                                        checked={!this.props.isTrainer}
                                        onChange={this.toggleUserRole}
                                    />
                                    <Label check>Client</Label>
                                </FormGroup>
                                <FormGroup check inline>
                                    <Input
                                        type="checkbox"
                                        checked={this.props.isTrainer}
                                        onChange={this.toggleUserRole}
                                    />
                                    <Label check>Trainer</Label>
                                </FormGroup>
                            </div>
                        </InputGroup>
                    )}
                    <Button
                        className="w-100 mb-2 py-2"
                        disabled={isDisabled}
                        color="primary"
                        onClick={this.handleSubmit}
                    >
                        {this.props.isLoading
                            ? "Loading..."
                            : this.state.isLogin
                            ? "Sign in"
                            : "Sign Up"}
                    </Button>
                    <InputGroup className="d-flex flex-column align-content-center justify-content-center">
                        <Label>
                            {this.state.isLogin
                                ? "Don't have an account?"
                                : "Already have an account?"}
                        </Label>
                        <div className="d-flex align-content-center justify-content-center">
                            <Link
                                onClick={this.toggleFormType}
                                className="text-decoration-none"
                            >
                                {this.state.isLogin
                                    ? "Create one for free!"
                                    : "Click here to log in!"}
                            </Link>
                        </div>
                    </InputGroup>
                    {(this.props.error || this.props.success) && (
                        <Alert
                            color={this.props.error ? "danger" : "success"}
                            fade={false}
                        >
                            {this.props.error || this.props.success}
                        </Alert>
                    )}
                </div>
            </div>
        );
    }
}
const mapDispatchToProps = {
    passwordChanged,
    emailChanged,
    doSignUp,
    toggleUserRole,
    doSignIn,
    togglePersistent,
    doGetUserData,
    setInitialURL,
    doSignOut,
};
const mapStateToProps = (state) => {
    return {
        password: state.user.userCredentials.password,
        email: state.user.userCredentials.email,
        isLoading: state.user.loading,
        isTrainer: state.user.isTrainer,
        isAdmin: state.user.isAdmin,
        error: state.user.error,
        success: state.user.success,
        isLoggedIn: state.user.isLoggedIn,
        initialURL: state.user.initialURL,
    };
};
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withRouter(LoginPage));
