import React, { Component } from "react";
import { Button } from "reactstrap";
import withRouter from "../Components/WithRouter";
import { connect } from "react-redux";
import { setInitialURL } from "../Features/user/userSlice";
class NotFound extends Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {
        this.props.setInitialURL("/notFound");
    }
    handleClick = () => {
        const { isTrainer, isAdmin, navigate, isLoggedIn } = this.props;
        navigate(
            !isLoggedIn
                ? "/"
                : isAdmin === true
                ? "/courses"
                : isTrainer
                ? "/courses"
                : "/myCourses"
        );
    };
    render() {
        return (
            <div className="d-flex justify-content-center align-items-center pt-5 flex-column gap-5">
                <div className="w-50 h-50 d-flex justify-content-center">
                    We were not able to find the page you were looking for!
                </div>
                <Button style={{ width: "15rem" }} onClick={this.handleClick}>
                    Go back to home!
                </Button>
            </div>
        );
    }
}
const mapDispatchToProps = {
    setInitialURL,
};
const mapStateToProps = (state) => {
    return {
        isTrainer: state.user.isTrainer,
        isAdmin: state.user.isAdmin,
        initialURL: state.user.initialURL,
        isLoggedIn: state.user.isLoggedIn,
    };
};
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withRouter(NotFound));
