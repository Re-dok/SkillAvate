import { Badge, Button, Alert } from "reactstrap";
import React, { Component } from "react";
import ReactPlayer from "react-player";
import { doUpdateCourseProgress } from "../features/user/userSlice";
import { connect } from "react-redux";
import withRouter from "./WithRouter";

class QuestionCard extends Component {
    // TODO works preety much for single content page, need to add messages, after that you'll have to write logic to move to new module/content page
    constructor(props) {
        super(props);
        this.state = {
            alertMessage: null,
            answerIsCurrect: true,
            currentQuestion: 1,
            selectedOptions: null,
        };
    }
    componentDidMount() {
        console.log("THIS IS FROM qustion 1\n");
        console.log(this.props.courseProgress[4]);
        if (!this.props.isComplete)
            this.setState({
                currentQuestion: this.props.courseProgress[4] + 1,
            });
        else {
            this.setState({ currentQuestion: this.props.test.length });
        }
    }
    componentDidUpdate(prevProps) {
        if (prevProps?.test[0].question != this.props?.test[0].question) {
            // the content page is changed, so move to last question and top of the page
            window.scrollTo(0, 0);
            if (this.props.isComplete) {
                this.setState({ currentQuestion: this.props.test.length });
            }
        }
        if (prevProps.courseProgress[4] !== this.props.courseProgress[4]) {
            // the progress was updated so ,move the question forward
            this.setState({
                currentQuestion: this.props.courseProgress[4] + 1,
                answerIsCurrect: true,
                selectedOptions: null,
                alertMessage: null,
            });
        }
    }
    nextQuestion = () => {
        if (
            this.state.currentQuestion < this.props.test.length &&
            this.state.currentQuestion <= this.props.courseProgress[4]
        ) {
            this.setState({
                currentQuestion: this.state.currentQuestion + 1,
                selectedOptions: null,
                alertMessage: null,
                answerIsCurrect: true,
            });
        }
    };
    prevQuestion = () => {
        if (this.state.currentQuestion > 1) {
            this.setState({ currentQuestion: this.state.currentQuestion - 1 });
        }
    };
    handleSubmit = async () => {
        const { test } = this.props;
        const { currentQuestion } = this.state;
        if (
            test[currentQuestion - 1].answer ===
            this.state.selectedOptions + 1
        ) {
            let newProgress = [...this.props.courseProgress];

            // FIXME should add more complex function to increace progress
            if (currentQuestion < this.props.test.length) {
                // if more questions are there then just ++
                newProgress[4] += 1;
                const courseId = this.props.params.courseId;
                await this.props.doUpdateCourseProgress({
                    newProgress,
                    courseId,
                });
            } else {
                // if no more questions, find the next content page
                newProgress[4] += 1;
            }
            this.setState({
                alertMessage: "Correct Answer!",
                answerIsCurrect: true,
            });
        } else {
            this.setState({
                alertMessage:
                    "Wrong Answer, you have one more attempt after which you will be moved to the next question!",
                answerIsCurrect: false,
            });
        }
    };

