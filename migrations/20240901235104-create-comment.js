'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Comments', {
      id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4
      },
      comment: {
        type: Sequelize.STRING
      },
      writer: {
        type: Sequelize.STRING
      },
      postId: {
        type: Sequelize.UUID,  
        references: { 
          model: "Posts",  
          key: "id"
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
      }, 
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Comments');
  }
};