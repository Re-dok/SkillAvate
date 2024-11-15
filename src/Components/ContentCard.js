import { Badge, Button, Alert, Modal, ModalBody } from "reactstrap";
import React, { Component } from "react";
import ReactPlayer from "react-player";
import {
    doMarkCourseAsComplete,
    doUpdateCourseProgress,
} from "../features/user/userSlice";
import { connect } from "react-redux";
import withRouter from "./WithRouter";
// import bcrypt from "bcrypt"
// 1. badges on changeing unit wont show currect stuff, same with the submit button. 2. from 2,0 moving forward isnt correct;3. Options should not be selectable after submission ;
// 4. Add logic to store the course Marks when ans is wrong and add logic to allow only 2 submissions
// 6. change my courses to accom completed and incomplete
// 6.add modal
// TODO 7.0.add encrptions
// 7.1 change colors for nav

class QuestionCard extends Component {
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
        if (!this.props.isComplete)
            this.setState({
                currentQuestion: this.props.courseProgress[4] + 1,
            });
        else {
            this.setState({ currentQuestion: this.props.test.length });
        }
    }
    componentDidUpdate(prevProps) {
        if (prevProps?.test[0].question !== this.props?.test[0].question) {
            // the content page is changed, so move to last question and top of the page
            window.scrollTo(0, 0);
            if (this.props.isComplete) {
                this.setState({
                    currentQuestion: this.props.test.length,
                    selectedOptions: null,
                    answerIsCurrect: true,
                    alertMessage: null,
                });
            } else {
                this.setState({
                    currentQuestion: this.props.courseProgress[4] + 1,
                    selectedOptions: null,
                    answerIsCurrect: true,
                    alertMessage: null,
                });
            }
        }
        if (prevProps.courseProgress[4] !== this.props.courseProgress[4]) {
            // the progress was updated so ,move the question forward
            if (this.props.isComplete) {
                this.setState({
                    currentQuestion: this.props.test.length,
                    selectedOptions: null,
                    answerIsCurrect: true,
                    alertMessage: null,
                });
            } else {
                this.setState({
                    currentQuestion: this.props.courseProgress[4] + 1,
                    selectedOptions: null,
                    answerIsCurrect: true,
                    alertMessage: null,
                });
            }
        }
    }
    nextQuestion = () => {
        if (
            this.state.currentQuestion < this.props.test.length &&
            (this.state.currentQuestion <= this.props.courseProgress[4] ||
                this.props.isComplete)
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
        // const ans=await bcrypt.hash(test.options[this.state.selectedOptions]);
        // const isCorrect=await bcrypt.compare(ans,test[currentQuestion-1].answer);
        // console.log(isCorrect);
        let prevProgress = [...this.props.courseProgress];
        // gives unit coordinates and grade
        let newProgress = [...prevProgress];
        const courseId = this.props.params.courseId;
        if (
            test[currentQuestion - 1].answer ===
            this.state.selectedOptions + 1
        ) {
            if (currentQuestion < this.props.test.length) {
                // if more questions are there then just ++
                newProgress[4] += 1;
                newProgress[5] = false;
                // is of the form "1010101"
                prevProgress[3] = "1";
                await this.props.doUpdateCourseProgress({
                    newProgress,
                    courseId,
                    prevProgress,
                });
            } else {
                newProgress = this.props.getNextUnit();
                prevProgress[3] = "1";
                await this.props.doUpdateCourseProgress({
                    newProgress,
                    courseId,
                    prevProgress,
                });
                // this will only happen if the course is complete,since the unit is complete but the number of questions completed = total questions
                if (newProgress[4] === this.props.test.length) {
                    await this.props.doMarkCourseAsComplete(courseId);
                    this.props.triggerModal();
                }
                window.scrollTo(0, 0);
            }
            this.setState({
                alertMessage: null,
                answerIsCurrect: null,
                selectedOptions: null,
            });
        } else {
            // if first time mark as first and put alert
            const isFirstAttempt = !prevProgress[5];
            if (isFirstAttempt) {
                newProgress[5] = true;
                prevProgress = [];
                await this.props.doUpdateCourseProgress({
                    newProgress,
                    courseId,
                    prevProgress,
                });
                this.setState({
                    alertMessage:
                        "Wrong Answer, you have one more attempt after which you will be moved to the next question!",
                    answerIsCurrect: false,
                    selectedOptions: null,
                });
            } else {
                // else mark as wrong and move on
                if (currentQuestion < this.props.test.length) {
                    // if more questions are there then just ++
                    newProgress[5] = false;
                    newProgress[4] += 1;
                    // is of the form "1,0,1,0,1,0,1"
                    prevProgress[3] = "0";
                    await this.props.doUpdateCourseProgress({
                        newProgress,
                        courseId,
                        prevProgress,
                    });
                } else {
                    newProgress = this.props.getNextUnit();
                    prevProgress[3] = "0";
                    await this.props.doUpdateCourseProgress({
                        newProgress,
                        courseId,
                        prevProgress,
                    });
                    // this will only happen if the course is complete,since the unit is complete but the number of questions completed = total questions
                    if (newProgress[4] === this.props.test.length) {
                        await this.props.doMarkCourseAsComplete(courseId);
                        this.props.triggerModal();
                    }
                    window.scrollTo(0, 0);
                }
                this.setState({
                    alertMessage: null,
                    answerIsCurrect: null,
                    selectedOptions: null,
                });
            }
        }
    };

    render() {
        if (this.props.test.length === 0) return <>Nothing</>;

        const completedQuestions = this.props.courseProgress[4];
        const { currentQuestion } = this.state;

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
                                (currentQuestion <= completedQuestions ||
                                    this.props.isComplete)
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
                            completedQuestions >= currentQuestion ? (
                                <i className="bi bi-check-circle-fill me-2"></i>
                            ) : (
                                <i className="bi bi-exclamation-circle-fill me-1"></i>
                            )}
                            {this.props.isComplete ||
                            completedQuestions >= currentQuestion
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
                            (this.state.selectedOptions === optionNumber &&
                            !this.props.isComplete
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
                                (this.state.selectedOptions === optionNumber &&
                                !this.props.isComplete
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
    doMarkCourseAsComplete,
};
const ConnectedQuestionCard = connect(
    null,
    mapDispatchToProps
)(withRouter(QuestionCard));
class ContentCard extends Component {
    constructor(props) {
        super(props);
        this.getNextUnit = this.getNextUnit.bind(this);
        this.state = {
            showModal: false,
        };
    }
    openReadingAssignment = (docLink) => {
        window.open(docLink, "_blank");
    };
    getNextUnit() {
        const modules = this.props.modules;
        const courseProgress = this.props.courseProgress;
        let i = courseProgress[0];
        // heading number
        let j = courseProgress[1];
        // sybHeading number
        let k = courseProgress[2];
        let done = false;

        if (k !== -1) {
            if (k < modules[i].headings[j].subheadings.length - 1) {
                k++;
                done = true;
            } else k = -1;
        }
        if (!done && j !== -1) {
            if (j < modules[i].headings.length - 1) {
                j++;
                !(modules[i].headings[j]?.content === undefined)
                    ? (k = -1)
                    : (k = 0);
                done = true;
            } else j = -1;
        }
        if (!done && i !== -1) {
            if (i < modules.length - 1) {
                i++;
                if (modules[i].content) {
                    j = -1;
                    k = -1;
                } else {
                    j = 0;
                    modules[i].headings[0]?.content ? (k = -1) : (k = 0);
                    done = true;
                }
            } else {
                // else course is completed
                i = courseProgress[0];
                // heading number
                j = courseProgress[1];
                // sybHeading number
                k = courseProgress[2];
                return [i, j, k, 0, courseProgress[4] + 1, false];
            }
        }
        return [i, j, k, 0, 0, false];
    }
    triggerModal() {
        this.setState({ showModal: true });
    }
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
            const completed = (numberOfQuestions) => {
                if (i < courseProgress[0]) {
                    return true;
                } else if (i === courseProgress[0]) {
                    if (j < courseProgress[1]) {
                        return true;
                    } else {
                        if (k < courseProgress[2]) {
                            return true;
                        } else {
                            if (courseProgress[4] === numberOfQuestions)
                                return true;
                            return false;
                        }
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
                            isComplete={completed(test?.length || 0)}
                            getNextUnit={this.getNextUnit}
                            triggerModal={() =>
                                this.setState({ showModal: true })
                            }
                        />
                    )}
                    <Modal isOpen={this.state.showModal}>
                        <ModalBody className="pb-5 p-4 p-4 row gap-3">
                            <div className="fw-bold fs-5">Congratulations!</div>
                            <div className="col-12">
                                You have successfully completed the course "
                                <strong>{this.props.courseName}</strong>,"
                                created by{" "}
                                <span className="fst-italic fw-bold">
                                    {this.props.createrName} !
                                </span>
                            </div>
                            <Button
                                //  className="rounded-3 p-3 mb-3 fw-bold"
                                //     size="sm"
                                className="mx-auto col-6 mt-4 rounded-3 p-3 fw-bold"
                                // color="primary"
                                size="sm"
                                onClick={() => this.props.navigate("/explore")}
                            >
                                Explore Courses
                            </Button>{" "}
                        </ModalBody>
                    </Modal>
                </div>
            );
        }
    }
}
export default withRouter(ContentCard);