    render() {
        if (this.props.test.length === 0) return <>Nothing</>;

        const completedQuestions = this.props.courseProgress[4];
        const { currentQuestion } = this.state;
        console.log("this is for currrent qestion\n" + currentQuestion);
        const { question, options } =
            this.props?.test[
                currentQuestion - 1 < this.props.test.length
                    ? currentQuestion - 1
                    : 0
            ];
        const numberOfQuestions = this.props.test.length || 0;
        const isDisabled =
            this.state.selectedOptions === null ||
            this.state.alertMessage !== null;
        return (
            <div className="border border-1 rounded rounded-3 bg-white">
                <div className="border-bottom border-1 py-2 d-flex justify-content-between">
                    <div className="d-inline">
                        <i
                            role="button"
                            onClick={this.prevQuestion}
                            className={
                                "bi bi-chevron-left border-end border-2 p-2" +
                                " " +
                                (this.state.currentQuestion > 1
                                    ? " "
                                    : "bg-grey")
                            }
                        ></i>
                        <i
                            onClick={this.nextQuestion}
                            role="button"
                            className={
                                "bi bi-chevron-right border-2 border-end p-2 me-3" +
                                " " +
                                (currentQuestion < numberOfQuestions &&
                                currentQuestion <= completedQuestions
                                    ? " "
                                    : "bg-grey")
                            }
                        ></i>
                        <p className="fw-bold d-inline">
                            Question {currentQuestion}/{numberOfQuestions}{" "}
                            {completedQuestions}
                        </p>
                    </div>
                    {
                        <Badge
                            color={
                                this.props.isComplete ||
                                completedQuestions >= currentQuestion
                                    ? "info"
                                    : "warning"
                            }
                            pill
                            className="me-3 text-dark"
                        >
                            {this.props.isComplete ||
                            completedQuestions === currentQuestion ? (
                                <i className="bi bi-check-circle-fill me-2"></i>
                            ) : (
                                <i className="bi bi-exclamation-circle-fill me-1"></i>
                            )}
                            {this.props.isComplete ||
                            completedQuestions === currentQuestion
                                ? "Completed"
                                : "Mandatory"}
                        </Badge>
                    }
                </div>
                <div className="p-3 py-4 border-bottom border-2">
                    <p className="fw-bold">Question {currentQuestion} </p>
                    <p className="fw-light">{question}</p>
                </div>
                {options.map((option, optionNumber) => (
                    <div
                        className={
                            "p-3 pb-0 d-flex border-bottom border-2 " +
                            (this.state.selectedOptions === optionNumber
                                ? "bg-secodary-o"
                                : "")
                        }
                        key={optionNumber}
                        onClick={() => {
                            if (optionNumber === this.state.selectedOptions) {
                                this.setState({ selectedOptions: null });
                            } else
                                this.setState({
                                    selectedOptions: optionNumber,
                                });
                        }}
                        role="button"
                    >
                        <i
                            className={
                                "bi me-2 fw-light " +
                                (this.state.selectedOptions === optionNumber
                                    ? "bi-record-circle"
                                    : "bi-circle")
                            }
                        ></i>
                        <p className="fw-light">{option}</p>
                    </div>
                ))}
                <Alert
                    color={this.state.answerIsCurrect ? "success" : "danger"}
                    className="mx-2 my-2"
                    isOpen={this.state.alertMessage}
                    toggle={() => {
                        if (this.state.answerIsCurrect === true) {
                            this.nextQuestion();
                        }
                        this.setState({
                            alertMessage: null,
                            answerIsCurrect: null,
                            selectedOptions: null,
                        });
                    }}
                >
                    {this.state.alertMessage}
                </Alert>
                {currentQuestion <= completedQuestions ||
                    (!this.props.isComplete && (
                        <div className="border-0 px-4 py-3 d-flex flex-row-reverse justify-content-between">
                            <Button
                                color="info"
                                className="text-light"
                                disabled={isDisabled}
                                onClick={() => {
                                    if (!isDisabled) {
                                        this.handleSubmit();
                                    }
                                }}
                            >
                                Submit
                            </Button>
                        </div>
                    ))}
            </div>
        );
    }
}
const mapDispatchToProps = {
    doUpdateCourseProgress,
};
const ConnectedQuestionCard = connect(
    null,
    mapDispatchToProps
)(withRouter(QuestionCard));
export default class ContentCard extends Component {
    // TODO add logic to only allow submission when all questions are attempted AND unlock tests only after the video is watched
    openReadingAssignment = (docLink) => {
        window.open(docLink, "_blank");
    };
    // FIXME change the badge logic for complition etc
    render() {
        if (this.props.modules === undefined || this.props.openUnit === null)
            return <>loading</>;
        else {
            const modules = this.props.modules;
            const courseProgress = this.props.courseProgress;
            // module number
            const i = this.props.openUnit[0];
            // heading number
            const j = this.props.openUnit[1];
            // sybHeading number
            const k = this.props.openUnit[2];
            // how many of the assmts in the content are done
            const l = this.props.openUnit[3];
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
            const writeUp = content.writeUp;
            const docLink = content.docLink;
            const videoLink = content.videoLink;
            const test = content.test;
            const completed = (badgeType) => {
                if (i < courseProgress[0]) {
                    return true;
                } else if (i === courseProgress[0]) {
                    if (j < courseProgress[1]) {
                        return true;
                    } else {
                        if (j < courseProgress[2]) {
                            return true;
                        }
                        return badgeType <= courseProgress[3];
                    }
                }
                return false;
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
                                            : "Mandatory"}
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
                            className="rounded rounded-pill col-lg-5 col-md-6 position-relative fw-light bg-white p-4"
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
                                    {completed(1) ? "Completed" : "Mandatory"}
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
                    {test.length !== 0 && (
                        <ConnectedQuestionCard
                            test={test || []}
                            courseProgress={this.props.courseProgress}
                            isComplete={completed(3)}
                        />
                    )}
                </div>
            );
        }
    }
}
