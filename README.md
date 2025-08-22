# 现代贪吃蛇游戏

一个使用 React + TypeScript + Vite 构建的现代化贪吃蛇游戏。

## 🎮 游戏特性

- 现代化的UI设计
- 响应式布局，支持移动端
- 流畅的游戏体验
- 多语言支持（中文/英文）
- 烟花特效
- 分数记录

## 🚀 在线体验

游戏已部署到 GitHub Pages：
[https://yangchaoeva.github.io/modern-snake-game](https://yangchaoeva.github.io/modern-snake-game)

## 🛠️ 本地开发

### 安装依赖
```bash
npm install
```

### 启动开发服务器
```bash
npm run dev
```

### 构建项目
```bash
npm run build
```

### 预览构建结果
```bash
npm run preview
```

## 📦 部署到 GitHub Pages

本项目已配置自动部署到 GitHub Pages。每次推送到 `main` 分支时，GitHub Actions 会自动构建并部署项目。

### 手动启用 GitHub Pages（如果需要）

如果遇到 404 错误，请按以下步骤手动启用 GitHub Pages：

1. 进入 GitHub 仓库页面
2. 点击 **Settings** 标签
3. 在左侧菜单中找到 **Pages**
4. 在 **Source** 部分选择 **GitHub Actions**
5. 保存设置

### 故障排除

如果部署后仍然显示 404 错误，请尝试以下解决方案：

1. **检查仓库是否为公开**：GitHub Pages 免费版只支持公开仓库
2. **等待部署完成**：首次部署可能需要几分钟时间
3. **清除浏览器缓存**：强制刷新页面（Ctrl+F5 或 Cmd+Shift+R）
4. **检查 GitHub Actions**：在仓库的 Actions 标签中查看部署状态
5. **验证分支**：确保代码已推送到 `main` 分支

## 🎯 游戏控制

- **方向键** 或 **WASD**：控制蛇的移动方向
- **空格键**：暂停/继续游戏
- **R键**：重新开始游戏

## 🏗️ 技术栈

- **React 18** - UI 框架
- **TypeScript** - 类型安全
- **Vite** - 构建工具
- **Tailwind CSS** - 样式框架
- **GitHub Actions** - 自动部署

## 📄 许可证

MIT License