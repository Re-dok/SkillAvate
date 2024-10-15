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

// tODO add signup
// tODO add role check box to sign UP

// tODO add a msg section

//check multiple signups with same email is possible
//nop

//tODO add sign in with email and the respective html
//tODO add password reset, verify email logic
//TODO can we customize the verify email and password reset pages?
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
        /// check if the state isLoggedIn is true
        if (this.props.isLoggedIn) {
            // yes handle it and nav to home if initented is empty or login page
            const { isAdmin, isTrainer } = this.props;
            this.props.navigate(
                isAdmin ? "/admin" : isTrainer ? "/trainer" : "/client"
            );
            // no?
            // wait for login, fetch details,nav accordingly
            // check before navgating if intended url is not empty, if so nav them there else to home
        }
    }

    handleSubmit = async () => {
        this.props.setEnableAuth(false);
        const { email } = this.props;
        if (!this.state.isLogin) {
            await this.props.doSignUp();
        } else {
            if(!email) return;
            await this.props.doSignIn();
            await this.props.doGetUserData(email);
            const { isTrainer, isAdmin, success, navigate } = this.props;
            if (success) {
                if (
                    this.props.initialURL === "/" ||
                    this.props.initialURL === null ||
                    this.props.initialURL === "/resetPassword"
                )
                    navigate(
                        isAdmin ? "/admin" : isTrainer ? "/trainer" : "/client"
                    );
                else {
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
        // TODO check and impliment user role signup
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
    doSignOut
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
