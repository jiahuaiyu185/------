# 机器学习 · 零基础入门

一个面向零基础学习者的**中文机器学习入门平台**:界面现代、上手简单,配有可交互的演示与练习测验。无需后端、无需付费 API,学习进度全部保存在浏览器本地。

## 功能特性

- 🏠 **首页**:网站简介、「开始学习」入口、学习路线图与课程进度概览。
- 📚 **课程体系**:6 门课程,由浅入深 —— 机器学习基础、线性回归、逻辑回归、决策树、K-means 聚类、神经网络入门。
- ✏️ **课程内容**:每节包含概念解释、公式、示例与知识总结。
- 🎛️ **交互演示**:
  - 线性回归:拖动滑块实时更新数据点、拟合直线、残差与均方误差 MSE;
  - K-means 聚类:逐步运行「分配 → 更新中心」迭代,观察聚类过程与收敛。
  - 均为原生 SVG 绘制,零外部服务。
- 📝 **练习测验**:每章至少 3 道选择题,提交后显示得分、逐题答案与解析。
- 📊 **学习进度**:完成课程数、测验成绩可视化,支持一键重置。
- 💾 **本地存储**:进度与答题记录保存在 `localStorage`。
- ♿ **无障碍与响应式**:键盘可完整操作、焦点样式、对比度达标,适配桌面与手机。

## 技术栈

- [Vite](https://vite.dev/) + [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS v4](https://tailwindcss.com/)(通过 `@tailwindcss/vite` 插件)
- [React Router v7](https://reactrouter.com/)
- 原生 SVG 绘图,无图表库、无后端、无付费 API

## 安装与启动

```bash
# 安装依赖
npm install

# 启动开发服务器(默认 http://localhost:5173)
npm run dev

# 类型检查 + 生产构建
npm run build

# 本地预览构建产物
npm run preview
```

## 项目结构

```
src/
├── main.tsx                 # 入口
├── App.tsx                  # 路由定义
├── index.css                # Tailwind 主题、全局样式与动画
├── types.ts                 # 全局类型定义
├── data/
│   └── courses.ts           # 6 门课程的正文内容与测验题(数据与逻辑分离)
├── lib/
│   ├── random.ts            # 可复用的确定性随机数工具(种子随机 + 高斯噪声)
│   ├── storage.ts           # localStorage 读写封装(带版本号、防损坏)
│   ├── progress.tsx         # 学习进度 Context 与 useProgress hook
│   └── stats.ts             # 进度统计纯函数
├── components/              # 可复用 UI 组件
│   ├── Layout.tsx           # 页面骨架(导航 + 页脚 + 跳过链接)
│   ├── Navbar.tsx / Footer.tsx
│   ├── Button / Card / Badge / ProgressBar / ProgressRing / Formula
│   ├── CourseCard.tsx       # 课程卡片
│   ├── LessonNav.tsx        # 小节上一节/下一节导航
│   └── NotFound.tsx
├── demos/
│   ├── LinearRegressionDemo.tsx  # 线性回归交互演示(SVG)
│   └── KMeansDemo.tsx            # K-means 聚类交互演示(SVG)
└── pages/
    ├── Home.tsx             # 首页
    ├── Courses.tsx          # 课程总览
    ├── CourseDetail.tsx     # 课程详情(小节列表)
    ├── Lesson.tsx           # 单节课程内容
    ├── Quiz.tsx             # 章节测验
    └── Progress.tsx         # 个人学习进度
```

## 如何新增课程

所有课程内容集中在 [src/data/courses.ts](src/data/courses.ts)。新增一门课程只需:

1. 在 `courses` 数组中追加一个 `Course` 对象(含 `lessons` 与 `quiz`)。
2. 课程会自动出现在首页路线图、课程总览与进度页,路由无需改动。

课程正文的 `sections` 支持多种内容块类型(`paragraph` / `formula` / `example` / `list` / `keypoints` / `note` / `summary`),由 [Lesson.tsx](src/pages/Lesson.tsx) 中的 `Section` 组件统一渲染。

## 如何新增交互演示

1. 在 [src/demos/](src/demos/) 下新建演示组件;
2. 在 [types.ts](src/types.ts) 的 `DemoKind` 中登记类型;
3. 给对应课程设置 `demo` 字段,并在 [Lesson.tsx](src/pages/Lesson.tsx) 的演示渲染处加一个分支。演示会显示在该课程最后一节的末尾。

## 本地数据说明

- 存储键:`ml-learning:progress`
- 数据结构:`{ version, completedLessons, quizzes }`
- 清除方式:在「学习进度」页点击「重置学习进度」,或清除浏览器站点数据。
