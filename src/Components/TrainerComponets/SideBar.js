import React, { Component } from "react";
import {
    ListGroup,
    ListGroupItem,
    Collapse,
    Modal,
    Button,
    ModalBody,
    Input,
    FormFeedback,
} from "reactstrap";
import { doUpdateHeadingName } from "../../features/course/courseSlice";
import { connect } from "react-redux";
class SideBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            openModule: -1,
            openHeading: -1,
            currentSubheading: -1,
            showModal: false,
            isLoading: false,
            modalMsg: null,
            coordinatesTochange: null,
            newName: "",
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
            if (prevProps.openUnit[3] !== this.props.openUnit[3])
                window.scrollTo(0, 0);
            this.setState({
                openModule: moduleNumber,
                openHeading: headingNumber,
                currentSubheading: subHeadingNumber,
            });
        }
    }

    handleSetIndex(isOpen, hasContent) {
        if (isOpen) {
            if (hasContent) return 0;
            else return 1;
        } else {
            if (hasContent) {
                return 2;
            } else {
                return 1;
            }
        }
    }
    render() {
        const { courseData, unitType } = this.props;
        if (!this.props.courseData) return <>Loading</>;
        else {
            const { isLoading, modalMsg, newName, coordinatesTochange } =
                this.state;
            const handleEditHeadingName = (
                e,
                oldName,
                moduleNumber,
                headingNumber = null
            ) => {
                e.stopPropagation();
                this.setState({
                    showModal: true,
                    coordinatesTochange: [moduleNumber, headingNumber],
                    newName: oldName,
                });
            };
            const dochangeName = () => {
                this.setState({ isLoading: true });
                const resp = this.props.doUpdateHeadingName({
                    newName,
                    moduleNumber: coordinatesTochange[0],
                    headingNumber: coordinatesTochange[1],
                });
                if (resp.error)
                    this.setState({
                        isLoading: false,
                        modalMsg: "Somthing went wrong! Please try again!",
                    });
                else
                    this.setState({
                        isLoading: false,
                        modalMsg: "Changes Saved!",
                    });
            };
            const onChangeValue = (e) => {
                let { name, value } = e.target;
                this.setState({ [name]: value });
            };
            const onBlurValue = (e) => {
                let { name, value } = e.target;
                // Trim leading and trailing whitespace on blur
                this.setState({
                    [name]: value?.replace(/\s+/g, " ").trim() || "",
                });
            };
            return (
                <div className="mt-5">
                    <div className="px-2 mb-3 fs-6 fw-bold">
                        {courseData?.courseName}
                    </div>
                    <div
                        role="button"
                        className={
                            "fs-6 mb-3 p-2 py-3 border border-2 rounded d-flex align-content-center align-items-center justify-content-between" +
                            (unitType === 1 ? " bg-secondary text-white" : "")
                        }
                        onClick={() => {
                            this.props.setOpenUnit([-1, -1, -1], 1);
                            this.setState({
                                openModule: -1,
                                openHeading: -1,
                                currentSubheading: -1,
                            });
                            if (this.props.isCanvas) this.props.toggleSideBar();
                        }}
                    >
                        Course Details
                        <i className="bi bi-chevron-right ms-3"></i>
                    </div>
                    <ListGroup>
                        {courseData?.modules?.map((module, moduleNumber) => (
                            <ListGroupItem
                                key={moduleNumber}
                                className="p-0 border-0"
                            >
                                <div
                                    role="button"
                                    onClick={() => {
                                        let isOpen =
                                            this.state.openModule ===
                                            moduleNumber;
                                        let code = this.handleSetIndex(
                                            isOpen,
                                            module?.content
                                        );
                                        switch (code) {
                                            case 1:
                                                let newVal = isOpen
                                                    ? -1
                                                    : moduleNumber;
                                                this.setState({
                                                    openModule: newVal,
                                                    openHeading: -1,
                                                    currentSubheading: -1,
                                                });
                                                break;
                                            case 2:
                                                this.props.setOpenUnit([
                                                    moduleNumber,
                                                    -1,
                                                    -1,
                                                ]);
                                                if (this.props.isCanvas)
                                                    this.props.toggleSideBar();
                                                break;
                                            default:
                                                break;
                                        }
                                    }}
                                    className={
                                        "fs-6 mb-1 p-2 border border-2 rounded d-flex align-content-center align-items-center justify-content-between " +
                                        (this.props.openUnit[0] ===
                                            moduleNumber && module.content
                                            ? "bg-secondary text-light"
                                            : "")
                                    }
                                >
                                    <p>
                                        Module {moduleNumber + 1}
                                        <br></br> {module.moduleName}
                                    </p>
                                    {module.content ? (
                                        <i className="bi bi-chevron-right ms-3"></i>
                                    ) : this.state.openModule ===
                                      moduleNumber ? (
                                        <div style={{ minWidth: "4rem" }}>
                                            <i
                                                className="bi bi-pencil-fill border border-secondary text-secondary px-2 py-1 rounded-circle me-3"
                                                role="button"
                                                onClick={(e) => {
                                                    handleEditHeadingName(
                                                        e,
                                                        module.moduleName,
                                                        moduleNumber
                                                    );
                                                }}
                                                title="Edit Name"
                                            ></i>
                                            <i className="bi bi-chevron-up"></i>
                                        </div>
                                    ) : (
                                        <div style={{ minWidth: "4rem" }}>
                                            <i
                                                className="bi bi-pencil-fill border border-secondary text-secondary px-2 py-1 rounded-circle me-3"
                                                role="button"
                                                title="Edit Name"
                                                onClick={(e) => {
                                                    handleEditHeadingName(
                                                        e,
                                                        module.moduleName,
                                                        moduleNumber
                                                    );
                                                }}
                                            ></i>
                                            <i className="bi bi-chevron-down"></i>
                                        </div>
                                    )}
                                </div>
                                <Collapse
                                    isOpen={
                                        this.state.openModule === moduleNumber
                                    }
                                >
                                    {
                                        <div
                                            key={moduleNumber}
                                            className="mb-3"
                                        >
                                            {module.headings?.map(
                                                (heading, headingNumber) => (
                                                    <div
                                                        className="m-0 ms-2 fs-6 p-0"
                                                        key={headingNumber}
                                                    >
                                                        <div
                                                            className={
                                                                "border mb-1 border-2 div-2 p-3 overflow-hidden d-flex justify-content-between align-items-center align-content-center " +
                                                                (this.props
                                                                    .openUnit[0] ===
                                                                    moduleNumber &&
                                                                this.props
                                                                    .openUnit[1] ===
                                                                    headingNumber &&
                                                                heading.content
                                                                    ? "bg-secondary text-light"
                                                                    : "")
                                                            }
                                                            role="button"
                                                            onClick={() => {
                                                                let isOpen =
                                                                    this.state
                                                                        .openModule ===
                                                                        moduleNumber &&
                                                                    this.state
                                                                        .openHeading ===
                                                                        headingNumber;
                                                                let code =
                                                                    this.handleSetIndex(
                                                                        isOpen,
                                                                        heading?.content
                                                                    );
                                                                switch (code) {
                                                                    case 1:
                                                                        let newVal =
                                                                            isOpen
                                                                                ? -1
                                                                                : headingNumber;
                                                                        this.setState(
                                                                            {
                                                                                openModule:
                                                                                    moduleNumber,
                                                                                openHeading:
                                                                                    newVal,
                                                                                currentSubheading:
                                                                                    -1,
                                                                            }
                                                                        );
                                                                        break;
                                                                    case 2:
                                                                        this.props.setOpenUnit(
                                                                            [
                                                                                moduleNumber,
                                                                                headingNumber,
                                                                                -1,
                                                                            ]
                                                                        );
                                                                        if (
                                                                            this
                                                                                .props
                                                                                .isCanvas
                                                                        )
                                                                            this.props.toggleSideBar();
                                                                        break;
                                                                    default:
                                                                        break;
                                                                }
                                                            }}
                                                        >
                                                            <p>
                                                                {
                                                                    heading.headingName
                                                                }
                                                            </p>

                                                            {heading.content ? (
                                                                <i className="bi bi-chevron-right ms-3"></i>
                                                            ) : this.state
                                                                  .openModule ===
                                                                  moduleNumber &&
                                                              this.state
                                                                  .openHeading ===
                                                                  headingNumber ? (
                                                                <div
                                                                    style={{
                                                                        minWidth:
                                                                            "4rem",
                                                                    }}
                                                                >
                                                                    <i
                                                                        className="bi bi-pencil-fill border border-secondary text-secondary px-2 py-1 rounded-circle"
                                                                        role="button"
                                                                        onClick={(
                                                                            e
                                                                        ) => {
                                                                            handleEditHeadingName(
                                                                                e,
                                                                                heading.headingName,
                                                                                moduleNumber,
                                                                                headingNumber
                                                                            );
                                                                        }}
                                                                        title="Edit Name"
                                                                    ></i>
                                                                    <i className="bi bi-chevron-up ms-2"></i>
                                                                </div>
                                                            ) : (
                                                                <div
                                                                    style={{
                                                                        minWidth:
                                                                            "4rem",
                                                                    }}
                                                                >
                                                                    <i
                                                                        className="bi bi-pencil-fill border border-secondary text-secondary px-2 py-1 rounded-circle"
                                                                        role="button"
                                                                        title="Edit Name"
                                                                        onClick={(
                                                                            e
                                                                        ) => {
                                                                            handleEditHeadingName(
                                                                                e,
                                                                                heading.headingName,
                                                                                moduleNumber,
                                                                                headingNumber
                                                                            );
                                                                        }}
                                                                    ></i>
                                                                    <i className="bi bi-chevron-down ms-2"></i>
                                                                </div>
                                                            )}
                                                        </div>
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
                                                            {heading.subheadings?.map(
                                                                (
                                                                    subheading,
                                                                    i
                                                                ) => (
                                                                    <div
                                                                        key={i}
                                                                        className={
                                                                            "ms-3 my-1 p-3 border border-2 rounded-pill d-flex align-content-center align-items-center justify-content-between " +
                                                                            (this
                                                                                .props
                                                                                .openUnit[2] ===
                                                                            i
                                                                                ? "bg-secondary text-light"
                                                                                : "")
                                                                        }
                                                                        role="button"
                                                                        onClick={() => {
                                                                            let isOpen =
                                                                                this
                                                                                    .state
                                                                                    .currentSubheading ===
                                                                                i;
                                                                            let code =
                                                                                this.handleSetIndex(
                                                                                    isOpen,
                                                                                    true
                                                                                );
                                                                            switch (
                                                                                code
                                                                            ) {
                                                                                case 2:
                                                                                    this.props.setOpenUnit(
                                                                                        [
                                                                                            moduleNumber,
                                                                                            headingNumber,
                                                                                            i,
                                                                                        ]
                                                                                    );
                                                                                    if (
                                                                                        this
                                                                                            .props
                                                                                            .isCanvas
                                                                                    )
                                                                                        this.props.toggleSideBar();
                                                                                    break;
                                                                                default:
                                                                                    break;
                                                                            }
                                                                        }}
                                                                    >
                                                                        {
                                                                            subheading.subheadingName
                                                                        }
                                                                        {
                                                                            <i className="bi bi-chevron-right ms-3"></i>
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
                    <Modal isOpen={this.state.showModal}>
                        <ModalBody className="pb-3 rounded p-4 justify-content-center">
                            <p className="d-flex justify-content-center mb-2">
                                {modalMsg ? (
                                    modalMsg
                                ) : (
                                    <div className="fw-bold mb-3 w-100">
                                        <i className="bi bi-pencil-fill me-2"></i>
                                        Edit Name :
                                        <Input
                                            rows="1"
                                            required
                                            className="mt-1 py-2 mb-0 border-0 border-bottom border-3"
                                            value={newName}
                                            placeholder="New Name"
                                            name="newName"
                                            onChange={onChangeValue}
                                            invalid={newName.length === 0}
                                            onBlur={onBlurValue}
                                        />
                                        <FormFeedback invalid>
                                            Name can not be empty!
                                        </FormFeedback>
                                    </div>
                                )}
                            </p>
                            <div className="col gap-3 mx-auto d-flex justify-content-center">
                                {!modalMsg && (
                                    <Button
                                        className="rounded-3 py-2 fw-bold"
                                        size="sm"
                                        color="success"
                                        onClick={dochangeName}
                                        disabled={
                                            newName.length === 0 || isLoading
                                        }
                                    >
                                        {isLoading ? "Loading..." : "Save"}
                                    </Button>
                                )}
                                <Button
                                    className="rounded-3 py-2 fw-bold"
                                    size="sm"
                                    color="warning"
                                    disabled={isLoading}
                                    onClick={() => {
                                        this.setState({
                                            showModal: false,
                                            isLoading: false,
                                            modalMsg: null,
                                            coordinatesTochange: null,
                                            newName: "",
                                        });
                                    }}
                                >
                                    {modalMsg ? "Close" : "Cancel"}
                                </Button>
                            </div>
                        </ModalBody>
                    </Modal>
                </div>
            );
        }
    }
}
const mapDispatchToProps = {
    doUpdateHeadingName,
};
export default connect(null, mapDispatchToProps)(SideBar);
