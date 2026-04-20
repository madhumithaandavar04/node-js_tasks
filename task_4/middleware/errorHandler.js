// error handler middleware to handle error
export const errorhandler = (error, req, res, next) => {
    const statusCode = error.status || 500;
    return res.status(statusCode).send(error.message);
}
