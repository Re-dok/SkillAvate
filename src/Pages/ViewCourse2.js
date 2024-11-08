import React, { Component } from "react";
import {
    Offcanvas,
    OffcanvasHeader,
    OffcanvasBody,
    ListGroup,
    ListGroupItem,
    Collapse,
} from "reactstrap";
import { doGetCourseDetails } from "../features/course/courseSlice";
import { connect } from "react-redux";
import withRouter from "../Components/WithRouter";
import ContentCard from "../Components/ContentCard";

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
        console.log(this.props.openUnit);
    }
    componentDidUpdate(prevProps) {
        if (prevProps.openUnit !== this.props.openUnit) {
            const [moduleNumber, headingNumber, subHeadingNumber] =
                this.props.openUnit;
            this.setState({
                openModule: moduleNumber,
                openHeading: headingNumber,
                currentSubheading: subHeadingNumber,
            });
            console.log(this.props.openUnit);
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
        const { courseData, courseProgress } = this.props;
        const isAllowed = (newUnit) => {
            if (newUnit[0] < courseProgress[0]) {
                return true;
            } else if (newUnit[0] === courseProgress[0]) {
                if (newUnit[1] < courseProgress[1]) {
                    return true;
                } else if (newUnit[1] === courseProgress[1]) {
                    return newUnit[2] <= courseProgress[2];
                }
            }
            return false;
        };

        return (
            <div className="mt-5">
                <div className="px-2 mb-3 fs-6 fw-bold">
                    {courseData?.courseName}
                </div>
                <ListGroup>
                    {courseData?.modules?.map((module, moduleNumber) => (
                        <ListGroupItem key={moduleNumber}>
                            <div
                                role="button"
                                onClick={() => {
                                    let isOpen =
                                        this.state.openModule === moduleNumber;
                                    let code = this.handleSetIndex(
                                        isOpen,
                                        module?.content,
                                        isAllowed([moduleNumber, -1, -1])
                                    );
                                    switch (code) {
                                        case 1:
                                            let newVal = isOpen
                                                ? -1
                                                : moduleNumber;
                                            this.setState({
                                                openModule: newVal,
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
                                    "fs-6 m-0 p-2 rounded d-flex align-content-center align-items-center justify-content-between "
                                }
                            >
                                <p>
                                    Module {moduleNumber + 1}
                                    <br></br> {module.moduleName}
                                </p>
                                {module.content ? (
                                    isAllowed([moduleNumber + 1, -1, -1]) ? (
                                        <i class="bi bi-check-circle-fill"></i>
                                    ) : (
                                        <i class="bi bi-chevron-right ms-3"></i>
                                    )
                                ) : this.state.openModule === moduleNumber ? (
                                    <i class="bi bi-chevron-up ms-3"></i>
                                ) : (
                                    <i class="bi bi-chevron-down ms-3"></i>
                                )}
                            </div>
                            <Collapse
                                isOpen={this.state.openModule === moduleNumber}
                            >
                                {
                                    <div key={moduleNumber}>
                                        {module.headings?.map(
                                            (heading, headingNumber) => (
                                                <div
                                                    className="m-0 fs-6 p-0"
                                                    key={headingNumber}
                                                >
                                                    <div
                                                        className="border my-2 border-2 border-start-5 rounded-3 div-2 p-3 overflow-hidden d-flex justify-content-between align-items-center align-content-center"
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
                                                                    isAllowed([
                                                                        moduleNumber,
                                                                        headingNumber,
                                                                        -1,
                                                                    ])
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
                                                        {heading.headingName}

                                                        {heading.content ? (
                                                            isAllowed([
                                                                moduleNumber,
                                                                headingNumber +
                                                                    1,
                                                                -1,
                                                            ]) ? (
                                                                <i class="bi bi-check-circle-fill"></i>
                                                            ) : (
                                                                <i className="bi bi-chevron-right ms-3"></i>
                                                            )
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
                                                            (subheading, i) => (
                                                                <div
                                                                    key={i}
                                                                    className="ms-3 my-1 p-3 border border-2 rounded-pill d-flex align-content-center align-items-center justify-content-between"
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
                                                                                isAllowed(
                                                                                    [
                                                                                        moduleNumber,
                                                                                        headingNumber,
                                                                                        i,
                                                                                    ]
                                                                                )
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
                                                                    {isAllowed([
                                                                        moduleNumber,
                                                                        headingNumber,
                                                                        i + 1,
                                                                    ]) ? (
                                                                        <i className="bi bi-check-circle-fill ms-3"></i>
                                                                    ) : (
                                                                        <i className="bi bi-chevron-right ms-3"></i>
                                                                    )}
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

class ViewCourse2 extends Component {
    constructor(props) {
        super(props);
        this.state = {
            openUnit: [0, 0, 0],
            courseProgress: [1, 0, 0, 1],
            navbarIsOpen: false,
            qnaIsOpen: false,
        };
    }
    async componentDidMount() {
        let { courseData, doGetCourseDetails, userCourses } = this.props;
        const { courseId } = this.props.params;
        const courseProgress = userCourses.filter(
            (course) => course.courseId === courseId
        )[0].courseProgress;
        if (courseData === undefined || courseData.length === 0) {
            await doGetCourseDetails(courseId);
        }
        this.setState({
            openUnit: courseProgress,
            courseProgress: courseProgress,
        });
    }

    render() {
        if (this.props.isLoading) return <>Loading...</>;
        else {
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
                                    courseProgress={this.state.courseProgress}
                                    courseData={this.props.courseData[0]}
                                    setOpenUnit={(newUnit) => {
                                        this.setState({ openUnit: newUnit });
                                    }}
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
                    <div className="col-lg-3 d-none d-lg-block">
                        <SideBar
                            openUnit={this.state.openUnit}
                            courseProgress={this.state.courseProgress}
                            courseData={this.props.courseData[0]}
                            setOpenUnit={(newUnit) => {
                                this.setState({ openUnit: newUnit });
                            }}
                            isCanvas={false}
                        />
                    </div>
                    {/* main content*/}
                    <div className="col-lg-9 col bg-grey py-5 px-lg-5">
                        <ContentCard
                            modules={this.props.courseData[0]?.modules}
                            openUnit={this.state.openUnit}
                            courseProgress={this.state.courseProgress}
                        />
                    </div>
                </div>
            );
        }
    }
}
const mapStatesToProps = (state) => ({
    // TODO are these || working the way you think they are?
    isLoading: state.course.courseLoading || state.user.loading,
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
)(withRouter(ViewCourse2));
