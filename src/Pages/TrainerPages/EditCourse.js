import React, { Component } from "react";
import { Offcanvas, OffcanvasHeader, OffcanvasBody } from "reactstrap";
import { doGetCourseDetails } from "../../features/course/courseSlice";
import { connect } from "react-redux";
import withRouter from "../../Components/WithRouter";
import TrainerContentCard from "../../Components/TrainerComponets/TrainerContentCard";
import TrainerCourseInfoCard from "../../Components/TrainerComponets/TrainerCourseInfoCard";
import SideBar from "../../Components/TrainerComponets/SideBar";
import ConnectedNewUnitCard from "../../Components/TrainerComponets/NewUnitCard";

class EditCourse extends Component {
    constructor(props) {
        super(props);
        this.state = {
            openUnit: [-1, -1, -1],
            courseProgress: [0, 0, 0, 0, 0, false],
            navbarIsOpen: false,
            qnaIsOpen: false,
            // based on the type different components are renderd
            // 0 for content edit
            // 1 for basic info edit
            unitType: 1,
            newUnitHeadings:[],
            newUnitCoordinates:[]
        };
    }
    async componentDidMount() {
        window.scrollTo(0, 0);
        let { courseData, doGetCourseDetails } = this.props;
        const { courseId } = this.props.params;
        if (courseData === undefined || courseData.length === 0) {
            await doGetCourseDetails(courseId);
            courseData = this.props.courseData;
        }
        // if the course doesnt exist or the course isnt yours to edit, you cant open it
        if (
            courseData === undefined ||
            courseData.length === 0 ||
            courseData[0]?.createrEmail !== this.props.userEmail
        ) {
            this.props.navigate("/notFound");
            return;
        }
    }
    render() {
        if (this.props.isLoading) return <>Loading...</>;
        else {
            const { unitType } = this.state;
            return (
                <div className="row m-0">
                    {/* Button for sidebar on mobile */}
                    <div
                        color="primary"
                        role="button"
                        className="border col-auto position-absolute end-0 border-4 shadow rounded-pill p-2 px-3 d-lg-none d-inline-flex align-items-center align-content-center flex-wrap me-2"
                        onClick={() =>
                            this.setState({
                                navbarIsOpen: !this.state.navbarIsOpen,
                            })
                        }
                    >
                        <i className="me-2 bi bi-list"></i>
                        Navigate
                    </div>
                    {/* sidebar for mobiles and tabs*/}
                    <div id={"offcanvasContainer"} className="d-lg-none">
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
                                    // courseProgress={this.state.courseProgress}
                                    courseData={this.props.courseData[0]}
                                    setOpenUnit={(newUnit, unitType = 0,newUnitCoordinates=[],headings=[]) => {
                                        this.setState({
                                            openUnit: newUnit,
                                            unitType: unitType,
                                            newUnitCoordinates,
                                            headings
                                        });
                                    }}
                                    toggleSideBar={() => {
                                        this.setState({
                                            navbarIsOpen:
                                                !this.state.navbarIsOpen,
                                        });
                                    }}
                                    unitType={this.state.unitType}
                                    isCanvas={true}
                                    // isComplete={this.state.isComplete}
                                />
                            </OffcanvasBody>
                        </Offcanvas>
                    </div>
                    {/* sideBar for computers */}
                    <div className="col-lg-3 d-none d-lg-block"></div>
                    <div className="col-lg-3 d-none d-lg-block h-100 overflow-y-scroll position-fixed pb-5 mb-5">
                        <SideBar
                            openUnit={this.state.openUnit}
                            //     courseProgress={this.state.courseProgress}
                            courseData={this.props.courseData[0]}
                            setOpenUnit={(newUnit, unitType = 0,newUnitCoordinates=[],headings=[]) => {
                                this.setState({
                                    openUnit: newUnit,
                                    unitType: unitType,
                                    newUnitCoordinates,
                                    headings
                                });
                            }}
                            unitType={this.state.unitType}
                            isCanvas={false}
                            //     isComplete={this.state.isComplete}
                        />
                        <div className="my-5"></div>
                    </div>
                    {/* main content*/}
                    {unitType === 0 && (
                        <div className="col-lg-9 col bg-grey py-5 px-lg-5">
                            <TrainerContentCard
                                modules={this.props.courseData[0]?.modules}
                                openUnit={this.state.openUnit || null}
                                courseName={
                                    this.props.courseData[0]?.courseName
                                }
                                createrName={
                                    this.props.courseData[0]?.createrName
                                }
                            />
                        </div>
                    )}
                    {unitType === 1 && (
                        <div className="col-lg-9 col px-lg-5">
                            <TrainerCourseInfoCard
                                courseName={
                                    this.props.courseData[0]?.courseName
                                }
                                courseId={this.props.courseData[0]?.courseId}
                                createrName={
                                    this.props.courseData[0]?.createrName
                                }
                                createrEmail={
                                    this.props.courseData[0]?.createrEmail
                                }
                                courseDiscp={
                                    this.props.courseData[0]?.courseDiscp
                                }
                            />
                        </div>
                    )}
                    {unitType === 2 && (
                        <div className="col-lg-9 col bg-grey py-5 px-lg-5">
                            <ConnectedNewUnitCard
                                modules={this.props.courseData[0]?.modules}
                                headings={this.state.newUnitHeadings}
                                courseName={
                                    this.props.courseData[0]?.courseName
                                }
                                createrName={
                                    this.props.courseData[0]?.createrName
                                }
                                setOpenUnit={() => {
                                    this.setState({
                                        openUnit: [-1,-1,-1],
                                        unitType: 1,
                                    });
                                }}
                            />
                        </div>
                    )}
                </div>
            );
        }
    }
}
const mapStatesToProps = (state) => ({
    // TODO are these || working the way you think they are?
    isLoading: state.course.courseLoading,
    error: state.course.courseError || state.user.error,
    success: state.course.courseSuccess || state.user.success,
    courseData: state.course.course,
    userEmail: state.user.userCredentials.email,
});
const mapDispatchToProps = {
    doGetCourseDetails,
};
export default connect(
    mapStatesToProps,
    mapDispatchToProps
)(withRouter(EditCourse));
