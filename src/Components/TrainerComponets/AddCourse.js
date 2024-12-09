import React, { Component } from "react";
import { connect } from "react-redux";
import { Button, Modal, Input, FormFeedback } from "reactstrap";
import { doCreateCourse } from "../../features/course/courseSlice";
class AddCourse extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: !true,
            modalMessage: "",
            isLoading: false,
            newCourseDiscp: "",
            newCourseName: "",
            modalResp: false,
        };
    }
    render() {
        const {
            showModal,
            isLoading,
            modalMessage,
            modalResp,
            newCourseDiscp,
            newCourseName,
        } = this.state;
        const onBlurValue = (e) => {
            let { name, value } = e.target;
            // Trim leading and trailing whitespace on blur
            this.setState({
                [name]: value?.replace(/\s+/g, " ").trim() || "",
            });
        };
        const onChangeValue = (e) => {
            let { name, value } = e.target;
            this.setState({ [name]: value });
        };
        const handleAddCourse = async () => {
            this.setState({ isLoading: true, modalResp: true });
            const { newCourseDiscp, newCourseName } = this.state;

            const resp = await this.props.doCreateCourse({
                courseName: newCourseName,
                courseDiscp: newCourseDiscp,
            });
            if (resp.error) {
                this.setState({
                    isLoading: false,
                    modalMessage:
                        "Somthing went wrong! Please try again!\n(Make sure you have filled in your name in the settings page!",
                });
            } else
                this.setState({
                    isLoading: false,
                    modalMessage: "Course Created!",
                });
        };
        return (
            <div className="row m-0">
                <Button
                    className="col-7 col-md-3 col-lg-2 text-white bg-primary-o"
                    onClick={() =>
                        this.setState({
                            showModal: true,
                            modalMessa:
                                "Please fill this information to add a course",
                        })
                    }
                >
                    {" "}
                    <i class="bi bi-plus me-2"></i>Add Course
                </Button>
                <Modal isOpen={showModal} size={!modalMessage ? "lg" : "md"}>
                    <div className="pb-5 p-4 p-4 row gap-3">
                        <div className="col-12 fw-bold row justify-content-center">
                            {modalMessage}
                            {!modalMessage && (
                                <>
                                    Please fill this information to add a course
                                    <Input
                                        rows="1"
                                        required
                                        className="mt-1 py-2 mb-0 border-0 border-bottom border-3"
                                        value={newCourseName}
                                        placeholder="Course Name Here!"
                                        name="newCourseName"
                                        onChange={onChangeValue}
                                        invalid={newCourseName.length === 0}
                                        onBlur={onBlurValue}
                                    />
                                    <FormFeedback invalid>
                                        A Name for this Course is Required!
                                    </FormFeedback>
                                    <Input
                                        rows="4"
                                        required
                                        className="mt-1 py-2 mb-0 mt-3 border-0 border-bottom border-3"
                                        value={newCourseDiscp}
                                        placeholder="Course Discription Here!"
                                        name="newCourseDiscp"
                                        onChange={onChangeValue}
                                        invalid={newCourseDiscp.length === 0}
                                        onBlur={onBlurValue}
                                    />
                                    <FormFeedback invalid>
                                        Course Discription is Required!
                                    </FormFeedback>
                                </>
                            )}
                        </div>
                        <div className="col gap-3 mx-auto d-flex justify-content-center">
                            {!modalResp && (
                                <Button
                                    className="rounded-3 py-2 fw-bold"
                                    size="sm"
                                    color="success"
                                    disabled={
                                        newCourseDiscp.length === 0 ||
                                        newCourseName.length === 0 ||
                                        isLoading
                                    }
                                    onClick={handleAddCourse}
                                >
                                    {isLoading ? "Loading..." : "ADD"}
                                </Button>
                            )}
                            <Button
                                className="rounded-3 py-2 fw-bold"
                                size="sm"
                                color="warning"
                                disabled={isLoading}
                                onClick={() =>
                                    this.setState({
                                        showModal: false,
                                        isLoading: false,
                                        modalResp: false,
                                        newCourseDiscp: "",
                                        newCourseName: "",
                                        modalMessage: "",
                                    })
                                }
                            >
                                {modalResp ? "Close" : " Cancel"}
                            </Button>
                        </div>
                    </div>
                </Modal>
            </div>
        );
    }
}
const mapDispatchToProps = {
    doCreateCourse,
};
export default connect(null, mapDispatchToProps)(AddCourse);
