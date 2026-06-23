import { useDispatch, useSelector } from "react-redux";
import { registerUser, loginUser, getMe, logoutUser } from "../services/auth.api";
import { setUser, setLoading, setError } from "../auth.slice";

export const useAuth = () => {
    const dispatch = useDispatch();
    const { user, loading, error } = useSelector((state) => state.auth);

    const handleRegister = async (data) => {
        try {
            dispatch(setLoading(true));
            dispatch(setError(null));
            const response = await registerUser(data);
            dispatch(setUser(response.user));
            return response.user;
        } catch (err) {
            const errMsg = err.response?.data?.message || err.message || "Registration failed";
            dispatch(setError(errMsg));
            throw err;
        } finally {
            dispatch(setLoading(false));
        }
    }

    const handleLogin = async (data) => {
        try {
            dispatch(setLoading(true));
            dispatch(setError(null));
            const response = await loginUser(data);
            dispatch(setUser(response.user));
            return response.user;
        } catch (err) {
            const errMsg = err.response?.data?.message || err.message || "Login failed";
            dispatch(setError(errMsg));
            throw err;
        } finally {
            dispatch(setLoading(false));
        }
    }
    
    const handleGetMe = async (silent = false) => {
        try {
            dispatch(setLoading(true));
            if (!silent) dispatch(setError(null));
            const response = await getMe();
            dispatch(setUser(response.user));
            return response.user;
        } catch (err) {
            if (!silent) {
                const errMsg = err.response?.data?.message || err.message || "Failed to load user profile";
                dispatch(setError(errMsg));
            }
            throw err;
        } finally {
            dispatch(setLoading(false));
        }
    }

    const handleLogout = async () => {
        try {
            dispatch(setLoading(true));
            await logoutUser();
            dispatch(setUser(null));
        } catch (err) {
            console.error("Logout failed, clearing user state locally:", err);
            dispatch(setUser(null));
        } finally {
            dispatch(setLoading(false));
        }
    }

    const clearError = () => {
        dispatch(setError(null));
    }

    return {
        user,
        loading,
        error,
        handleRegister,
        handleLogin,
        handleGetMe,
        getUser: handleGetMe, // For backward compatibility
        handleLogout,
        clearError
    }
}
