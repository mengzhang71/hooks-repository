# Tasks

- [x] Task 1: 构建文档站点静态文件
  - [x] SubTask 1.1: 执行 `pnpm run build:doc` 构建文档
  - [x] SubTask 1.2: 确认 `dist` 目录生成成功

- [x] Task 2: 使用 localtunnel 部署到公网
  - [x] SubTask 2.1: 安装 serve 和 localtunnel 依赖
  - [x] SubTask 2.2: 启动静态服务器托管 dist 目录
  - [x] SubTask 2.3: 使用 localtunnel 暴露到公网，获取 URL: https://encode-hooks.loca.lt

- [x] Task 3: 添加部署脚本到 package.json
  - [x] SubTask 3.1: 在 package.json scripts 中添加 `deploy` 脚本

# Task Dependencies
- [Task 2] depends on [Task 1]
- [Task 3] 可以与 [Task 1] 并行执行
