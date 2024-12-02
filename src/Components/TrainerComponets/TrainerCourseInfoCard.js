import React, { Component } from "react";
import { Button, Input, FormFeedback, Modal, ModalBody } from "reactstrap";
export default class TrainerCourseInfoCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            newCourseDiscp: null,
            newCourseName: null,
            showModal: false,
            hasUnsavedChanges: false,
        };
    }
    render() {
        if (!this.props.courseName) return <>Loading...</>;

        const handleDiscardChanges = () => {
            this.setState({
                newCourseDiscp: null,
                newCourseName: null,
                showModal: false,
                hasUnsavedChanges: false,
            });
        };
        function isValidSubmission() {
            if (newCourseName && newCourseDiscp) return true;
            return false;
        }
        const onChangeValue = (e) => {
            let { name, value } = e.target;
            const { hasUnsavedChanges } = this.state;
            if (hasUnsavedChanges) this.setState({ [name]: value });
            else this.setState({ [name]: value, hasUnsavedChanges: true });
        };
        const onBlurValue = (e) => {
            let { name, value } = e.target;
            // Trim leading and trailing whitespace on blur
            this.setState({
                [name]: value?.replace(/\s+/g, " ").trim() || "",
            });
        };
        const handleSubmit = () => {
            alert("add this feature");
            if (!isValidSubmission(newCourseName, newCourseDiscp)) {
                this.setState({ showModal: true });
                return;
            }
            // const newContent = {
            //     videoLink: newVideoLink,
            //     docLink: newDocLink,
            //     writeUp: newWriteUp,
            //     test: newTest,
            // };
            // const headingName = newHeading;
            // const moduleDiscp = newModuleDiscp;
            // this.props.doUpdateCourseUnit({
            //     newContent,
            //     headingName,
            //     moduleDiscp,
            //     moduleIndex: [i, j, k],
            // });
        };

        const { courseDiscp, courseName, courseId, createrEmail, createrName } =
            this.props;
        const { hasUnsavedChanges } = this.state;
        const newCourseName =
            this.state.newCourseName !== null
                ? this.state.newCourseName
                : courseName;
        const newCourseDiscp =
            this.state.newCourseDiscp !== null
                ? this.state.newCourseDiscp
                : courseDiscp;
        return (
            <div className="mx-lg-5 mt-5 py-5 rounded px-lg-4 px-2 bg-grey">
                <div className="fw-bold fs-3 mb-3">Course Details</div>
                <div className=" mb-5 mt-3 mt-md-0 mb-md-3 row justify-content-end row-cols-md-6 px-3 rounded row gap-3">
                    <Button
                        disabled={!hasUnsavedChanges}
                        color="success"
                        className="col"
                        onClick={handleSubmit}
                    >
                        Save
                    </Button>
                    <Button
                        disabled={!hasUnsavedChanges}
                        color="danger"
                        className="col"
                        onClick={handleDiscardChanges}
                    >
                        <i className="bi bi-trash me-2" />
                        Discard
                    </Button>
                </div>
                <div className="fw-bold mb-3">
                    <i className="bi bi-pencil-fill me-2"></i>
                    Edit Course Name :
                    <Input
                        rows="1"
                        required
                        className="mt-1 py-2 mb-0 border-0 border-bottom border-3"
                        value={newCourseName}
                        placeholder="Heading Here!"
                        name="newCourseName"
                        onChange={onChangeValue}
                        invalid={newCourseName.length === 0}
                        onBlur={onBlurValue}
                    />
                    <FormFeedback invalid>
                        A Name for this Course is Required!
                    </FormFeedback>
                </div>
                <div className="fw-bold mb-5">
                    <i className="bi bi-pencil-fill me-2"></i>
                    Edit Module Discription :
                    <Input
                        rows="4"
                        required
                        className="mt-1 py-2 mb-0 border-0 border-bottom border-3"
                        value={newCourseDiscp}
                        placeholder="Heading Here!"
                        name="newCourseDiscp"
                        onChange={onChangeValue}
                        invalid={newCourseDiscp.length === 0}
                        onBlur={onBlurValue}
                    />
                    <FormFeedback invalid>
                        Course Discription is Required!
                    </FormFeedback>
                </div>
                <div className="fw-bold mb-3">Course ID: {courseId}</div>
                <div className="fw-bold mb-3">
                    Instructor Name: {createrName}
                </div>
                <div className="fw-bold mb-3">
                    Instructor Email: {createrEmail}
                </div>
                <Modal
                    isOpen={this.state.showModal}
                    toggle={() => this.setState({ showModal: false })}
                >
                    <ModalBody className="pb-3 rounded p-4 justify-content-center">
                        <p className="d-flex justify-content-center mb-2">
                            Please ensure all necessary fields are filled in.
                        </p>
                        <div className="col gap-3 mx-auto d-flex justify-content-center">
                            <Button
                                className="rounded-3 py-2 fw-bold"
                                size="sm"
                                color="warning"
                                onClick={() =>
                                    this.setState({ showModal: false })
                                }
                            >
                                Close
                            </Button>
                        </div>
                    </ModalBody>
                </Modal>
            </div>
        );
    }
}
