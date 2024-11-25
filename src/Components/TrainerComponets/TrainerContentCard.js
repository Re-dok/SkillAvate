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
import isEqual from "lodash/isEqual";
class QuestionCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            newTest: [],
            intialLoading: true,
        };
    }
    getCorrectOption = async (hashedAns, options) => {
        let answer = 0;
        for (let i = 0; i < 4; i++) {
            await bcrypt.compare(options[i], hashedAns).then((isCorrect) => {
                if (isCorrect) {
                    answer = i;
                }
            });
        }
        return answer;
    };
    async componentDidMount() {
        const newTest = [];
        for (const questionData of this.props.test) {
            const { question, options, answer } = questionData;
            newTest.push({
                question,
                options: [...options],
                answer: answer,
            });
        }
        this.setState({ newTest, intialLoading: false });
    }
    // async componentDidUpdate(prevProps) {
    //     const testChanged = !isEqual(prevProps.test, this.props.test);
    //     if (testChanged) {
    //         console.log("REGITERING");
    //         const newTest = [];
    //         for (const questionData of this.props.test) {
    //             console.log(questionData);
    //             const { question, options, answer: hashedAns } = questionData;
    //             const answer = await this.getCorrectOption(
    //                 hashedAns,
    //                 options
    //             );
    //             newTest.push({
    //                 question,
    //                 options: [...options],
    //                 answer,
    //             });
    //         }
    //         this.setState({ newTest, intialLoading: false });
    //     }
    // }
    handleInputChange = (e, questionIndex, optionIndex = null) => {
        const { name, value } = e.target;
        this.setState((prevState) => {
            const updatedTest = [...prevState.newTest];
            if (optionIndex !== null) {
                // Update specific option
                updatedTest[questionIndex].options[optionIndex] = value;
            } else {
                // Update the question
                updatedTest[questionIndex][name] = value;
            }
            return { newTest: updatedTest };
        });
        this.props.setNewTest(this.state.newTest);
    };

    handleCorrectOptionChange = (questionIndex, answer) => {
        this.setState((prevState) => {
            const updatedTest = [...prevState.newTest];
            updatedTest[questionIndex].answer = answer;
            return { newTest: updatedTest };
        });
        this.props.setNewTest(this.state.newTest);
    };

    render() {
        const { newTest } = this.state;

        if (newTest.length === 0) return <>Nothing</>;

        return (
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
                                    this.handleInputChange(e, questionIndex)
                                }
                                placeholder="Edit Question"
                            />
                        </div>
                        <strong>Options :</strong>
                        {q.options.map((option, optionIndex) => (
                            <div key={optionIndex} className="mt-2">
                                <Input
                                    value={option}
                                    onChange={(e) =>
                                        this.handleInputChange(
                                            e,
                                            questionIndex,
                                            optionIndex
                                        )
                                    }
                                    placeholder={`Option ${optionIndex + 1}`}
                                />
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
                                        onClick={() =>
                                            this.handleCorrectOptionChange(
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
            newWriteUp: null,
            newHeading: null,
            newTest: null,
            unsavedChanges: false,
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

    // componentDidUpdate() {
    //     console.log(this.state);
    // }
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
                // Map newContent keys to corresponding content keys
                const mapping = {
                    newVideoLink: "videoLink",
                    newWriteUp: "writeUp",
                    newDocLink: "docLink",
                    newTest: "test",
                };
                // Iterate through each key in newContent
                for (const [newField, contentField] of Object.entries(
                    mapping
                )) {
                    const newValue = newContent[newField];
                    const contentValue = content[contentField];

                    // If newValue is null, continue to the next field
                    if (newValue === null) continue;

                    // Use deep comparison for objects (e.g., "test")
                    if (!isEqual(newValue, contentValue)) {
                       
                        return false;
                    }
                }

                return true;
            }
            const onChangeValue = (e) => {
                let { name, value } = e.target;
                // console.log(name);
                this.setState({ [name]: value }, function () {
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
                    this.setState({ unsavedChanges: hasChanges });
                });
            };
            const { unsavedChanges } = this.state;
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
            const setNewTest = (newTest) =>
                this.setState(
                    {
                        newTest: newTest,
                    },
                    function () {
                        // const hasChanges=isEqual(this.state.newTest,test);
                        // if(hasChanges){
                        //     this.setState({unsavedChanges:true})
                        // }else{
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
                        this.setState({ unsavedChanges: hasChanges });
                        // }
                    }
                );
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
                                value={newHeading}
                                placeholder={newHeading}
                                name="newHeading"
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
                                name="newVideoLink"
                                placeholder={newVideoLink}
                                onChange={onChangeValue}
                            />
                            <div className="mt-2 p-0 d-flex justify-content-end">
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
                                name="newDocLink"
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
                            value={newWriteUp}
                            name="newWriteUp"
                            placeholder={newWriteUp}
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

                    <QuestionCard
                        test={newTest || []}
                        setNewTest={setNewTest}
                        getNextUnit={this.getNextUnit}
                        triggerModal={() => this.setState({ showModal: true })}
                        onChangeValue={onChangeValue}
                    />

                    <div className=" my-5 px-5 py-3 bg-white rounded row gap-3 p-2">
                        <Button
                            disabled={!unsavedChanges}
                            color="success"
                            className="col"
                        >
                            Save
                        </Button>
                        <Button
                            disabled={!unsavedChanges}
                            color="danger"
                            className="col"
                            onClick={handleDiscardChanges}
                        >
                            <i classname="bi bi-trash me-2" />
                            Discard
                        </Button>
                    </div>
                </div>
            );
        }
    }
}
export default withRouter(ContentCard);
