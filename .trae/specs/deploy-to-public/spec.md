# 项目公网部署 Spec

## Why
当前项目只能在本地访问，无法在外网展示。需要将 dumi 文档站点部署到公网，方便向他人展示 React Hooks 库的功能和文档。

## What Changes
- 构建文档站点的静态文件
- 使用 surge.sh 服务将静态文件部署到公网
- 添加部署脚本到 package.json

## Impact
- Affected code: package.json (添加部署脚本)
- 产出: 公网可访问的文档站点 URL

## ADDED Requirements

### Requirement: 文档构建
系统应能够将 dumi 文档站点构建为静态文件。

#### Scenario: 构建成功
- **WHEN** 执行 `pnpm run build:doc` 命令
- **THEN** 在 `docs-dist` 目录生成静态文件

### Requirement: 公网部署
系统应能够将构建的静态文件部署到公网。

#### Scenario: 部署成功
- **WHEN** 执行部署命令
- **THEN** 生成一个公网可访问的 URL（如 https://xxx.surge.sh）
- **AND** 该 URL 可从外网访问

### Requirement: 部署脚本
package.json 中应包含便捷的部署脚本。

#### Scenario: 一键部署
- **WHEN** 执行 `pnpm run deploy` 命令
- **THEN** 自动完成构建和部署流程
