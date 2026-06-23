import { createBrowserRouter } from "react-router";
import App from "./App";
import Login from "../Features/Auth/pages/Login";
import Register from "../Features/Auth/pages/Register";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />
    },
    {
        path: "/login",
        element: <Login />
    },
    {
        path: "/register",
        element: <Register />
    }
]);

export default router;