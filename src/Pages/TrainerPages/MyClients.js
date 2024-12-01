import React, { Component } from "react";
import { Button, Table, Modal, ModalBody, ModalHeader } from "reactstrap";
import withRouter from "../../Components/WithRouter";
import { connect } from "react-redux";
import {
    clearOtherUserCoursesInfo,
    doGetCourseDetails,
} from "../../features/course/courseSlice";
import { getMyCourses } from "../../Firbase/firebaseCourseDB";

// TODO finish this page
const mapStateToprops = (state) => {
    return {
        isLoading: state.user.loading,
        error: state.user.error,
        success: state.user.success,
        myClients: state.user.myClients,
        myCourses: state.user.courses,
        courseData: state.course.course,
        userEmail: state.user.userCredentials.email,
    };
};
const mapDispatchToProps = {
    doGetCourseDetails,
    clearOtherUserCoursesInfo,
};
class MyClients extends Component {
    constructor(props) {
        super(props);
        this.state = {
            myCourseDetails: [],
            showModal: false,
            modalResp: null,
            modalMessage: "",
            // courses: [],
        };
    }
    async componentDidMount() {
        console.log(this.props.userEmail);
        const resp = await getMyCourses(this.props.userEmail);
        const courses = resp.coursesData.map((course) => {
            if (course.isPublished) {
                return course;
            }
        });
        this.setState({ myCourseDetails: courses });
    }
    componentDidUpdate() {
        // console.log(this.state.courses);
    }
    render() {
        const handleRemoveCourse = (e, course, clientEmail) => {
            this.setState({
                modalMessage:
                    "Are you sure you want to remove course " +
                    course +
                    " from the client " +
                    clientEmail,
                showModal: true,
            });
        };
        // const ;
        const myClients = this.props.myClients;
        return (
            <div className="px-2 px-md-5 mx-2 mx-md-5 mt-5">
                <Table striped responsive>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Client Email</th>
                            <th>Course Name</th>
                            <th>Courses Id</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {myClients.map((client, i) => (
                            <tr className="align-content-center justify-content-center align-items-center">
                                <th
                                    scope="row "
                                    className="align-content-center"
                                >
                                    {i + 1}
                                </th>
                                <td className="align-content-center">
                                    <div className="">
                                        {client.clientEmail}{" "}
                                    </div>
                                    <Button
                                        size="sm"
                                        color="success"
                                        className="mt-2"
                                    >
                                        <i class="bi bi-plus-circle-dotted me-2"></i>
                                        Add Course
                                    </Button>
                                </td>
                                <td className="align-content-center">
                                    {this.state.myCourseDetails.map(
                                        (course) => (
                                            <>
                                                <div className="py-2 d-flex justify-content-between align-items-center">
                                                    <p className="mb-0 me-3">
                                                        {course.courseName}
                                                    </p>
                                                </div>
                                            </>
                                        )
                                    )}
                                </td>
                                <td className="align-content-center">
                                    {client.courses.map((course) => (
                                        <>
                                            <div className="py-2 d-flex justify-content-between align-items-center">
                                                <p className="mb-0 me-3">
                                                    {course}
                                                </p>
                                            </div>
                                        </>
                                    ))}
                                </td>
                                <td className="align-content-center">
                                    {client.courses.map((course) => (
                                        <>
                                            <div className=" py-2 d-flex justify-content-between align-items-center">
                                                <Button
                                                    size="sm"
                                                    color="danger"
                                                    onClick={(e) =>
                                                        handleRemoveCourse(
                                                            e,
                                                            course,
                                                            client.clientEmail
                                                        )
                                                    }
                                                >
                                                    <i class="bi bi-dash-circle-dotted me-2"></i>
                                                    Remove Course
                                                </Button>
                                            </div>
                                        </>
                                    ))}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
                <Modal isOpen={this.state.showModal}>
                    <ModalHeader className="d-flex justify-content-center mb-0 pb-0">
                        <i class="bi bi-exclamation-circle fw-bolder fs-1 text-danger"></i>
                    </ModalHeader>
                    <ModalBody className="pb-5 p-4 p-4 row gap-3">
                        <div className="col-12 fw-bold">
                            {this.state.modalMessage}
                        </div>
                        <div className="col gap-3 mx-auto d-flex align-content-center justify-content-center align-items-center">
                            <Button
                                className="rounded-3 py-2 fw-bold"
                                size="sm"
                                color="danger"
                                onClick={() => {
                                    this.setState(
                                        {
                                            showModal: false,
                                            modalMessage: "",
                                        },
                                        alert("add remove logic")
                                    );
                                }}
                            >
                                Remove
                            </Button>
                            <Button
                                className="rounded-3 py-2 fw-bold"
                                size="sm"
                                color="warning"
                                onClick={() => {
                                    this.setState({
                                        showModal: false,
                                        modalMessage: "",
                                    });
                                }}
                            >
                                Cancel
                            </Button>
                        </div>
                    </ModalBody>
                </Modal>
            </div>
        );
    }
}
export default connect(
    mapStateToprops,
    mapDispatchToProps
)(withRouter(MyClients));
