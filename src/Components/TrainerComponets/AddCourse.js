import React, { Component } from "react";
import {
    Button,
    Modal,
    Input,
    FormFeedback,
} from "reactstrap";
class AddCourse extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: !true,
            modalMessage: "",
            isLoading: false,
            newCourseDiscp: "",
            newCourseName: "",
        };
    }
    render() {
        const {
            showModal,
            isLoading,
            modalMessage,
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
        const handleAddCourse = () => {
            this.setState({ isLoading: true });
            setTimeout(() => {
                this.setState({
                    modalMessage:
                        "Course Added! You can edit it in the 'Unannounced' section",
                    isLoading: false,
                });
            }, 2000);
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
                            {!modalMessage && (
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
                                        modalMessage: "",
                                        newCourseDiscp: "",
                                        newCourseName: "",
                                    })
                                }
                            >
                                {modalMessage ? "Close" : " Cancel"}
                            </Button>
                        </div>
                    </div>
                </Modal>
            </div>
        );
    }
}
export default AddCourse;
