/**
 * Supabase 集成配置
 * 用于连接真实数据库
 */

// ═══ 修改这里的配置信息 ═══
const SUPABASE_CONFIG = {
  URL: "https://your-project.supabase.co",        // 替换为你的 Supabase URL
  KEY: "your-anon-key",                           // 替换为你的 Anon Key
  ENABLED: false                                   // 改为 true 启用 Supabase
};

// ═══ Supabase 初始化 ═══
let supabaseClient = null;

async function initSupabase() {
  if (!SUPABASE_CONFIG.ENABLED || supabaseClient) return;
  
  const { createClient } = window.supabase;
  if (!createClient) {
    console.error("Supabase 库未加载");
    return;
  }
  
  try {
    supabaseClient = createClient(
      SUPABASE_CONFIG.URL,
      SUPABASE_CONFIG.KEY
    );
    console.log("✅ Supabase 连接成功");
  } catch (e) {
    console.error("❌ Supabase 连接失败:", e);
  }
}

// ═══ 用户认证 ═══
async function signUpUser(email, password, userData) {
  if (!supabaseClient) {
    console.warn("Supabase 未启用，使用本地存储");
    return null;
  }
  
  try {
    const { data, error } = await supabaseClient.auth.signUp({
      email,
      password,
      options: {
        data: userData
      }
    });
    
    if (error) throw error;
    return data;
  } catch (e) {
    console.error("注册失败:", e.message);
    throw e;
  }
}

async function signInUser(email, password) {
  if (!supabaseClient) {
    console.warn("Supabase 未启用，使用本地存储");
    return null;
  }
  
  try {
    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) throw error;
    return data;
  } catch (e) {
    console.error("登录失败:", e.message);
    throw e;
  }
}

async function signOutUser() {
  if (!supabaseClient) return;
  
  try {
    const { error } = await supabaseClient.auth.signOut();
    if (error) throw error;
  } catch (e) {
    console.error("退出失败:", e.message);
  }
}

// ═══ 数据库操作 ═══

// 产品表
async function getProducts() {
  if (!supabaseClient) return null;
  
  try {
    const { data, error } = await supabaseClient
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (error) throw error;
    return data;
  } catch (e) {
    console.error("获取产品失败:", e.message);
    return null;
  }
}

async function createProduct(product) {
  if (!supabaseClient) return null;
  
  try {
    const { data, error } = await supabaseClient
      .from("products")
      .insert([product])
      .select();
    
    if (error) throw error;
    return data[0];
  } catch (e) {
    console.error("创建产品失败:", e.message);
    throw e;
  }
}

async function updateProduct(id, updates) {
  if (!supabaseClient) return null;
  
  try {
    const { data, error } = await supabaseClient
      .from("products")
      .update(updates)
      .eq("id", id)
      .select();
    
    if (error) throw error;
    return data[0];
  } catch (e) {
    console.error("更新产品失败:", e.message);
    throw e;
  }
}

async function deleteProduct(id) {
  if (!supabaseClient) return false;
  
  try {
    const { error } = await supabaseClient
      .from("products")
      .delete()
      .eq("id", id);
    
    if (error) throw error;
    return true;
  } catch (e) {
    console.error("删除产品失败:", e.message);
    throw e;
  }
}

// 询盘表
async function getInquiries() {
  if (!supabaseClient) return null;
  
  try {
    const { data, error } = await supabaseClient
      .from("inquiries")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (error) throw error;
    return data;
  } catch (e) {
    console.error("获取询盘失败:", e.message);
    return null;
  }
}

async function createInquiry(inquiry) {
  if (!supabaseClient) return null;
  
  try {
    const { data, error } = await supabaseClient
      .from("inquiries")
      .insert([inquiry])
      .select();
    
    if (error) throw error;
    return data[0];
  } catch (e) {
    console.error("创建询盘失败:", e.message);
    throw e;
  }
}

async function updateInquiry(id, updates) {
  if (!supabaseClient) return null;
  
  try {
    const { data, error } = await supabaseClient
      .from("inquiries")
      .update(updates)
      .eq("id", id)
      .select();
    
    if (error) throw error;
    return data[0];
  } catch (e) {
    console.error("更新询盘失败:", e.message);
    throw e;
  }
}

// 游客表
async function getVisitors() {
  if (!supabaseClient) return null;
  
  try {
    const { data, error } = await supabaseClient
      .from("visitors")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (error) throw error;
    return data;
  } catch (e) {
    console.error("获取游客失败:", e.message);
    return null;
  }
}

async function createVisitor(visitor) {
  if (!supabaseClient) return null;
  
  try {
    const { data, error } = await supabaseClient
      .from("visitors")
      .insert([visitor])
      .select();
    
    if (error) throw error;
    return data[0];
  } catch (e) {
    console.error("创建游客记录失败:", e.message);
    throw e;
  }
}

async function updateVisitor(id, updates) {
  if (!supabaseClient) return null;
  
  try {
    const { data, error } = await supabaseClient
      .from("visitors")
      .update(updates)
      .eq("id", id)
      .select();
    
    if (error) throw error;
    return data[0];
  } catch (e) {
    console.error("更新游客记录失败:", e.message);
    throw e;
  }
}

// 文件上传
async function uploadFile(bucket, path, file) {
  if (!supabaseClient) return null;
  
  try {
    const { data, error } = await supabaseClient.storage
      .from(bucket)
      .upload(path, file, { upsert: true });
    
    if (error) throw error;
    
    // 获取公开 URL
    const { data: publicData } = supabaseClient.storage
      .from(bucket)
      .getPublicUrl(path);
    
    return publicData.publicUrl;
  } catch (e) {
    console.error("上传文件失败:", e.message);
    throw e;
  }
}

// ═══ 混合模式（本地 + 云端） ═══
async function syncData() {
  if (!SUPABASE_CONFIG.ENABLED) return;
  
  try {
    console.log("开始同步数据到 Supabase...");
    
    // 同步产品
    const products = await getProducts();
    if (products) {
      state.products = products;
    }
    
    // 同步询盘
    const inquiries = await getInquiries();
    if (inquiries) {
      state.inquiries = inquiries;
    }
    
    // 同步游客
    const visitors = await getVisitors();
    if (visitors) {
      state.visitors = visitors;
    }
    
    console.log("✅ 数据同步完成");
  } catch (e) {
    console.error("❌ 同步失败:", e);
  }
}

// 在页面加载时初始化
window.addEventListener("DOMContentLoaded", async () => {
  await initSupabase();
  if (SUPABASE_CONFIG.ENABLED) {
    await syncData();
  }
});
