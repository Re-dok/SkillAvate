import { Route, Routes } from "react-router-dom";
import "./App.css";
import LoginPage from "./Pages/LoginPage";
import {
    AdminRoute,
    ClientRoute,
    TrainerRoute,
} from "./Components/PrivateRoutes";
import { useNavigate } from "react-router-dom";
import ResetPassword from "./Pages/ResetPassword";
function App() {
    const navigate = useNavigate();
    return (
        <div>
            <Routes>
                <Route
                    path="/"
                    exact
                    element={<LoginPage navigate={navigate} />}
                />
                <Route
                    path="/admin"
                    exact
                    element={
                        <AdminRoute>
                            <>admin</>
                        </AdminRoute>
                    }
                />
                <Route
                    path="/client"
                    exact
                    element={
                        <ClientRoute>
                            <>client</>
                        </ClientRoute>
                    }
                />
                <Route
                    path="/trainer"
                    exact
                    element={
                        <TrainerRoute>
                            <>client</>
                        </TrainerRoute>
                    }
                />
                <Route path="/resetPassword" element={<ResetPassword />} />
            </Routes>
        </div>
    );
}

export default App;
