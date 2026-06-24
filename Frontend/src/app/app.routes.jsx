import { createBrowserRouter } from "react-router";
import App from "./App";
import Login from "../Features/Auth/pages/Login";
import Register from "../Features/Auth/pages/Register";
import Dashboard from "../Features/Chat/pages/Dashboard";
import Protected from "../Features/Auth/components/Protected";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                path: "",
                element: (
                    <Protected>
                        <Dashboard />
                    </Protected>
                )
            },
            {
                path: "login",
                element: <Login />
            },
            {
                path: "register",
                element: <Register />
            }
        ]
    }
]);


export default router;

