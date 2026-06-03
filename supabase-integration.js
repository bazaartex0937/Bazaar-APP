<!-- ═══ SUPABASE 库 ═══ -->
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>

<script>
// ═══════════════════════════════════════════════════════════
// 🔐 SUPABASE 配置 - 已连接
// ═══════════════════════════════════════════════════════════

const supabaseUrl = 'https://edhvvpionbkwonfwvybтb';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVodnZwaW9uYmt3b25md3Z5YnRiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA0NTg2NjEsImV4cCI6MjA5NjAzNDY2MX0.ZEOhZC8pCCF8EOGhAvkIBAxgkzhehyZ10gFh4QBh1Xc';

let supabase = null;

// 初始化 Supabase
function initSupabase() {
  try {
    supabase = window.supabase.createClient(supabaseUrl, supabaseKey);
    console.log('✅ Supabase 初始化成功！');
    return true;
  } catch (error) {
    console.error('❌ Supabase 初始化失败:', error);
    return false;
  }
}

// ═══════════════════════════════════════════════════════════
// 📊 数据库操作函数
// ═══════════════════════════════════════════════════════════

// 获取所有产品
async function getProductsFromDB() {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    console.log('✅ 从数据库获取产品:', data);
    return data;
  } catch (error) {
    console.error('❌ 获取产品失败:', error.message);
    return null;
  }
}

// 获取所有询盘
async function getInquiriesFromDB() {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from('inquiries')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    console.log('✅ 从数据库获取询盘:', data);
    return data;
  } catch (error) {
    console.error('❌ 获取询盘失败:', error.message);
    return null;
  }
}

// 获取所有游客
async function getVisitorsFromDB() {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from('visitors')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    console.log('✅ 从数据库获取游客:', data);
    return data;
  } catch (error) {
    console.error('❌ 获取游客失败:', error.message);
    return null;
  }
}

// 创建新产品
async function createProductInDB(product) {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from('products')
      .insert([product])
      .select();
    if (error) throw error;
    console.log('✅ 产品创建成功:', data);
    return data[0];
  } catch (error) {
    console.error('❌ 创建产品失败:', error.message);
    return null;
  }
}

// 创建新询盘
async function createInquiryInDB(inquiry) {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from('inquiries')
      .insert([inquiry])
      .select();
    if (error) throw error;
    console.log('✅ 询盘创建成功:', data);
    return data[0];
  } catch (error) {
    console.error('❌ ��建询盘失败:', error.message);
    return null;
  }
}

// 创建访客记录
async function createVisitorInDB(visitor) {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from('visitors')
      .insert([visitor])
      .select();
    if (error) throw error;
    console.log('✅ 访客记录创建成功:', data);
    return data[0];
  } catch (error) {
    console.error('❌ 创建访客记录失败:', error.message);
    return null;
  }
}

// 更新产品
async function updateProductInDB(id, updates) {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', id)
      .select();
    if (error) throw error;
    console.log('✅ 产品更新成功:', data);
    return data[0];
  } catch (error) {
    console.error('❌ 更新产品失败:', error.message);
    return null;
  }
}

// 删除产品
async function deleteProductInDB(id) {
  if (!supabase) return false;
  try {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);
    if (error) throw error;
    console.log('✅ 产品删除成功');
    return true;
  } catch (error) {
    console.error('❌ 删除产品失败:', error.message);
    return false;
  }
}

// 上传文件
async function uploadFileToSupabase(bucket, path, file) {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, { upsert: true });
    if (error) throw error;
    
    // 获取公开 URL
    const { data: publicData } = supabase.storage
      .from(bucket)
      .getPublicUrl(path);
    
    console.log('✅ 文件上传成功:', publicData.publicUrl);
    return publicData.publicUrl;
  } catch (error) {
    console.error('❌ 文件上传失败:', error.message);
    return null;
  }
}

// ═══════════════════════════════════════════════════════════
// 🔄 数据同步函数
// ═══════════════════════════════════════════════════════════

async function syncAllDataFromDB() {
  if (!supabase) return;
  
  console.log('🔄 开始同步所有数据...');
  
  // 同步产品
  const products = await getProductsFromDB();
  if (products && Array.isArray(products)) {
    state.products = products;
    console.log(`✅ 同步了 ${products.length} 个产品`);
  }
  
  // 同步询盘
  const inquiries = await getInquiriesFromDB();
  if (inquiries && Array.isArray(inquiries)) {
    state.inquiries = inquiries;
    console.log(`✅ 同步了 ${inquiries.length} 条询盘`);
  }
  
  // 同步游客
  const visitors = await getVisitorsFromDB();
  if (visitors && Array.isArray(visitors)) {
    state.visitors = visitors;
    console.log(`✅ 同步了 ${visitors.length} 个游客`);
  }
  
  console.log('✅ 数据同步完成！');
}

// ═══════════════════════════════════════════════════════════
// 🔐 用户认证函数（可选）
// ═══════════════════════════════════════════════════════════

// 注册新用户
async function signUpUser(email, password, userData = {}) {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData
      }
    });
    if (error) throw error;
    console.log('✅ 用户注册成功:', data);
    return data;
  } catch (error) {
    console.error('❌ 注册失败:', error.message);
    return null;
  }
}

// 用户登录
async function signInUser(email, password) {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    if (error) throw error;
    console.log('✅ 用户登录成功:', data);
    return data;
  } catch (error) {
    console.error('❌ 登录失败:', error.message);
    return null;
  }
}

// 用户退出
async function signOutUser() {
  if (!supabase) return false;
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    console.log('✅ 用户已退出');
    return true;
  } catch (error) {
    console.error('❌ 退出失败:', error.message);
    return false;
  }
}

// ═══════════════════════════════════════════════════════════
// 🚀 页面加载时初始化
// ═══════════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', async () => {
  console.log('📌 页面加载完成，初始化 Supabase...');
  
  if (initSupabase()) {
    // 延迟同步，确保其他组件已初始化
    setTimeout(() => {
      syncAllDataFromDB();
    }, 500);
  } else {
    console.warn('⚠️ Supabase 初始化失败，使用本地存储模式');
  }
});
</script>
