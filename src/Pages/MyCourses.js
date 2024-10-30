import React, { Component } from "react";
import {
    doGetCourseDetails,
    setCurrentCourse,
} from "../features/course/courseSlice";
import { connect } from "react-redux";
import { Button, CloseButton, Collapse, Progress } from "reactstrap";
import { addCourse } from "../Firbase/firebaseCourseDB";
import withRouter from "../Components/WithRouter";

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
        };
    }
    async componentDidMount() {
        if (this.props.courseData === null) {
            await this.props.doGetCourseDetails(this.props.courseId);
        }
        const { courseName, modules, courseDiscp } = this.props.courseData;
        const courseProgressPersent = this.props.courseProgress[0];
        this.setState({
            courseName: courseName,
            modules: modules,
            progress: (100 * courseProgressPersent) / modules.length,
            courseDiscp: courseDiscp,
        });
    }
    render() {
        return (
            <div className="row">
                <div className="col-sm-6 col-12 p-3">
                    <div className="ps-3 border-start border-3">
                        <span className="fs-2 text-uppercase align-items-center d-lg-inline d-flex">
                            {this.state.courseName}
                        </span>
                        <p>{this.state.courseDiscp}</p>
                        <Button
                            className="rounded-3 p-3 mb-3 fw-bold"
                            size="sm"
                            onClick={() => {
                                this.props.setCurrentCourse(
                                    this.props.courseId
                                );
                                this.props.navigate(
                                    `/viewCourse/${this.props.courseId}`
                                );
                            }}
                        >
                            <i className="bi bi-play-circle-fill me-1"></i>{" "}
                            Continue Learning
                        </Button>
                        <div className="my-3 mt-4 fw-light">
                            {this.state.progress}% complete
                            <Progress
                                value={this.state.progress}
                                barClassName="bg-primary-o"
                                className="mt-1"
                                style={{
                                    height: "7px",
                                    width: "50%",
                                    color: "red !important",
                                }}
                            />
                        </div>
                        <div>
                            <p
                                role="button"
                                onClick={() =>
                                    this.setState({
                                        openModules: !this.state.openModules,
                                        openDetatils: -1,
                                    })
                                }
                            >
                                View modules
                                {!this.state.openModules ? (
                                    <i className="ms-2 bi bi-chevron-down"></i>
                                ) : (
                                    <i className="ms-2 bi bi-chevron-up"></i>
                                )}
                            </p>
                            <Collapse isOpen={this.state.openModules}>
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
                                                            openDetatils: -1,
                                                            openHeadings: false,
                                                        });
                                                    } else {
                                                        this.setState({
                                                            openDetatils: -1,
                                                        });
                                                        setTimeout(
                                                            () => {
                                                                this.setState({
                                                                    openDetatils:
                                                                        moduleNumber,
                                                                });
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
                                onClick={() =>
                                    this.setState({
                                        openDetatils: -1,
                                        openHeadings: false,
                                    })
                                }
                                className="fs-6"
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

                        <p
                            role="button"
                            onClick={() =>
                                this.setState({
                                    openHeadings: !this.state.openHeadings,
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
                        <Collapse isOpen={this.state.openHeadings}>
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
                                                        {heading.subheadings.map(
                                                            (subheading, i) => (
                                                                <div
                                                                    className="p-0 ps-5 m-0"
                                                                    key={i}
                                                                >
                                                                    <p className="border rounded-start-pill rounded-end-pill mb-2 border-2 rounded-3 p-2 overflow-hidden">
                                                                        <i className="ms-1 me-2 bi bi-play-circle-fill"></i>
                                                                        {
                                                                            subheading.subheadingName
                                                                        }
                                                                    </p>
                                                                </div>
                                                            )
                                                        )}
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    )
                            )}
                        </Collapse>
                    </div>
                </Collapse>
            </div>
        );
    }
}
const mapDispatchToProps = {
    doGetCourseDetails,
    setCurrentCourse,
};
const mapStateToprops = (state) => {
    return {
        isLoading: state.course.courseLoading,
        error: state.course.courseError,
        success: state.course.courseSuccess,
        courses: state.user.courses,
        courseData: state.course.course,
        courseId: state.user.courses[0]?.courseId,
        courseProgress: state.user.courses[0]?.courseProgress,
    };
};
const ConectedCourseCard = connect(
    mapStateToprops,
    mapDispatchToProps
)(withRouter(CourseCard));
class MyCourses extends Component {
    constructor(props) {
        super(props);
    }
    addCourse = () => {
        try {
            const ans = addCourse();
            alert(ans);
        } catch (err) {
            alert(err.message);
        }
    };
    render() {
        return (
            <div className="d-flex row mw-100 justify-content-center">
                <div className="col-12 col-md-10 py-5 px-5 px-md-0 d-flex gap-5 flex-column">
                    <ConectedCourseCard />
                    <ConectedCourseCard />
                    <ConectedCourseCard />
                    <ConectedCourseCard />
                    <ConectedCourseCard />
                    {/* <Button onClick={this.addCourse}>Add course</Button> */}
                </div>
            </div>
        );
    }
}
export default MyCourses;
