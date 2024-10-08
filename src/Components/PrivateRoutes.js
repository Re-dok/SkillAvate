import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
// FIXME no route added for admin
export const AdminRoute = ({ children }) => {
    if ("admi"=== "admin") return children;
    else return <Navigate to={"/"} />;
};
export const ClientRoute = ({ children}) => {
    const isTrainer=useSelector((state)=>state.user.isTrainer)
    if (!isTrainer) return children;
    else return <Navigate to={"/"} />;
};
export const TrainerRoute = ({ children }) => {
    const isTrainer=useSelector((state)=>state.user.isTrainer)
    if (isTrainer) return children;
    else return <Navigate to={"/"} />;
};
