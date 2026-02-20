# Joy Lets · 曼城房产租赁 App

线上地址：https://app.man-live.uk

---

## 这是什么

一个专为 Joy Lets 定制的房产租赁移动端 Web App，客户可以浏览房源、收藏、询盘、查看地图。后台由乔乔自己管理，不依赖任何第三方租赁平台。

---

## 日常操作

### 添加新房源
1. 打开 `app.man-live.uk/admin.html`
2. 在 **Add** 标签页填写信息、上传照片
3. 切到 **Manage** 确认已添加
4. 点击 **Publish Now** → 约1分钟后线上更新

### 修改已有房源
1. Admin → **Manage** 标签页
2. 找到房源 → 点 **Edit** → 修改 → **Save**
3. **Publish Now**

### 标记已出租
- Admin → Manage → Status 改为 `rented` → Publish Now
- 客户端会看到该房源照片模糊，并显示已出租状态

### 下架房源
- Status 改为 `unlisted` → 客户完全看不到，但数据还在

---

## 页面说明

| 页面 | 地址 | 说明 |
|------|------|------|
| 首页 | `/` | 房源列表，分类筛选 |
| 房源详情 | `/listing.html?id=xxx` | 图片轮播、询盘表单 |
| 搜索 | `/search.html` | 邮编、预算、入住时间筛选 |
| 收藏夹 | `/saved.html` | Shortlist |
| 地图 | `/map.html` | 房源地图视图 |
| 关于 | `/profile.html` | Joy Lets 介绍 + 联系方式 |
| 后台 | `/admin.html` | 管理房源（不对外公开） |

---

## 联系方式配置

- 电话：+44 7510 757408
- 邮箱：info.manlive@gmail.com
- 微信：manchester_room
- WhatsApp：https://wa.me/447510757408

---

## 第三方服务

| 服务 | 用途 | 控制台 |
|------|------|--------|
| Vercel | 托管部署 | vercel.com |
| Cloudflare | CDN + 域名 | cloudflare.com |
| GitHub | 代码 + 数据存储 | github.com/Joy-LQ/joy-lets |
| Cloudinary | 图片存储 | cloudinary.com（cloud: du6lliisx） |
| EmailJS | 询盘邮件发送 | emailjs.com |

---

## 遇到问题？

**客户看到的还是旧版本** → 多半是缓存问题，让他们用浏览器（不要微信）打开，或者清除缓存重试

**照片上传失败** → 检查 Cloudinary 后台，Upload Preset `Man-Live app` 是否设为 Unsigned 模式

**询盘邮件收不到** → 检查 EmailJS 后台，确认 To Email 是 info.manlive@gmail.com（不是变量）

**Publish Now 失败** → GitHub PAT 可能过期，需要重新生成并在 Admin 页面重新输入

**想让阿晏帮忙改代码** → 新开 Claude Code 窗口，直接说需求，他会自己看代码和 `drive-d/阿晏/joy-lets.md`

---

*项目由乔乔 + 阿晏共同搭建 · 2026*
