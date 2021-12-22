'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Categories', ['中式料理', '日本料理', '義大利料理', '墨西哥料理', '素食料理', '美式料理', '複合式料理'].map((item, index) => ({
      // 這是考慮到遠端佈署時會使用 clearDB，而 clearDB 的 id 跳號採用了有間隔的設計
      id: index * 10 + 1,
      name: item,
      createdAt: new Date(),
      updatedAt: new Date(),
    })), {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Categories', null, {})
  }
};
