import React, { Component } from "react";
import { Button, Input, InputGroup, Label, Alert } from "reactstrap";
import { emailChanged, doPasswordReset } from "../features/user/userSlice";
import { connect } from "react-redux";

// tODO add signup
// tODO add role check box to sign UP

// tODO add a msg section

//check multiple signups with same email is possible
//nop

//tODO add sign in with email and the respective html
//tODO add password reset, verify email logic
// can we customize the verify email and password reset pages?

class ResetPassword extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    handleSubmit = async () => {
        //   tODO add forgot password logic
        const { email } = this.props;
        // alert("hi1");
        await this.props.doPasswordReset({ email });
        // alert("h7");
    };
    handleChange = (e) => {
        this.props.emailChanged(e.target.value);
    };
    render() {
        const isDisabled = !this.props.email || this.state.isLoading;
        return (
            <div className="d-flex min-vh-100 justify-content-center align-items-center">
                <div
                    className="border rounded shadow p-5 mx-auto justify-content-center align-items-center w-lg-25 d-flex flex-column gap-3"
                    style={{ width: "30%", minWidth: "340px" }}
                >
                    <h2>Forgot your password?</h2>
                    <InputGroup className="gap-0 d-flex flex-column ">
                        <Label>Email address</Label>
                        <Input
                            name="email"
                            onChange={(e) => this.handleChange(e)}
                            className="w-100"
                        />
                    </InputGroup>
                    <Button
                        className="w-100 mb-2 py-2"
                        disabled={isDisabled}
                        color="primary"
                        onClick={this.handleSubmit}
                    >
                        {this.props.isLoading ? "Loading" : "Reset Password"}
                    </Button>
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
    emailChanged,
    doPasswordReset,
};
const mapStateToProps = (state) => {
    return {
        email: state.user.userCredentials.email,
        isLoading: state.user.loading,
        error: state.user.error,
        success: state.user.success,
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(ResetPassword);
