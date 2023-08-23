let errorLogger = (err, req, res, next) => {
    res.send(err.message);
    next(err);
}
module.exports = errorLogger;