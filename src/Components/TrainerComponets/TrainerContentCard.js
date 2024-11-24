import {
    Badge,
    Button,
    Alert,
    Modal,
    ModalBody,
    Input,
    ButtonGroup,
} from "reactstrap";
import React, { Component } from "react";
import ReactPlayer from "react-player";
import {
    doMarkCourseAsComplete,
    doUpdateCourseProgress,
} from "../../features/user/userSlice";
import { connect } from "react-redux";
import withRouter from ".././WithRouter";
import bcrypt from "bcryptjs";

class QuestionCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            alertMessage: null,
            answerIsCurrect: true,
            currentQuestion: 1,
            selectedOptions: null,
            answers: [],
        };
    }
    getCorrectOption = async (hashedAns, options) => {
        let correctOption = 0;
        for (let i = 0; i < 4; i++) {
            await bcrypt.compare(options[i], hashedAns).then((isCorrect) => {
                if (isCorrect) {
                    correctOption = i;
                }
            });
        }
        return correctOption;
    };
    async componentDidMount() {
        let answers = [];
        const numberOfQuestions = this.props.test.length || 0;
        for (
            let currentQuestion = 1;
            currentQuestion < numberOfQuestions + 1;
            currentQuestion++
        ) {
            const { options } =
                this.props?.test[
                    currentQuestion - 1 < this.props.test.length
                        ? currentQuestion - 1
                        : 0
                ];
            const hashedAns = this.props?.test[currentQuestion - 1].answer;
            const ans = await this.getCorrectOption(hashedAns, options);
            answers.push(ans);
        }
        this.setState({ answers: answers });
    }
    async componentDidUpdate(prevProps) {
        if (prevProps.test[0].question !== this.props.test[0].question) {
            let answers = [];
            const numberOfQuestions = this.props.test.length || 0;
            for (
                let currentQuestion = 1;
                currentQuestion < numberOfQuestions + 1;
                currentQuestion++
            ) {
                const { options } =
                    this.props?.test[
                        currentQuestion - 1 < this.props.test.length
                            ? currentQuestion - 1
                            : 0
                    ];
                const hashedAns = this.props?.test[currentQuestion - 1].answer;
                const ans = await this.getCorrectOption(hashedAns, options);
                answers.push(ans);
            }
            this.setState({ answers: answers, currentQuestion: 1 });
        }
    }
    nextQuestion = () => {
        if (this.state.currentQuestion < this.props.test.length) {
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
    render() {
        if (this.props.test.length === 0) return <>Nothing</>;

        const onChangeValue = (e) => {
            let { value } = e.target;
            console.log(value);
            if (value.length === 1) value.slice(0, 1);
        };
        const { currentQuestion } = this.state;

        const { question, options } =
            this.props?.test[
                currentQuestion - 1 < this.props.test.length
                    ? currentQuestion - 1
                    : 0
            ];
        const numberOfQuestions = this.props.test.length || 0;
        const correctOption = this.state.answers[currentQuestion - 1];
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
                                (currentQuestion < numberOfQuestions
                                    ? " "
                                    : "bg-grey")
                            }
                        ></i>
                        <p className="fw-bold d-inline">
                            Question {currentQuestion}/{numberOfQuestions}{" "}
                        </p>
                    </div>
                </div>
                <div className="p-3 py-4 border-bottom border-2">
                    <p className="fw-bold">
                        <i classname="bi bi-pencil-fill me-2" />
                        Edit Question {currentQuestion}{" "}
                    </p>
                    <Input
                        value={question}
                        onChange={onChangeValue}
                        placeholder={question}
                    />
                </div>
                {options.map((option, optionNumber) => (
                    <div
                        className={
                            "p-3 pb-2 d-flex border-bottom border-2 align-content-center align-items-center " +
                            (correctOption === optionNumber ? "bg-done" : "")
                        }
                        key={optionNumber}
                    >
                        <i classname="bi bi-pencil-fill me-2" />
                        <Input
                            value={option}
                            onChange={onChangeValue}
                            placeholder={option}
                            className={
                                "opacity-100 m-0 my-1" +
                                (correctOption === optionNumber
                                    ? " bg-done border-0"
                                    : "")
                            }
                        />
                    </div>
                ))}
                <div
                    className={
                        "p-3 m-0 pb-4 row row-cols-1 row-cols-md-2 border-bottom border-2 justify-content-end"
                    }
                >
                    <div className="col row row-cols-1 m-0 p-0 justify-content-start align-items-center">
                        <p
                            className="col mb-1"
                            style={{ width: "max-content" }}
                        >
                            Correct Option:
                        </p>
                        <ButtonGroup className="col gap-1">
                            {Array.from({ length: 4 }, (_, i) => {
                                return (
                                    <Button
                                        key={i}
                                        outline={correctOption === i}
                                        disabled={correctOption === i}
                                        color={
                                            correctOption === i
                                                ? "success"
                                                : "warning"
                                        }
                                    >
                                        {i + 1}
                                    </Button>
                                );
                            })}
                        </ButtonGroup>
                    </div>
                </div>
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
            </div>
        );
    }
}
const mapDispatchToProps = {
    // doUpdateCourseProgress,
    // doMarkCourseAsComplete,
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
            newVideoLink: null,
            newDocLink: null,
            unsavedChanges: !false,
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
    componentDidUpdate() {
        console.log(this.state);
    }
    render() {
        if (this.props.modules === undefined || this.props.openUnit === null)
            return <>loading</>;
        else {
            const modules = this.props.modules;

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
            const newVideoLink =
                this.state.newVideoLink !== null
                    ? this.state.newVideoLink
                    : videoLink;
            const newDocLink =
                this.state.newDocLink !== null
                    ? this.state.newDocLink
                    : docLink;
            const onChangeValue = (e) => {
                let { name, value } = e.target;
                this.setState({ newVideoLink: value });
            };
            const { unsavedChanges } = this.state;
            return (
                <div className="mx-lg-5 px-lg-4">
                    {heading && (
                        <div className="fw-bold mb-3">
                            <i classname="bi bi-pencil-fill me-2" />
                            Edit Heading :
                            <Input
                                rows="1"
                                required
                                className="mt-1 py-2 mb-0 border-0 border-bottom border-3"
                                value={heading}
                                onChange={onChangeValue}
                            />
                        </div>
                    )}

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
                        <div className="p-4 row row-cols-1">
                            <strong className="col mb-2">
                                <i classname="bi bi-pencil-fill me-2" />
                                Edit Lecture Link :
                            </strong>
                            <Input
                                className="col-6"
                                value={newVideoLink}
                                placeholder={newVideoLink}
                                onChange={onChangeValue}
                            />
                            <div className="mt-2 p-0 d-flex justify-content-end">
                                <Button
                                    className="col col-md-2"
                                    color="danger"
                                    onClick={() => {
                                        console.log("hi");
                                        this.setState({ newVideoLink: "" });
                                    }}
                                >
                                    <i classname="bi bi-trash me-2"></i>Remove
                                </Button>
                            </div>
                        </div>
                    </div>

                    <div>
                        <div
                            role="button"
                            onClick={() => this.openReadingAssignment(docLink)}
                            className="rounded rounded-pill col-lg-5 col-md-6 position-relative fw-light bg-white p-4"
                        >
                            <i className="bi bi-journal-bookmark me-2"></i>
                            Reading Assignment
                        </div>
                        <div className="rounded fw-light bg-white my-2 px-3 pb-2 pt-3">
                            <strong className="col mb-2">
                                <i classname="bi bi-pencil-fill me-2" />
                                Edit Reading Assignment Link :
                            </strong>
                            <Input
                                className="mt-1"
                                value={newDocLink}
                                placeholder={newDocLink}
                                onChange={onChangeValue}
                            />
                            <div className="mt-2 d-flex justify-content-end">
                                <Button
                                    className="col col-md-2"
                                    color="danger"
                                    onClick={() => {
                                        this.setState({ newVideoLink: "" });
                                    }}
                                >
                                    <i classname="bi bi-trash me-2"></i>Remove
                                </Button>
                            </div>
                        </div>
                    </div>

                    <p className="rounded fw-light bg-white p-4 my-3 mb-4">
                        <i classname="bi bi-pencil-fill me-2" />
                        Edit Writeup
                        <Input
                            type="textarea"
                            rows="15"
                            className="mt-1 border-0 border-bottom border-3"
                            value={writeUp}
                            onChange={onChangeValue}
                        />
                        <div className="mt-2 d-flex justify-content-end">
                            <Button
                                disabled={writeUp === ""}
                                className="col col-md-2"
                                color="danger"
                                onClick={() => {
                                    this.setState({ newVideoLink: "" });
                                }}
                            >
                                <i classname="bi bi-trash me-2"></i>Remove
                            </Button>
                        </div>
                    </p>

                    <ConnectedQuestionCard
                        test={test || []}
                        getNextUnit={this.getNextUnit}
                        triggerModal={() => this.setState({ showModal: true })}
                    />
                    {unsavedChanges && (
                        <div className=" m-5 bg-white rounded row gap-3 p-2">
                            <Button disabled color="success" className="col">
                                Save
                            </Button>
                            <Button disabled color="danger" className="col">
                                <i classname="bi bi-trash me-2" />
                                Discard
                            </Button>
                        </div>
                    )}
                </div>
            );
        }
    }
}
export default withRouter(ContentCard);
