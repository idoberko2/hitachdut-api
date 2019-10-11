/**
 * @link https://thecodebarbarian.com/80-20-guide-to-express-error-handling
 * @param fn
 * @return {Function}
 */
function wrapAsync(fn) {
    return function wrapped(req, res, next) {
        fn(req, res, next).catch(err => {
            next(err, req, res);
        });
    };
}

module.exports = wrapAsync;
