# GitHub Pages 摄影作品集

这是一个不需要框架、不需要安装任何东西的静态摄影网站。

## 你最常改的地方

### 1. 改名字、自我介绍、合集
打开：

`assets/js/site-data.js`

里面有：
- `siteTitle`：网站名字
- `name`：首页中央显示的名字
- `intro`：一句自我介绍
- `collections`：所有摄影合集

### 2. 放自己的照片
建议按合集建文件夹，例如：

```text
assets/images/maine/
assets/images/new-york/
assets/images/night/
```

然后把 `site-data.js` 里的路径换成：

```js
photos: [
  "assets/images/maine/001.jpg",
  "assets/images/maine/002.jpg",
  { src: "assets/images/maine/003.jpg", caption: "Old Orchard Beach, 2026" }
]
```

合集封面：

```js
cover: "assets/images/maine/cover.jpg"
```

### 3. 图片尺寸建议
摄影网站的大图可以从这个基准开始：
- 长边约 3200 px
- JPEG quality 88–92 左右
- sRGB
- 不必强迫每张都压到同样大小

首页合集封面如果想更快，可以另存 1600–2200 px 的版本。

## 发布到 GitHub Pages

### 最简单的方式
1. 在 GitHub 新建一个 repository。
2. 想让网址直接是 `你的用户名.github.io`，repository 名就建成 `你的用户名.github.io`。
3. 把这个文件夹里的**所有文件**上传到 repository 根目录。
4. 打开 repository 的 **Settings → Pages**。
5. Source 选择 **Deploy from a branch**，branch 选择 **main**，folder 选择 **/(root)**。
6. 保存后等待 GitHub 发布。

如果你用的是普通 repository 名，例如 `photos`，网站通常会发布在 `你的用户名.github.io/photos/`。

## 网站结构

```text
index.html                 首页
album.html                 合集详情页
.nojekyll                  让 GitHub Pages 直接按静态文件发布
assets/css/styles.css      所有视觉样式
assets/js/site-data.js     你主要编辑的内容
assets/js/main.js          首页逻辑
assets/js/album.js         合集和大图浏览逻辑
assets/images/cover.jpeg   当前封面图
```

## 功能
- 全屏封面 + 名字 + 简介
- 摄影合集卡片
- 每个合集独立详情页
- 合集简介 + 拍摄感想
- 自适应 masonry 照片墙
- 点击照片全屏查看
- 左右键切换、Esc 关闭
- 手机 / 平板 / 电脑自适应

不需要数据库，也不需要付费服务。
