
const user = require("../db/models/user");

const jwt = require("jsonwebtoken");

const bcrypt = require("bcrypt");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

const generateToken = (payload) => { 
    return jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: process.env.JWT_EXPIRES_IN });
};

const signup = catchAsync(async (req, res, next) => {
    // res.json({
    //     status: 'success',
    //     message: 'sign up route working'
    // })
    const body = req.body;
    if (!['1', '2'].includes(body.userType)) {
        throw new AppError('Invalid user type', 400);
    
    }
    const newUser = await user.create({
        userType: body.userType,
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        password: body.password,
        confirmPassword: body.confirmPassword
    });
    //

    if (!newUser) {

        return next(new AppError('Failed to create user already exist', 400))
      
    }
    const restult = newUser.toJSON();

    

    delete restult.password;
    delete restult.deletedAt;

    restult.token = generateToken({
        id: restult.id
    })




    return res.status(201).json({
        'status': 'success',
        data: restult
    });
});

const login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return next(new AppError('provide email and password', 400));
    
    }

    const result = await user.findOne({ where: { email } });
    if (!result || !(await bcrypt.compare(password, result.password))) {

        return next(new AppError('icorrect emai or password', 401));
   
    }

    // const isPasswordMatched = await bcrypt.compare(password, result.password);

    // if (!isPasswordMatched) {
    //     res.status(401).json({
    //         status: 'fail',
    //         message: 'icorrect emai or password'
    //     })
    // }

    const token = generateToken({
        id: result.id,
    });
    return res.json({
        status: 'success',
        token
    })
});

const authentication = catchAsync(async (req, res, next) => {
    // 1. get the token from headers
    let idToken = '';
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        // Bearer asfdasdfhjasdflkkasdf
        idToken = req.headers.authorization.split(' ')[1];
    }
    if (!idToken) {
        return next(new AppError('Please login to get access', 401));
    }
    // 2. token verification
    const tokenDetail = jwt.verify(idToken, process.env.JWT_SECRET_KEY);
    // 3. get the user detail from db and add to req object
    const freshUser = await user.findByPk(tokenDetail.id);

    if (!freshUser) {
        return next(new AppError('User no longer exists', 400));
    }
    req.user = freshUser;
    return next();
});

const restrictTo = (...userType) => {
    const checkPermission = (req, res, next) => {
        if (!userType.includes(req.user.userType)) {
            return next(
                new AppError(
                    "You don't have permission to perform this action",
                    403
                )
            );
        }
        return next();
    };

    return checkPermission;
};

module.exports = { signup, login, authentication, restrictTo };