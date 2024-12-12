import React, { Component } from "react";
import {
    clearOtherUserCoursesInfo,
    doGetCourseDetails,
    doGetMyCourses,
    doPublishCourse,
    doUnpublishCourse,
} from "../../features/course/courseSlice";
import { connect } from "react-redux";
import {
    Button,
    CloseButton,
    Collapse,
    Modal,
    ModalBody,
    Nav,
} from "reactstrap";
import { addCourse } from "../../Firbase/firebaseCourseDB";
import withRouter from "../../Components/WithRouter";
import AddCourse from "../../Components/TrainerComponets/AddCourse";
class CourseCard extends Component {
    // props = courseId,courseProgress
    constructor(props) {
        super(props);
        this.state = {
            courseName: null,
            courseDiscp: null,

            createrName: null,

            modules: [],
            // view module details
            openDetatils: -1,
            // view modules
            openModules: false,
            // course overview

            test: true,
            modalMessage: "",
            modalResp: false,
            showModal: false,
            isLoading: false,
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
            const { courseName, modules, courseDiscp, createrName } =
                courseData;
            this.setState({
                courseName: courseName,
                modules: modules,

                createrName: createrName,

                courseDiscp: courseDiscp,
            });
        }
    }
    render() {
        if (this.props.isLoading === null || this.props.isLoading === true)
            return <>loading......</>;
        else {
            const { modalResp, modalMessage, showModal, isLoading } =
                this.state;
            const handleTogglePublish = async () => {
                this.setState({ isLoading: true });
                // setTimeout(() => {
                if (this.props.isPublished) {
                    const resp = await this.props.doUnpublishCourse(
                        this.props.courseId
                    );
                    if (resp.error) {
                        this.setState({
                            isLoading: false,
                            modalResp: true,
                            modalMessage:
                                "Somthing went wrong! Please try again!",
                        });
                    } else {
                        this.setState({
                            isLoading: false,
                            modalResp: true,
                            modalMessage: "UnPublished!",
                        });
                    }
                } else {
                    const resp = await this.props.doPublishCourse(
                        this.props.courseId
                    );
                    if (resp.error) {
                        this.setState({
                            isLoading: false,
                            modalResp: true,
                            modalMessage:
                                "Somthing went wrong! Please try again!",
                        });
                    } else {
                        this.setState({
                            isLoading: false,
                            modalResp: true,
                            modalMessage: "Published!",
                        });
                    }
                }
            };
            return (
                <div className="row">
                    <div className="col-sm-6 col-12 p-3">
                        <div className="ps-3 border-start border-3">
                            <span className="fs-2 text-uppercase align-items-center d-lg-inline d-flex">
                                {this.state.courseName}
                            </span>
                            <p>{this.state.courseDiscp}</p>
                            <p>
                                by : <strong>{this.state.createrName}</strong>
                            </p>
                            <div>
                                <Button
                                    className="rounded-3 p-3 mb-3 fw-bold me-lg-3 me-2"
                                    size="sm"
                                    onClick={() => {
                                        this.props.isPublished
                                            ? this.props.navigate(
                                                  `/view/${this.props.courseId}`
                                              )
                                            : this.props.navigate(
                                                  `/editCourse/${this.props.courseId}`
                                              );
                                        this.props.clearOtherUserCoursesInfo(
                                            this.props.courseId
                                        );
                                    }}
                                >
                                    <i className="bi bi-play-circle-fill me-1"></i>{" "}
                                    {this.props.isPublished
                                        ? "View Course"
                                        : "Continue Editing"}
                                </Button>

                                <Button
                                    className="rounded-3 p-3 mb-3 fw-bold"
                                    size="sm"
                                    onClick={() => {
                                        this.props.isPublished
                                            ? this.setState({
                                                  showModal: true,
                                                  modalMessage: "Are you sure?",
                                              })
                                            : this.setState({
                                                  showModal: true,
                                                  modalMessage: "Are you sure?",
                                              });
                                    }}
                                    disabled={
                                        !this.props.isPublished &&
                                        this.state.modules.length === 0
                                    }
                                    color={
                                        this.props.isPublished
                                            ? "danger"
                                            : "success"
                                    }
                                >
                                    {/* <i className="bi bi-play-circle-fill me-1"></i>{" "} */}
                                    {this.props.isPublished ? (
                                        <>
                                            {/* <i class="bi bi-radioactive"></i> */}
                                            <i class="bi bi-x-octagon-fill me-2"></i>
                                            UnPublish
                                        </>
                                    ) : (
                                        <>
                                            <i class="bi bi-globe me-2"></i>
                                            Publish
                                        </>
                                    )}
                                </Button>
                            </div>
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
                                    <p className="d-inline-block mb-0">
                                        Module Overview {"  "}
                                        <i className="bi bi-chevron-down"></i>
                                    </p>

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
                                </>
                            )}
                        </div>
                    </Collapse>
                    <Modal isOpen={showModal}>
                        <ModalBody>
                            <div className="row gap-3 mx-auto d-flex justify-content-center">
                                <div className="col-12 d-flex justify-content-center">
                                    {modalMessage}
                                </div>
                                <div className="col-12 d-flex justify-content-center">
                                    {!modalResp && (
                                        <Button
                                            className="rounded-3 py-2 fw-bold me-3"
                                            size="sm"
                                            color="success"
                                            disabled={isLoading}
                                            onClick={handleTogglePublish}
                                        >
                                            {isLoading ? "Loading..." : "Yes"}
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
                                                modalMessage: "",
                                            })
                                        }
                                    >
                                        {modalResp ? "Close" : " Cancel"}
                                    </Button>
                                </div>
                            </div>
                        </ModalBody>
                    </Modal>
                </div>
            );
        }
    }
}
const mapDispatchToProps = {
    doGetCourseDetails,
    clearOtherUserCoursesInfo,
    doPublishCourse,
    doUnpublishCourse,

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
const mapDispatchToPropsCourseCard = {
    doGetMyCourses,
};
const mapStateToPropsForMyCourses = (state) => {
    return {
        userEmail: state.user.userCredentials.email,
        courses: state.course.course,
    };
};
class TrainerCourses extends Component {
    constructor(props) {
        super(props);
        this.state = {
            openPublishedCourse: false,
            publishedCoursesArePresent: false,
            unPublishedCoursesArePresent: false,
            courses: [],
        };
    }
    //TODO Make a button and the corresponding page to make an 'add course' page
    // TODO remove me later once the admin pages add Course is done
    addCourse = () => {
        try {
            const ans = addCourse();
            alert(ans);
        } catch (err) {
            alert(err.message);
        }
    };
    async componentDidMount() {
        window.scrollTo(0, 0);
        await this.props.doGetMyCourses();
        // const courses = await getMyCourses(this.props.userEmail);
        // this.setState({ courses: courses.coursesData });
    }
    render() {
        const {
            openPublishedCourse,
            publishedCoursesArePresent,
            unPublishedCoursesArePresent,
        } = this.state;
        const notePresence = (ofPublished) => {
            if (ofPublished && !publishedCoursesArePresent)
                this.setState({ publishedCoursesArePresent: true });
            if (!ofPublished && !unPublishedCoursesArePresent)
                this.setState({ unPublishedCoursesArePresent: true });
        };
        return (
            <div className="d-flex row mw-100 justify-content-center">
                <div className="col-12 col-md-10 pt-3 px-5 px-md-0">
                    <Nav>
                        <div
                            role="button"
                            className={
                                "nav-text me-3 " +
                                (!openPublishedCourse
                                    ? "border-bottom border-5 border-primary-color"
                                    : "")
                            }
                            onClick={() =>
                                this.setState({
                                    openPublishedCourse: false,
                                })
                            }
                        >
                            Unannouced
                        </div>
                        <div
                            role="button"
                            onClick={() =>
                                this.setState({
                                    openPublishedCourse: true,
                                })
                            }
                            className={
                                "nav-text " +
                                (openPublishedCourse
                                    ? "border-bottom border-5 border-primary-color"
                                    : "")
                            }
                        >
                            Published
                        </div>
                    </Nav>
                </div>
                <div className="col-12 col-md-10 py-5 px-5 px-md-0 d-flex gap-5 flex-column">
                    {!openPublishedCourse && <AddCourse />}
                    {this.props.courses.map((course, courseNumber) => {
                        if (course.isPublished === openPublishedCourse) {
                            notePresence(openPublishedCourse);
                            return (
                                <ConectedCourseCard
                                    key={courseNumber}
                                    courseId={course.courseId}
                                    isPublished={course.isPublished}
                                />
                            );
                        } else return <></>;
                    })}
                    {openPublishedCourse &&
                        !this.state.publishedCoursesArePresent && (
                            <>Nothing here!</>
                        )}
                    {!openPublishedCourse &&
                        !this.state.unPublishedCoursesArePresent && (
                            <>Nothing here!</>
                        )}
                </div>
            </div>
        );
    }
}
export default connect(
    mapStateToPropsForMyCourses,
    mapDispatchToPropsCourseCard
)(TrainerCourses);
