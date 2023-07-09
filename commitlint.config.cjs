/*
 * @Description:
 * @Author: CodeGetters
 * @version:
 * @Date: 2023-06-18 20:30:52
 * @LastEditors: CodeGetters
 * @LastEditTime: 2023-07-07 16:08:42
 */
// commitlint.config.js

module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [
      2,
      "always",
      [
        "feat", // --------- 提交新功能
        "fix", // -----------修复了 bug
        "docs", // ----------只修改了文档
        "style", // ---------调整代码格式，未修改代码逻辑（比如修改空格、格式化、缺少分号等
        "refactor", // ------代码重构，既没修复 bug 也没有添加新功能
        "test", // ----------添加或修改代码测试
        "build", // ---------构造工具的或者外部依赖的改动，例如webpack，npm
        "chore", // ---------对构建流程或辅助工具和依赖库（如文档生成等）的更改
        "pref", // ----------性能优化，提高性能的代码更改
      ],
    ],
    "type-case": [0],
    "type-empty": [0],
    "scope-empty": [0],
    "scope-case": [0],
    "subject-full-stop": [0, "never"],
    "subject-case": [0, "never"],
    "header-max-length": [0, "always", 72],
  },
};
