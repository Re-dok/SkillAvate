import React, { Component } from "react";
import { Button, Input, InputGroup, Label, Alert } from "reactstrap";
import { emailChanged, doPasswordReset } from "../Features/user/userSlice";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

class ResetPassword extends Component {
    constructor(props) {
        super(props);
    }
    handleSubmit = async () => {
        await this.props.doPasswordReset();
    };
    handleChange = (e) => {
        this.props.emailChanged(e.target.value);
    };
    render() {
        const isDisabled = !this.props.email || this.props.isLoading;
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
                            className="w-100 input-focus-none"
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
                        <Alert
                            color={this.props.error ? "danger" : "success"}
                            fade={false}
                        >
                            {this.props.error || this.props.success}
                        </Alert>
                    )}
                    <div className="gap-2 d-flex align-content-center">
                        <Link to="/" className="text-decoration-none">
                            Go back to Login ?
                        </Link>
                    </div>
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
        isLoading: state.user.loading,
        error: state.user.error,
        success: state.user.success,
        email: state.user.userCredentials.email,
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(ResetPassword);
