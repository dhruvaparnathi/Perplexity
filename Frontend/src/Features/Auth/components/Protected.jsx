import { useSelector } from "react-redux";
import { Navigate } from "react-router";

const Protected = ({ children }) => {
    const { user, loading } = useSelector((state) => state.auth);

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-950">
                <div className="w-12 h-12 rounded-full border border-zinc-900 border-t-zinc-100 animate-spin" />
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return children;
}

export default Protected;