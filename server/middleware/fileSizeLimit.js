function fileSizeLimitMiddleware(req, res, next) {
    if (req.headers["content-length"] > 1024 * 1024 * 11) {
        return res.status(413).json({ error: 'Note size limit is 10MB' })
    }
    next()
}

module.exports = fileSizeLimitMiddleware;