# Cloudflare Pages 部署指南

## 前提条件

1. 拥有一个Cloudflare账号（如果没有，请前往 [Cloudflare官网](https://dash.cloudflare.com/sign-up) 注册）
2. GitHub仓库已经设置（已完成）

## 步骤1：设置Cloudflare Pages项目

1. 登录您的Cloudflare账户
2. 进入 Cloudflare Dashboard
3. 点击左侧菜单的 **Pages**
4. 点击 **创建应用程序**
5. 选择 **连接到Git**
6. 授权并连接您的GitHub账户
7. 选择 `fishing-gear-shop` 仓库
8. 在设置页面，配置如下：
   - 项目名称：`fishing-gear-shop`（或您喜欢的名称）
   - 生产分支：`main`
   - 构建设置：保持默认
   - 环境变量：暂不设置
9. 点击 **保存并部署**

## 步骤2：获取Cloudflare API令牌

1. 在Cloudflare Dashboard中，点击右上角的个人资料图标
2. 选择 **我的个人资料**
3. 在左侧导航栏中点击 **API令牌**
4. 点击 **创建令牌**
5. 选择 **编辑Cloudflare Workers**模板
6. 在权限部分，确保包含：
   - Account > Cloudflare Pages > Edit
   - Account > Account Settings > Read
7. 点击 **继续到摘要**，然后点击 **创建令牌**
8. 复制生成的API令牌（这只会显示一次）

## 步骤3：配置GitHub仓库Secrets

1. 前往您的GitHub仓库 `https://github.com/yanjing7/fishing-gear-shop`
2. 点击 **设置(Settings)** > **Secrets and variables** > **Actions**
3. 点击 **New repository secret**
4. 添加两个密钥：
   - 名称：`CLOUDFLARE_API_TOKEN`，值：步骤2中获取的API令牌
   - 名称：`CLOUDFLARE_ACCOUNT_ID`，值：您的Cloudflare账户ID（可在Cloudflare Dashboard右下角找到）
5. 点击 **添加密钥**

## 步骤4：触发部署

1. 提交并推送新创建的工作流文件到GitHub
2. 工作流将自动运行，部署您的网站到Cloudflare Pages

## 部署完成后

部署完成后，您的网站将同时托管在:
- GitHub Pages: https://yanjing7.github.io/fishing-gear-shop/
- Cloudflare Pages: https://fishing-gear-shop.pages.dev/ (或您设置的自定义域名)

## 优势

Cloudflare Pages提供:
- 全球CDN加速
- 自动SSL
- 更高的带宽限制
- DDoS保护
- 自定义域名支持
- 更快的构建时间 