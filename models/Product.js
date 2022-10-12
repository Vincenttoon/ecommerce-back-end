// import important parts of sequelize library
const { Model, DataTypes } = require('sequelize');
// import our database connection from config.js
const sequelize = require('../config/connection');

// Initialize Product model (table) by extending off Sequelize's Model class
class Product extends Model {}

// set up fields and rules for Product model
Product.init(
  {
    // creates id parameters
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    // creates product name parameters
    product_name: {
      type: DataTypes.STRING,
      allowNull: false,
      // validation for no empty strings
      validate: {
        len: [1]
      }
    },
    // creates price parameters
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      // validates price ends with a decimal
      validate: {
        isDecimal: true
      }
    },
    // creates stock parameter
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 10,
      // validates a number is being returned
      validate: {
        isNumeric: true
      }
    },
    // calls category model for their foreign key id
    category_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'category',
        key: 'id'
      }
    }
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'product',
  }
);

module.exports = Product;
