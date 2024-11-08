import React, { Component } from "react";
import ReactPlayer from "react-player";
import {
    Badge,
    Button,
    Alert,
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
class QuestionCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            alertIsOpen: true,
            currentQuestion: 1,
            selectedOptions: null,
            // TODO add logic to only allow submission when all questions are attempted AND unlock tests only after the video is watched
            isDisabled: true,
        };
    }
    nextQuestion = () => {
        if (this.state.currentQuestion < this.props.test.length) {
            this.setState({ currentQuestion: this.state.currentQuestion + 1 });
        }
    };
    prevQuestion = () => {
        if (this.state.currentQuestion > 1) {
            this.setState({ currentQuestion: this.state.currentQuestion - 1 });
        }
    };
    handleSubmit = () => {
        alert("add submit logic");
    };
    render() {
        if (this.props.test.length === 0) return <>Nothing</>;
        const { completedQuestions } = this.props;
        const { currentQuestion } = this.state;
        const { question, options } = this.props.test[currentQuestion - 1];
        const numberOfQuestions = this.props.test.length || 0;
        const isDisabled = this.state.isDisabled;
        return (
            <div className="border border-1 rounded rounded-3 bg-white">
                <div className="border-bottom border-1 py-2 d-flex justify-content-between">
                    <div className="d-inline">
                        <i
                            onClick={this.prevQuestion}
                            style={{
                                cursor:
                                    this.state.currentQuestion > 1
                                        ? "pointer"
                                        : "not-allowed",
                            }}
                            className="bi bi-chevron-left border-end border-2 p-2"
                        ></i>
                        <i
                            onClick={this.nextQuestion}
                            style={{
                                cursor:
                                    this.state.currentQuestion <
                                    numberOfQuestions
                                        ? "pointer"
                                        : "not-allowed",
                            }}
                            className="bi bi-chevron-right border-2 border-end p-2 me-3"
                        ></i>
                        <p className="fw-bold d-inline">
                            Question {currentQuestion}/{numberOfQuestions}
                        </p>
                    </div>
                    {
                        <Badge
                            color={completedQuestions ? "info" : "warning"}
                            pill
                            className="me-3 text-dark"
                        >
                            {completedQuestions ? (
                                <i className="bi bi-check-circle-fill me-2"></i>
                            ) : (
                                <i className="bi bi-exclamation-circle-fill me-1"></i>
                            )}
                            {completedQuestions ? "Completed" : "Mandatery"}
                        </Badge>
                    }
                </div>
                <div className="p-3 py-4">
                    <p className="fw-bold">Question {currentQuestion} </p>
                    <p className="fw-light">{question}</p>
                </div>
                {options.map((option, optionNumber) => (
                    <div
                        className="p-3 pb-0 d-flex border-top border-2"
                        key={optionNumber}
                    >
                        <i className="bi bi-circle me-2 fw-light"></i>
                        <p className="fw-light">{option}</p>
                    </div>
                ))}
                <div
                    className="border-top border-1 px-4 py-3 d-flex flex-row-reverse justify-content-between"
                    onClick={() => {
                        if (!isDisabled) {
                            if (currentQuestion !== numberOfQuestions) {
                                this.nextQuestion();
                            } else {
                                this.handleSubmit();
                            }
                        }
                    }}
                >
                    <Button color="info" className="text-light" disabled>
                        {currentQuestion !== numberOfQuestions
                            ? "Next"
                            : "Submit"}
                    </Button>
                </div>
                <Alert
                    color="primary"
                    className="mx-2"
                    isOpen={!this.state.alertIsOpen}
                >
                    This is a primary alert — check it out!
                </Alert>
            </div>
        );
    }
}

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
            this.setState({
                openModule: moduleNumber,
                openHeading: headingNumber,
                currentSubheading: subHeadingNumber,
            });
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
                                    if (!module.content) {
                                        let newVal;
                                        if (
                                            this.state.openModule ===
                                            moduleNumber
                                        ) {
                                            newVal = -1;
                                        } else {
                                            newVal = moduleNumber;
                                        }
                                        this.setState({
                                            openHeading: -1,
                                            currentSubheading: -1,
                                        });
                                        this.setState({ openModule: newVal });
                                    } else if (
                                        isAllowed([moduleNumber, -1, -1])
                                    ) {
                                        this.setState({
                                            openModule: moduleNumber,
                                            openHeading: -1,
                                            currentSubheading: -1,
                                        });
                                        this.props.setOpenUnit([
                                            moduleNumber,
                                            -1,
                                            -1,
                                        ]);
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
                                                            if (
                                                                !heading.content
                                                            ) {
                                                                let newVal;
                                                                if (
                                                                    this.state
                                                                        .openHeading ===
                                                                    headingNumber
                                                                ) {
                                                                    newVal = -1;
                                                                } else {
                                                                    newVal =
                                                                        headingNumber;
                                                                }
                                                                this.setState({
                                                                    openHeading:
                                                                        newVal,
                                                                    openUnit:
                                                                        -1,
                                                                    currentSubheading:
                                                                        -1,
                                                                });
                                                            } else if (
                                                                isAllowed([
                                                                    moduleNumber,
                                                                    headingNumber,
                                                                    -1,
                                                                ])
                                                            ) {
                                                                this.props.setOpenUnit(
                                                                    [
                                                                        moduleNumber,
                                                                        headingNumber,
                                                                        -1,
                                                                    ]
                                                                );
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
                                                                        if (
                                                                            isAllowed(
                                                                                [
                                                                                    moduleNumber,
                                                                                    headingNumber,
                                                                                    i,
                                                                                ]
                                                                            )
                                                                        ) {
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
                                                                            ) {
                                                                                this.props.toggleSideBar();
                                                                            }
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
class ContentCard extends Component {
    openReadingAssignment = (docLink) => {
        window.open(docLink, "_blank");
    };
    render() {
        if (this.props.modules === undefined) return <>loading</>;
        else {
            const modules = this.props.modules;
            const i = this.props.openUnit[0];
            const j = this.props.openUnit[1];
            const k = this.props.openUnit[2];
            const t = this.props.openUnit[3];
            const { content, heading } = (() => {
                let content, heading;
                if (modules[i].content) {
                    content = modules[i].content;
                    heading = modules[i].moduleName;
                } else if (modules[i].headings[j].content) {
                    content = modules[i].headings[j].content;
                    heading = modules[i].headings[j].headingName;
                } else {
                    content = modules[i].headings[j].subheadings[k].content;
                    heading =
                        modules[i].headings[j].subheadings[k].subheadingName;
                }
                return { content, heading };
            })();
            // console.log(content);
            const writeUp = content.writeUp;
            const docLink = content.docLink;
            const videoLink = content.videoLink;
            const test = content.test;
            const completed = () => {
                return true;
            };
            return (
                <div className="mx-lg-5 px-lg-4">
                    {heading && <div className="fw-bold mb-3">{heading}</div>}

                    {videoLink && (
                        <div className="rounded position-relative fw-light bg-white mb-4">
                            <div className="p-4">
                                <i className="bi bi-camera-reels me-2"></i>
                                Lecture Assignment
                                {
                                    <Badge
                                        color={
                                            completed(1) ? "info" : "warning"
                                        }
                                        pill
                                        className="position-absolute end-0 text-dark me-md-4 me-2"
                                    >
                                        {completed(1) ? (
                                            <i className="bi bi-check-circle-fill me-2"></i>
                                        ) : (
                                            <i className="bi bi-exclamation-circle-fill me-1"></i>
                                        )}
                                        {completed(1)
                                            ? "Completed"
                                            : "Mandatery"}
                                    </Badge>
                                }
                            </div>
                            <ReactPlayer
                                url={videoLink || ""}
                                width={"100%"}
                                controls
                            ></ReactPlayer>
                        </div>
                    )}
                    {/* TODO add the docLink condition later on when you have added it to the db */}
                    {/* {docLink && ( */}
                    <div>
                        <div
                            role="button"
                            onClick={() => this.openReadingAssignment(docLink)}
                            className="rounded rounded-pill col-md-5 position-relative fw-light bg-white p-4"
                        >
                            <i className="bi bi-journal-bookmark me-2"></i>
                            Reading Assignment
                            {
                                <Badge
                                    color={completed(1) ? "info" : "warning"}
                                    pill
                                    className="position-absolute end-0 text-dark me-4"
                                >
                                    {completed(1) ? (
                                        <i className="bi bi-check-circle-fill me-2"></i>
                                    ) : (
                                        <i className="bi bi-exclamation-circle-fill me-1"></i>
                                    )}
                                    {completed(1) ? "Completed" : "Mandatery"}
                                </Badge>
                            }
                        </div>
                    </div>
                    {/* )} */}

                    {writeUp && (
                        <p className="paragram-text rounded fw-light bg-white p-4 my-3 mb-5">
                            {writeUp}
                        </p>
                    )}
                    <QuestionCard
                        test={test || []}
                        completedQuestions={completed(3)}
                    />
                </div>
            );
        }
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
        if (!this.props.courseData) return <>Loading...</>;
        else {
            // const completed = (badgeType) => {
            //     if (moduleNumber < courseProgress[0]) {
            //         return true;
            //     } else if (moduleNumber === courseProgress[0]) {
            //         if (headingNumber < courseProgress[1]) {
            //             return true;
            //         } else {
            //             if (subHeadingNumber < courseProgress[2]) {
            //                 return true;
            //             }

            //             return badgeType <= courseProgress[3];
            //         }
            //     }
            //     return false;
            // };
            return (
                <div className="row m-0">
                    {/* Button for sidebar on mobile */}
                    {/* <div className="col-12 d-flex d-lg-none justify-content-between px-2 mb-3">
                        <div
                            color="primary"
                            role="button"
                            className="border border-4 shadow rounded-pill p-2 px-3 d-inline-flex align-items-center align-content-center flex-wrap"
                            onClick={() =>
                                this.setState({
                                    navbarIsOpen: !this.state.navbarIsOpen,
                                })
                            }
                        >
                            <i className="me-2 bi bi-list"></i>
                            Navigate
                        </div>
                        <div
                            color="primary"
                            role="button"
                            className="border border-4 shadow rounded-pill p-2 px-3 d-inline-flex align-items-center align-content-center flex-wrap"
                            onClick={() =>
                                this.setState({
                                    qnaIsOpen: !this.state.qnaIsOpen,
                                })
                            }
                        >
                            <i className="me-2 bi bi-chat-right-dots"></i>
                            Q&A
                        </div>
                    </div> */}
                    {/* sidebar for mobiles*/}
                    {/* <div id={"offcanvasContainer"} className="d-lg-none">
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
                                        this.setState({
                                            openUnit: newUnit,
                                        });
                                    }}
                                    isCanvas={true}
                                    toggleSideBar={() =>
                                        this.setState({
                                            navbarIsOpen:
                                                !this.state.navbarIsOpen,
                                        })
                                    }
                                />
                            </OffcanvasBody>
                        </Offcanvas>
                        <Offcanvas
                            isOpen={this.state.qnaIsOpen}
                            direction="end"
                            container={"offcanvasContainer"}
                        >
                            <OffcanvasHeader
                                toggle={() =>
                                    this.setState({
                                        qnaIsOpen: !this.state.qnaIsOpen,
                                    })
                                }
                            >
                                <p className="mb-0">
                                    <i className="me-2 bi bi-chat-right-dots mb-0"></i>
                                    Close Q&A
                                </p>
                            </OffcanvasHeader>
                            <OffcanvasBody>
                                <strong>This is the QNA body.</strong>
                            </OffcanvasBody>
                        </Offcanvas>
                    </div> */}
                    {/* sideBar for computers */}
                    <div className="col-lg-3 d-none d-lg-block">
                        <SideBar
                            openUnit={this.state.openUnit}
                            courseProgress={this.state.courseProgress}
                            courseData={this.props.courseData}
                            setOpenUnit={(newUnit) => {
                                this.setState({ openUnit: newUnit });
                            }}
                        />
                    </div>

                    {/* main content code */}
                    <div className="col-lg-9 col bg-grey py-5 px-lg-5">
                        <ContentCard
                            modules={this.props.courseData.modules}
                            openUnit={this.state.openUnit}
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
    courseData: state.course.course[0],
    userCourses: state.user.courses,
});
const mapDispatchToProps = {
    doGetCourseDetails,
};
export default connect(
    mapStatesToProps,
    mapDispatchToProps
)(withRouter(ViewCourse2));
