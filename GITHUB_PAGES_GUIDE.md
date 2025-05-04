# 程老板渔具网站 - GitHub Pages部署指南

本指南将帮助您将程老板渔具网站部署到GitHub Pages，使其在互联网上可访问。

## 第一步：在GitHub上创建仓库

1. 在浏览器中打开 [GitHub](https://github.com) 并登录您的账户
2. 点击右上角的"+"图标，然后选择"New repository"
3. 在"Repository name"字段中输入：`fishing-gear-shop`
4. 添加描述："程老板渔具网站 - 专业野钓装备"
5. 选择"Public"（公开）选项
6. 不要勾选"Add a README file"选项
7. 点击"Create repository"按钮创建仓库

## 第二步：将本地代码推送到GitHub

在您的命令行终端中，确保您位于程老板渔具项目的根目录下（包含index.html文件的目录），然后运行以下命令（请替换`YOUR_USERNAME`为您的GitHub用户名）：

```
git remote add origin https://github.com/YOUR_USERNAME/fishing-gear-shop.git
git branch -M main
git push -u origin main
```

这组命令将：
1. 添加GitHub仓库作为远程源
2. 将当前分支重命名为main
3. 将代码推送到GitHub

## 第三步：启用GitHub Pages

1. 在GitHub上导航到您的仓库页面
2. 点击顶部菜单中的"Settings"（设置）选项
3. 在左侧菜单中找到并点击"Pages"选项
4. 在"Source"（源）部分，从下拉菜单中选择"Deploy from a branch"（从分支部署）
5. 在"Branch"（分支）下拉菜单中选择"main"
6. 在分支旁边的下拉菜单中选择"/(root)"（根目录）
7. 点击"Save"（保存）按钮

## 第四步：等待部署完成

GitHub会自动开始构建和部署您的网站。这个过程通常需要几分钟时间。您可以在仓库的"Actions"（操作）标签页中查看部署进度。

## 第五步：访问您的网站

部署完成后，您的网站将在以下URL上可用：
```
https://YOUR_USERNAME.github.io/fishing-gear-shop/
```

请将`YOUR_USERNAME`替换为您的GitHub用户名。

## （可选）第六步：添加自定义域名

如果您有自己的域名，可以将其添加到您的GitHub Pages网站：

1. 在仓库的"Settings" > "Pages"页面中
2. 在"Custom domain"（自定义域名）部分，输入您的域名
3. 点击"Save"按钮
4. 按照GitHub提供的说明配置您的DNS提供商的设置

## 注意事项

1. 您的项目中已包含`.nojekyll`文件，这确保GitHub不会使用Jekyll处理您的网站
2. 您的项目中已包含GitHub Actions工作流配置文件，这将在您推送代码时自动部署网站
3. 确保所有链接都是相对路径，这样网站才能在GitHub Pages子目录下正常工作

## 更新网站

当您对网站进行更改后，只需使用以下命令将更改推送到GitHub，网站将自动更新：

```
git add .
git commit -m "描述您的更改"
git push
```

祝您成功部署网站！如有任何问题，可参考[GitHub Pages官方文档](https://docs.github.com/en/pages)。 