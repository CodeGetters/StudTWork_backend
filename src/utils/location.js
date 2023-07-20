/*
 * @Description-en:
 * @Description-zh:
 * @Author: CodeGetters
 * @version:
 * @Date: 2023-07-20 23:24:35
 * @LastEditors: CodeGetters
 * @LastEditTime: 2023-07-20 23:30:44
 */
const locationModel = require("../models/location");

const createLocation = async (userName, city, province, loginTime) => {
  await locationModel
    .create({
      userName,
      city,
      province,
      loginTime,
    })
    .catch((err) => {
      return err;
    });
};

module.exports = { createLocation };
