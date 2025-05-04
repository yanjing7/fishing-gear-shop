# 部署到 GitHub Pages 指南

本文档详细介绍如何将程老板渔具网站部署到GitHub Pages上。

## 准备工作

在开始部署前，请确保：

1. 你有一个GitHub账号
2. 你已经了解基本的Git操作

## 方法一：使用GitHub Actions自动部署（推荐）

本项目已经包含了GitHub Actions工作流配置（`.github/workflows/github-pages.yml`），可以自动部署网站到GitHub Pages。

### 步骤

1. **创建GitHub仓库**

   - 登录GitHub账号
   - 点击右上角的"+"图标，选择"New repository"
   - 填写仓库名称（如果想要使用自定义域名，可以使用任意名称；如果使用GitHub Pages默认域名，建议使用`<你的用户名>.github.io`）
   - 选择"Public"可见性
   - 点击"Create repository"

2. **上传代码到仓库**

   ```bash
   # 克隆仓库到本地
   git clone https://github.com/<你的用户名>/<仓库名>.git
   
   # 进入仓库目录
   cd <仓库名>
   
   # 复制所有项目文件到此目录
   # ...
   
   # 添加所有文件到Git
   git add .
   
   # 提交更改
   git commit -m "初始化网站"
   
   # 推送到GitHub
   git push origin main
   ```

3. **启用GitHub Pages**

   - 进入GitHub仓库页面
   - 点击"Settings"
   - 点击左侧菜单的"Pages"
   - 在"Source"部分，选择"GitHub Actions"
   - 等待GitHub Actions工作流程完成，你将会在"GitHub Pages"部分看到网站URL

## 方法二：手动部署

如果你不想使用GitHub Actions，也可以手动部署。

### 步骤

1. **创建GitHub仓库**（同上）

2. **上传代码到仓库**（同上）

3. **启用GitHub Pages**
   
   - 进入GitHub仓库页面
   - 点击"Settings"
   - 点击左侧菜单的"Pages"
   - 在"Source"部分，选择"Deploy from a branch"
   - 选择"main"分支和"/(root)"文件夹
   - 点击"Save"
   - 等待几分钟，GitHub会自动构建和部署你的网站

## 使用自定义域名（可选）

如果你有自己的域名，可以将其配置为GitHub Pages站点的自定义域名。

### 步骤

1. **添加自定义域名到GitHub Pages**
   
   - 进入GitHub仓库页面
   - 点击"Settings"
   - 点击左侧菜单的"Pages"
   - 在"Custom domain"部分，输入你的域名（例如：`www.example.com`）
   - 点击"Save"

2. **配置DNS记录**

   对于子域名（如`www.example.com`），添加一个CNAME记录：
   
   ```
   类型: CNAME
   主机名: www (或者你想要的子域名)
   指向: <你的用户名>.github.io
   TTL: 3600或默认
   ```

   对于顶级域名（如`example.com`），添加A记录指向GitHub Pages的IP地址：
   
   ```
   类型: A
   主机名: @ (表示根域名)
   IP地址: 
   185.199.108.153
   185.199.109.153
   185.199.110.153
   185.199.111.153
   TTL: 3600或默认
   ```

3. **在项目中添加CNAME文件**

   手动添加：
   - 在仓库根目录创建一个名为`CNAME`的文件（无扩展名）
   - 在文件中写入你的域名（例如：`www.example.com`）
   - 提交并推送此文件到GitHub

   GitHub自动添加：
   - 当你在GitHub Pages设置中添加自定义域名并保存时，GitHub会自动在仓库中创建CNAME文件

## 故障排查

如果部署后无法访问网站，请检查以下几点：

1. **确认GitHub Actions成功运行**
   - 检查仓库的"Actions"选项卡，查看工作流程是否成功完成

2. **检查GitHub Pages设置**
   - 确认GitHub Pages已启用，并且显示了正确的发布URL

3. **检查浏览器缓存**
   - 尝试清除浏览器缓存或使用隐私模式访问网站

4. **404错误**
   - 确保index.html文件在仓库的根目录中

5. **自定义域名不工作**
   - 确认DNS记录配置正确
   - DNS传播可能需要几小时，请耐心等待

## 更新网站

要更新已部署的网站，只需将更改推送到GitHub仓库。如果使用GitHub Actions，它将自动重新部署；如果是手动部署，GitHub Pages会在几分钟内更新。

```bash
# 修改文件后
git add .
git commit -m "更新网站内容"
git push origin main
```

## 需要修改的内容

在部署前，请确保修改以下内容：

1. 更新所有抖音链接为你自己的抖音用户链接
2. 在`js/app.js`中修改`CONFIG.douyinUserId`为你自己的抖音用户ID
3. 替换`img/qrcode.jpg`为你自己的抖音二维码图片
4. 更新联系信息（微信、电话、地址等） 