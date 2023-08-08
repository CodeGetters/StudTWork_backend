/*
 * @Description-en:article controller
 * @Description-zh:文章控制器
 * @Author: CodeGetters
 * @version:
 * @Date: 2023-07-05 16:49:10
 * @LastEditors: CodeGetters
 * @LastEditTime: 2023-08-02 18:05:01
 */
const dayjs = require("dayjs");
const articleModel = require("../models/article");
const notificationModel = require("../models/notification");
const { verifyToken } = require("../utils/token");
const baseController = require("./index");
const { Op, where } = require("sequelize");
const userModel = require("../models/user");
const { yellow, blue, red } = require("kolorist");

/*
 限制：
 1、token 必须没有过期且有效
 2、被删除的用户不能进行操作
*/

// TODO：每一行的输出显示注明什么文件多少行
class articleController extends baseController {
  /**
   * @description:上传文章
   * @param {*} ctx
   */
  static async createArticle(ctx) {
    // TODO:加入文章标签、分类(数据库是重建一个表还是就在这个表的基础上进行添加？？？)
    let msg = "";
    const { articleName, articleCon, visualRange } = ctx.request.body;

    try {
      const token = ctx.headers.authorization.split(" ")[1];
      const { userName, id, authority } = verifyToken(token);
      // 检查用户权限值
      if (authority === 1) {
        msg = "文章创建失败，用户无权限创建文章";
        ctx.response.status = 403;
        console.log(yellow("[CreateArticle]:文章创建失败，用户权限不足"));
      } else {
        await articleModel
          .create({
            articleCon,
            articleName,
            author: userName,
            releaseTime: dayjs(),
            visualRange,
            isDelete: false,
            readers: "0",
            userId: id,
            lastUpdate: dayjs(),
          })
          .catch((err) => {
            ctx.response.status = 500;
            msg = "创建失败，创建过程中出现意外";

            console.log(red("[CREATE ARTICLE]:创建过程中出现意外"), err);
          });

        msg = "上传成功";
        ctx.response.status = 200;
        console.log(blue("[CreateArticle]:文章创建成功"));
      }
    } catch (err) {
      ctx.response.status = 401;
      msg = "token 无效或过期";
      console.log(yellow("[CreateArticle]:Token 无效或过期："));
    }

    ctx.body = baseController.renderJsonSuccess(msg);
  }

  /**
   * @description 查看权限内公开的所有文章
   * @param {*} ctx
   */
  static async findArticle(ctx) {
    let msg = "";
    let articleList = null;
    let data = {};

    const searchArticle = async (authority) => {
      /* 查询权限值比查询用户的权限值小于等于的所有文章 */
      /* 有公开文章以及可见范围文章 */
      const res = await articleModel.findAll({
        attributes: [
          "id",
          "author",
          "articleName",
          "releaseTime",
          "readers",
          "articleCon",
          "userId",
          "visualRange",
        ],
        where: {
          isDelete: false,
        },
        include: [
          {
            model: userModel,
            // 不返回用户的信息
            attributes: [],
            where: {
              authority: {
                // 文章所属用户的权限必须小于等于查询用户的权限
                [Op.gte]: authority,
              },
              // 用户不能被删除
              isDelete: {
                // [Op.eq] 运算符表示相等比较 [Op.not] 运算符可以否定一个条件
                [Op.eq]: false,
              },
            },
          },
        ],
      });
      return res;
    };

    try {
      const token = ctx.headers.authorization.split(" ")[1];
      const { authority } = verifyToken(token);

      try {
        articleList = await searchArticle(authority);
        data = {
          articleList,
        };
        msg = "查询成功";
        ctx.response.status = 200;
        console.log(blue("[FindArticle]:文章查询成功"));
      } catch (err) {
        msg = "查询失败";
        ctx.response.status = 500;
        console.log(yellow("[FindArticle]:查询文章失败:"), err);
      }
    } catch (err) {
      ctx.response.status = 401;
      msg = "Token 无效或过期";
      console.log(yellow("[FindArticle]:Token 无效或过期："));
    }

    ctx.body = baseController.renderJsonSuccess(msg, data);
  }

