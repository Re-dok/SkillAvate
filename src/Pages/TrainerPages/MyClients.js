import React, { Component } from "react";
import { Button, Table, Modal, ModalHeader } from "reactstrap";
import withRouter from "../../Components/WithRouter";
import { connect } from "react-redux";
import { getMyCourses } from "../../Firbase/firebaseCourseDB";
import { doAddCourseToUser } from "../../features/user/userSlice";

// TODO finish this page

class MyClients extends Component {
    constructor(props) {
        super(props);
        this.state = {
            myCourseDetails: [],
            showModal: false,
            modalResp: null,
            modalMessage: "",
            isAdd: true,
            currentClient: null,
            currentCourse: null,
            isLoading: false,
        };
    }
    async componentDidMount() {
        const resp = await getMyCourses(this.props.userEmail);
        const courses = resp.coursesData.map((course) => {
            if (course.isPublished) {
                return course;
            }
        });
        this.setState({ myCourseDetails: courses });
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
        const handleAddCourse = async () => {
            alert("hi");
            this.setState({ isLoading: true });
            const { currentClient, currentCourse, myCourseDetails } =
                this.state;
            const modules = myCourseDetails.filter(
                (course) => course.courseId == currentCourse
            )[0].modules;
            let firstUnitCoorditantes = () => {
                return modules[0].content
                    ? [0, -1, -1]
                    : modules.headings[0].content
                    ? [0, 0, -1]
                    : [0, 0, 0];
            };
            const courseProgress = firstUnitCoorditantes();
            const resp = await this.props.doAddCourseToUser({
                currentClient,
                currentCourse,
                courseProgress,
            });
            if (resp) this.setState({ isLoading: false });
        };
        const myClients = this.props.myClients;
        const {
            isAdd,
            showModal,
            modalMessage,
            currentCourse,
            myCourseDetails,
        } = this.state;
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
                            <tr
                                key={i}
                                className="align-content-center justify-content-center align-items-center"
                            >
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
                                        onClick={(e) => {
                                            this.setState({
                                                modalMessage:
                                                    "Please select the course you'd like to add, for your client: " +
                                                    client.clientEmail,
                                                showModal: true,
                                                isAdd: true,
                                                currentClient:
                                                    client.clientEmail,
                                            });
                                        }}
                                        className="mt-2"
                                    >
                                        <i className="bi bi-plus-circle-dotted me-2"></i>
                                        Add Course
                                    </Button>
                                </td>
                                <td className="align-content-center">
                                    {client.courses.map((courseId) => (
                                        <>
                                            <div
                                                key={courseId + "1"}
                                                className="py-2 d-flex justify-content-between align-items-center"
                                            >
                                                <p className="mb-0 me-3">
                                                    {
                                                        myCourseDetails.filter(
                                                            (course) =>
                                                                course?.courseId ===
                                                                courseId
                                                        )[0]?.courseName
                                                    }
                                                </p>
                                            </div>
                                        </>
                                    ))}
                                </td>
                                <td className="align-content-center">
                                    {client.courses.map((courseId) => (
                                        <>
                                            <div
                                                key={courseId + "2"}
                                                className="py-2 d-flex justify-content-between align-items-center"
                                            >
                                                <p className="mb-0 me-3">
                                                    {courseId}
                                                </p>
                                            </div>
                                        </>
                                    ))}
                                </td>
                                <td className="align-content-center">
                                    {client.courses.map((courseId) => (
                                        <>
                                            <div
                                                key={courseId + "3"}
                                                className=" py-2 d-flex justify-content-between align-items-center"
                                            >
                                                <Button
                                                    size="sm"
                                                    color="danger"
                                                    onClick={(e) =>
                                                        handleRemoveCourse(
                                                            e,
                                                            courseId,
                                                            client.clientEmail
                                                        )
                                                    }
                                                >
                                                    <i className="bi bi-dash-circle-dotted me-2"></i>
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
                <Modal isOpen={showModal}>
                    {!isAdd ? (
                        <ModalHeader className="d-flex justify-content-center mb-0 pb-0">
                            <i className="bi bi-exclamation-circle fw-bolder fs-1 text-danger"></i>
                        </ModalHeader>
                    ) : null}
                    <div className="pb-5 p-4 p-4 row gap-3">
                        <div className="col-12 fw-bold">{modalMessage}</div>
                        <div className="col-12 col gap-3 mx-auto d-flex paragram-text align-content-center justify-content-center align-items-center">
                            <Table responsive hover>
                                <thead>
                                    <tr>
                                        <th></th>
                                        <th>Course Name</th>
                                        <th>Courses Id</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                
                                    {myCourseDetails.map((course, i) => (
                                        <tr
                                            role="button"
                                            onClick={() => {
                                                this.setState({
                                                    currentCourse:
                                                        course.courseId,
                                                });
                                            }}
                                        >
                                            <td
                                                className={
                                                    currentCourse ===
                                                    course.courseId
                                                        ? "bg-info text-light"
                                                        : ""
                                                }
                                            >
                                                {i + 1}
                                            </td>
                                            <td
                                                className={
                                                    currentCourse ===
                                                    course.courseId
                                                        ? "bg-info text-light"
                                                        : ""
                                                }
                                            >
                                                {course.courseName}
                                            </td>
                                            <td
                                                className={
                                                    currentCourse ===
                                                    course.courseId
                                                        ? "bg-info text-light"
                                                        : ""
                                                }
                                            >
                                                {course.courseId}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </div>
                        <div className="col gap-3 mx-auto d-flex align-content-center justify-content-center align-items-center">
                            <Button
                                className="rounded-3 py-2 fw-bold"
                                size="sm"
                                color={isAdd ? "success" : "danger"}
                                onClick={() => handleAddCourse()}
                                disabled={isAdd && currentCourse === null}
                            >
                                {isAdd ? "ADD" : "Remove"}
                            </Button>
                            <Button
                                className="rounded-3 py-2 fw-bold"
                                size="sm"
                                color="warning"
                                onClick={() => {
                                    this.setState({
                                        showModal: false,
                                        modalResp: null,
                                        modalMessage: "",
                                        currentClient: null,
                                        isAdd: true,
                                        currentCourse: null,
                                    });
                                }}
                            >
                                Cancel
                            </Button>
                        </div>
                    </div>
                </Modal>
            </div>
        );
    }
}
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
    doAddCourseToUser,
};
export default connect(
    mapStateToprops,
    mapDispatchToProps
)(withRouter(MyClients));
