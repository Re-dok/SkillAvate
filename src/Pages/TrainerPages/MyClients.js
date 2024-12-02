import React, { Component } from "react";
import { Button, Table, Modal, ModalHeader } from "reactstrap";
import withRouter from "../../Components/WithRouter";
import { connect } from "react-redux";
import { getMyCourses } from "../../Firbase/firebaseCourseDB";
import {
    doAddCourseToUser,
    doRemoveCourseFromUser,
} from "../../features/user/userSlice";

class MyClients extends Component {
    constructor(props) {
        super(props);
        this.state = {
            myCourseDetails: [],
            showModal: false,
            modalResp: false,
            modalMessage: "",
            isAdd: true,
            currentClient: null,
            currentCourse: null,
            isLoading: false,
        };
    }
    async componentDidMount() {
        const resp = await getMyCourses(this.props.userEmail);
        const courses = resp.coursesData.filter((course) => {
            return course.isPublished;
        });
        this.setState({ myCourseDetails: courses });
    }
    render() {
        const handleRemoveCourse = async () => {
            this.setState({ isLoading: true });
            const { currentClient, currentCourse } = this.state;
            const resp = await this.props.doRemoveCourseFromUser({
                currentClient,
                currentCourse,
            });

            if (!resp.error)
                this.setState({
                    isLoading: false,
                    modalResp: true,
                    modalMessage: "Course Removed Successfully!",
                });
            else
                this.setState({
                    isLoading: false,
                    modalResp: true,
                    modalMessage: "Somthing went wrong, please try again!",
                });
        };
        const handleAddCourse = async () => {
            this.setState({ isLoading: true });
            const { currentClient, currentCourse, myCourseDetails } =
                this.state;
            const modules = myCourseDetails.filter(
                (course) => course.courseId === currentCourse
            )[0].modules;
            let firstUnitCoorditantes = () => {
                if (modules[0]?.content) return [0, -1, -1];
                else {
                    if (modules[0]?.headings[0]?.content) return [0, 0, -1];
                    return [0, 0, 0];
                }
            };
            const courseProgress = firstUnitCoorditantes();
            const resp = await this.props.doAddCourseToUser({
                currentClient,
                currentCourse,
                courseProgress,
            });
            if (!resp.error)
                this.setState({
                    isLoading: false,
                    modalResp: true,
                    modalMessage: "Course Added Successfully!",
                });
            else
                this.setState({
                    isLoading: false,
                    modalResp: true,
                    modalMessage: "Somthing went wrong, please try again!",
                });
        };
        const myClients = this.props.myClients;
        const {
            isAdd,
            showModal,
            modalMessage,
            currentCourse,
            myCourseDetails,
            isLoading,
            modalResp,
            currentClient,
        } = this.state;
        const avaiableCoursesForEnroll = () => {
            const courses = myClients.filter(
                (client) => client.clientEmail === currentClient
            )[0].courses;
            return myCourseDetails.filter((course) => {
                return !courses.includes(course.courseId);
            });
        };
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
                                        onClick={() => {
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
                                                    onClick={() => {
                                                        this.setState({
                                                            modalMessage:
                                                                "Are you sure you want to remove course " +
                                                                courseId +
                                                                " from the client " +
                                                                client.clientEmail,
                                                            showModal: true,
                                                            isAdd: false,
                                                            currentClient:
                                                                client.clientEmail,
                                                            currentCourse:
                                                                courseId,
                                                        });
                                                    }}
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
                <Modal
                    isOpen={showModal}
                    size={!modalResp && isAdd ? "lg" : "md"}
                >
                    {!isAdd && !modalResp ? (
                        <ModalHeader className="d-flex justify-content-center mb-0 pb-0">
                            <i className="bi bi-exclamation-circle fw-bolder fs-1 text-danger"></i>
                        </ModalHeader>
                    ) : null}
                    <div className="pb-5 p-4 p-4 row gap-3">
                        <div className="col-12 fw-bold d-flex justify-content-center">
                            {modalMessage}
                        </div>
                        <div className="col-12 col gap-3 mx-auto d-flex paragram-text align-content-center justify-content-center align-items-center">
                            {isAdd && !modalResp && (
                                currentClient &&
                                    avaiableCoursesForEnroll().length !== 0 ? (
                                        <>
                                        <Table responsive hover size="lg">
                                            <thead>
                                                <tr>
                                                    <th></th>
                                                    <th>Course Name</th>
                                                    <th>Courses Id</th>
                                                    <th></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {avaiableCoursesForEnroll().map(
                                                    (course, i) => (
                                                        <tr
                                                            role="button"
                                                            onClick={() => {
                                                                this.setState({
                                                                    currentCourse:
                                                                        course.courseId,
                                                                });
                                                            }}
                                                            key={i+"5"}
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
                                                                {
                                                                    course.courseName
                                                                }
                                                            </td>
                                                            <td
                                                                className={
                                                                    currentCourse ===
                                                                    course.courseId
                                                                        ? "bg-info text-light"
                                                                        : ""
                                                                }
                                                            >
                                                                {
                                                                    course.courseId
                                                                }
                                                            </td>
                                                        </tr>
                                                    )
                                                )}
                                            </tbody>
                                            </Table>
                                        </>
                                    ) : (
                                        <>No Courses Left UnEnrolled</>
                                    )
                            )}
                        </div>
                        <div className="col gap-3 mx-auto d-flex justify-content-center">
                            {!modalResp && (
                                <Button
                                    className="rounded-3 py-2 fw-bold"
                                    size="sm"
                                    color={isAdd ? "success" : "danger"}
                                    onClick={() =>
                                        isAdd
                                            ? handleAddCourse()
                                            : handleRemoveCourse()
                                    }
                                    disabled={
                                        (isAdd && currentCourse === null) ||
                                        isLoading
                                    }
                                >
                                    {isLoading
                                        ? "Loading..."
                                        : isAdd
                                        ? "ADD"
                                        : "Remove"}
                                </Button>
                            )}
                            <Button
                                className="rounded-3 py-2 fw-bold"
                                size="sm"
                                color="warning"
                                disabled={isLoading}
                                onClick={() => {
                                    this.setState({
                                        showModal: false,
                                        modalResp: false,
                                        modalMessage: "",
                                        currentClient: null,
                                        isAdd: true,
                                        currentCourse: null,
                                    });
                                }}
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
    doRemoveCourseFromUser,
};
export default connect(
    mapStateToprops,
    mapDispatchToProps
)(withRouter(MyClients));
