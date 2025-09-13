# 🚀 Hollow Knight 攻略站部署指南

## 📋 部署前准备

### 1. 环境要求
- **Node.js** 16.0 或更高版本
- **现代浏览器** (Chrome, Firefox, Safari, Edge)
- **域名** (已有：hollowknight.net)

### 2. 项目文件检查
确保以下文件和目录存在：
```
hollowknight.net/
├── index.html                 # 主页面
├── package.json              # 项目配置
├── README.md                 # 项目说明
├── robots.txt                # 搜索引擎爬虫规则
├── sitemap.xml              # 网站地图
├── styles/                   # 样式文件
├── scripts/                  # JavaScript文件
├── images/                   # 图片资源
├── pages/                    # 子页面
└── data/                     # 数据文件
```

## 🌐 部署选项

### 选项 1: Vercel (推荐)
1. 在 [Vercel](https://vercel.com) 注册账号
2. 连接 GitHub 仓库
3. 自动部署配置：
   ```json
   {
     "build": {
       "env": {
         "NODE_VERSION": "18"
       }
     },
     "cleanUrls": true,
     "trailingSlash": false
   }
   ```

### 选项 2: Netlify
1. 在 [Netlify](https://netlify.com) 注册账号
2. 拖拽项目文件夹到 Netlify
3. 配置文件 `netlify.toml`：
   ```toml
   [build]
     publish = "."
     command = "npm run build"
   
   [[redirects]]
     from = "/*"
     to = "/index.html"
     status = 404
   ```

### 选项 3: GitHub Pages
1. 推送代码到 GitHub 仓库
2. 在仓库设置中启用 Pages
3. 选择 `main` 分支作为源

### 选项 4: 传统虚拟主机
1. 使用 FTP 上传所有文件到网站根目录
2. 确保 `index.html` 在根目录
3. 配置 `.htaccess` (Apache) 或 nginx 配置

## 🔧 部署配置

### 1. DNS 配置
为域名 `hollowknight.net` 配置 DNS：
```
A    hollowknight.net       → 服务器IP
A    www.hollowknight.net   → 服务器IP
```

### 2. SSL 证书
- 使用 Let's Encrypt 免费证书
- 或使用 Cloudflare 代理服务

### 3. CDN 配置 (可选)
推荐使用 Cloudflare 作为 CDN：
- 加速图片和静态资源加载
- 提供 DDoS 保护
- 启用压缩和缓存

## 📊 SEO 优化配置

### 1. Google Search Console
1. 添加网站到 [Google Search Console](https://search.google.com/search-console)
2. 验证域名所有权
3. 提交 `sitemap.xml`

### 2. 百度搜索资源平台
1. 在 [百度搜索资源平台](https://ziyuan.baidu.com) 添加网站
2. 验证网站所有权
3. 提交网站地图

### 3. Google Analytics (可选)
添加 GA4 跟踪代码到 `index.html`：
```html
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

## 🚀 快速部署命令

### 本地开发
```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

### Vercel 部署
```bash
# 安装 Vercel CLI
npm i -g vercel

# 部署
vercel --prod
```

### Netlify 部署
```bash
# 安装 Netlify CLI
npm i -g netlify-cli

# 部署
netlify deploy --prod --dir .
```

## 📈 性能优化

### 1. 图片优化
```bash
# 压缩图片
npm run optimize-images
```

### 2. 代码压缩
```bash
# 压缩 CSS 和 JavaScript
npm run build
```

### 3. 启用 Gzip 压缩
服务器配置示例（Apache）：
```apache
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/json
</IfModule>
```

## 🔒 安全配置

### 1. 安全标头
在服务器配置中添加安全标头：
```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
```

### 2. HTTPS 强制重定向
```apache
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
```

## 📱 PWA 配置 (未来扩展)

可以添加 PWA 支持：
1. 创建 `manifest.json`
2. 添加 Service Worker
3. 实现离线缓存

## 🛠️ 监控和维护

### 1. 网站监控
- 使用 UptimeRobot 监控网站可用性
- 设置 Google PageSpeed Insights 定期检查

### 2. 日志分析
- 启用服务器访问日志
- 使用 Google Analytics 分析用户行为

### 3. 定期更新
- 定期更新攻略内容
- 检查并修复失效链接
- 优化页面加载速度

## 📞 问题排查

### 常见问题
1. **页面 404 错误** - 检查文件路径和服务器配置
2. **图片加载失败** - 检查图片路径和文件权限
3. **CSS/JS 加载失败** - 检查文件路径和 MIME 类型

### 调试工具
- 浏览器开发者工具
- Google PageSpeed Insights
- GTmetrix 性能分析

---

🎮 **现在你的 Hollow Knight 攻略站已经准备好征服互联网了！**