  /**
   * @description 查看对外公开的文章
   * @param {*} ctx
   */
  static async showArticle(ctx) {
    let msg = "";
    let data = [];

    const searchArticle = async () => {
      const res = await articleModel.findAll({
        attributes: {
          exclude: ["isDelete"],
        },
        where: {
          isDelete: false,
          // 1234 || 0
          [Op.or]: [
            {
              visualRange: "1234",
            },
            {
              visualRange: "0",
            },
          ],
        },
        include: [
          {
            model: userModel,
            attributes: [],
            where: {
              isDelete: false,
            },
          },
        ],
      });
      return res;
    };

    try {
      const token = ctx.headers.authorization.split(" ")[1];
      verifyToken(token);

      try {
        const articleList = await searchArticle();

        data = {
          articleList: articleList,
        };

        msg = "查询成功";
        ctx.response.status = 200;

        console.log(blue("[SHOW ARTICLE]:查询成功"));
      } catch (err) {
        msg = "查询过程中失败，请稍后重试";
        ctx.response.status = 500;

        console.log(red("[SHOW ARTICLE]:查询过程中发生错误"), err);
      }
    } catch (err) {
      msg = "TOKEN 无效或已经过期";
      ctx.response.status = 401;

      console.log(yellow("[SHOW ARTICLE]:token 无效或过期"));
    }
    ctx.response.body = baseController.renderJsonSuccess(msg, data);
  }

  /**
   * @description 修改对外公开的文章信息
   * @param {*} ctx
   */
  static async updatePublicInfo(ctx) {
    let msg = "";
    // TODO：检查修改用户检查权限值：1、修改用户是文章发布者 2、修改用户是该部门的管理员 3、修改用户是超级管理员
    // TODO：给超级管理员和作者发送站内信
    const { id, articleName, author, visualRange } = ctx.request.body;

    try {
      const token = ctx.headers.authorization.split(" ")[1];

      // 修改者 id
      const userId = verifyToken(token).id;

      // 修改者权限值
      const authority = verifyToken(token).authority;

      const articleRes = await articleModel.findByPk(id).catch((err) => {
        console.log(red("[PUBLIC INFO]:查找失败", err));
      });
      // 文章发布者 id
      const updateUserId = articleRes.dataValues.userId;

      // 检查是否是文章发布者或超级管理员
      if (userId === updateUserId || authority === 4) {
        // 直接修改
        await articleModel
          .update(
            {
              articleName,
              author,
              visualRange,
            },
            { where: { id } },
          )
          .catch((err) => {
            msg = "修改失败，修改过程中出现意外";
            ctx.response.status = 500;

            console.log(red("[PUBLIC INFO]:修改过程中出现意外：", err));
          });

        msg = "authorOrSuperSuccess";
        ctx.response.status = 200;

        console.log(blue("[PUBLIC INFO]:修改成功"));
        // 检查是否为管理员
      } else if (authority === 3) {
        // 超级管理员 id
        const findSuperAdmin = await userModel
          .findOne(
            { attributes: ["id"] },
            {
              where: {
                authority: 4,
              },
            },
          )
          .catch((err) => {
            console.log(red("[PUBLIC INFO]:查找时发生错误:", err));
          });
        const superAdminID = findSuperAdmin.dataValues.id;

        // 文章作者
        const authorName = await userModel
          .findByPk(updateUserId)
          .catch((err) => {
            console.log("[PUBLIC INFO]:查找时发生错误：", red(err));
          });

        // 原文章信息
        const oldArticle = await articleModel
          .findOne(
            {
              attributes: ["author", "articleName", "visualRange"],
            },
            { where: { id } },
          )
          .catch((err) => {
            console.log(red("[PUBLIC INFO]:查找时发生错误:", err));
          });

        // 嗨~ 可以拜托你帮个忙吗？有位用户需要你的帮助，他想改变一下他的文章内容，原内容 -> 新内容
        const notificationCon = ` 嗨~ 可以拜托你帮个忙吗？ ${
          verifyToken(token).userName
        } 需要你的帮助，他/她 想改变一下 《${
          authorName.dataValues.userName
        } de ${
          oldArticle.dataValues.articleName
        }》的信息，以下是详细修改内容，大概长这样：author:${
          oldArticle.dataValues.author
        } --> ${author},articleName：${
          oldArticle.dataValues.articleName
        } --> ${articleName},visualRange：${
          oldArticle.dataValues.visualRange
        } --> ${visualRange}，小的想问问您意见？`;

        await notificationModel
          .create({
            creatorId: userId,
            receiverId: superAdminID,
            createTime: dayjs(),
            notificationCon,
            isDelete: false,
            status: 0,
          })
          .catch((err) => {
            msg = "创建失败，创建站内信时发生意外";
            ctx.response.status = 500;
            console.log(
              red("[PUBLIC INFO]:创建失败，创建站内信时发生意外", err),
            );
          });
        msg = "managerSuccess";
        ctx.response.status = 200;

        console.log(blue("[PUBLIC INFO]:站内信发送成功"));
      } else {
        // 其他人员没有权限进行修改
        msg = "修改失败，无操作权限";
        ctx.response.status = 403;

        console.log(yellow("[PUBLIC INFO]:修改失败，无操作权限"));
      }
    } catch (err) {
      msg = "token 无效或已经过期";
      ctx.response.status = 401;

      console.log(yellow("[PUBLIC INFO]:token 无效或过期", err));
    }
    ctx.response.body = baseController.renderJsonSuccess(msg);
  }

