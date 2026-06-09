import { validationResult } from "express-validator";

function validationMiddleware(err, req, res, next) {
    const statusCode = err.status || 500;
    res.status(statusCode).json({
        message: err.message || "Internal server error",
    });
}

export default validationMiddleware;