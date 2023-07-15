const path = require("path");

module.exports = {
  apps: [
    {
      name: "StudTWork",
      script: "app.js",
      instances: 1,
      // 自动重启
      autorestart: true,
      exec_mode: "cluster",
      max_memory_restart: "1G",
      watch: false,
      merge_logs: true,
      error_file: path.join(__dirname, "/logs/err.log"),
      out_file: path.join(__dirname, "/logs/out.log"),
      log_date_format: "YYYY-MM-DD HH:mm",
    },
  ],
};