  /**
   * @description 修改对外公开的文章内容
   * @param {*} ctx
   */
  static async updatePublicCon(ctx) {
    let msg = "";
    // TODO：验证 Token，检查修改用户权限值，给超级管理员发送站内信
    const { id, articleCon } = ctx.request.body;

    try {
      const token = ctx.headers.authorization.split(" ")[1];
      // 修改者 id、修改者权限值
      const userId = verifyToken(token).id;
      const authority = verifyToken(token).authority;

      const articleRes = await articleModel.findByPk(id);
      // 文章发布者 id
      const updateUserId = articleRes.dataValues.userId;

      // 检查是否是文章发布者或超级管理员
      if (userId === updateUserId || authority === 4) {
        // 直接修改
        await articleModel
          .update({ articleCon }, { where: { id } })
          .catch((err) => {
            msg = "修改失败，修改过程中出现意外";
            ctx.response.status = 500;

            console.log(red("[PUBLIC CON]:修改过程中出现意外：", err));
          });
        msg = "authorOrSuperSuccess";
        ctx.response.status = 200;

        console.log(blue("[PUBLIC CON]:修改成功"));
        // 检查是否为管理员
      } else if (authority === 3) {
        // 管理员修改;创建消息，通知超级管理员和发布者

        // 查找超级管理员 id
        const findSuperAdmin = await userModel
          .findOne(
            { attributes: ["id"] },
            {
              where: {
                authority: 4,
              },
            },
          )
          .catch((err) => {
            console.log(red("[PUBLIC CON]:查找时发生错误:", err));
          });
        const superAdminID = findSuperAdmin.dataValues.id;

        // 文章作者
        const authorName = await userModel
          .findByPk(updateUserId)
          .catch((err) => {
            console.log("[PUBLIC CON]:查找时发生错误：", red(err));
          });

        // 原文章信息
        const oldArticle = await articleModel
          .findOne(
            {
              attributes: ["articleCon"],
            },
            { where: { id } },
          )
          .catch((err) => {
            console.log(red("[PUBLIC CON]:查找时发生错误:", err));
          });

        // 嗨~ 可以拜托你帮个忙吗？有位用户需要你的帮助，他想改变一下他的文章内容，原内容 -> 新内容
        const notificationCon = ` 嗨~ 可以拜托你帮个忙吗？ ${
          verifyToken(token).userName
        } 需要你的帮助，他/她 想改变一下 ${
          authorName.dataValues.userName
        } de 《${
          oldArticle.dataValues.articleName
        }》的，以下是详细修改内容，大概长这样：${
          oldArticle.dataValues.articleCon
        } -> ${articleCon}，小的想问问您意见？`;

        await notificationModel
          .create({
            creatorId: userId,
            receiverId: superAdminID,
            createTime: dayjs(),
            notificationCon,
            isDelete: false,
            status: 0,
          })
          .catch((err) => {
            msg = "创建失败，创建站内信时发生意外";
            ctx.response.status = 500;
            console.log(
              red("[PUBLIC CON]:创建失败，创建站内信时发生意外", err),
            );
          });
        msg = "managerSuccess";
        ctx.response.status = 200;

        console.log(blue("[PUBLIC CON]:站内信发送成功"));
      } else {
        // 其他人员没有权限进行修改
        msg = "修改失败，无操作权限";
        ctx.response.status = 403;

        console.log(yellow("[PUBLIC CON]:修改失败，无操作权限"));
      }
    } catch (err) {
      msg = "token 无效或已经过期";
      ctx.response.status = 401;

      console.log(yellow("[PUBLIC CON]:token 无效或过期"));
    }

    ctx.response.body = baseController.renderJsonSuccess(msg);
  }

