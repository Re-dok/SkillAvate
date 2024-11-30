import React, { Component } from "react";
import { Button, Table } from "reactstrap";
import withRouter from "../../Components/WithRouter";
import { connect } from "react-redux";
import {
    clearOtherUserCoursesInfo,
    doGetCourseDetails,
} from "../../features/course/courseSlice";
// TODO finish this page
const mapStateToprops = (state) => {
    return {
        isLoading: state.user.loading,
        error: state.user.error,
        success: state.user.success,
        myClients: state.user.myClients,
        myCourses: state.user.courses,
        courseData: state.course.course,
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
        };
    }
    async componentDidMount() {
        const myCourses = [...this.props.myCourses];
        // console.log(myCourses);
        myCourses.map(async (course) => {
            console.log(course);
            // FIXME change this to ! later
            if (course.isPublished) {
                return;
            }
            await this.props.doGetCourseDetails(course.courseId);
            this.setState((prevState) => {
                let newMycourseDetails = [...prevState.myCourseDetails];
                newMycourseDetails.push({
                    courseId: course.courseId,
                    courseName: this?.props.courseData[0]?.courseName,
                });
                console.log(newMycourseDetails);
                return { myCourseDetails: newMycourseDetails };
            }, await this.props.clearOtherUserCoursesInfo);
        });
    }
    componentDidUpdate() {
        console.log(this.state.myCourseDetails);
    }
    render() {
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
                                                    df4a4c7c-a786-449c-bb57-5e741c32f737
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
                                                    onClick={() =>
                                                        alert(
                                                            client.clientEmail,
                                                            course
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
            </div>
        );
    }
}
export default connect(
    mapStateToprops,
    mapDispatchToProps
)(withRouter(MyClients));
