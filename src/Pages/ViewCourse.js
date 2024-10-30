import React, { Component } from "react";
import {
    Offcanvas,
    OffcanvasHeader,
    OffcanvasBody,
    ListGroup,
    ListGroupItem,
    Collapse,
    Button,
} from "reactstrap";
import { connect } from "react-redux";
import withRouter from "../Components/WithRouter";
import { doGetCourseDetails } from "../features/course/courseSlice";
import ReactPlayer from "react-player";
import { current } from "@reduxjs/toolkit";
class SideBar extends Component {
    constructor(props) {
        super(props);
        const { courseId } = this.props.params; // Access courseId from params
        this.state = {
            courseId: courseId,
            openUnit: -1,
            openModule: -1,
            openheading: -1,
        };
    }

    async componentDidMount() {
        const { courseId } = this.state;
        const { courseData, doGetCourseDetails } = this.props;

        if (courseData === null) {
            try {
                await doGetCourseDetails(courseId); // Load course details
            } catch (error) {
                console.error("Error loading course details:", error);
            }
        }
        const { currentUnit } = this.props;
        const [openModule, openheading, openUnit] = currentUnit;
        this.setState({
            openUnit: openUnit,
            openModule: openModule,
            openheading: openheading,
        });
        console.log("hellow/^1");
        console.log(currentUnit);
        console.log("hellow/^2");
    }
    componentDidUpdate() {
        console.log(this.state);
    }
    render() {
        const { isLoading, courseData, error } = this.props;

        if (isLoading) return <p>Loading course details...</p>;
        if (error)
            return <p>Error loading course details. Please try again later.</p>;
        if (!courseData) return <p>No course data available.</p>; // Handle missing data
        return (
            <div>
                <div className="mb-3 fs-3 fw-bold">{courseData.courseName}</div>
                <ListGroup>
                    {courseData.modules.map((module, moduleNumber) => (
                        <ListGroupItem key={moduleNumber}>
                            <p
                                style={{ cursor: "pointer" }}
                                onClick={() => {
                                    let newVal;
                                    if (
                                        this.state.openModule ===
                                        moduleNumber + 1
                                    ) {
                                        newVal = -1;
                                    } else {
                                        newVal = moduleNumber + 1;
                                    }
                                    this.setState({ openheading: -1 });
                                    this.setState({ openModule: newVal });
                                }}
                            >
                                {module.moduleName}
                            </p>
                            <Collapse
                                isOpen={
                                    this.state.openModule === moduleNumber + 1
                                }
                            >
                                {
                                    <div key={moduleNumber}>
                                        {module.headings.map(
                                            (heading, headingNumber) => (
                                                <div
                                                    className="m-0 p-0 ps-2"
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
                                                                    .openheading ===
                                                                headingNumber +
                                                                    1
                                                            ) {
                                                                newVal = -1;
                                                            } else {
                                                                newVal =
                                                                    headingNumber +
                                                                    1;
                                                            }
                                                            this.setState({
                                                                openheading:
                                                                    newVal,
                                                                openUnit: -1,
                                                            });
                                                        }}
                                                    >
                                                        {heading.headingName}
                                                    </p>
                                                    <Collapse
                                                        isOpen={
                                                            this.state
                                                                .openModule ===
                                                                moduleNumber +
                                                                    1 &&
                                                            this.state
                                                                .openheading ===
                                                                headingNumber +
                                                                    1
                                                        }
                                                    >
                                                        {heading.subheadings.map(
                                                            (subheading, i) => (
                                                                <div
                                                                    className="p-0 ps-5 m-0"
                                                                    key={i}
                                                                >
                                                                    <p
                                                                        className="border rounded-start-pill rounded-end-pill my-2 border-2 rounded-3 p-2 overflow-hidden"
                                                                        style={{
                                                                            cursor: "pointer",
                                                                        }}
                                                                        onClick={() => {
                                                                            const {
                                                                                openModule,
                                                                                openheading,
                                                                            } =
                                                                                this
                                                                                    .state;
                                                                            console.log(
                                                                                [
                                                                                    openModule-1,
                                                                                    openheading-1,
                                                                                    i ,
                                                                                ]
                                                                            );
                                                                            this.props.setCurrentUnit(
                                                                                [
                                                                                    openModule-1,
                                                                                    openheading-1,
                                                                                    i
                                                                                ]
                                                                            );
                                                                            this.props.toggleSideBar();
                                                                        }}
                                                                    >
                                                                        <i className="ms-1 me-2 bi bi-play-circle-fill"></i>
                                                                        {
                                                                            subheading.subheadingName
                                                                        }
                                                                    </p>
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

const mapStateToprops = (state) => ({
    isLoading: state.course.courseLoading,
    error: state.course.courseError,
    courseData: state.course.course,
    courseProgress: state.user.courses[0]?.courseProgress,
});

const mapDispatchToProps = {
    doGetCourseDetails,
};

const ConnectedSideBar = connect(
    mapStateToprops,
    mapDispatchToProps
)(withRouter(SideBar));

class ViewCourse extends Component {
    constructor(props) {
        super(props);
        const { courseId } = this.props.params; // Access courseId from params
        this.state = {
            navbarIsOpen: false,
            qnaIsOpen: false,
            courseId: courseId,
            docType: 2,
            currentUnit: [0, 0, 0],
            courseProgress:null
        };
    }
    async componentDidMount() {
        const { courseId } = this.state;
        const { courseData, doGetCourseDetails, courseProgress } = this.props;

        if (courseData === null) {
            try {
                await doGetCourseDetails(courseId); // Load course details
                this.setState({ currentUnit: courseProgress,courseProgress:courseProgress });
            } catch (error) {
                console.error("Error loading course details:", error);
            }
        }
    }
    componentDidUpdate() {
        console.log(this.state.currentUnit);
    }
    render() {
        const { isLoading, courseData, error } = this.props;

        if (isLoading) return <p>Loading course details...</p>;
        if (error)
            return <p>Error loading course details. Please try again later.</p>;
        if (courseData === null) return <p>No course data available.</p>; // Handle missing data
        const heading =
            this.props.courseData.modules[this.state.currentUnit[0]]
                .headings[this.state.currentUnit[1]];
        const { headingName, subheadings } = heading;
        const {
            subheadingName,
            subheadingDisc,
            subheadingFileType,
            subheadingLink,
            question,
            options,
            // answer
        } = subheadings[this.state.currentUnit[2]];
        return (
            <div className="row justify-content-center mw-100 mb-5">
                <div className="col-12 d-flex justify-content-between px-5 mb-3">
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
                            this.setState({ qnaIsOpen: !this.state.qnaIsOpen })
                        }
                    >
                        <i className="me-2 bi bi-chat-right-dots"></i>
                        Q&A
                    </div>
                </div>
                <div id={"offcanvasContainer"}>
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
                            {/* <p className="mb-0">
                                <i className="me-2 bi bi-list"></i>
                                Close NavBar
                            </p> */}
                        </OffcanvasHeader>
                        <OffcanvasBody>
                            <ConnectedSideBar
                                toggleSideBar={() =>
                                    this.setState({
                                        navbarIsOpen: !this.state.navbarIsOpen,
                                    })
                                }
                                setCurrentUnit={(newCurrentUnit) => {
                                    this.setState({
                                        currentUnit: newCurrentUnit,
                                    });
                                }}
                                currentUnit={this.state.currentUnit}
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
                            <strong>This is the Offcanvas body.</strong>
                        </OffcanvasBody>
                    </Offcanvas>
                </div>
                <div className="col-9 d-flex flex-column align-items-center">
                    <p>{subheadingName || "Content not available"}</p>

                    <p>{subheadingDisc}</p>

                    {subheadingFileType === 1 ? (
                        <ReactPlayer
                            url={subheadingLink}
                            className="my-5"
                            width={"100%"}
                            controls
                            height={"50vh"}
                        />
                    ) : (
                        <Button
                            size="lg"
                            className="w-25 mb-5 fw-bold rounded-5 p-3"
                            onClick={() =>
                                window.open({ subheadingLink }, "_blank")
                            }
                            // disabled
                        >
                            <i className="bi bi-book-half me-2"></i> Read
                            Document
                        </Button>
                    )}
                    {/* TODO add write up? */}
                    <ListGroup className="w-50">
                        <ListGroupItem className="py-4 pb-0">
                            <strong>{question}</strong>
                            <p className="fw-light mt-2">This is a question</p>
                        </ListGroupItem>
                        <ListGroupItem action tag="button">
                            <input type="radio" name="lol" className="me-2" />
                            {options[0]}
                        </ListGroupItem>
                    </ListGroup>
                </div>
            </div>
        );
    }
}
export default connect(
    mapStateToprops,
    mapDispatchToProps
)(withRouter(ViewCourse));
