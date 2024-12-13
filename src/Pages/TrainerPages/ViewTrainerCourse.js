import React, { Component } from "react";
import {
    Offcanvas,
    OffcanvasHeader,
    OffcanvasBody,
    ListGroup,
    ListGroupItem,
    Collapse,
} from "reactstrap";
import { doGetCourseDetails } from "../../features/course/courseSlice";
import { connect } from "react-redux";
import withRouter from "../../Components/WithRouter";
import ViewContentCard from "../../Components/TrainerComponets/ViewContentCard";

class SideBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            openModule: -1,
            openHeading: -1,
            currentSubheading: -1,
        };
    }
    componentDidMount() {
        const [moduleNumber, headingNumber, subHeadingNumber] =
            this.props.openUnit;
        this.setState({
            openModule: moduleNumber,
            openHeading: headingNumber,
            currentSubheading: subHeadingNumber,
        });
    }
    componentDidUpdate(prevProps) {
        if (prevProps.openUnit !== this.props.openUnit) {
            const [moduleNumber, headingNumber, subHeadingNumber] =
                this.props.openUnit;
            if (prevProps.openUnit[3] !== this.props.openUnit[3])
                window.scrollTo(0, 0);
            this.setState({
                openModule: moduleNumber,
                openHeading: headingNumber,
                currentSubheading: subHeadingNumber,
            });
        }
    }

    handleSetIndex(isOpen, hasContent, isAllowed) {
        if (isOpen) {
            if (hasContent) return 0;
            else return 1;
        } else {
            if (hasContent) {
                if (isAllowed) {
                    return 2;
                } else {
                    return 0;
                }
            } else {
                return 1;
            }
        }
    }

    render() {
        const { courseData, unitType } = this.props;
        if (!this.props.courseData) return <>Loading</>;
        else {
            return (
                <div className="mt-5">
                    <div className="px-2 mb-3 fs-6 fw-bold">
                        {courseData?.courseName}
                    </div>
                    <div
                        role="button"
                        className={
                            "fs-6 mb-3 p-2 py-3 border border-2 rounded d-flex align-content-center align-items-center justify-content-between" +
                            (unitType === 1 ? " bg-secondary text-white" : "")
                        }
                        onClick={() => {
                            this.props.setOpenUnit([-1, -1, -1], 1);
                            this.setState({
                                openModule: -1,
                                openHeading: -1,
                                currentSubheading: -1,
                            });
                            if (this.props.isCanvas) this.props.toggleSideBar();
                        }}
                    >
                        Course Details
                        <i className="bi bi-chevron-right ms-3"></i>
                    </div>
                    <ListGroup>
                        {courseData?.modules?.map((module, moduleNumber) => (
                            <ListGroupItem
                                key={moduleNumber}
                                className="p-0 border-0"
                            >
                                <div
                                    role="button"
                                    onClick={() => {
                                        let isOpen =
                                            this.state.openModule ===
                                            moduleNumber;
                                        let code = this.handleSetIndex(
                                            isOpen,
                                            module?.content,
                                            true
                                        );
                                        switch (code) {
                                            case 1:
                                                let newVal = isOpen
                                                    ? -1
                                                    : moduleNumber;
                                                this.setState({
                                                    openModule: newVal,
                                                    openHeading: -1,
                                                    currentSubheading: -1,
                                                });
                                                break;
                                            case 2:
                                                this.props.setOpenUnit([
                                                    moduleNumber,
                                                    -1,
                                                    -1,
                                                ]);
                                                if (this.props.isCanvas)
                                                    this.props.toggleSideBar();
                                                break;
                                            default:
                                                break;
                                        }
                                    }}
                                    className={
                                        "fs-6 mb-1 p-2 border border-2 rounded d-flex align-content-center align-items-center justify-content-between "
                                    }
                                >
                                    <p>
                                        Module {moduleNumber + 1}
                                        <br></br> {module.moduleName}
                                    </p>
                                    {module.content ? (
                                        <i className="bi bi-chevron-right ms-3"></i>
                                    ) : this.state.openModule ===
                                      moduleNumber ? (
                                        <i className="bi bi-chevron-up ms-3"></i>
                                    ) : (
                                        <i className="bi bi-chevron-down ms-3"></i>
                                    )}
                                </div>
                                <Collapse
                                    isOpen={
                                        this.state.openModule === moduleNumber
                                    }
                                >
                                    {
                                        <div
                                            key={moduleNumber}
                                            className="mb-3"
                                        >
                                            {module.headings?.map(
                                                (heading, headingNumber) => (
                                                    <div
                                                        className="m-0 ms-2 fs-6 p-0"
                                                        key={headingNumber}
                                                    >
                                                        <div
                                                            className={
                                                                "border mb-1 border-2 div-2 p-3 overflow-hidden d-flex justify-content-between align-items-center align-content-center "
                                                            }
                                                            role="button"
                                                            onClick={() => {
                                                                let isOpen =
                                                                    this.state
                                                                        .openModule ===
                                                                        moduleNumber &&
                                                                    this.state
                                                                        .openHeading ===
                                                                        headingNumber;
                                                                let code =
                                                                    this.handleSetIndex(
                                                                        isOpen,
                                                                        heading?.content,
                                                                        true
                                                                    );
                                                                switch (code) {
                                                                    case 1:
                                                                        let newVal =
                                                                            isOpen
                                                                                ? -1
                                                                                : headingNumber;
                                                                        this.setState(
                                                                            {
                                                                                openModule:
                                                                                    moduleNumber,
                                                                                openHeading:
                                                                                    newVal,
                                                                                currentSubheading:
                                                                                    -1,
                                                                            }
                                                                        );
                                                                        break;
                                                                    case 2:
                                                                        this.props.setOpenUnit(
                                                                            [
                                                                                moduleNumber,
                                                                                headingNumber,
                                                                                -1,
                                                                            ]
                                                                        );
                                                                        if (
                                                                            this
                                                                                .props
                                                                                .isCanvas
                                                                        )
                                                                            this.props.toggleSideBar();
                                                                        break;
                                                                    default:
                                                                        break;
                                                                }
                                                            }}
                                                        >
                                                            {
                                                                heading.headingName
                                                            }

                                                            {heading.content ? (
                                                                <i className="bi bi-chevron-right ms-3"></i>
                                                            ) : (
                                                                <i className="bi bi-chevron-down ms-3"></i>
                                                            )}
                                                        </div>
                                                        <Collapse
                                                            isOpen={
                                                                this.state
                                                                    .openModule ===
                                                                    moduleNumber &&
                                                                this.state
                                                                    .openHeading ===
                                                                    headingNumber
                                                            }
                                                        >
                                                            {heading.subheadings?.map(
                                                                (
                                                                    subheading,
                                                                    i
                                                                ) => (
                                                                    <div
                                                                        key={i}
                                                                        className={
                                                                            "ms-3 my-1 p-3 border border-2 rounded-pill d-flex align-content-center align-items-center justify-content-between "
                                                                        }
                                                                        role="button"
                                                                        onClick={() => {
                                                                            let isOpen =
                                                                                this
                                                                                    .state
                                                                                    .currentSubheading ===
                                                                                i;
                                                                            let code =
                                                                                this.handleSetIndex(
                                                                                    isOpen,
                                                                                    true,
                                                                                    true
                                                                                );
                                                                            switch (
                                                                                code
                                                                            ) {
                                                                                case 2:
                                                                                    this.props.setOpenUnit(
                                                                                        [
                                                                                            moduleNumber,
                                                                                            headingNumber,
                                                                                            i,
                                                                                        ]
                                                                                    );
                                                                                    if (
                                                                                        this
                                                                                            .props
                                                                                            .isCanvas
                                                                                    )
                                                                                        this.props.toggleSideBar();
                                                                                    break;
                                                                                default:
                                                                                    break;
                                                                            }
                                                                        }}
                                                                    >
                                                                        {
                                                                            subheading.subheadingName
                                                                        }
                                                                        <i className="bi bi-chevron-right ms-3"></i>
                                                                    </div>
                                                                )
                                                            )}
                                                        </Collapse>
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    }
                                </Collapse>
                            </ListGroupItem>
                        ))}
                    </ListGroup>
                </div>
            );
        }
    }
}

class ViewCourse extends Component {
    constructor(props) {
        super(props);
        this.state = {
            openUnit: [-1, -1, -1],
            navbarIsOpen: false,
            qnaIsOpen: false,
            unitType: 1,
        };
    }
    async componentDidMount() {
        window.scrollTo(0, 0);
        let { courseData, doGetCourseDetails } = this.props;
        const { courseId } = this.props.params;
        if (courseData === undefined || courseData.length === 0) {
            await doGetCourseDetails(courseId);
        }
    }
    render() {
        if (this.props.isLoading || !this.props.courseData[0])
            return <>Loading...</>;
        else {
            const { unitType } = this.state;
            const {
                courseName,
                courseId,
                createrName,
                createrEmail,
                courseDiscp,
            } = this.props.courseData[0];
            return (
                <div className="row m-0">
                    {/* Button for sidebar on mobile */}
                    <div
                        color="primary"
                        role="button"
                        className="border col-auto position-absolute end-0 border-4 shadow rounded-pill p-2 px-3 d-lg-none d-inline-flex align-items-center align-content-center flex-wrap me-2"
                        onClick={() =>
                            this.setState({
                                navbarIsOpen: !this.state.navbarIsOpen,
                            })
                        }
                    >
                        <i className="me-2 bi bi-list"></i>
                        Navigate
                    </div>
                    {/* sidebar for mobiles and tabs*/}
                    <div id={"offcanvasContainer"} className="d-lg-none">
                        <Offcanvas
                            isOpen={this.state.navbarIsOpen}
                            container={"offcanvasContainer"}
                        >
                            <OffcanvasHeader
                                toggle={() =>
                                    this.setState({
                                        navbarIsOpen: !this.state.navbarIsOpen,
                                    })
                                }
                            >
                                Close Nabar
                            </OffcanvasHeader>
                            <OffcanvasBody>
                                <SideBar
                                    openUnit={this.state.openUnit}
                                    courseData={this.props.courseData[0]}
                                    setOpenUnit={(newUnit, unitType = 0) => {
                                        this.setState({
                                            openUnit: newUnit,
                                            unitType: unitType,
                                        });
                                    }}
                                    unitType={this.state.unitType}
                                    toggleSideBar={() => {
                                        this.setState({
                                            navbarIsOpen:
                                                !this.state.navbarIsOpen,
                                        });
                                    }}
                                    isCanvas={true}
                                />
                            </OffcanvasBody>
                        </Offcanvas>
                    </div>
                    {/* sideBar for computers */}
                    <div className="col-lg-3 d-none d-lg-block"></div>
                    <div className="col-lg-3 d-none d-lg-block h-100 overflow-y-scroll position-fixed pb-5 mb-5">
                        <SideBar
                            openUnit={this.state.openUnit}
                            courseData={this.props.courseData[0]}
                            setOpenUnit={(newUnit, unitType = 0) => {
                                this.setState({
                                    openUnit: newUnit,
                                    unitType: unitType,
                                });
                            }}
                            unitType={this.state.unitType}
                            isCanvas={false}
                        />
                        <div className="my-5"></div>
                    </div>
                    {/* main content*/}
                    <div className="col-lg-9 col bg-grey py-5 px-lg-5">
                        {unitType === 0 && (
                            <ViewContentCard
                                modules={this.props.courseData[0]?.modules}
                                openUnit={this.state.openUnit}
                                courseName={
                                    this.props.courseData[0]?.courseName
                                }
                                createrName={
                                    this.props.courseData[0]?.createrName
                                }
                            />
                        )}
                        {unitType === 1 && (
                            <div className="mx-lg-5 mt-5 py-5 rounded px-lg-4 px-2 bg-grey">
                                <div className="fw-bold fs-3 mb-3">
                                    Course Details
                                </div>
                                <div className="fw-bold mb-3">
                                    Course Name: {courseName}
                                </div>
                                <div className="fw-bold mb-3">
                                    Course Discription: {courseDiscp}
                                </div>
                                <div className="fw-bold mb-3">
                                    Course ID: {courseId}
                                </div>
                                <div className="fw-bold mb-3">
                                    Instructor Name: {createrName}
                                </div>
                                <div className="fw-bold mb-3">
                                    Instructor Email: {createrEmail}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            );
        }
    }
}
const mapStatesToProps = (state) => ({
    // TODO are these || working the way you think they are?
    isLoading: state.course.courseLoading,
    error: state.course.courseError || state.user.error,
    success: state.course.courseSuccess || state.user.success,
    courseData: state.course.course,
    userCourses: state.user.courses,
});
const mapDispatchToProps = {
    doGetCourseDetails,
};
export default connect(
    mapStatesToProps,
    mapDispatchToProps
)(withRouter(ViewCourse));
