import React, { Component } from "react";
import ReactPlayer from "react-player";
import {
    Pagination,
    PaginationItem,
    PaginationLink,
    Badge,
    Button,
    Alert,
} from "reactstrap";
import { doGetCourseDetails } from "../features/course/courseSlice";
import { connect } from "react-redux";
import withRouter from "../Components/WithRouter";
class QuestionCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            o: true,
        };
    }
    render() {
        return (
            <div className="border border-1 rounded rounded-3 bg-white">
                <div className="border-bottom border-1 py-2 d-flex justify-content-between">
                    <div className="d-inline">
                        <i class="bi bi-chevron-left border-end border-2 p-2"></i>
                        <i class="bi bi-chevron-right border-2 border-end p-2 me-3"></i>
                        <p className="fw-bold d-inline">Question 1/3</p>
                    </div>
                    <Badge color="warning" pill className="me-3 text-dark">
                        <i class="bi bi-exclamation-circle-fill me-1"></i>
                        Mandatery
                    </Badge>
                    {/* <Badge color="info" className="me-3">
                        <i class="bi bi-check-circle-fill me-2"></i>
                        Completed
                    </Badge> */}
                </div>
                <div className="p-3 py-4">
                    <p className="fw-bold">Question 1</p>
                    <p className="fw-light">What is 3 times 3?</p>
                </div>
                <div className="p-3 pb-0 d-flex border-top border-2">
                    <i class="bi bi-circle me-2 fw-light"></i>
                    <p className="fw-light">Option One</p>
                </div>
                <div className="p-3 pb-0 d-flex border-top border-2">
                    <i class="bi bi-circle me-2 fw-light"></i>
                    <p className="fw-light">Option Two</p>
                </div>
                <div className="p-3 pb-0 d-flex border-top border-2 bg-secodary-o">
                    <i class="bi bi-record-circle me-2 fw-light"></i>
                    <p className="fw-light">Option Three</p>
                </div>
                <div className="p-3 pb-0 d-flex border-top border-2">
                    <i class="bi bi-circle me-2 fw-light"></i>
                    <p className="fw-light">Option Four</p>
                </div>
                <div className="border-top border-1 px-4 py-3 d-flex flex-row-reverse justify-content-between">
                    <Button color="info" className="text-light">
                        Submit
                    </Button>
                </div>
                <Alert color="primary" className="mx-2" isOpen={!this.state.o}>
                    This is a primary alert — check it out!
                </Alert>
            </div>
        );
    }
}
class ViewCourse1 extends Component {
    constructor(props) {
        super(props);
        this.state = {
            openUnit: [0, 0, 0],
            courseProgress: [0, 0, 0, -1],
        };
    }
    async componentDidMount() {
        let { courseData, doGetCourseDetails } = this.props;
        const { courseId } = this.props.params;
        if (!courseData) {
            await doGetCourseDetails(courseId);
        }
        // const {openUnit}=this.props.
        this.setState({ openUnit: [1, 1, 1], courseProgress: [1, 1, 1, 1] });
    }
    componentDidUpdate() {}
    render() {
        const text =
            "Elit reprehenderit esse laboris dolor veniam laborum est ullamco cupidatat proident in. Nisi occaecat commodo exercitation commodo ea anim commodo. Duis laborum ipsum adipisicing ad. Ipsum exercitation officia elit duis. Pariatur commodo nisi officia ex exercitation ex aliqua enim. Ad elit eu veniam non laborum commodo.\nLaboris consectetur magna elit et dolore occaecat magna Lorem adipisicing ea. Amet quis nulla est consectetur enim sit. Labore enim est occaecat proident consectetur eiusmod qui in adipisicing et pariatur proident consectetur. Elit occaecat fugiat anim esse ex ullamco nisi ipsum magna elit labore. Proident veniam in irure non qui consectetur in do ullamco commodo ad. Lorem culpa consequat quis non dolor incididunt enim. Reprehenderit irure aute qui do ea minim.\nReprehenderit enim duis enim magna nulla aliqua excepteur magna enim laborum commodo. Adipisicing esse pariatur excepteur exercitation ullamco. Labore dolor non culpa irure eu sunt id. Aliqua ea enim esse veniam proident nostrud pariatur mollit nisi dolore aliqua fugiat adipisicing commodo. Ipsum deserunt est eu tempor nostrud consectetur laborum et. Anim velit commodo ut enim minim sunt. Duis velit sunt proident quis ex nisi.";
        return (
            <div className="row m-0">
                <div className="col-lg-2 d-none d-lg-block"></div>
                <div className="col-lg-7 col bg-grey py-5 px-4">
                    <div className="fw-bold mb-3">
                        This is the heading for this section
                    </div>
                    <div>
                        <ReactPlayer
                            url={"https://www.youtube.com/watch?v=TBIjgBVFjVI"}
                            width={"100%"}
                            controls
                        ></ReactPlayer>
                    </div>
                    <p className="paragram-text rounded fw-light bg-white p-4 my-3">
                        {text}
                    </p>
                    <QuestionCard></QuestionCard>
                </div>
                <div className="col-lg-3 d-none d-lg-block  "></div>
            </div>
        );
    }
}
const mapStatesToProps = (state) => ({
    isLoading: state.course.courseLoading || state.user.loading,
    error: state.course.courseError || state.user.error,
    success: state.course.courseSuccess || state.user.success,
    currentCourse: state.course.currentCourse,
    courseData: state.course.course,
});
const mapDispatchToProps = {
    doGetCourseDetails,
};
export default connect(
    mapStatesToProps,
    mapDispatchToProps
)(withRouter(ViewCourse1));