  /**
   * @description 删除对外公开的文章
   * @param {*} ctx
   */
  static async deletePublic(ctx) {
    let msg = "";
    const { id } = ctx.request.body;

    try {
      const token = ctx.headers.authorization.split(" ")[1];
      // 修改者 id、修改者权限值
      const userId = verifyToken(token).id;
      const authority = verifyToken(token).authority;

      const articleRes = await articleModel.findByPk(id);
      // 文章发布者 id
      const updateUserId = articleRes.dataValues.userId;

      // 检查是否是文章发布者或超级管理员
      if (userId === updateUserId || authority === 4) {
        // 直接修改
        await articleModel
          .update({ isDelete: true }, { where: { id } })
          .catch((err) => {
            msg = "修改失败，修改过程中出现意外";
            ctx.response.status = 500;

            console.log(red("[DELETE PUBLIC]:修改过程中出现意外：", err));
          });
        msg = "authorOrSuperSuccess";
        ctx.response.status = 200;

        console.log(blue("[DELETE PUBLIC]:删除成功"));
        // 检查是否为管理员
      } else if (authority === 3) {
        // 管理员修改;创建消息，通知超级管理员和发布者

        // 查找超级管理员 id
        const findSuperAdmin = await userModel
          .findOne(
            { attributes: ["id"] },
            {
              where: {
                authority: 4,
              },
            },
          )
          .catch((err) => {
            console.log(red("[DELETE PUBLIC]:查找时发生错误:", err));
          });
        const superAdminID = findSuperAdmin.dataValues.id;

        // 文章所有人
        const authorName = await userModel
          .findByPk(updateUserId)
          .catch((err) => {
            console.log("[DELETE PUBLIC]:查找时发生错误：", red(err));
          });

        // 原文章信息
        const oldArticle = await articleModel
          .findOne(
            {
              attributes: [
                "author",
                "visualRange",
                "articleCon",
                "articleName",
              ],
            },
            { where: { id } },
          )
          .catch((err) => {
            console.log(red("[DELETE PUBLIC]:查找时发生错误:", err));
          });

        const { author, articleName, visualRange, articleCon } =
          oldArticle.dataValues;

        const notificationCon = ` 嗨~ 可以拜托你帮个忙吗？ ${
          verifyToken(token).userName
        } 需要你的帮助，他/她 想要删除 ${authorName} de 《${articleName}》的，以下是文章详细修改内容，大概长这样：author:${author} visualRange:${visualRange} articleCon: ${articleCon}，小的想问问您意见？`;

        await notificationModel
          .create({
            creatorId: userId,
            receiverId: superAdminID,
            createTime: dayjs(),
            notificationCon,
            isDelete: false,
            status: 0,
          })
          .catch((err) => {
            msg = "创建失败，创建站内信时发生意外";
            ctx.response.status = 500;
            console.log(
              red("[DELETE PUBLIC]:创建失败，创建站内信时发生意外", err),
            );
          });
        msg = "managerSuccess";
        ctx.response.status = 200;

        console.log(blue("[DELETE PUBLIC]:站内信创建成功"));
      } else {
        // 其他人员没有权限进行修改
        msg = "修改失败，无操作权限";
        ctx.response.status = 403;

        console.log(yellow("[DELETE PUBLIC]:修改失败，无操作权限"));
      }
    } catch (err) {
      msg = "token 无效或已经过期";
      ctx.response.status = 401;

      console.log(yellow("[DELETE PUBLIC]:删除失败,token 无效或过期", err));
    }

    ctx.response.body = baseController.renderJsonSuccess(msg);
  }

