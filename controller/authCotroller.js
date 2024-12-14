
const user = require("../db/models/user");
const signup = async (req, res, next) => {
    // res.json({
    //     status: 'success',
    //     message: 'sign up route working'
    // })
    const body = req.body;
    if (!['1', '2'].includes(body.userType)) {
        return res.status(400).json({
            status: 'fail',
            message: 'Invalid user type',
        });
    }
    const newUser = await user.create({
        userType: body.userType,
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        password: body.password,
        confirmPassword: body.confirmPassword
    });
    if (!newUser) {
        return res.status(400).json({
            status: 'fail',
            message: 'Failed to create user already exist',
        });
    }

    return res.status(201).json({
        'status': 'success',
        data: newUser
    });
}

module.exports = { signup };