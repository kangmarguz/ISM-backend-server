const errorResponse = (message, code) => {
    const error = new Error(message);
    error.statusCode = code;
    throw error;
};

export default errorResponse;
