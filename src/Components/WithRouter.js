import { useLocation, useNavigate, useParams } from "react-router-dom";

function withRouter(Component) {
    function ComponentWithRouterProp(props) {
        const location = useLocation();
        const navigate = useNavigate();

        return (
            <Component {...props} router={{ location }} navigate={navigate} />
        );
    }

    return ComponentWithRouterProp;
}

export default withRouter;
