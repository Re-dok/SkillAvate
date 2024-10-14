import React from "react";
import { Button, Nav, NavItem } from "reactstrap";
import withRouter from "./WithRouter";
import { Link } from "react-router-dom";
import { doSignoutUser } from "../Firbase/fireaseConfig";

class Toolbar extends React.Component {
    render() {
        return (
            <div>
                <div className="mx-3 d-flex justify-content-between">
                    <div className="col-lg-3 col-12">
                        <Nav fill pills>
                            <NavItem>
                                <Link
                                    className="nav-link"
                                    active={
                                        this.props.router.location.pathname ===
                                        "/client"
                                            ? true
                                            : false
                                    }
                                    to="/client"
                                >
                                    client
                                </Link>
                            </NavItem>
                            <NavItem>
                                <Link
                                    className="nav-link"
                                    active={
                                        this.props.router.location.pathname ===
                                        "/admin"
                                            ? true
                                            : false
                                    }
                                    to="/admin"
                                >
                                    admin
                                </Link>
                            </NavItem>
                            <NavItem>
                                <Link
                                    className="nav-link"
                                    active={
                                        this.props.router.location.pathname ===
                                        "/trainer"
                                            ? true
                                            : false
                                    }
                                    to="/trainer"
                                >
                                    trainer
                                </Link>
                            </NavItem>
                        </Nav>
                    </div>
                    <div className="my-1">
                        <Button
                            size="sm"
                            onClick={async () => {
                                await doSignoutUser();
                                window.location.reload();
                            }}
                        >
                            sign out
                        </Button>
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(Toolbar);
