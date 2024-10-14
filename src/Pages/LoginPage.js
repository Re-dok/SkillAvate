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
    getUserData,
} from "../features/user/userSlice";
import { doSignUp } from "../features/user/userSlice";
import { connect } from "react-redux";

// tODO add signup
// tODO add role check box to sign UP

// tODO add a msg section

//check multiple signups with same email is possible
//nop

//tODO add sign in with email and the respective html
//tODO add password reset, verify email logic
//TODO can we customize the verify email and password reset pages?
import { auth } from "../Firbase/fireaseConfig";
import withRouter from "../Components/WithRouter";

class LoginPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLogin: true,
            passwordType: "password",
        };
    }

    handleSubmit = async () => {
        this.props.setEnableAuth(false);
        console.log("here for 2nd: " + this.props.enabledAuth);
        const { email, password, isTrainer, isPersistent } = this.props;
        if (!this.state.isLogin) {
            await this.props.doSignUp({
                email,
                password,
                isTrainer,
                isPersistent,
            });
            setTimeout(() => {
                window.location.reload();
            }, 5000);
        } else {
            await this.props.doSignIn({ email, password });
            // to use the latest values we destruncture the props again
            await this.props.getUserData(email);
            const { isTrainer, isAdmin, success, navigate } = this.props;
            if (success) {
                console.log("LOGGED IN");
                navigate(
                    isAdmin ? "/admin" : isTrainer ? "/trainer" : "/client"
                );
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
            // not a real prop, used to connect to store
            this.props.passwordChanged(e.target.value);
        // not a real prop, used to connect to store
        else this.props.emailChanged(e.target.value);
    };
    render() {
        const isDisabled =
            !this.props.email || !this.props.password || this.state.isLoading;
        // TODO remove this ->
        // if(false) return (<>lol</>)
        //     else
        return (
            <div className="d-flex min-vh-100 justify-content-center align-items-center">
                <div
                    className="border rounded shadow p-5 mx-auto justify-content-center align-items-center w-lg-25 d-flex flex-column gap-3"
                    style={{ width: "30%", minWidth: "340px" }}
                >
                    <h2>{this.state.isLogin ? "Login" : "Sign Up"}</h2>
                    <InputGroup className="gap-0 d-flex flex-column ">
                        {/* FIXME dont focus on select */}
                        <Label>Email address</Label>
                        <Input
                            name="email"
                            onChange={(e) => this.handleChange(e)}
                            className="w-100"
                        />
                    </InputGroup>
                    <InputGroup className="gap-0 d-flex flex-column">
                        <Label>Password</Label>
                        <InputGroup className="d-flex flex-row border rounded border-2">
                            <Input
                                name="password"
                                onChange={(e) => this.handleChange(e)}
                                type={this.state.passwordType}
                                className="border-0"
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
                                    //FIXME add persitant login
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
                            <div className="w-100 mb-3 d-flex flex-row justify-content-evenly align-content-center">
                                {/* FIXME should be lined up from the left */}
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
                        <Alert color={this.props.error ? "danger" : "success"}>
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
    getUserData,
    getUserData,
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
        isPersistent: state.user.isPersistent,
    };
};
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withRouter(LoginPage));
