import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

// FIXME maybe redirect to aa not 'dont have access page', do this after chaging the logoin logics 3 layres
export const AdminRoute = ({ children }) => {
    const isAdmin = useSelector((state) => state.user.isAdmin);
    const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
    if (isLoggedIn && isAdmin === true) return children;
    else if (isLoggedIn) return <Navigate to={"/notFound"} />;
    else return <Navigate to={"/"} />;
};
export const ClientRoute = ({ children }) => {
    const isTrainer = useSelector((state) => state.user.isTrainer);
    const isAdmin = useSelector((state) => state.user.isAdmin);
    const isLoggedIn = useSelector((state) => state.user.isLoggedIn);

    if (isLoggedIn && isAdmin === false && isTrainer === false) return children;
    else if (isLoggedIn) return <Navigate to={"/notFound"} />;
    else return <Navigate to={"/"} />;
};
export const TrainerRoute = ({ children }) => {
    const isTrainer = useSelector((state) => state.user.isTrainer);
    const isAdmin = useSelector((state) => state.user.isAdmin);
    const isLoggedIn = useSelector((state) => state.user.isLoggedIn);

    if (isLoggedIn && isAdmin !== true && isTrainer === true) return children;
    else if (isLoggedIn) return <Navigate to={"/notFound"} />;
    else return <Navigate to={"/"} />;
};
