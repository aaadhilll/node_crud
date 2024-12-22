'use strict';
const {
  Model, Sequelize, DataTypes
} = require('sequelize');
const sequelize = require('../../config/database');
// const AppError = require('../../utils/appError');
const bcrypt = require('bcrypt');
const AppError = require('../../utils/appError');

const project = require('./project');

const user = sequelize.define('user', {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  userType: {
    type: DataTypes.ENUM('0', '1', '2'),
    allowNull: false,
    validate: {
      notNull: {
        msg: 'user type canot be null',

      },
      notEmpty: {
        msg: 'user type canot be'
      }
    }
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'first name canot be null',

      },
      notEmpty: {
        msg: 'first name canot be empty'
      }
    }
  },
  lastName: {
    type: DataTypes.STRING
  },
  email: {
    type: DataTypes.STRING
    ,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'email canot be null',

      },
      notEmpty: {
        msg: 'email canot be empty'
      },
      isEmail: {
        msg: 'Invalid email id'
      }
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,

    validate: {
      notNull: {
        msg: 'password canot be null',

      },
      notEmpty: {
        msg: 'password canot be empty'
      }
    }
  },
  confirmPassword: {
    type: DataTypes.VIRTUAL,
    set(value) {
      if (this.password.length < 7) {
        throw new AppError(
          'password lenght must be greater than 7', 400
        )
      }
      if (value === this.password) {
        console.log(value);
        const hashPassword = bcrypt.hashSync(value, 10);
        this.setDataValue('password', hashPassword);

      } else {
        throw new AppError(
          'Password and confirm password must be same', 400

        );
      }
    }
  },
  createdAt: {
    allowNull: false,
    type: DataTypes.DATE
  },
  updatedAt: {
    allowNull: false,
    type: DataTypes.DATE
  },
  deletedAt: {
    type: DataTypes.DATE,
  },

},

  {
    paranoid: true,
    freezeTableName: true,
    modelName: 'user'
  },
);

user.hasMany(project, { foreignKey: 'createdBy' });
project.belongsTo(user, {
  foreignKey: 'createdBy',
});
module.exports = user;