  /**
   * @description 查看用户自己的所有文章(包括不公开但是不包括已经删除的)
   * @param {*} ctx
   */
  static async findPersonal(ctx) {
    let msg = "";
    let data = [];

    const searchArticle = async (userId) => {
      const res = await articleModel.findAll({
        attributes: {
          exclude: ["userId", "isDelete"],
        },
        where: {
          isDelete: false,
        },
        include: [
          {
            model: userModel,
            attributes: [],
            where: {
              id: userId,
              isDelete: false,
            },
          },
        ],
      });

      return res;
    };

    try {
      const token = ctx.headers.authorization.split(" ")[1];
      const { id } = verifyToken(token);

      try {
        const articleList = await searchArticle(id);
        data = {
          articleList,
        };
        msg = "查询成功";
        ctx.response.status = 200;
        console.log(blue("[FIND PERSONAL]:查询成功"));
      } catch (err) {
        msg = "查询失败，服务端发生错误";
        ctx.response.status = 500;

        console.log(red("查询时发生错误"), err);
      }
    } catch (err) {
      msg = "token 无效或过期";
      ctx.response.status = 401;

      console.log(yellow("[FIND PERSONAL]:TOKEN 无效或过期"));
    }
    ctx.body = baseController.renderJsonSuccess(msg, data);
  }

  /**
   * @description 修改个人文章权限
   * @param {*} ctx
   */
  static async updatePersonal(ctx) {
    let msg = "";

    const { id, author, articleName, visualRange } = ctx.request.body;
    // 验证 token
    try {
      // TODO：检查该用户是否有操作权限(文章是不是该用户的所属)

      const token = ctx.headers.authorization.split(" ")[1];
      verifyToken(token);
      try {
        await articleModel.update(
          {
            author,
            articleName,
            visualRange,
            lastUpdate: dayjs(),
          },
          { where: { id } },
        );
        msg = "success";
        ctx.response.status = 200;

        console.log(blue("[UPDATE PERSONAL]:修改成功"));
      } catch (err) {
        msg = "修改时发生意外";
        ctx.response.status = 500;

        console.log(yellow("[UPDATE PERSONAL]:更新时发生意外"), err);
      }
    } catch (err) {
      msg = "token 无效或过期";
      ctx.response.status = 401;

      console.log(yellow("[UPDATE PERSONAL]:TOKEN 无效或过期"), err);
    }

    ctx.body = baseController.renderJsonSuccess(msg);
  }

