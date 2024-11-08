import { Badge, Button, Alert } from "reactstrap";
import React, { Component } from "react";
import ReactPlayer from "react-player";

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
export default class ContentCard extends Component {
    openReadingAssignment = (docLink) => {
        window.open(docLink, "_blank");
    };
    render() {
        if (this.props.modules === undefined) return <>loading</>;
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
