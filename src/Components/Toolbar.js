import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import {
    NavbarBrand,
    Dropdown,
    DropdownItem,
    DropdownToggle,
    DropdownMenu,
    Tooltip,
} from "reactstrap";
import withRouter from "./WithRouter";
import { connect } from "react-redux";
import { doSignOut } from "../Features/user/userSlice";

class Toolbar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            drawIsOpen: false,
            burgerIsopen: false,
            tooltipOpen: false,
        };
    }
    toggleIsOpen = () => {
        this.setState({
            drawIsOpen: !this.state.drawIsOpen,
            tooltipOpen: false,
        });
    };
    toggleBurger = () => {
        this.setState({ burgerIsopen: !this.state.burgerIsopen });
    };
    handleSignOut = () => {
        this.props.doSignOut();
    };
    render() {
        const { isTrainer, isAdmin } = this.props;
        return (
            <div className="sticky-top-toolbar">
                <div className="shadow d-flex flex-row justify-content-between align-items-center mb-2 px-3 px-sm-5 py-3 border-dark">
                    <NavbarBrand className="brand-text" href="/">
                        DecHealth
                    </NavbarBrand>

                    <div className="d-sm-flex d-none gap-3 gap-sm-5">
                        {isTrainer === false && isAdmin === false && (
                            <>
                                <NavLink
                                    className="text-decoration-none nav-text gap-2 d-flex"
                                    to="/myCourses"
                                >
                                    {this.props.router.location.pathname ===
                                    "/myCourses" ? (
                                        <i className="bi bi-house-fill text-info"></i>
                                    ) : (
                                        <i className="bi bi-house"></i>
                                    )}
                                    My Courses
                                </NavLink>
                                {!this.props.unAssigned && (
                                    <NavLink
                                        to="/explore"
                                        className="text-decoration-none nav-text d-flex gap-2"
                                    >
                                        {this.props.router.location.pathname ===
                                        "/explore" ? (
                                            <i className="bi bi-binoculars-fill text-info"></i>
                                        ) : (
                                            <i className="bi bi-binoculars"></i>
                                        )}
                                        Explore
                                    </NavLink>
                                )}
                            </>
                        )}
                        {
                            // this.props
                            isTrainer === false && isAdmin === true && (
                                <>
                                    <NavLink
                                        className="text-decoration-none nav-text gap-2 d-flex"
                                        to="/dashboard"
                                    >
                                        {this.props.router.location.pathname ===
                                        "/dashboard" ? (
                                            <i className="bi bi-easel-fill text-info"></i>
                                        ) : (
                                            <i className="bi bi-easel"></i>
                                        )}
                                        Dashboard
                                    </NavLink>
                                </>
                            )
                        }
                        {
                            // this.props
                            (isTrainer === true || isAdmin === true) && (
                                <>
                                    <NavLink
                                        className="text-decoration-none nav-text gap-2 d-flex"
                                        to="/courses"
                                    >
                                        {this.props.router.location.pathname ===
                                        "/courses" ? (
                                            <i className="bi bi-house-fill text-info"></i>
                                        ) : (
                                            <i className="bi bi-house"></i>
                                        )}
                                        My Courses
                                    </NavLink>
                                    <NavLink
                                        to={"/myClients"}
                                        className="text-decoration-none nav-text d-flex gap-2"
                                    >
                                        {this.props.router.location.pathname ===
                                        "/myClients" ? (
                                            <i className="bi bi-people-fill text-info"></i>
                                        ) : (
                                            <i className="bi bi-people"></i>
                                        )}
                                        My Clients
                                    </NavLink>
                                </>
                            )
                        }
                        <Dropdown
                            isOpen={this.state.drawIsOpen}
                            toggle={this.toggleIsOpen}
                            menuRole="menu"
                            className="d-none d-sm-block"
                        >
                            <DropdownToggle tag={"i"} title="">
                                {!this.props.username ? (
                                    <i
                                        className="bi bi-person-circle"
                                        style={{ fontSize: "24px" }}
                                    />
                                ) : (
                                    <div
                                        className="bg-danger bg-black-hover position-relative rounded-circle d-flex justify-content-center align-content-center pe-auto"
                                        style={{
                                            height: "35px",
                                            width: "35px",
                                            cursor: "pointer",
                                        }}
                                        id="TooltipExample"
                                    >
                                        <span
                                            className="fw-light position-absolute top-50 start-50 translate-middle"
                                            style={{
                                                fontSize: "20px",
                                                color: "white",
                                            }}
                                        >
                                            {this.props.username
                                                .charAt(0)
                                                .toUpperCase()}
                                        </span>
                                        <Tooltip
                                            isOpen={
                                                this.state.tooltipOpen &&
                                                !this.state.drawIsOpen
                                            }
                                            target="TooltipExample"
                                            toggle={() => {
                                                this.setState({
                                                    tooltipOpen:
                                                        !this.state.tooltipOpen,
                                                });
                                            }}
                                        >
                                            {this.props.username}
                                        </Tooltip>
                                    </div>
                                )}
                            </DropdownToggle>
                            <DropdownMenu>
                                <DropdownItem>
                                    <NavLink
                                        to={
                                            isTrainer === false &&
                                            isAdmin === false
                                                ? "/settings"
                                                : "mySettings"
                                        }
                                        className="text-decoration-none nav-text d-flex gap-2"
                                    >
                                        {isTrainer === false &&
                                        isAdmin === false ? (
                                            this.props.router.location
                                                .pathname === "/settings" ? (
                                                <i className="bi bi-gear-fill text-info"></i>
                                            ) : (
                                                <i className="bi bi-gear"></i>
                                            )
                                        ) : this.props.router.location
                                              .pathname === "/mySettings" ? (
                                            <i className="bi bi-gear-fill text-info"></i>
                                        ) : (
                                            <i className="bi bi-gear"></i>
                                        )}
                                        settings
                                    </NavLink>
                                </DropdownItem>
                                <DropdownItem onClick={this.handleSignOut}>
                                    <NavLink
                                        to="/"
                                        className="text-decoration-none nav-text d-flex gap-2"
                                    >
                                        <i className="bi bi-box-arrow-right"></i>
                                        Logout
                                    </NavLink>
                                </DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </div>

                    <div className="d-sm-none">
                        <Dropdown
                            isOpen={this.state.burgerIsopen}
                            toggle={this.toggleBurger}
                        >
                            <DropdownToggle tag={"button"} className="border-0">
                                <i className="bi bi-list"></i>
                            </DropdownToggle>
                            <DropdownMenu>
                                <DropdownItem text>
                                    Logged In as:
                                    <p
                                        style={{
                                            maxWidth: "40vw",
                                            display: "flex",
                                            overflow: "clip",
                                            fontSize: "15px",
                                        }}
                                    >
                                        {this.props.username}
                                    </p>
                                </DropdownItem>
                                <DropdownItem divider />
                                {isTrainer === false && isAdmin === false && (
                                    <>
                                        <DropdownItem>
                                            <NavLink
                                                className="text-decoration-none nav-text gap-2 d-flex"
                                                to="/myCourses"
                                            >
                                                {this.props.router.location
                                                    .pathname ===
                                                "/myCourses" ? (
                                                    <i className="bi bi-house-fill text-info"></i>
                                                ) : (
                                                    <i className="bi bi-house"></i>
                                                )}
                                                My Courses
                                            </NavLink>
                                        </DropdownItem>
                                        {!this.props.unAssigned && (
                                            <DropdownItem>
                                                <NavLink
                                                    to="/explore"
                                                    className="text-decoration-none nav-text d-flex gap-2"
                                                >
                                                    {this.props.router.location
                                                        .pathname ===
                                                    "/explore" ? (
                                                        <i className="bi bi-binoculars-fill text-info"></i>
                                                    ) : (
                                                        <i className="bi bi-binoculars"></i>
                                                    )}
                                                    Explore
                                                </NavLink>
                                            </DropdownItem>
                                        )}
                                    </>
                                )}
                                {
                                    // this.props
                                    isTrainer === false && isAdmin === true && (
                                        <>
                                            <DropdownItem>
                                                <NavLink
                                                    className="text-decoration-none nav-text gap-2 d-flex"
                                                    to="/dashboard"
                                                >
                                                    {this.props.router.location
                                                        .pathname ===
                                                    "/dashboard" ? (
                                                        <i className="bi bi-easel-fill text-info"></i>
                                                    ) : (
                                                        <i className="bi bi-easel"></i>
                                                    )}
                                                    Dashboard
                                                </NavLink>
                                            </DropdownItem>
                                        </>
                                    )
                                }
                                {(isTrainer === true || isAdmin === true) && (
                                    <>
                                        <DropdownItem>
                                            <NavLink
                                                className="text-decoration-none nav-text gap-2 d-flex"
                                                to="/courses"
                                            >
                                                {this.props.router.location
                                                    .pathname === "/courses" ? (
                                                    <i className="bi bi-house-fill text-info"></i>
                                                ) : (
                                                    <i className="bi bi-house"></i>
                                                )}
                                                My Courses
                                            </NavLink>
                                        </DropdownItem>
                                        <DropdownItem>
                                            <NavLink
                                                to={"/myClients"}
                                                className="text-decoration-none nav-text d-flex gap-2"
                                            >
                                                {this.props.router.location
                                                    .pathname ===
                                                "/myClients" ? (
                                                    <i className="bi bi-people-fill text-info"></i>
                                                ) : (
                                                    <i className="bi bi-people"></i>
                                                )}
                                                My Clients
                                            </NavLink>
                                        </DropdownItem>
                                    </>
                                )}
                                <DropdownItem>
                                    <NavLink
                                        to={
                                            isTrainer === false &&
                                            isAdmin === false
                                                ? "/settings"
                                                : "mySettings"
                                        }
                                        className="text-decoration-none nav-text d-flex gap-2"
                                    >
                                        {isTrainer === false &&
                                        isAdmin === false ? (
                                            this.props.router.location
                                                .pathname === "/settings" ? (
                                                <i className="bi bi-gear-fill text-info"></i>
                                            ) : (
                                                <i className="bi bi-gear"></i>
                                            )
                                        ) : this.props.router.location
                                              .pathname === "/mySettings" ? (
                                            <i className="bi bi-gear-fill text-info"></i>
                                        ) : (
                                            <i className="bi bi-gear"></i>
                                        )}
                                        settings
                                    </NavLink>
                                </DropdownItem>
                                <DropdownItem divider />

                                <DropdownItem onClick={this.handleSignOut}>
                                    <NavLink
                                        to="/login"
                                        className="text-decoration-none nav-text d-flex gap-2"
                                    >
                                        <i className="bi bi-box-arrow-right"></i>
                                        Logout
                                    </NavLink>
                                </DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </div>
                </div>
            </div>
        );
    }
}
const mapDispatchToProps = {
    doSignOut,
};
const mapStateToProps = (state) => ({
    username: state.user.userCredentials.email,
    isAdmin: state.user?.isAdmin || false,
    isTrainer: state.user.isTrainer,
    unAssigned: state.user.unAssigned,
});
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withRouter(Toolbar));