  /**
   * @description：修改自己的文章内容
   * @param {*} ctx
   */
  static async updateCon(ctx) {
    let msg = "";

    const { articleCon, id } = ctx.request.body;
    // TODO：检查该用户是否有操作权限(文章是不是该用户的所属)

    try {
      const token = ctx.headers.authorization.split(" ")[1];
      verifyToken(token);
      try {
        await articleModel.update({ articleCon }, { where: { id } });

        msg = "success";
        ctx.response.status = 200;
        console.log(blue("[UPDATE ARTICLE]:修改成功"));
      } catch (err) {
        msg = "修改时发生意外";
        ctx.response.status = 500;

        console.log(yellow("[UPDATE ARTICLE]:修改时发生意外"), err);
      }
    } catch (err) {
      msg = "token 无效或过期";
      ctx.response.status = 401;

      console.log(yellow("[UPDATE Article]:TOKEN 无效或过期"), err);
    }
    ctx.body = baseController.renderJsonSuccess(msg);
  }

  /**
   * @description 用户删除自己的文章
   * @param {*} ctx
   */
  static async deletePersonal(ctx) {
    let msg = "";
    // 文章 id
    const { id } = ctx.request.body;

    try {
      const token = ctx.headers.authorization.split(" ")[1];
      const userId = verifyToken(token).id;

      // 检查该用户是否有操作权限(文章是不是该用户的所属)
      const articleUser = await articleModel.findOne({
        attributes: ["userId"],
        where: { id },
      });

      if (articleUser.dataValues.userId === userId) {
        try {
          await articleModel.update({ isDelete: true }, { where: { id } });

          msg = "success";
          ctx.response.status = 200;
          console.log(blue("[DELETE ARTICLE]:删除成功"));
        } catch (err) {
          msg = "删除时发生意外";
          ctx.response.status = 500;

          console.log(red("[DELETE ARTICLE]:删除时发生错误"), err);
        }
      } else {
        msg = "删除失败，无权限操作";
        ctx.response.status = 403;

        console.log(yellow("删除失败，用户无权限操作"));
      }
    } catch (err) {
      msg = "删除失败 token 过期或失效";
      ctx.response.status = 401;

      console.log(yellow("[DELETE ARTICLE]:TOKEN 过期或失效"), err);
    }

    ctx.body = baseController.renderJsonSuccess(msg);
  }

  /**
   * @description 查看某篇文章(根据文章 id)
   * @param {*} ctx
   */
  static async viewArticle(ctx) {
    let msg = "";
    let data = [];
    const { id } = ctx.query;
    // TODO:权限，文章是否是作者？文章是否是权限内可见的？文章是否是公开的？
    try {
      const token = ctx.headers.authorization.split(" ")[1];
      verifyToken(token);

      const articleInfo = await articleModel
        .findOne({
          attributes: { exclude: ["isDelete", "releaseTime"] },
          where: { id },
        })
        .catch((err) => {
          msg = "预览时发生意外";
          ctx.response.status = 500;

          console.log(red("[VIEW ARTICLE]:预览时发生错误"), err);
        });
      data = {
        articleInfo,
      };
      msg = "success";
      ctx.response.status = 200;

      console.log(blue("[VIEW ARTICLE]:查看成功"));
    } catch (err) {
      msg = "删除失败 token 过期或失效";
      ctx.response.status = 401;

      console.log(yellow("[VIEW ARTICLE]:TOKEN 过期或失效"), err);
    }
    ctx.response.body = baseController.renderJsonSuccess(msg, data);
  }
}

// 自动建表---将表模型定义好后使用一次即可
// articleModel.sync({
//   force: true,
// });

// 删除 article 表
// sequelize
//   .query("DROP TABLE IF EXISTS article")
//   .then(() => {
//     console.log("Article table dropped successfully.");
//   })
//   .catch((err) => {
//     console.error("An error occurred while dropping the article table:", err);
//   });

module.exports = articleController;
