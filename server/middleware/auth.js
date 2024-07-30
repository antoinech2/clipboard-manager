function auth(req, res, next) {
    try{
        if (!req.cookies.user) {
            //get authorization
            var authHeader = req.headers.authorization;
            if (!authHeader) {
                var err = new Error('You are not authenticated!');
                //res.setHeader('WWW-Authenticate', 'Basic');
                err.status = 401;
                next(err);
                return;
            }
            //If this client request does not include the authorization information
            var auth = new Buffer.from(authHeader.split(' ')[1], 'base64').toString();
            if (auth == process.env.AUTH_PASSWORD) {
                sendUserCookie(res)
                next();  // user authorized
            } else {
                var err = new Error('You are not authenticated!');
                //res.setHeader('WWW-Authenticate', 'Basic');
                err.status = 401;
                next(err);
            }
        }
        else {
            //client request has cookie, check is valid
            if (req.cookies.user === process.env.AUTH_PASSWORD) {
                next();
            }
            else {
                var err = new Error('You are not authenticated!');
                err.status = 401;
                next(err);
            }
        }    
    }
    catch(err){
        next(err);
        console.log(err)
    }
}

// sentUserCookie creates a cookie which expires after one day
const sendUserCookie = (res) => {
    // Our token expires after one week
    const expiresIn = 24 * 60 * 60 * 1000 * 7;
    res.cookie('user', process.env.AUTH_PASSWORD, { maxAge: expiresIn });
};

module.exports = auth;