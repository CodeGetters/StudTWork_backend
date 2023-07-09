const jwt = require("jsonwebtoken");

const { secret, validTime } = require("../config/globalConfig").jwtOption;

/**
 * @description 创建 token
 * @param {*} userinfo
 * @returns token
 */
const createToken = (userinfo) => {
  const token = jwt.sign(
    {
      id: userinfo.id,
      userName: userinfo.userName,
      authority: userinfo.authority,
      role: userinfo.role,
    },
    secret,
    {
      // 有效时长
      expiresIn: validTime,
    },
  );
  return token;
};

/**
 * 验证 token 是否过期
 * @param {*} token
 * @returns false(过期) || userInfo(token 携带的用户信息)
 */
const verifyToken = (token) => {
  const tokenItem = jwt.verify(token, secret);
  // iat:createTime exp:validTime---------
  const { iat, exp, ...userInfo } = tokenItem;
  if (Math.floor(Date.now() / 1000) - iat <= exp) {
    return userInfo;
  } else {
    return false;
  }
};

module.exports = {
  createToken,
  verifyToken,
};
