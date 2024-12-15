import React, { Component } from "react";
import {
    clearOtherUserCoursesInfo,
    doGetCourseDetails,
} from "../Features/course/courseSlice";
import { connect } from "react-redux";
import { CloseButton, Collapse } from "reactstrap";
import withRouter from "../Components/WithRouter";
import { getAdminCourses } from "../Firebase/firebaseUserDB";
class CourseCard extends Component {
    // props = courseId,courseProgress
    constructor(props) {
        super(props);
        this.state = {
            courseName: null,
            courseDiscp: null,
            progress: 0,
            modules: [],
            // view module details
            openDetatils: -1,
            // view modules
            openModules: false,
            // course overview
            openHeadings: false,
            test: true,
        };
    }

    async componentDidMount() {
        const currentCourseId = this.props.courseId;
        let courseData = this.props.coursesData.filter(
            (course) => course.courseId === currentCourseId
        );
        if (courseData.length === 0) {
            await this.props.doGetCourseDetails(currentCourseId);
        }
        courseData = this.props.coursesData.filter(
            (course) => course.courseId === currentCourseId
        )[0];
        if (courseData) {
            const { courseName, modules, courseDiscp } = courseData;
            this.setState({
                courseName: courseName,
                modules: modules,
                courseDiscp: courseDiscp,
            });
        }
    }
    render() {
        if (this.props.isLoading === null || this.props.isLoading === true)
            return <>loading......</>;
        else {
            return (
                <div className="row">
                    <div className="col-sm-6 col-12 p-3">
                        <div className="ps-3 border-start border-3">
                            <span className="fs-2 text-uppercase align-items-center d-lg-inline d-flex">
                                {this.state.courseName}
                            </span>
                            <p>{this.state.courseDiscp}</p>
                            <div>
                                <p
                                    role="button"
                                    onClick={() =>
                                        this.setState({
                                            openModules:
                                                !this.state.openModules,
                                            openDetatils: -1,
                                        })
                                    }
                                >
                                    Modules
                                </p>
                                <Collapse isOpen={true}>
                                    {this.state.modules.map(
                                        (module, moduleNumber) => (
                                            <p
                                                key={moduleNumber}
                                                className="ps-5 my-3 fw-3"
                                            >
                                                <span
                                                    onClick={() => {
                                                        if (
                                                            this.state
                                                                .openDetatils ===
                                                            moduleNumber
                                                        ) {
                                                            this.setState({
                                                                openDetatils:
                                                                    -1,
                                                                openHeadings: false,
                                                            });
                                                        } else {
                                                            this.setState({
                                                                openDetatils:
                                                                    -1,
                                                            });
                                                            setTimeout(
                                                                () => {
                                                                    this.setState(
                                                                        {
                                                                            openDetatils:
                                                                                moduleNumber,
                                                                        }
                                                                    );
                                                                },
                                                                this.state
                                                                    .openDetatils ===
                                                                    -1
                                                                    ? 0
                                                                    : 550
                                                            );
                                                        }
                                                    }}
                                                    role="button"
                                                >
                                                    {module.moduleName}
                                                    {this.state.openDetatils !==
                                                    moduleNumber ? (
                                                        <i className="ms-2 fs-6 d-inline-block bi bi-info-circle"></i>
                                                    ) : (
                                                        <i className="ms-2 fs-6 bi bi-x-circle"></i>
                                                    )}
                                                </span>
                                            </p>
                                        )
                                    )}
                                </Collapse>
                            </div>
                        </div>
                    </div>
                    <Collapse
                        isOpen={this.state.openDetatils !== -1}
                        className="col-sm-6 col-12 order-first order-sm-last"
                    >
                        <div className="border shadow rounded-3 p-4 border-3 position-relative">
                            <div className="position-absolute top-0 end-0 d-flex justify-content-end m-2">
                                <CloseButton
                                    className="fs-6"
                                    onClick={() =>
                                        this.setState({
                                            openDetatils: -1,
                                            openHeadings: false,
                                        })
                                    }
                                ></CloseButton>
                            </div>
                            {this.state.modules.map(
                                (module, i) =>
                                    i === this.state.openDetatils && (
                                        <p className="fs-4 mb-0" key={i}>
                                            {module.moduleName}
                                        </p>
                                    )
                            )}
                            {this.state.modules.map(
                                (module, i) =>
                                    i === this.state.openDetatils && (
                                        <p
                                            className="p-2 ps-0 mt-0 overflow-hidden"
                                            key={i}
                                        >
                                            {module.moduleDiscp}
                                        </p>
                                    )
                            )}
                            {this.state.modules[this.state.openDetatils]
                                ?.headings && (
                                <>
                                    <p
                                        role="button"
                                        onClick={() =>
                                            this.setState({
                                                openHeadings:
                                                    !this.state.openHeadings,
                                            })
                                        }
                                        className="d-inline-block mb-0"
                                    >
                                        Module Overview {"  "}
                                        {this.state.openHeadings ? (
                                            <i className="bi bi-chevron-up"></i>
                                        ) : (
                                            <i className="bi bi-chevron-down"></i>
                                        )}
                                    </p>

                                    <Collapse isOpen={true}>
                                        {this.state.modules.map(
                                            (module, moduleNumber) =>
                                                moduleNumber ===
                                                    this.state.openDetatils && (
                                                    <div key={moduleNumber}>
                                                        {module.headings.map(
                                                            (heading, i) => (
                                                                <div
                                                                    className="m-0 p-0 ps-2"
                                                                    key={i}
                                                                >
                                                                    <p className="my-2 mb-0 p-2 ps-3 overflow-hidden">
                                                                        <i class="bi bi-dot"></i>{" "}
                                                                        {
                                                                            heading.headingName
                                                                        }
                                                                    </p>
                                                                    {heading?.subheadings && (
                                                                        <div className="d-inline-flex justify-content-start flex-column">
                                                                            {heading?.subheadings?.map(
                                                                                (
                                                                                    subheading,
                                                                                    i
                                                                                ) => (
                                                                                    <div
                                                                                        className="border rounded-pill mb-2 ms-5 border-2 px-3 py-2 overflow-hidden d-inline-block"
                                                                                        key={
                                                                                            i
                                                                                        }
                                                                                    >
                                                                                        {
                                                                                            subheading.subheadingName
                                                                                        }
                                                                                    </div>
                                                                                )
                                                                            )}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            )
                                                        )}
                                                    </div>
                                                )
                                        )}
                                    </Collapse>
                                </>
                            )}
                        </div>
                    </Collapse>
                </div>
            );
        }
    }
}
const mapDispatchToProps = {
    doGetCourseDetails,
    clearOtherUserCoursesInfo,
};
const mapStateToprops = (state) => {
    return {
        isLoading: state.course.courseLoading,
        error: state.course.courseError,
        success: state.course.courseSuccess,
        coursesData: state.course.course,
    };
};
const ConectedCourseCard = connect(
    mapStateToprops,
    mapDispatchToProps
)(withRouter(CourseCard));
const mapStateToPropsForMyCourses = (state) => {
    return {
        courses: state.user.courses,
    };
};
class ExplorePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            courses: [],
        };
    }
    async componentDidMount() {
        window.scrollTo(0, 0);
        const resp = await getAdminCourses(this.props.courses);
        if (!resp.error) this.setState({ courses: resp.courses });
    }
    render() {
        return (
            <div className="d-flex row mw-100 justify-content-center">
                <div className="col-12 col-md-10 py-5 px-5 px-md-0 d-flex gap-5 flex-column">
                    {this.state.courses?.map((course, courseNumber) => (
                        <ConectedCourseCard
                            key={courseNumber}
                            courseId={course.courseId}
                            courseProgress={course.courseProgress}
                        />
                    ))}
                    {!this.state.courses.length && (
                        <div>
                            <p>Nothing To Explore!</p>
                            <p>
                                We will let you know when new courses are
                                available
                            </p>
                        </div>
                    )}
                </div>
            </div>
        );
    }
}
export default connect(mapStateToPropsForMyCourses, null)(ExplorePage);
