import React, { Component } from "react";
import { connect } from "react-redux";
import { Button, Modal, ModalBody, Input } from "reactstrap";
import {
    doPasswordReset,
    doSetUserName,
    doSignOut,
} from "../features/user/userSlice";

const mapDispatchToProps = {
    doPasswordReset,
    doSignOut,
    doSetUserName,
};
const mapStateToProps = (state) => {
    return {
        name: state.user.name,
    };
};
class Settings extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            name: "",
            isName: false,
        };
    }
    handleSubmit = async () => {
        if (!this.state.isName) {
            await this.props.doPasswordReset();
            await this.props.doSignOut();
        } else {
            await this.props.doSetUserName(this.state.name);
            this.setState({ showModal: false, name: "", isName: false });
        }
    };
    handleChange = (e) => {
        this.setState({ name: e.target.value });
    };
    render() {
        return (
            <div className="m-5 p-md-5">
                {!this.props.name.length ? (
                    <div className="mb-5 mx-0">
                        <p className="fs-4">Please Enter You Name :</p>
                        <div className="d-flex align-content-center">
                            <div className="m-0 me-5 p-0">
                                <Input
                                    name="name"
                                    value={this.state.name}
                                    onChange={(e) => this.handleChange(e)}
                                    className="w-100 input-focus-none"
                                />
                            </div>
                        </div>
                        <p className="my-2 text-danger">
                            Keep in mind that you wont be able to change your
                            name again!
                        </p>
                        <Button
                            className="px-4 mt-1"
                            onClick={() =>
                                this.setState({ showModal: true, isName: true })
                            }
                            disabled={!this.state.name.length}
                            color="success"
                        >
                            Save
                        </Button>
                    </div>
                ) : (
                    <div className="mb-5 mx-0 fs-4">
                        Your Name : {this.props.name}
                    </div>
                )}
                <div>
                    <p className="fs-4">This will action will sign you out!</p>
                    <Button
                        className="py-3 fw-bold d-flex"
                        onClick={() => this.setState({ showModal: true })}
                    >
                        <i className="bi bi-key-fill me-2 fw-bold" />
                        Change Password
                    </Button>
                </div>
                <Modal isOpen={this.state.showModal}>
                    <ModalBody className="p-3 row">
                        <div className="col-12 d-flex mb-3 justify-content-center">
                            Are you sure you want to continue?
                        </div>
                        <div className="col-12 d-flex gap-3 justify-content-center">
                            <Button color="success" onClick={this.handleSubmit}>
                                Yes
                            </Button>
                            <Button
                                color="danger"
                                onClick={() =>
                                    this.setState({
                                        showModal: false,
                                        isName: false,
                                    })
                                }
                            >
                                No
                            </Button>
                        </div>
                    </ModalBody>
                </Modal>
            </div>
        );
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Settings);
