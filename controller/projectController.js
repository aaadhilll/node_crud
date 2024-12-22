const project = require("../db/models/project");
const user = require("../db/models/user");
const catchAsync = require("../utils/catchAsync");

const createProject = catchAsync(async (req, res, next) => {
    const body = req.body;
    const userId = req.user.id; 

    const newProject = await project.create(
        {
            title: body.title,
            productImage: body.productImage,
            price: body.price,
            shortDescription: body.shortDescription,
            description: body.description,
            productUrl: body.productUrl,
            category: body.category,
            tags: body.tags,
            createdBy: userId,
        }
    );
    return res.status(201).json({
        status: 'succuss',
        data: newProject,
    })
});

const getAllProject = catchAsync(async (req, res, next) => {
  //  const userId = req.user.id;
    const result = await project.findAll({include: user});

    return res.json({
        status: 'success',
        data: result,
    });
});

module.exports = { createProject, getAllProject };