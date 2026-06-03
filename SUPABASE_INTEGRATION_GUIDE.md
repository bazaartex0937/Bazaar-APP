# 🚀 Supabase 集成指南

## 📋 目录
1. [快速开始](#快速开始)
2. [获取 Supabase 凭证](#获取-supabase-凭证)
3. [创建数据库表](#创建数据库表)
4. [集成步骤](#集成步骤)
5. [常见问题](#常见问题)

---

## 快速开始

### 前置要求
- Supabase 账号 (免费注册：https://supabase.com)
- 已有 Bazaar 产品目录项目

### 整合三步走

```
1️⃣ 注册 Supabase → 2️⃣ 获取凭证 → 3️⃣ 更新配置文件 → 4️⃣ 创建数据表
```

---

## 获取 Supabase 凭证

### 步骤 1: 创建 Supabase 项目
1. 访问 https://supabase.com
2. 登录或注册账号
3. 点击 "New project"
4. 填写项目信息：
   - **Project name**: `bazaar-catalog`
   - **Password**: 设置强密码
   - **Region**: 选择离你最近的区域 (推荐 Singapore 新加坡)
5. 点击 "Create new project" 等待初始化

### 步骤 2: 获取 API 凭证
1. 进入项目后，点击左侧菜单 "Settings"
2. 选择 "API"
3. 找到以下信息并复制：
   - **Project URL**: `https://your-project.supabase.co`
   - **Anon Key**: 以 `eyJ...` 开头的长字符串

### 步骤 3: 更新配置文件

在 `supabase-config.js` 中修改以下部分：

```javascript
const SUPABASE_CONFIG = {
  URL: "https://your-project.supabase.co",    // ← 粘贴 Project URL
  KEY: "eyJ0eXAiOiJKV1QiLCJhbG...",          // ← 粘贴 Anon Key
  ENABLED: true                               // ← 改为 true 启用
};
```

---

## 创建数据库表

### 步骤 1: 打开 SQL Editor

在 Supabase 控制面板：
1. 左侧菜单 → "SQL Editor"
2. 点击 "New Query"

### 步骤 2: 执行建表 SQL

复制以下 SQL 语句逐一执行：

#### 1️⃣ 产品表 (products)

```sql
CREATE TABLE IF NOT EXISTS products (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  code TEXT UNIQUE,
  category TEXT NOT NULL,
  icon TEXT,
  composition TEXT,
  weight TEXT,
  width TEXT,
  moq TEXT,
  tags TEXT[],
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- 创建索引便于查询
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_created_at ON products(created_at);
```

#### 2️⃣ 询盘表 (inquiries)

```sql
CREATE TABLE IF NOT EXISTS inquiries (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  customer_company TEXT,
  product_id uuid REFERENCES products(id),
  quantity TEXT,
  message TEXT,
  status TEXT DEFAULT '新询盘',
  country TEXT,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE INDEX idx_inquiries_status ON inquiries(status);
CREATE INDEX idx_inquiries_created_at ON inquiries(created_at);
```

#### 3️⃣ 游客表 (visitors)

```sql
CREATE TABLE IF NOT EXISTS visitors (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  username TEXT,
  name TEXT,
  company TEXT,
  login_method TEXT,
  ip_address TEXT,
  country TEXT,
  visits INTEGER DEFAULT 1,
  blocked BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE INDEX idx_visitors_blocked ON visitors(blocked);
CREATE INDEX idx_visitors_created_at ON visitors(created_at);
```

#### 4️⃣ 用户表 (users_profile)

```sql
CREATE TABLE IF NOT EXISTS users_profile (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  full_name TEXT,
  company TEXT,
  role TEXT DEFAULT 'customer',
  avatar_url TEXT,
  is_admin BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);
```

#### 5️⃣ 公司信息表 (company_info)

```sql
CREATE TABLE IF NOT EXISTS company_info (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  summary TEXT,
  address TEXT,
  phone TEXT,
  email TEXT,
  whatsapp TEXT,
  website TEXT,
  logo_url TEXT,
  photo_url TEXT,
  video_url TEXT,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);
```

### 步骤 3: 设置 RLS 策略（安全性）

在 Supabase 控制面板：
1. 左侧菜单 → "Authentication" → "Policies"
2. 为每个表添加策略

#### 示例：产品表读策略
```sql
-- 所有人可读
CREATE POLICY "Enable read access for all users" ON products
  FOR SELECT USING (true);

-- 仅管理员可写
CREATE POLICY "Enable insert for authenticated users only" ON products
  FOR INSERT WITH CHECK (
    auth.role() = 'authenticated' AND 
    (SELECT is_admin FROM users_profile WHERE id = auth.uid())
  );
```

---

## 集成步骤

### 步骤 1: 在 HTML 中引入 Supabase 库

在你的 HTML 文件的 `<head>` 中添加：

```html
<!-- Supabase 官方库 -->
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>

<!-- 你的配置文件 -->
<script src="supabase-config.js"></script>
```

### 步骤 2: 修改登录函数

在你的主 JS 文件中，修改 `doAccountLogin()` 函数：

```javascript
async function doAccountLogin() {
  const usr = document.getElementById("accUsername").value.trim();
  const pw = document.getElementById("accPassword").value;
  
  if (!usr || !pw) {
    toast("请输入账号和密码", "error");
    return;
  }
  
  if (SUPABASE_CONFIG.ENABLED) {
    // 使用 Supabase
    try {
      const { data, error } = await signInUser(usr, pw);
      if (error) throw error;
      
      // 从 Supabase 获取用户资料
      const { data: profile } = await supabaseClient
        .from("users_profile")
        .select("*")
        .eq("id", data.user.id)
        .single();
      
      state.user = {
        type: "customer",
        username: usr,
        email: data.user.email,
        profile: profile,
        time: new Date().toISOString()
      };
      
      save();
      showApp();
      toast("登录成功！", "success");
    } catch (e) {
      toast("登录失败: " + e.message, "error");
    }
  } else {
    // 使用本地存储（原逻辑）
    const found = state.registeredUsers.find(u =>
      (u.username === usr || u.email === usr) && u.password === pw
    );
    if (!found) {
      toast("账号或密码不正确", "error");
      return;
    }
    // ... 原逻辑
  }
}
```

### 步骤 3: 修改产品加载函数

```javascript
async function loadProducts() {
  if (SUPABASE_CONFIG.ENABLED) {
    // 从 Supabase 加载
    const products = await getProducts();
    if (products) {
      state.products = products;
    }
  }
  // 继续渲染 UI...
  renderProducts();
}
```

### 步骤 4: 修改数据保存函数

```javascript
async function saveNewProduct(product) {
  if (SUPABASE_CONFIG.ENABLED) {
    try {
      const created = await createProduct(product);
      state.products.push(created);
      toast("产品已保存到 Supabase", "success");
    } catch (e) {
      toast("保存失败: " + e.message, "error");
    }
  } else {
    state.products.push(product);
    save();
    toast("产品已保存到本地", "success");
  }
}
```

---

## 常见问题

### Q1: 如何同时使用本地和云端？
✅ 配置文件支持混合模式。将 `ENABLED` 改为 `false` 时使用本地存储，改为 `true` 时使用 Supabase。

### Q2: 如何处理离线访问？
✅ 在 `syncData()` 函数中实现离线缓存机制：
```javascript
async function syncData() {
  if (!SUPABASE_CONFIG.ENABLED) return;
  
  try {
    const products = await getProducts();
    if (products) {
      state.products = products;
      SS("products_cache", products); // 缓存本地
    }
  } catch (e) {
    // 网络错误时使用缓存
    const cached = JSON.parse(LS("products_cache") || "null");
    if (cached) state.products = cached;
  }
}
```

### Q3: 如何上传图片？
✅ 使用 `uploadFile()` 函数：
```javascript
const imageInput = document.getElementById("productImage");
const file = imageInput.files[0];
const url = await uploadFile("product-images", `products/${Date.now()}.jpg`, file);
product.image_url = url;
```

### Q4: 如何处理实时更新？
✅ 使用 Supabase 的实时订阅：
```javascript
supabaseClient
  .from("products")
  .on("*", (payload) => {
    console.log("产品数据变更:", payload);
    syncData(); // 重新同步
  })
  .subscribe();
```

### Q5: 生产环境需要注意什么？
⚠️ 关键事项：
1. **不要暴露密钥** - 改用服务角色密钥 + RLS 策略
2. **启用 HTTPS** - Supabase 数据传输必须加密
3. **设置 RLS** - 确保用户只能访问自己的数据
4. **备份数据** - 定期导出重要数据
5. **监控配额** - 关注 API 调用次数和存储空间

---

## 📞 获取帮助

- **Supabase 文档**: https://supabase.com/docs
- **JavaScript 客户端库**: https://github.com/supabase/supabase-js
- **社区论坛**: https://github.com/supabase/supabase/discussions

---

**提示**: 完成配置后，刷新页面测试是否成功连接！🎉
