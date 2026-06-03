# 📸 Supabase 凭证获取详细图解

## 🔑 第1步：登录 Supabase 项目

进入你创建的项目后，界面如下所示：

```
┌─────────────────────────────────────────────┐
│  Bazaar Textile (项目名)                    │
├─────────────────────────────────────────────┤
│ 左侧菜单：                                  │
│  ├─ Dashboard                              │
│  ├─ Editor                                 │
│  ├─ SQL Editor                             │
│  ├─ Authentication                         │
│  ├─ Storage                                │
│  ├─ Vectors                                │
│  └─ Settings ⬅️ 点这里                     │
└─────────────────────────────────────────────┘
```

---

## 🔧 第2步：打开 Settings（设置）

点击左侧菜单最下方的 **Settings**：

```
左侧菜单显示：
────────────────────
  Project Settings
────────────────────
│ General
│ Database
│ API ⬅️ 点这里
│ Auth
│ Storage
│ Logs
│ Billing
│ Team
```

---

## 🔐 第3步：打开 API 选项卡

点击 **API** 后，你会看到这样的界面：

```
┌─────────────────────────────────────────┐
│ API                                      │
├─────────────────────────────────────────┤
│                                         │
│ Project URL (项目 URL)                  │
│ ┌───────────────────────────────────┐  │
│ │ https://[your-id].supabase.co     │ 📋 Copy
│ └───────────────────────────────────┘  │
│                                         │
│ Anon Key (匿名密钥)                     │
│ ┌───────────────────────────────────┐  │
│ │ eyJ0eXAiOiJKV1QiLCJhbGc... [长] │ 📋 Copy
│ └───────────────────────────────────┘  │
│                                         │
│ Service Role Key                        │
│ ┌───────────────────────────────────┐  │
│ │ eyJ0eXAiOiJKV1QiLCJhbGc... [长]  │ 📋 Copy
│ └───────────────────────────────────┘  │
│                                         │
└─────────────────────────────────────────┘
```

---

## 📋 第4步：复制凭证

### 🔹 复制 Project URL

1. 找到 **"Project URL"** 这一行
2. 点击右边的 **📋 Copy** 按钮
3. 粘贴到 `supabase-config.js` 中：

```javascript
const SUPABASE_CONFIG = {
  URL: "https://your-id.supabase.co",  // ⬅️ 粘贴这里
  KEY: "...",
  ENABLED: true
};
```

### 🔹 复制 Anon Key

1. 找到 **"Anon Key"** 这一行（注意不是 Service Role Key）
2. 点击右边的 **📋 Copy** 按钮
3. 粘贴到 `supabase-config.js` 中：

```javascript
const SUPABASE_CONFIG = {
  URL: "https://your-id.supabase.co",
  KEY: "eyJ0eXAiOiJKV1QiLCJhbGc...",  // ⬅️ 粘贴这里
  ENABLED: true
};
```

---

## ⚠️ 重要提示

| 密钥类型 | 用途 | 是否公开 |
|---------|------|--------|
| **Project URL** | 数据库地址 | ✅ 可以公开 |
| **Anon Key** | 前端访问密钥 | ✅ 可以公开 |
| **Service Role Key** | 后端管理员密钥 | ❌ **不要公开** |

> 🔒 **Service Role Key 只在后端服务器使用，永远不要暴露在前端代码！**

---

## 📝 完整示例

### 原始状态（修改前）
```javascript
const SUPABASE_CONFIG = {
  URL: "https://your-project.supabase.co",      // ❌ 示例值
  KEY: "your-anon-key",                         // ❌ 示例值
  ENABLED: false                                 // ❌ 未启用
};
```

### 修改后（真实值）
```javascript
const SUPABASE_CONFIG = {
  URL: "https://abcdefghijkl.supabase.co",      // ✅ 真实 URL
  KEY: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",  // ✅ 真实 Key
  ENABLED: true                                 // ✅ 已启用
};
```

---

## 🎯 完整操作流程图

```
┌─────────────────────────────────────────────────┐
│ 1. Supabase 官网                                 │
│    https://supabase.com                         │
└──────────────┬──────────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────────┐
│ 2. 登录并打开你的项目                           │
│    (Bazaar Textile)                             │
└──────────────┬──────────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────────┐
│ 3. 左侧菜单 → Settings                          │
└──────────────┬──────────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────────┐
│ 4. 点击 API 选项卡                              │
└──────────────┬──────────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────────┐
│ 5. 复制 Project URL                             │
│    📋 点 Copy 按钮                              │
└──────────────┬──────────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────────┐
│ 6. 复制 Anon Key                                │
│    📋 点 Copy 按钮                              │
└──────────────┬──────────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────────┐
│ 7. 粘贴到 supabase-config.js                    │
│    改 ENABLED: true                             │
└──────────────┬──────────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────────┐
│ 8. 保存文件并刷新网页测试                       │
│    ✅ 完成！                                    │
└─────────────────────────────────────────────────┘
```

---

## 🧪 测试连接是否成功

修改完配置后，打开你的 HTML 页面，按 **F12** 打开浏览器控制台（Console），应该看到：

### ✅ 成功连接
```
✅ Supabase 连接成功
开始同步数据到 Supabase...
✅ 数据同步完成
```

### ❌ 连接失败
```
❌ Supabase 连接失败: Invalid API key
```

如果出现连接失败，请检查：
1. ✓ URL 是否正确无空格
2. ✓ Key 是否完整（通常很长，以 `eyJ...` 开头）
3. ✓ 是否复制的是 "Anon Key" 而不是其他密钥
4. ✓ Supabase 项目是否已激活

---

## 💡 常见错误排查

### 错误 1: "Invalid API key"
**原因**: Key 格式错误或不完整
**解决**: 重新复制 Anon Key，确保没有多余空格

### 错误 2: "CORS error"
**原因**: 跨域问题
**解决**: 在 Supabase 的 API 设置中添加你的域名到 CORS 允许列表

### 错误 3: "Connection timeout"
**原因**: 网络问题或 Supabase 服务不可用
**解决**: 检查网络连接，稍后重试

---

## 📞 需要帮助？

- 📖 Supabase 官方文档: https://supabase.com/docs
- 💬 GitHub 讨论: https://github.com/supabase/supabase/discussions
- 🔗 中文社区: https://www.supabase-community.cn

---

**下一步**: 凭证配置完成后，按照 `SUPABASE_INTEGRATION_GUIDE.md` 创建数据表！
