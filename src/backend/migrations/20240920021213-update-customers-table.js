"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Cập nhật cột rank
    await queryInterface.changeColumn("Customers", "rank", {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: "Bronze", // Giá trị mặc định là 'Đồng'
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Đảo ngược lại thay đổi của cột rank (nếu cần rollback)
    await queryInterface.changeColumn("Customers", "rank", {
      type: Sequelize.STRING,
      allowNull: true, // Cho phép null nếu rollback
    });
  },
};
