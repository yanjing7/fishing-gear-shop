# 程老板渔具网站

这是一个展示和销售渔具的个人网站，支持从抖音橱窗导入商品，并引导用户到抖音进行购买。

## 功能特点

- 从抖音橱窗自动抓取商品数据
- 商品分类筛选和搜索
- 购物车功能
- 响应式设计，适配移动端和桌面端
- 抖音二维码，方便用户关注
- 野钓攻略，提供专业的钓鱼建议

## 抖音商品抓取功能

网站支持多种方式从抖音获取橱窗商品数据：

1. **直接API获取**：尝试使用抖音商品API直接获取数据（受跨域限制可能需要代理）
2. **用户页面解析**：从用户页面HTML中提取商品数据
3. **兜底数据**：当无法获取时使用预设的示例数据

### 使用方法

1. 在`js/app.js`中的`CONFIG.douyinUserId`设置你的抖音用户ID
2. 打开网站时会自动获取并显示商品
3. 使用"刷新商品"按钮可以强制更新商品数据（清除缓存）

### 解决跨域问题

由于浏览器的同源策略，直接获取抖音数据会遇到跨域问题。以下是几种解决方案：

1. **使用CORS代理**：默认使用`corsproxy.io`作为代理，可在`DouyinScraper`类的`proxyUrl`属性中修改
2. **部署自己的代理服务**：可以使用Node.js、Python等搭建简单的代理服务
3. **使用浏览器扩展**：开发环境可使用如CORS Unblock等扩展临时解决

## 项目完成情况

- [x] 响应式网站设计
- [x] 抖音橱窗商品抓取功能
- [x] 商品展示和分类功能
- [x] 购物车功能
- [x] 商品搜索和排序功能
- [x] GitHub Pages部署配置
- [ ] 真实商品图片上传（需要自行添加）
- [ ] 抖音二维码图片（需要自行添加）

## 技术栈

- HTML5
- CSS3
- JavaScript (ES6+)
- 响应式设计
- localStorage 本地数据缓存

## 目录结构

```
/
├── css/               # 样式文件
│   └── style.css      # 主样式表
├── js/                # JavaScript文件
│   ├── app.js         # 主应用逻辑
│   ├── demo-data.js   # 演示数据
│   └── douyin-scraper.js # 抖音数据抓取工具
├── img/               # 图片目录（需要自行添加图片）
│   └── qrcode.jpg     # 抖音二维码（需要自行添加）
├── .github/           # GitHub配置
│   └── workflows/     # GitHub Actions工作流
│       └── github-pages.yml # GitHub Pages部署配置
├── .gitignore         # Git忽略文件
├── .nojekyll          # 禁用GitHub Pages的Jekyll处理
├── index.html         # 网站主页
├── DEPLOYMENT.md      # 部署说明
└── README.md          # 项目说明
```

## 下一步操作

1. 添加真实的商品图片到`img/`目录：
   - 创建`img/product1.jpg`到`img/product8.jpg`作为示例商品图片
   - 添加`img/qrcode.jpg`作为你的抖音二维码
   - 添加`img/hero-bg.jpg`作为首页背景图

2. 修改抖音用户信息：
   - 在`js/app.js`中更新`CONFIG.douyinUserId`为你自己的抖音ID
   - 在HTML文件中更新所有抖音链接

3. 个性化定制：
   - 根据需要调整网站颜色和样式
   - 更新联系信息

4. 按照`DEPLOYMENT.md`中的步骤部署到GitHub Pages

## 抖音商品爬取逻辑说明

`js/douyin-scraper.js`文件实现了从抖音获取商品数据的核心功能：

1. 首先尝试使用官方API获取数据（最稳定的方式）
2. 如果API请求失败，尝试从HTML页面解析：
   - 解析`window.__INITIAL_STATE__`中的数据
   - 解析`RENDER_DATA`脚本中的数据
   - 使用正则表达式提取商品信息
3. 如果都失败，使用预设的示例数据

缓存机制：
- 默认缓存抓取到的数据30分钟
- 点击"刷新商品"按钮可以强制更新数据

## 部署说明

详细的部署步骤请查看 [DEPLOYMENT.md](./DEPLOYMENT.md) 文件。

## 注意事项

- 由于浏览器的同源策略限制，直接从抖音获取数据可能会遇到跨域问题，实际使用时可能需要后端支持
- 本项目仅用于学习和展示，实际商业使用需遵守相关法律法规
- 替换示例商品数据为真实数据

## 许可证

MIT

## 联系方式

如有任何问题，请通过以下方式联系：

- 抖音：[程老板渔具](https://www.douyin.com/user/MS4wLjABAAAA8jzJnzR9cQ-hFRhpzqISFcsDIS_B0gmsuX0OFLVy-mOXsfnOWkujToJ6JM8TmhJJ)
- 微信：Fish_Master001（请备注：野钓）