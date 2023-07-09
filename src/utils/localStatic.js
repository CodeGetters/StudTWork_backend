const fs = require("fs");

const path = require("path");

const getStatic = (fileName) => {
  let filePath = path.join(__dirname, "../../public/images", fileName);
  // 读取目录下所有的文件并返回数组
  let fileDir = fs.readFileSync(filePath, {
    encoding: "utf8",
    withFileTypes: true,
  });

  // 将 fileDir 从 buffer 对象转成 base64 格式
  return fileDir.toString("base64");
};

module.exports = {
  getStatic,
};
