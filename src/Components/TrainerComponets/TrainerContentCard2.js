import { Button, Input, ButtonGroup, FormFeedback } from "reactstrap";
import React, { Component } from "react";
// import ReactPlayer from "react-player";
import { connect } from "react-redux";
import withRouter from ".././WithRouter";
import bcrypt from "bcryptjs";
import isEqual from "lodash/isEqual";
import { doUpdateCourseUnit } from "../../features/course/courseSlice";
class ContentCard extends Component {
    constructor(props) {
        super(props);
        this.getNextUnit = this.getNextUnit.bind(this);
        this.state = {
            showModal: false,
            newVideoLink: null,
            newDocLink: null,
            newWriteUp: null,
            newHeading: null,
            newTest: null,
            unsavedChanges: false,
            headingIsInvalid: false,
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
    //     componentDidUpdate(prevProps) {
    //         console.log(this.state);
    //         if (prevProps !== this.props) {
    //             this.setState({ flag: !this.state.flag });
    //             window.scrollTo(0, 0);
    //         }
    //     }
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
            const newWriteUp =
                this.state.newWriteUp !== null
                    ? this.state.newWriteUp
                    : writeUp;
            const newHeading =
                this.state.newHeading !== null
                    ? this.state.newHeading
                    : heading;
            const newTest =
                this.state.newTest !== null ? this.state.newTest : test;
            function isContentMatching(content, newContent) {
                const mapping = {
                    newVideoLink: "videoLink",
                    newWriteUp: "writeUp",
                    newDocLink: "docLink",
                    newTest: "test",
                };
                for (const [newField, contentField] of Object.entries(
                    mapping
                )) {
                    const newValue = newContent[newField];
                    const contentValue = content[contentField];
                    if (newValue === null) continue;
                    if (!isEqual(newValue, contentValue)) {
                        return false;
                    }
                }

                return true;
            }
            const checkForChanges = () => {
                const {
                    newHeading,
                    newWriteUp,
                    newDocLink,
                    newTest,
                    newVideoLink,
                } = this.state;
                let hasChanges = !isContentMatching(content, {
                    newWriteUp,
                    newDocLink,
                    newTest,
                    newVideoLink,
                });
                if (newHeading) {
                    hasChanges = newHeading !== heading;
                }
                if (newHeading === "") {
                    this.setState({ headingIsInvalid: true });
                } else if (newHeading !== null) {
                    this.setState({ headingIsInvalid: false });
                }
                this.setState({ unsavedChanges: hasChanges });
            };
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
                    this.setState({ [name]: value }, checkForChanges);
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
                });
            };
            const handleSubmit = () => {
                const newContent = {
                    videoLink: newVideoLink,
                    docLink: newDocLink,
                    writeUp: newWriteUp,
                    test: newTest,
                };
                const headingName = newHeading;

                this.props.doUpdateCourseUnit({
                    newContent,
                    headingName,
                    moduleIndex: [i, j, k],
                });
            };

            return (
                <div className="mx-lg-5 px-lg-4">
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
                                        invalid={q.question.length == 0}
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
                                            invalid={option.length == 0}
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
                                </div>
                            </div>
                        ))}
                    </div>
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
