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
import { doUpdateHeadingName } from "../../Features/course/courseSlice";
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
            showUnitModal: false,
            unitModalMsg: null,
            unitModalResp: false,
            newHeading: null,
            newModule: null,
            newSubheading: null,
            unitDepth: 0,
            moduleCoordiantes: [],
            // depending on the depth we handle one of the 6 cases, in which we add new units
            // 0 module lvl
            // 1 heading lvl
            // 2 subheading lvl
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
            const {
                isLoading,
                modalMsg,
                newName,
                coordinatesTochange,
                unitModalMsg,
                showUnitModal,
                newModule,
                newHeading,
                newSubheading,
                unitDepth,
                moduleCoordiantes,
            } = this.state;
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
                        modalMsg: "Something went wrong! Please try again!",
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
            const unitIsValid = (() => {
                if (unitDepth === 2)
                    return newSubheading === null || newSubheading.length === 0;
                if (unitDepth === 1)
                    return newHeading === null || newHeading.length === 0;
                if (unitDepth === 0)
                    return newModule === null || newModule.length === 0;
            })();
            const handleAddUnit = (
                moduleNumber,
                headingNumber = -1,
                subheadingNumber = -1
            ) => {
                let unitDepth = 2;
                if (headingNumber === -1) {
                    unitDepth = 0;
                } else if (subheadingNumber === -1) {
                    unitDepth = 1;
                }
                this.setState({
                    moduleCoordiantes: [
                        moduleNumber,
                        headingNumber,
                        subheadingNumber,
                    ],
                    showUnitModal: true,
                    unitDepth,
                });
            };
            const doAddUnit = () => {
                const headings = [newModule, newHeading, newSubheading];
                this.props.setOpenUnit(
                    [-1, -1, -1],
                    2,
                    moduleCoordiantes,
                    headings
                );
                this.setState({
                    showUnitModal: false,
                    unitModalMsg: null,
                    unitModalResp: false,
                    newHeading: null,
                    newModule: null,
                    newSubheading: null,
                    unitDepth: 2,
                    isLoading: false,
                });
                if (this.props.isCanvas) this.props.toggleSideBar();
            };
            return (
                <div className={"mt-5"}>
                    {!this.props.noNav ? (
                        <div className="">
                            <div className="px-2 mb-3 fs-6 fw-bold">
                                {courseData?.courseName}
                            </div>
                            <div
                                role="button"
                                className={
                                    "fs-6 mb-3 p-2 py-3 border border-2 rounded d-flex align-content-center align-items-center justify-content-between" +
                                    (unitType === 1
                                        ? " bg-secondary text-white"
                                        : "")
                                }
                                onClick={() => {
                                    this.props.setOpenUnit([-1, -1, -1], 1);
                                    this.setState({
                                        openModule: -1,
                                        openHeading: -1,
                                        currentSubheading: -1,
                                    });
                                    if (this.props.isCanvas)
                                        this.props.toggleSideBar();
                                }}
                            >
                                Course Details
                                <i className="bi bi-chevron-right ms-3"></i>
                            </div>
                            <ListGroup>
                                {courseData?.modules?.map(
                                    (module, moduleNumber) => (
                                        <ListGroupItem
                                            key={moduleNumber}
                                            className="p-0 border-0"
                                        >
                                            <div
                                                role="button"
                                                onClick={() => {
                                                    let isOpen =
                                                        this.state
                                                            .openModule ===
                                                        moduleNumber;
                                                    let code =
                                                        this.handleSetIndex(
                                                            isOpen,
                                                            module?.content
                                                        );
                                                    switch (code) {
                                                        case 1:
                                                            let newVal = isOpen
                                                                ? -1
                                                                : moduleNumber;
                                                            this.setState({
                                                                openModule:
                                                                    newVal,
                                                                openHeading: -1,
                                                                currentSubheading:
                                                                    -1,
                                                            });
                                                            break;
                                                        case 2:
                                                            this.props.setOpenUnit(
                                                                [
                                                                    moduleNumber,
                                                                    -1,
                                                                    -1,
                                                                ]
                                                            );
                                                            if (
                                                                this.props
                                                                    .isCanvas
                                                            )
                                                                this.props.toggleSideBar();
                                                            break;
                                                        default:
                                                            break;
                                                    }
                                                }}
                                                className={
                                                    "fs-6 mb-1 p-2 border border-2 rounded d-flex align-content-center align-items-center justify-content-between " +
                                                    (this.props.openUnit[0] ===
                                                        moduleNumber &&
                                                    module.content
                                                        ? "bg-secondary text-light"
                                                        : "")
                                                }
                                            >
                                                <p>
                                                    Module {moduleNumber + 1}
                                                    <br></br>{" "}
                                                    {module.moduleName}
                                                </p>
                                                {module.content ? (
                                                    <i className="bi bi-chevron-right ms-3"></i>
                                                ) : this.state.openModule ===
                                                  moduleNumber ? (
                                                    <div
                                                        style={{
                                                            minWidth: "4rem",
                                                        }}
                                                    >
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
                                                    <div
                                                        style={{
                                                            minWidth: "4rem",
                                                        }}
                                                    >
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
                                                    this.state.openModule ===
                                                    moduleNumber
                                                }
                                            >
                                                {
                                                    <div
                                                        key={moduleNumber}
                                                        className="mb-3"
                                                    >
                                                        {module.headings?.map(
                                                            (
                                                                heading,
                                                                headingNumber
                                                            ) => (
                                                                <div
                                                                    className="m-0 ms-2 fs-6 p-0"
                                                                    key={
                                                                        headingNumber
                                                                    }
                                                                >
                                                                    <div
                                                                        className={
                                                                            "border mb-1 border-2 div-2 p-3 overflow-hidden d-flex justify-content-between align-items-center align-content-center " +
                                                                            (this
                                                                                .props
                                                                                .openUnit[0] ===
                                                                                moduleNumber &&
                                                                            this
                                                                                .props
                                                                                .openUnit[1] ===
                                                                                headingNumber &&
                                                                            heading.content
                                                                                ? "bg-secondary text-light"
                                                                                : "")
                                                                        }
                                                                        role="button"
                                                                        onClick={() => {
                                                                            let isOpen =
                                                                                this
                                                                                    .state
                                                                                    .openModule ===
                                                                                    moduleNumber &&
                                                                                this
                                                                                    .state
                                                                                    .openHeading ===
                                                                                    headingNumber;
                                                                            let code =
                                                                                this.handleSetIndex(
                                                                                    isOpen,
                                                                                    heading?.content
                                                                                );
                                                                            switch (
                                                                                code
                                                                            ) {
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
                                                                        <p className="me-3 m-0">
                                                                            {
                                                                                heading.headingName
                                                                            }
                                                                        </p>

                                                                        {heading.content ? (
                                                                            <i className="bi bi-chevron-right ms-3"></i>
                                                                        ) : this
                                                                              .state
                                                                              .openModule ===
                                                                              moduleNumber &&
                                                                          this
                                                                              .state
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
                                                                            this
                                                                                .state
                                                                                .openModule ===
                                                                                moduleNumber &&
                                                                            this
                                                                                .state
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
                                                                                    key={
                                                                                        i
                                                                                    }
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
                                                                        {!heading.content && (
                                                                            <div
                                                                                role="button"
                                                                                className={
                                                                                    "ms-3 my-1 p-3 border border-2 rounded-pill d-flex align-content-center align-items-center justify-content-center bg-secondary text-white"
                                                                                }
                                                                                onClick={() =>
                                                                                    handleAddUnit(
                                                                                        moduleNumber,
                                                                                        headingNumber,
                                                                                        heading
                                                                                            .subheadings
                                                                                            ?.length
                                                                                    )
                                                                                }
                                                                            >
                                                                                <i class="bi bi-plus-circle me-2"></i>
                                                                                Add
                                                                                Subheading
                                                                            </div>
                                                                        )}
                                                                    </Collapse>
                                                                </div>
                                                            )
                                                        )}
                                                        {!module.content && (
                                                            <div
                                                                role="button"
                                                                className={
                                                                    "m-0 ms-2 fs-6 p-2 py-3 border border-2 rounded d-flex align-content-center align-items-center justify-content-center bg-secondary text-white"
                                                                }
                                                                onClick={() =>
                                                                    handleAddUnit(
                                                                        moduleNumber,
                                                                        module
                                                                            ?.headings
                                                                            .length
                                                                    )
                                                                }
                                                            >
                                                                <i class="bi bi-plus-circle me-2"></i>
                                                                Add Heading
                                                            </div>
                                                        )}
                                                    </div>
                                                }
                                            </Collapse>
                                        </ListGroupItem>
                                    )
                                )}
                                <ListGroupItem className="p-0 border-0">
                                    <div
                                        role="button"
                                        className={
                                            "fs-6 mb-1 p-2 py-3 border border-2 rounded d-flex align-content-center align-items-center justify-content-center bg-secondary text-white"
                                        }
                                        onClick={() =>
                                            handleAddUnit(
                                                courseData?.modules?.length
                                            )
                                        }
                                    >
                                        <i class="bi bi-plus-circle me-2"></i>
                                        Add Module
                                    </div>
                                </ListGroupItem>
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
                                                    invalid={
                                                        newName.length === 0
                                                    }
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
                                                    newName.length === 0 ||
                                                    isLoading
                                                }
                                            >
                                                {isLoading
                                                    ? "Loading..."
                                                    : "Save"}
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
                            <Modal isOpen={showUnitModal} size="lg">
                                <ModalBody className="pb-3 rounded p-4 justify-content-center">
                                    <p className="d-flex justify-content-center mb-2">
                                        {unitModalMsg ? (
                                            unitModalMsg
                                        ) : (
                                            <div className="w-100 bg-grey p-2 px-3">
                                                <p>Please enter the details</p>

                                                {unitDepth < 1 && (
                                                    <div className="fw-bold mb-3 w-100">
                                                        Module Name :
                                                        <Input
                                                            rows="1"
                                                            required
                                                            className="mt-1 py-2 mb-0 border-0 border-bottom border-3"
                                                            value={newModule}
                                                            name="newModule"
                                                            onChange={
                                                                onChangeValue
                                                            }
                                                            onBlur={onBlurValue}
                                                            invalid={
                                                                newModule ==
                                                                    null ||
                                                                newModule.length ===
                                                                    0
                                                            }
                                                        />
                                                        <FormFeedback invalid>
                                                            Name can not be
                                                            empty!
                                                        </FormFeedback>
                                                    </div>
                                                )}
                                                {unitDepth < 2 && (
                                                    <div className="fw-bold mb-3 w-100">
                                                        Heading Name :
                                                        <Input
                                                            rows="1"
                                                            required
                                                            className="mt-1 py-2 mb-0 border-0 border-bottom border-3"
                                                            value={newHeading}
                                                            onBlur={onBlurValue}
                                                            name="newHeading"
                                                            onChange={
                                                                onChangeValue
                                                            }
                                                            placeholder={
                                                                unitDepth === 1
                                                                    ? ""
                                                                    : "Optional"
                                                            }
                                                            invalid={
                                                                unitDepth === 1
                                                                    ? newHeading ===
                                                                          null ||
                                                                      newHeading?.length ===
                                                                          0
                                                                    : false
                                                            }
                                                        />
                                                        <FormFeedback invalid>
                                                            Name can not be
                                                            empty!
                                                        </FormFeedback>
                                                    </div>
                                                )}
                                                <div className="fw-bold mb-3 w-100">
                                                    Subheading Name :
                                                    <Input
                                                        rows="1"
                                                        required
                                                        className="mt-1 py-2 mb-0 border-0 border-bottom border-3"
                                                        value={newSubheading}
                                                        name="newSubheading"
                                                        onChange={onChangeValue}
                                                        onBlur={onBlurValue}
                                                        placeholder={
                                                            unitDepth === 2
                                                                ? ""
                                                                : "Optional"
                                                        }
                                                        invalid={
                                                            unitDepth === 2
                                                                ? newSubheading ===
                                                                      null ||
                                                                  newSubheading.length ===
                                                                      0
                                                                : false
                                                        }
                                                    />
                                                    <FormFeedback invalid>
                                                        Name can not be empty!
                                                    </FormFeedback>
                                                </div>
                                            </div>
                                        )}
                                    </p>
                                    <div className="col gap-3 mx-auto d-flex justify-content-center">
                                        {!unitModalMsg && (
                                            <Button
                                                className="rounded-3 py-2 fw-bold"
                                                size="sm"
                                                color="success"
                                                onClick={() => {
                                                    this.setState({
                                                        showUnitModal: true,
                                                        unitModalMsg:
                                                            "Fill the Unit Details and Click save to finish the process.",
                                                    });
                                                }}
                                                disabled={unitIsValid}
                                            >
                                                {isLoading
                                                    ? "Loading..."
                                                    : "Next"}
                                            </Button>
                                        )}
                                        <Button
                                            className="rounded-3 py-2 fw-bold"
                                            size="sm"
                                            color="warning"
                                            disabled={isLoading}
                                            onClick={doAddUnit}
                                        >
                                            {unitModalMsg ? "OK" : "Cancel"}
                                        </Button>
                                    </div>
                                </ModalBody>
                            </Modal>
                        </div>
                    ) : (
                        <div className="d-flex justify-content-center align-content-center h-100 my-5 py-5 fw-bold">
                            Please save or discard changes
                        </div>
                    )}
                </div>
            );
        }
    }
}
const mapDispatchToProps = {
    doUpdateHeadingName,
};
export default connect(null, mapDispatchToProps)(SideBar);
