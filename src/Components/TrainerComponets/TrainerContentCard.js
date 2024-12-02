import {
    Button,
    Input,
    ButtonGroup,
    FormFeedback,
    Modal,
    ModalBody,
} from "reactstrap";
import React, { Component } from "react";
import ReactPlayer from "react-player";
import { connect } from "react-redux";
import withRouter from ".././WithRouter";
import { doUpdateCourseUnit } from "../../features/course/courseSlice";
class ContentCard extends Component {
    constructor(props) {
        super(props);
        this.getNextUnit = this.getNextUnit.bind(this);
        this.state = {
            newModuleDiscp: null,
            newVideoLink: null,
            newDocLink: null,
            newWriteUp: null,
            newHeading: null,
            newTest: null,
            unsavedChanges: false,
            headingIsInvalid: false,
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
    componentDidUpdate(prevProps) {
        if (prevProps !== this.props) {
            window.scrollTo(0, 0);
        }
    }
    triggerModal() {
        this.setState({ showModal: true });
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
            const { content, heading, moduleDiscp } = (() => {
                let content, heading, moduleDiscp;
                moduleDiscp = false;
                if (modules[i].content) {
                    content = modules[i].content;
                    heading = modules[i].moduleName;
                    moduleDiscp = modules[i].moduleDiscp;
                } else if (modules[i].headings[j].content) {
                    content = modules[i].headings[j].content;
                    heading = modules[i].headings[j].headingName;
                } else {
                    content = modules[i].headings[j].subheadings[k].content;
                    heading =
                        modules[i].headings[j].subheadings[k].subheadingName;
                }
                return { content, heading, moduleDiscp };
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
            const newWriteUp =
                this.state.newWriteUp !== null
                    ? this.state.newWriteUp
                    : writeUp;
            const newHeading =
                this.state.newHeading !== null
                    ? this.state.newHeading
                    : heading;
            const newModuleDiscp =
                this.state.newModuleDiscp !== null
                    ? this.state.newModuleDiscp
                    : moduleDiscp;
            const newTest =
                this.state.newTest !== null ? this.state.newTest : test;
            function isValidSubmission(newHeading, newModuleDiscp, newTest) {
                if (newHeading) {
                    if (newModuleDiscp !== false) {
                        if (!newModuleDiscp) return;
                    }
                    for (let q of newTest) {
                        if (q.question) {
                            for (let option of q.options) {
                                if (!option) return false;
                            }
                        } else {
                            return false;
                        }
                    }
                } else return false;
                return true;
            }
            const onChangeValue = (
                e,
                questionIndex = null,
                optionIndex = null
            ) => {
                let { name, value } = e.target;
                if (name === "answer") {
                    this.setState((prevState) => {
                        const updatedTest = prevState.newTest
                            ? JSON.parse(JSON.stringify(prevState.newTest))
                            : JSON.parse(JSON.stringify(newTest));
                        updatedTest[questionIndex].answer = optionIndex;
                        return { newTest: updatedTest };
                    });
                } else if (name === "question" || name === "newOption") {
                    this.setState((prevState) => {
                        const updatedTest = prevState.newTest
                            ? JSON.parse(JSON.stringify(prevState.newTest))
                            : JSON.parse(JSON.stringify(newTest));
                        if (optionIndex !== null) {
                            // Update specific option
                            updatedTest[questionIndex].options[optionIndex] =
                                value;
                        } else {
                            // Update the question
                            updatedTest[questionIndex][name] = value;
                        }
                        return { newTest: updatedTest };
                    });
                } else {
                    this.setState({ [name]: value });
                }
            };
            const onBlurValue = (e, questionIndex, optionIndex = null) => {
                let { name, value } = e.target;
                // Trim leading and trailing whitespace on blur
                if (name === "question" || name === "newOption") {
                    this.setState((prevState) => {
                        const updatedTest = prevState.newTest
                            ? JSON.parse(JSON.stringify(prevState.newTest))
                            : JSON.parse(JSON.stringify(newTest));
                        if (optionIndex !== null) {
                            // Update specific option
                            updatedTest[questionIndex].options[optionIndex] =
                                value?.replace(/\s+/g, " ").trim();
                        } else {
                            // Update the question
                            updatedTest[questionIndex][name] = value
                                ?.replace(/\s+/g, " ")
                                .trim();
                        }
                        return { newTest: updatedTest };
                    });
                } else
                    this.setState({
                        [name]: value?.replace(/\s+/g, " ").trim() || "",
                    });
            };
            const handleDiscardChanges = () => {
                this.setState({
                    showModal: false,
                    newVideoLink: null,
                    newDocLink: null,
                    newWriteUp: null,
                    newHeading: null,
                    newTest: null,
                    unsavedChanges: false,
                    newModuleDiscp: null,
                });
            };
            const handleSubmit = () => {
                if (!isValidSubmission(newHeading, newModuleDiscp, newTest)) {
                    this.setState({ showModal: true });
                    return;
                }
                const newContent = {
                    videoLink: newVideoLink,
                    docLink: newDocLink,
                    writeUp: newWriteUp,
                    test: newTest,
                };
                const headingName = newHeading;
                const moduleDiscp = newModuleDiscp;
                this.props.doUpdateCourseUnit({
                    newContent,
                    headingName,
                    moduleDiscp,
                    moduleIndex: [i, j, k],
                });
            };
            const removeQuestion = (questionIndex) => {
                this.setState((prevState) => {
                    const updatedTest = prevState.newTest
                        ? JSON.parse(JSON.stringify(prevState.newTest))
                        : JSON.parse(JSON.stringify(newTest));
                    updatedTest.splice(questionIndex, 1);
                    return { newTest: updatedTest };
                });
            };
            const addQuestion = () => {
                this.setState((prevState) => {
                    const updatedTest = prevState.newTest
                        ? JSON.parse(JSON.stringify(prevState.newTest))
                        : JSON.parse(JSON.stringify(newTest));
                    updatedTest.push({
                        question: "",
                        options: ["", "", "", ""],
                        answer: 0,
                    });
                    return { newTest: updatedTest };
                });
            };
            return (
                <div className="mx-lg-5 px-lg-4">
                    <div className=" mb-5 mt-3 mt-md-0 mb-md-3 row justify-content-end row-cols-md-6 px-3 rounded row gap-3">
                        <Button
                            // disabled={!unsavedChanges}
                            color="success"
                            className="col"
                            onClick={handleSubmit}
                        >
                            Save
                        </Button>
                        <Button
                            // disabled={!unsavedChanges}
                            color="danger"
                            className="col"
                            onClick={handleDiscardChanges}
                        >
                            <i classname="bi bi-trash me-2" />
                            Discard
                        </Button>
                    </div>

                    <div className="fw-bold mb-3">
                        <i classname="bi bi-pencil-fill me-2" />
                        Edit Heading :
                        <Input
                            rows="1"
                            required
                            className="mt-1 py-2 mb-0 border-0 border-bottom border-3"
                            value={newHeading}
                            placeholder="Heading Here!"
                            name="newHeading"
                            onChange={onChangeValue}
                            invalid={newHeading.length === 0}
                            onBlur={onBlurValue}
                        />
                        <FormFeedback invalid>
                            Heading is Required!
                        </FormFeedback>
                    </div>
                    {newModuleDiscp !== false && (
                        <div className="fw-bold mb-3">
                            <i classname="bi bi-pencil-fill me-2" />
                            Edit Module Discription :
                            <Input
                                rows="4"
                                required
                                className="mt-1 py-2 mb-0 border-0 border-bottom border-3"
                                value={newModuleDiscp}
                                placeholder="Heading Here!"
                                name="newModuleDiscp"
                                onChange={onChangeValue}
                                invalid={newModuleDiscp.length === 0}
                                onBlur={onBlurValue}
                            />
                            <FormFeedback invalid>
                                Discription is Required!
                            </FormFeedback>
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
                        <div className="p-4 pb-2 row row-cols-1">
                            <strong className="col mb-2">
                                <i classname="bi bi-pencil-fill me-2" />
                                <strong>Edit Lecture Link :</strong>
                            </strong>
                            <Input
                                className="col-6"
                                value={newVideoLink}
                                name="newVideoLink"
                                placeholder={newVideoLink}
                                onChange={onChangeValue}
                                onBlur={onBlurValue}
                            />
                            <div className="my-4 p-0 d-flex justify-content-end">
                                <Button
                                    className="col col-md-2"
                                    color="danger"
                                    disabled={newVideoLink === ""}
                                    onClick={() => {
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
                                <strong>Edit Reading Assignment Link :</strong>
                            </strong>
                            <Input
                                className="mt-1"
                                value={newDocLink}
                                name="newDocLink"
                                placeholder={newDocLink}
                                onChange={onChangeValue}
                                onBlur={onBlurValue}
                            />
                            <div className="my-4 d-flex justify-content-end">
                                <Button
                                    className="col col-md-2"
                                    color="danger"
                                    disabled={newDocLink === ""}
                                    onClick={() => {
                                        this.setState({ newDocLink: "" });
                                    }}
                                >
                                    <i classname="bi bi-trash me-2"></i>Remove
                                </Button>
                            </div>
                        </div>
                    </div>

                    <div className="rounded bg-white p-4 pb-2 my-3 mb-4">
                        <i classname="bi bi-pencil-fill me-2" />
                        <strong>Edit Writeup</strong>
                        <Input
                            type="textarea"
                            rows="15"
                            className="mt-1 border-0 border-bottom border-3"
                            value={newWriteUp}
                            name="newWriteUp"
                            placeholder={newWriteUp}
                            onChange={onChangeValue}
                            onBlur={onBlurValue}
                        />
                        <div className="my-4 d-flex justify-content-end">
                            <Button
                                disabled={newWriteUp === ""}
                                className="col col-md-2"
                                color="danger"
                                onClick={() => {
                                    this.setState({ newWriteUp: "" });
                                }}
                            >
                                <i classname="bi bi-trash me-2"></i>Remove
                            </Button>
                        </div>
                    </div>
                    <div>
                        {newTest.map((q, questionIndex) => (
                            <div
                                key={questionIndex}
                                className="border-bottom border-2 border-rounded rounded-5 bg-white p-4 mb-3"
                            >
                                <strong>Question {questionIndex + 1}</strong>
                                <div className="mb-3 mt-2">
                                    <Input
                                        name="question"
                                        value={q.question}
                                        onChange={(e) =>
                                            onChangeValue(e, questionIndex)
                                        }
                                        placeholder="Edit Question"
                                        invalid={q.question.length === 0}
                                        onBlur={(e) =>
                                            onBlurValue(e, questionIndex)
                                        }
                                    />
                                    <FormFeedback invalid>
                                        Add a question or remove the card!
                                    </FormFeedback>
                                </div>
                                <strong>Options :</strong>
                                {q.options.map((option, optionIndex) => (
                                    <div key={optionIndex} className="mt-2">
                                        <Input
                                            value={option}
                                            onChange={(e) =>
                                                onChangeValue(
                                                    e,
                                                    questionIndex,
                                                    optionIndex
                                                )
                                            }
                                            name="newOption"
                                            placeholder={`Option ${
                                                optionIndex + 1
                                            }`}
                                            invalid={option.length === 0}
                                            onBlur={(e) =>
                                                onBlurValue(
                                                    e,
                                                    questionIndex,
                                                    optionIndex
                                                )
                                            }
                                        />
                                        <FormFeedback invalid>
                                            Option can not be empty!
                                        </FormFeedback>
                                    </div>
                                ))}
                                <div className="mt-3">
                                    <p className="mb-1">
                                        <strong>Correct Answer:</strong>
                                    </p>
                                    <div className="d-flex justify-content-between">
                                        <ButtonGroup className="gap-1 mt-0 p-0">
                                            {q.options.map((_, i) => (
                                                <Button
                                                    key={i}
                                                    outline={q.answer === i}
                                                    color={
                                                        q.answer === i
                                                            ? "success"
                                                            : "warning"
                                                    }
                                                    name="answer"
                                                    onClick={(e) =>
                                                        onChangeValue(
                                                            e,
                                                            questionIndex,
                                                            i
                                                        )
                                                    }
                                                >
                                                    {i + 1}
                                                </Button>
                                            ))}
                                        </ButtonGroup>
                                        {newTest.length > 1 && (
                                            <div>
                                                <Button
                                                    color="danger"
                                                    onClick={() => {
                                                        removeQuestion(
                                                            questionIndex
                                                        );
                                                    }}
                                                >
                                                    <i classname="bi bi-trash me-2"></i>
                                                    Remove
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                        <div className="my-4 d-flex justify-content-center">
                            <Button
                                disabled={newWriteUp === ""}
                                color="success"
                                onClick={() => {
                                    addQuestion();
                                }}
                            >
                                <i classname="bi bi-trash me-2"></i>Add New
                                Question
                            </Button>
                        </div>
                    </div>
                    <Modal
                        isOpen={this.state.showModal}
                        toggle={() => this.setState({ showModal: false })}
                    >
                        <ModalBody className="pb-5 rounded p-4">
                            Please ensure all necessary fields, such as the
                            heading and at least one question, are filled in.
                        </ModalBody>
                    </Modal>
                </div>
            );
        }
    }
}
const mapDispatchToProps = {
    doUpdateCourseUnit,
};
const ConnectedContentCard = connect(
    null,
    mapDispatchToProps
)(withRouter(ContentCard));
export default ConnectedContentCard;
