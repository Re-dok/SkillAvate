import React, { Component } from "react";
import ReactPlayer from "react-player";
import {
    Badge,
    Button,
    Alert,
    // Accordion,
    // AccordionBody,
    // AccordionHeader,
    // AccordionItem,
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
            console.log(this.props.courseProgress);
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
                    {courseData?.modules.map((module, moduleNumber) => (
                        <ListGroupItem key={moduleNumber}>
                            <p
                                style={{ cursor: "pointer" }}
                                onClick={() => {
                                    let newVal;
                                    if (
                                        this.state.openModule === moduleNumber
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
                                }}
                                className="fs-6 m-0 py-2"
                            >
                                Module {moduleNumber + 1}
                                <br></br> {module.moduleName}
                            </p>
                            <Collapse
                                isOpen={this.state.openModule === moduleNumber}
                            >
                                {
                                    <div key={moduleNumber}>
                                        {module.headings.map(
                                            (heading, headingNumber) => (
                                                <div
                                                    className="m-0 fs-6 p-0"
                                                    key={headingNumber}
                                                >
                                                    <p
                                                        className="border my-2 border-2 border-start-5 rounded-3 p-2 ps-3 overflow-hidden"
                                                        style={{
                                                            cursor: "pointer",
                                                        }}
                                                        onClick={() => {
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
                                                                openUnit: -1,
                                                                currentSubheading:
                                                                    -1,
                                                            });
                                                        }}
                                                    >
                                                        {heading.headingName}
                                                    </p>
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
                                                        {heading.subheadings.map(
                                                            (subheading, i) => (
                                                                <div
                                                                    key={i}
                                                                    className="ms-3 my-1 px-3 p-2 border border-2 rounded-pill overflow-hidden text-nowrap d-flex align-content-center align-items-center"
                                                                    style={{
                                                                        cursor: isAllowed(
                                                                            [
                                                                                moduleNumber,
                                                                                headingNumber,
                                                                                i,
                                                                            ]
                                                                        )
                                                                            ? "pointer"
                                                                            : "no-drop",
                                                                        backgroundColor:
                                                                            this
                                                                                .props
                                                                                .openUnit[0] ===
                                                                                moduleNumber &&
                                                                            this
                                                                                .props
                                                                                .openUnit[1] ===
                                                                                headingNumber &&
                                                                            this
                                                                                .props
                                                                                .openUnit[2] ===
                                                                                i
                                                                                ? "#C6E7FF"
                                                                                : "white",
                                                                    }}
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
                                                                        }
                                                                    }}
                                                                >
                                                                    {courseProgress[0] ===
                                                                        moduleNumber &&
                                                                    courseProgress[1] ===
                                                                        headingNumber &&
                                                                    courseProgress[2] ===
                                                                        i ? (
                                                                        <i
                                                                            className="bi bi-play-circle-fill me-2"
                                                                            style={{
                                                                                color: "#FA7070",
                                                                            }}
                                                                        ></i>
                                                                    ) : isAllowed(
                                                                          [
                                                                              moduleNumber,
                                                                              headingNumber,
                                                                              i,
                                                                          ]
                                                                      ) ? (
                                                                        <i
                                                                            className="bi bi-check-circle-fill me-2"
                                                                            style={{
                                                                                color: "#0D92F4",
                                                                            }}
                                                                        ></i>
                                                                    ) : (
                                                                        <i className="bi bi-play-circle-fill me-2"></i>
                                                                    )}
                                                                    {
                                                                        subheading.subheadingName
                                                                    }
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
class ViewCourse extends Component {
    constructor(props) {
        super(props);
        this.state = {
            openUnit: [0, 0, 0],
            courseProgress: [0, 0, 0, 0],
        };
    }
    async componentDidMount() {
        let { courseData, doGetCourseDetails, userCourses } = this.props;
        const { courseId } = this.props.params;
        const courseProgress = userCourses.filter(
            (course) => course.courseId === courseId
        )[0].courseProgress;
        if (courseData.length === 0) {
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
            const [moduleNumber, headingNumber, subHeadingNumber] =
                this.state.openUnit;
            const {
                subheadingName,
                subheadingDisc,
                subheadingFileType,
                subheadingLink,
                test,
            } =
                this.props.courseData[0]?.modules[moduleNumber]?.headings[
                    headingNumber
                ]?.subheadings[subHeadingNumber] || "";
            return (
                <div className="row m-0">
                    <div className="col-lg-3 d-none d-lg-block">
                        <SideBar
                            openUnit={this.state.openUnit}
                            courseProgress={this.state.courseProgress}
                            courseData={this.props.courseData[0]}
                            setOpenUnit={(newUnit) => {
                                this.setState({ openUnit: newUnit });
                            }}
                        />
                    </div>
                    <div className="col-lg-7 col bg-grey py-5 px-4">
                        <div className="fw-bold mb-3">{subheadingName}</div>
                        {subheadingFileType === 1 && (
                            // TODO add a component for a doc type
                            <div className="mb-5">
                                <ReactPlayer
                                    url={subheadingLink || ""}
                                    width={"100%"}
                                    controls
                                ></ReactPlayer>
                            </div>
                        )}
                        <p className="paragram-text rounded fw-light bg-white p-4 my-3 mb-5">
                            {subheadingDisc}
                        </p>
                        <QuestionCard
                            test={test || []}
                            completedQuestions={
                                this.state.courseProgress[3] || false
                            }
                        />
                    </div>
                    <div className="col-lg-2 d-none d-lg-block"></div>
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
)(withRouter(ViewCourse));
