<script setup>
import { ref, onMounted, computed, nextTick } from 'vue'
import { getLabelList, saveLabel, deleteLabel, updateLabel } from './api/urlService'
import axios from 'axios'

// 模拟数据
const mockCategories = [
  {
    id: '1',
    title: '公司网址',
    links: [
      {
        id: 1,
        lable_name: '百度',
        lable_url: 'https://www.baidu.com',
        dev_url: 'https://dev.baidu.com',
        test_url: 'https://test.baidu.com',
        pre_url: 'https://pre.baidu.com',
        pro_url: 'https://www.baidu.com',
        icon_url: 'https://www.baidu.com/favicon.ico'
      },
      {
        id: 2,
        lable_name: 'Google',
        lable_url: 'https://www.google.com',
        dev_url: 'https://dev.google.com',
        test_url: 'https://test.google.com',
        pre_url: 'https://pre.google.com',
        pro_url: 'https://www.google.com',
        icon_url: 'https://www.google.com/favicon.ico'
      }
    ]
  },
  {
    id: '2',
    title: '推荐网址',
    links: [
      {
        id: '2-1',
        title: 'GitHub',
        description: '全球最大的代码托管平台',
        url: 'https://github.com'
      },
      {
        id: '2-2',
        title: 'Vue.js',
        description: '渐进式 JavaScript 框架',
        url: 'https://vuejs.org'
      },
      {
        id: '2-3',
        title: 'MDN',
        description: 'Web 开发技术文档',
        url: 'https://developer.mozilla.org'
      },
      {
        id: '2-4',
        title: 'Stack Overflow',
        description: '程序员问答社区',
        url: 'https://stackoverflow.com'
      },
      {
        id: '2-5',
        title: 'LeetCode',
        description: '编程刷题平台',
        url: 'https://leetcode.com'
      },
      {
        id: '2-6',
        title: 'CodePen',
        description: '在线代码编辑器',
        url: 'https://codepen.io'
      },
      {
        id: '2-7',
        title: 'Dribbble',
        description: '设计师作品展示平台',
        url: 'https://dribbble.com'
      },
      {
        id: '2-8',
        title: 'Figma',
        description: '在线设计工具',
        url: 'https://www.figma.com'
      }
    ]
  },
  {
    id: '3',
    title: '个人网址',
    links: [
      {
        id: '3-1',
        title: '知乎',
        description: '中文问答社区',
        url: 'https://www.zhihu.com'
      },
      {
        id: '3-2',
        title: '微博',
        description: '社交媒体平台',
        url: 'https://weibo.com'
      },
      {
        id: '3-3',
        title: 'B站',
        description: '视频弹幕网站',
        url: 'https://www.bilibili.com'
      },
      {
        id: '3-4',
        title: '豆瓣',
        description: '书影音社区',
        url: 'https://www.douban.com'
      },
      {
        id: '3-5',
        title: '小红书',
        description: '生活方式社区',
        url: 'https://www.xiaohongshu.com'
      },
      {
        id: '3-6',
        title: '抖音',
        description: '短视频平台',
        url: 'https://www.douyin.com'
      },
      {
        id: '3-7',
        title: '微信',
        description: '即时通讯软件',
        url: 'https://www.wechat.com'
      },
      {
        id: '3-8',
        title: 'QQ',
        description: '即时通讯软件',
        url: 'https://www.qq.com'
      }
    ]
  }
]

const categories = ref([])
const allCategories = ref([]);
const loading = ref(false)
const error = ref(null)
const searchKeyword = ref('')
const isSearchFocused = ref(false)

// Code flow background effect
const codeLines = ref([])
const numLines = 50 // Number of code lines

const generateCodeLine = () => {
  const keywords = ['const', 'let', 'var', 'function', 'class', 'import', 'export', 'return', 'if', 'else', 'for', 'while', 'do', 'switch', 'case', 'break', 'continue', 'try', 'catch', 'finally', 'new', 'this', 'super', 'extends', 'implements', 'static', 'public', 'private', 'protected', 'async', 'await', 'of', 'in', 'typeof', 'instanceof', 'void', 'null', 'undefined', 'true', 'false']
  const builtins = ['console', 'log', 'Math', 'random', 'Date', 'Array', 'Object', 'String', 'Number', 'Boolean', 'Promise', 'setTimeout', 'setInterval', 'clearTimeout', 'clearInterval', 'fetch']
  const operators = ['=', '+', '-', '* ', '/ ', '> ', '< ', '>= ', '<= ', '== ', '!= ', '=== ', '!== ', '&', '|', '^', '~', '<<', '>>', '>>>', '&&', '||', '??', '!', '~', '?:']
  const symbols = ['(', ')', '{', '}', '[', ']', ';', ',', '.', ':', '`', '"', "'"]

  let line = ''
  const len = Math.random() * 40 + 10 // Random line length
  for (let i = 0; i < len; i++) {
    const type = Math.random()
    if (type < 0.15) {
      const keyword = keywords[Math.floor(Math.random() * keywords.length)]
      line += `<span class="keyword">${keyword}</span>`
    } else if (type < 0.25) {
      const builtin = builtins[Math.floor(Math.random() * builtins.length)]
      line += `<span class="builtin">${builtin}</span>`
    } else if (type < 0.35) {
      const operator = operators[Math.floor(Math.random() * operators.length)]
      line += `<span class="operator">${operator}</span>`
    } else if (type < 0.45) {
      const symbol = symbols[Math.floor(Math.random() * symbols.length)]
      line += `<span class="symbol">${symbol}</span>`
    } else if (type < 0.65) {
      const number = Math.floor(Math.random() * 100)
      line += `<span class="number">${number}</span>`
    } else if (type < 0.85) {
      const string = Math.random().toString(36).substring(2, 5)
      line += `<span class="string">"${string}"</span>`
    } else {
      line += Math.random() > 0.5 ? '0' : '1'
    }
  }
  return {
    html: line,
    top: Math.random() * 100,
    left: Math.random() * 100,
    duration: Math.random() * 10 + 5,
    delay: Math.random() * 10
  }
}

const initCodeFlow = () => {
  codeLines.value = []
  for (let i = 0; i < numLines; i++) {
    codeLines.value.push(generateCodeLine())
  }
}

// 弹窗控制
const showModal = ref(false)
const editingItem = ref(null)
const formData = ref({
  lable_name: '',
  category_id: 0, // 固定为0
  lable_url: 'string', // 固定为'string'
  dev_url: '',
  test_url: '',
  pre_url: '',
  pro_url: '',
  icon_url: ''
})

// 表单校验状态
const formErrors = ref({
    lable_name: false,
    dev_url: false,
    test_url: false,
    pre_url: false,
    pro_url: false,
    icon_url: false,
})

// 校验网址格式（允许空）
const isValidUrl = (url) => {
    if (!url) return true; // 允许空
    // 简单的正则检查是否以http://或https://开头，或者只包含域名/IP
    const urlPattern = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(:\d+)?(\/\S*)?$/; // 简单的域名格式校验
     const ipPattern = /^(https?:\/\/)?(?:[0-9]{1,3}\.){3}[0-9]{1,3}(:\d+)?(\/\S*)?$/; // 简单的IP格式校验
    return urlPattern.test(url) || ipPattern.test(url);
};

// 校验表单
const validateForm = () => {
    let isValid = true;
    
    // 检查网站名称是否为空
    if (!formData.value.lable_name.trim()) {
        formErrors.value.lable_name = true;
        isValid = false;
    } else {
        formErrors.value.lable_name = false;
    }
    
    // 检查开发环境地址是否为有效网址（允许空）
    if (!isValidUrl(formData.value.dev_url)) {
        formErrors.value.dev_url = true;
        isValid = false;
    } else {
        formErrors.value.dev_url = false;
    }

    // 检查测试环境地址是否为有效网址（允许空）
    if (!isValidUrl(formData.value.test_url)) {
        formErrors.value.test_url = true;
        isValid = false;
    } else {
        formErrors.value.test_url = false;
    }

    // 检查预发环境地址是否为有效网址（允许空）
    if (!isValidUrl(formData.value.pre_url)) {
        formErrors.value.pre_url = true;
        isValid = false;
    } else {
        formErrors.value.pre_url = false;
    }

    // 检查生产环境地址是否为有效网址（允许空）
    if (!isValidUrl(formData.value.pro_url)) {
        formErrors.value.pro_url = true;
        isValid = false;
    } else {
        formErrors.value.pro_url = false;
    }

    // 检查Icon URL是否为有效网址（允许空）
     if (!isValidUrl(formData.value.icon_url)) {
        formErrors.value.icon_url = true;
        isValid = false;
    } else {
        formErrors.value.icon_url = false;
    }

    return isValid;
}

// 重置表单
const resetForm = () => {
  formData.value = {
    lable_name: '',
    category_id: 0, // 固定为0
    lable_url: 'string', // 固定为'string'
    dev_url: '',
    test_url: '',
    pre_url: '',
    pro_url: '',
    icon_url: ''
  }
  editingItem.value = null;
  // 重置校验状态
  formErrors.value = {
      lable_name: false,
      dev_url: false,
      test_url: false,
      pre_url: false,
      pro_url: false,
      icon_url: false,
  }
}

// 提交表单
const handleSubmit = async () => {
  // 先进行表单校验
  if (!validateForm()) {
      return; // 如果校验失败，停止提交
  }

  try {
    // 构造符合API要求的请求体
    const submitData = {
      id: formData.value.id, // 编辑时有id，新增时无id
      lable_name: formData.value.lable_name,
      category_id: 0, // 固定值
      lable_url: 'string', // 固定值
      dev_url: formData.value.dev_url,
      test_url: formData.value.test_url,
      pre_url: formData.value.pre_url,
      pro_url: formData.value.pro_url,
      icon_url: formData.value.icon_url
    };
    
    if (editingItem.value) {
      // 编辑
      await updateLabel(submitData);
    } else {
      // 新增
      await saveLabel(submitData);
    }
    showModal.value = false;
    resetForm();
    // 重新获取列表，更新显示
    await fetchCategories();
  } catch (error) {
    console.error('保存失败:', error);
    alert('保存失败，请重试');
  }
};

// 获取数据
const fetchCategories = async () => {
  loading.value = true;
  error.value = null;
  try {
    const data = await getLabelList();
    const formattedData = [{
      id: '1',
      title: '网址导航',
      links: data.map(item => ({
        id: item.id,
        lable_name: item.lable_name,
        lable_url: item.lable_url,
        dev_url: item.dev_url,
        test_url: item.test_url,
        pre_url: item.pre_url,
        pro_url: item.pro_url,
        icon_url: item.icon_url
      }))
    }];
    categories.value = formattedData; // 显示所有卡片
    allCategories.value = formattedData; // 保存原始数据用于过滤
  } catch (err) {
    error.value = '获取数据失败';
    console.error(err);
  } finally {
    loading.value = false;
  }
};

// 搜索功能
const handleSearch = () => {
  const keyword = searchKeyword.value.trim().toLowerCase();

  if (!keyword) {
    categories.value = allCategories.value; // 搜索关键词为空时显示所有卡片
    return;
  }

  // 根据卡片名称进行过滤
  const results = allCategories.value.map(category => ({
    ...category,
    links: category.links.filter(link => {
      return link.lable_name.toLowerCase().includes(keyword); // 只过滤名称
    })
  })).filter(category => category.links.length > 0);

  categories.value = results;
};

// 打开链接
const openLink = (url) => {
  if (url) {
    // 确保URL包含协议头，如果用户没有输入，默认加上http://
    const fullUrl = url.startsWith('http://') || url.startsWith('https://') 
      ? url 
      : `http://${url}`;
    window.open(fullUrl, '_blank')
  }
}

// 获取首字母
const getFirstLetter = (name) => {
  if (!name) return '?'
  return name.charAt(0).toUpperCase()
}

// 根据名称生成固定的颜色
const getRandomColor = (name) => {
  const colors = [
    '#2196F3', // 蓝色
    '#4CAF50', // 绿色
    '#FF9800', // 橙色
    '#9C27B0', // 紫色
    '#E91E63', // 粉色
    '#00BCD4', // 青色
    '#FF5722', // 深橙色
    '#673AB7', // 深紫色
    '#3F51B5', // 靛蓝色
    '#009688'  // 蓝绿色
  ]
  // 使用名称的字符编码总和来选择颜色，确保相同名称总是得到相同的颜色
  const sum = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  return colors[sum % colors.length]
}

// 删除相关的状态
const showDeleteModal = ref(false)
const deletePassword = ref('')
const itemToDelete = ref(null)

// 右键菜单相关的状态
const showContextMenu = ref(false)
const contextMenuPosition = ref({ x: 0, y: 0 })
// itemToDelete 也用于右键菜单

// 显示删除确认弹窗
const showDeleteConfirm = (item) => {
  itemToDelete.value = item
  deletePassword.value = ''
  showDeleteModal.value = true
}

// 删除导航项
const handleDelete = async () => {
  if (deletePassword.value !== '123456') {
    alert('密码错误，无法删除')
    return
  }
  
  try {
    await axios.delete('/api/lable/delete', {
      params: {
        labels_id: itemToDelete.value.id
      }
    })
    showDeleteModal.value = false
    deletePassword.value = ''
    itemToDelete.value = null
    // 重新获取列表
    await fetchCategories()
  } catch (error) {
    console.error('删除失败:', error)
    alert('删除失败，请重试')
  }
}

// 取消删除
const cancelDelete = () => {
  showDeleteModal.value = false
  deletePassword.value = ''
  itemToDelete.value = null
}

// 处理右键点击事件
const handleRightClick = (event, item) => {
  event.preventDefault(); // 阻止默认的浏览器右键菜单
  showContextMenu.value = false; // 先隐藏可能存在的菜单
  itemToDelete.value = item; // 记录当前点击的卡片
  
  // 设置菜单位置
  contextMenuPosition.value = {
    x: event.clientX, // 使用鼠标点击的X坐标
    y: event.clientY // 使用鼠标点击的Y坐标
  };

  // 在下一个tick中显示菜单，确保位置已设置
  nextTick(() => {
    showContextMenu.value = true;
  });
};

// 编辑功能
const handleEdit = () => {
  if (!itemToDelete.value) return;
  editingItem.value = { ...itemToDelete.value };
  formData.value = {
    id: itemToDelete.value.id,
    lable_name: itemToDelete.value.lable_name,
    category_id: itemToDelete.value.category_id ?? 0,
    lable_url: itemToDelete.value.lable_url ?? 'string',
    dev_url: itemToDelete.value.dev_url ?? '',
    test_url: itemToDelete.value.test_url ?? '',
    pre_url: itemToDelete.value.pre_url ?? '',
    pro_url: itemToDelete.value.pro_url ?? '',
    icon_url: itemToDelete.value.icon_url ?? ''
  };
  showModal.value = true;
  showContextMenu.value = false;
};

// 主题图片相关
const themeImages = [
  {
    name: 'none',
    url: '', // 无背景
    preview: '', // 可用空白或自定义图标
    label: '无背景'
  },
  {
    name: 'img1',
    url: 'https://img1.baidu.com/it/u=2603934083,3021636721&fm=253&fmt=auto&app=138&f=JPEG?w=889&h=500',
    preview: 'https://img1.baidu.com/it/u=2603934083,3021636721&fm=253&fmt=auto&app=138&f=JPEG?w=120&h=80',
    label: '图片1'
  },
  {
    name: 'img2',
    url: 'https://img0.baidu.com/it/u=2378188524,3381932151&fm=253&fmt=auto&app=138&f=JPEG?w=1422&h=800',
    preview: 'https://img0.baidu.com/it/u=2378188524,3381932151&fm=253&fmt=auto&app=138&f=JPEG?w=120&h=80',
    label: '图片2'
  },
  {
    name: 'img3',
    url: 'https://www.23jcw.net/wp-content/uploads/2024/03/202403240228514.jpg',
    preview: 'https://www.23jcw.net/wp-content/uploads/2024/03/202403240228514.jpg',
    label: '图片3'
  },
  {
    name: 'img4',
    url: 'https://p2.itc.cn/images01/20230321/0c5aaf55422a4ec3bfd1fc14555ca89e.jpeg',
    preview: 'https://p2.itc.cn/images01/20230321/0c5aaf55422a4ec3bfd1fc14555ca89e.jpeg',
    label: '图片4'
  },
  {
    name: 'img5',
    url: 'https://img.win3000.com/m00/14/36/91a1bb4533971206231955ac4521d968.jpg',
    preview: 'https://img.win3000.com/m00/14/36/91a1bb4533971206231955ac4521d968.jpg',
    label: '图片5'
  },
  {
    name: 'img6',
    url: 'https://pic.rmb.bdstatic.com/bjh/241023/dump/c0270e21a6ca5497f5a0fa66b3f89f4c.png',
    preview: 'https://pic.rmb.bdstatic.com/bjh/241023/dump/c0270e21a6ca5497f5a0fa66b3f89f4c.png',
    label: '图片6'
  }, 
  {
    name: 'img7',
    url: 'https://p8.itc.cn/images01/20230117/02e3c85b3698456f922435616ae4fb07.jpeg',
    preview: 'https://p8.itc.cn/images01/20230117/02e3c85b3698456f922435616ae4fb07.jpeg',
    label: '图片7'
  },
  { 
    name: 'img8',
    url: 'https://c-ssl.dtstatic.com/uploads/blog/202101/27/20210127091657_02886.thumb.1000_0.gif',
    preview: 'https://c-ssl.dtstatic.com/uploads/blog/202101/27/20210127091657_02886.thumb.1000_0.gif',
    label: '图片8'
  },
  { 
    name: 'img9',
    url: 'https://tukuimg.bdstatic.com/scrop/626afb2733ada856d80d4fc9d1320318.gif',
    preview: 'https://tukuimg.bdstatic.com/scrop/626afb2733ada856d80d4fc9d1320318.gif',
    label: '图片9'
  },
  { 
    name: 'img10',
    url: 'https://n.sinaimg.cn/sinakd20230420ac/703/w450h253/20230420/9fb9-gif79adef81db7c331802eba99d9e88f953.gif',
    preview: 'https://n.sinaimg.cn/sinakd20230420ac/703/w450h253/20230420/9fb9-gif79adef81db7c331802eba99d9e88f953.gif',
    label: '图片10'
  }
];  
const defaultBgColor = '#0a0a23';
const currentThemeImg = ref(localStorage.getItem('themeImg') || '');

const setThemeImg = (url) => {
  currentThemeImg.value = url;
  localStorage.setItem('themeImg', url);
  if (url) {
    document.body.style.backgroundImage = `url('${url}')`;
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundPosition = 'center';
    document.body.style.backgroundRepeat = 'no-repeat';
    document.body.style.backgroundColor = '';
  } else {
    document.body.style.backgroundImage = '';
    document.body.style.backgroundColor = defaultBgColor;
  }
};

// 组件挂载时获取数据
onMounted(() => {
  fetchCategories();
  initCodeFlow();
  // 应用主题图片或纯色
  nextTick(() => {
    if (currentThemeImg.value) {
      document.body.style.backgroundImage = `url('${currentThemeImg.value}')`;
      document.body.style.backgroundSize = 'cover';
      document.body.style.backgroundPosition = 'center';
      document.body.style.backgroundRepeat = 'no-repeat';
      document.body.style.backgroundColor = '';
    } else {
      document.body.style.backgroundImage = '';
      document.body.style.backgroundColor = defaultBgColor;
    }
  });
})
</script>

<template>
  <div id="app" class="page-wrapper">
    <!-- New code flow overlay -->
    <div class="code-flow-overlay">
      <div
        v-for="(line, index) in codeLines"
        :key="index"
        class="code-line"
        v-html="line.html"
        :style="{
          top: line.top + 'vh',
          left: line.left + 'vw',
          animationDuration: line.duration + 's',
          animationDelay: line.delay + 's',
        }"
      ></div>
    </div>

    <!-- Top area: Search bar and Add button -->
    <div class="top-bar">
      <input type="text" class="search-bar" v-model="searchKeyword" placeholder="Search..." @focus="isSearchFocused = true" @blur="isSearchFocused = false" @input="handleSearch" @keypress.enter="handleSearch"/>
      <div class="add-button-container">
        <div class="add-button" @click="showModal = true">
          <img src="https://img1.baidu.com/it/u=2882975787,2613993032&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500" alt="Add Icon" class="add-button-icon"/>
        </div>
        <div class="theme-buttons">
          <button v-for="theme in themeImages" :key="theme.name" class="theme-img-btn" @click="setThemeImg(theme.url)" :title="theme.label">
            <template v-if="theme.url">
              <img :src="theme.preview" :alt="theme.label" />
            </template>
            <template v-else>
              <span class="theme-none-icon">无</span>
            </template>
          </button>
        </div>
      </div>
    </div>

    <!-- Existing content wrapper -->
    <div class="content-wrapper">
      <!-- Header is now empty or can be removed if no title is needed -->
      <header></header>

      <!-- Add/Edit Modal -->
      <div v-if="showModal" class="modal-overlay" @click.self="showModal = false">
        <div class="modal-content">
          <h2>{{ editingItem ? 'Edit Navigation Item' : 'Add New Navigation Item' }}</h2>
          <form @submit.prevent="handleSubmit">
            <div class="form-group">
              <label for="lable_name">网站名称:</label>
              <input type="text" id="lable_name" v-model="formData.lable_name" required :class="{ 'input-error': formErrors.lable_name }" />
              <span v-if="formErrors.lable_name" class="error-message">网站名称不能为空</span>
            </div>
            <div class="form-group">
              <label for="dev_url">开发环境地址:</label>
              <input type="text" id="dev_url" v-model="formData.dev_url" :class="{ 'input-error': formErrors.dev_url }" />
              <span v-if="formErrors.dev_url" class="error-message">请输入有效的网址格式</span>
            </div>
            <div class="form-group">
              <label for="test_url">测试环境地址:</label>
              <input type="text" id="test_url" v-model="formData.test_url" :class="{ 'input-error': formErrors.test_url }" />
               <span v-if="formErrors.test_url" class="error-message">请输入有效的网址格式</span>
            </div>
            <div class="form-group">
              <label for="pre_url">预发环境地址:</label>
              <input type="text" id="pre_url" v-model="formData.pre_url" :class="{ 'input-error': formErrors.pre_url }" />
              <span v-if="formErrors.pre_url" class="error-message">请输入有效的网址格式</span>
            </div>
            <div class="form-group">
              <label for="pro_url">生产环境地址:</label>
              <input type="text" id="pro_url" v-model="formData.pro_url" :class="{ 'input-error': formErrors.pro_url }" />
              <span v-if="formErrors.pro_url" class="error-message">请输入有效的网址格式</span>
            </div>
            <div class="form-group">
              <label for="icon_url">Icon URL:</label>
              <input type="text" id="icon_url" v-model="formData.icon_url" :class="{ 'input-error': formErrors.icon_url }" />
              <span v-if="formErrors.icon_url" class="error-message">请输入有效的网址格式或留空</span>
            </div>
            <div class="modal-actions">
              <button type="submit">{{ editingItem ? 'Update' : 'Add' }}</button>
              <button type="button" @click="showModal = false">Cancel</button>
            </div>
          </form>
        </div>
      </div>

      <!-- Delete Confirmation Modal -->
      <div v-if="showDeleteModal" class="modal-overlay" @click.self="cancelDelete">
        <div class="modal-content">
          <h3>确认删除</h3>
          <p>确定要删除 "{{ itemToDelete?.lable_name }}" 吗？</p>
          <div class="form-group">
            <label for="delete-password">密码:</label>
            <input type="password" id="delete-password" v-model="deletePassword" required />
          </div>
          <div class="modal-actions">
            <button @click="handleDelete">删除</button>
            <button @click="cancelDelete">取消</button>
          </div>
        </div>
      </div>

      <!-- Custom Context Menu for Delete -->
      <div v-if="showContextMenu" class="context-menu" :style="{ left: contextMenuPosition.x + 'px', top: contextMenuPosition.y + 'px' }" @click="showContextMenu = false">
        <ul>
          <li @click.stop="showDeleteConfirm(itemToDelete)">删除</li>
          <li @click.stop="handleEdit">编辑</li>
        </ul>
      </div>

      <div class="category-list">
        <div v-for="category in categories" :key="category.id" class="category-item">
          <h2>{{ category.title }}</h2>
          <div class="card-list">
            <div
              v-for="(item, index) in category.links"
              :key="item.id"
              class="card-item"
              :class="'card-' + (index % 3)"
              @contextmenu.prevent="handleRightClick($event, item)"
            >
              <!-- Container for icon and site info -->
              <div class="site-info-wrapper">
                <div class="site-icon">
                  <img v-if="item.icon_url" :src="item.icon_url" :alt="item.lable_name" @error="onImageError($event, item)" />
                  <div v-else :style="{ backgroundColor: getRandomColor(item.lable_name) }" class="default-icon">{{ getFirstLetter(item.lable_name) }}</div>
                </div>
                <div class="site-info">
                  <div class="site-title">{{ item.lable_name }}</div>
                </div>
              </div>
              <!-- Container for environment links -->
              <div class="site-env-links">
                <button v-if="item.dev_url" @click.stop="openLink(item.dev_url)">开发环境</button>
                <button v-if="item.test_url" @click.stop="openLink(item.test_url)">测试环境</button>
                <button v-if="item.pre_url" @click.stop="openLink(item.pre_url)">预发环境</button>
                <button v-if="item.pro_url" @click.stop="openLink(item.pro_url)">生产环境</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
/* Basic Reset */
body {
  margin: 0;
  font-family: 'Arial', sans-serif;
  background-color: #0a0a23; /* Solid dark blue background */
  color: #e0e0e0; /* Light grey text */
  overflow-x: hidden; /* Prevent horizontal scroll */
  transition: background 0.3s;
}

.page-wrapper {
  min-height: 100vh;
  width: 100vw; /* Ensure it covers the full viewport width */
  position: relative; /* Needed for absolute positioning of overlay */
  overflow: hidden; /* Hide overflow from animations */
  background: transparent !important;
}

/* Code Flow Overlay */
.code-flow-overlay {
  position: fixed; /* Use fixed to cover the whole viewport */
  top: 0;
  left: 0;
  width: 100vw; /* Use vw to cover full viewport width */
  height: 100vh; /* Use vh to cover full viewport height */
  pointer-events: none;
  overflow: hidden;
  z-index: 0;
  opacity: 0.5; /* Increase overall opacity slightly */
}

.code-line {
  position: absolute;
  white-space: nowrap;
  font-family: 'Consolas', 'Monaco', 'Andale Mono', 'Ubuntu Mono', monospace;
  font-size: 12px;
  color: rgba(0, 255, 0, 0.6); /* Default green for other text */
  animation: flow linear infinite;
  opacity: 0;
  /* Initial position will be set by inline style */
}

/* Code element colors */
.code-line span.keyword {
    color: #569cd6; /* VS Code blue */
}

.code-line span.builtin {
    color: #00bfff; /* Deep Sky Blue */
}

.code-line span.operator {
    color: #d4d4d4; /* Light grey */
}

.code-line span.symbol {
    color: #d4d4d4; /* Light grey */
}

.code-line span.number {
    color: #b5cea8; /* Light green */
}

.code-line span.string {
    color: #ce9178; /* Light orange */
}

@keyframes flow {
  0% {
    transform: translateY(-10vh); /* Start higher up */
    opacity: 0;
  }
  10% {
    opacity: 0.8; /* Fade in faster and to higher opacity */
  }
  90% {
    opacity: 0.8; /* Stay visible longer */
  }
  100% {
    transform: translateY(100vh); /* Flow downwards */
    opacity: 0; /* Fade out */
  }
}

/* Top Bar */
.top-bar {
    position: fixed; /* 固定在顶部 */
    top: 0;
    left: 0;
    width: 100%;
    display: flex;
    justify-content: center; /* 搜索栏居中 */
    align-items: center;
    padding: 15px 20px; /* 添加内边距 */
    box-sizing: border-box;
    z-index: 100; /* 确保在其他内容之上 */
    background-color: rgba(10, 10, 35, 0.8); /* 添加半透明背景 */
    backdrop-filter: blur(5px); /* 添加毛玻璃效果 */
}

@keyframes jellyBounceWidth {
  0% {
    width: 70%;
    max-width: 800px;
  }
  30% { /* 快速扩张 */
     width: 97%;
     max-width: 1450px;
  }
  50% { /* 回弹 */
     width: 89%;
     max-width: 1250px;
  }
   70% { /* 再次扩张 */
     width: 93.5%;
     max-width: 1360px;
   }
   90% { /* 微小回弹，发生得稍晚 */
      width: 94.7%;
      max-width: 1393px;
   }
   97% { /* 接近最终状态，更平缓过渡 */
      width: 94.95%;
      max-width: 1399px;
   }
   99% { /* 非常接近最终状态，缓慢过渡 */
       width: 95.02%;
       max-width: 1400.5px;
   }
  100% { /* 最终状态，最平滑地停止 */
    width: 95%;
    max-width: 1400px;
  }
}

.search-bar {
  /* 还原宽度和内边距 */
  width: 70%;
  max-width: 800px;
  padding: 15px 25px; /* 还原内边距 */
  margin: 0; /* 移除自动margin */
  display: block;
  border: none;
  border-radius: 30px;
  box-sizing: border-box;
  background-color: rgba(255, 255, 255, 0.1);
  color: #e0e0e0;
  font-size: 18px;
  transition: box-shadow 0.3s ease, background-color 0.3s ease;
  position: relative;
  z-index: 1;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  /* animation for unfocusing - simple transition back */
  transition: width 0.3s ease-out, max-width 0.3s ease-out, box-shadow 0.3s ease, background-color 0.3s ease;
}

.search-bar:focus {
  outline: none;
  border-color: transparent;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.5), 0 0 20px rgba(0, 123, 255, 0.7);
  background-color: rgba(255, 255, 255, 0.2);
  animation: jellyBounceWidth 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards;
}

.add-button-container {
    position: fixed; /* 固定在右上角 */
    top: 15px;
    right: 20px;
    z-index: 101; /* 确保在top-bar之上 */
}

.add-button {
  background-color: #007bff; /* 调整背景色 */
  color: white;
  border: none;
  border-radius: 50%;
  width: 45px; /* 调整大小 */
  height: 45px; /* 调整大小 */
  font-size: 28px; /* 调整字体大小 */
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: background-color 0.3s ease, transform 0.2s ease; /* 添加transform过渡 */
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3); /* 添加阴影 */
}

.add-button img.add-button-icon {
    display: block; /* 确保图片是块级元素 */
    width: 100%; /* 图片宽度占满按钮 */
    height: 100%; /* 图片高度占满按钮 */
    object-fit: cover; /* 保持图片比例并填充 */
    border-radius: 50%; /* 让图片也是圆形 */
}

.add-button:hover {
  background-color: #0056b3;
}

/* Content Wrapper */
.content-wrapper {
  position: relative;
  z-index: 1; /* Ensure it's above the background/overlay */
  padding: 90px 20px 20px 20px; /* 增加顶部内边距，为top-bar留出空间 */
  max-width: 1920px;
  margin: 0 auto;
}

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

h1 {
  color: #ffffff;
  margin: 0;
  font-size: 24px;
}

.add-button {
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  font-size: 24px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: background-color 0.3s ease;
}

.add-button:hover {
  background-color: #0056b3;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: #1e1e2d;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  max-width: 600px; /* 增加最大宽度 */
  width: 90%;
  color: #cccccc;
}

.modal-content h2, .modal-content h3 {
    color: #ffffff;
    margin-top: 0;
    margin-bottom: 20px;
}

.form-group {
  margin-bottom: 15px;
  display: flex; /* 使用flex布局 */
  align-items: center; /* 垂直居中对齐 */
  gap: 15px; /* 增加label和input之间的间距 */
}

.form-group label {
  display: block; /* 保持块级元素特性 */
  margin-bottom: 0; /* 移除底部margin */
  font-weight: bold;
  color: #b3b3b3;
  flex-shrink: 0; /* 防止label被压缩 */
  width: 130px; /* 给label一个固定宽度 */
  text-align: left; /* 左对齐 */
}

.form-group input[type="text"],
.form-group input[type="url"],
.form-group input[type="password"] {
  width: calc(100% - 115px); /* 根据label宽度和gap调整input宽度 */
  padding: 10px;
  border: 1px solid #333;
  border-radius: 5px;
  background-color: #2a2a38;
  color: #e0e0e0;
  flex-grow: 1; /* 让input填充剩余空间 */
}

/* 表单校验错误样式 */
.form-group .input-error {
    border-color: #e57373; /* 柔和的红色边框 */
}

.form-group .error-message {
    color: #e57373; /* 柔和的红色文字 */
    font-size: 0.9em;
    margin-top: 5px;
    display: block; /* 确保错误信息独占一行 */
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

.modal-actions button {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.modal-actions button[type="submit"] {
  background-color: #007bff;
  color: white;
}

.modal-actions button[type="submit"]:hover {
  background-color: #0056b3;
}

.modal-actions button[type="button"] {
  background-color: #6c757d;
  color: white;
}

.modal-actions button[type="button"]:hover {
  background-color: #5a6268;
}

.category-list {
  display: flex;
  flex-wrap: wrap;
  gap: 30px; /* Space between categories */
}

.category-item {
  width: 100%; /* Each category takes full width */
  margin-bottom: 20px;
}

.category-item h2 {
  margin-bottom: 15px;
  color: #ffffff;
  border-bottom: 2px solid #333;
  padding-bottom: 5px;
}

.card-list {
  display: flex;
  flex-wrap: wrap;
  gap: 15px; /* 进一步减小卡片之间的间距 */
  justify-content: flex-start;
}

.card-item {
  position: relative;
  /* background-color: #ffffff; */ /* White background */
  background: linear-gradient(135deg, #1a2a6c, #b21f1f, #fdbb2d); /* 添加渐变背景 */
  background-size: 200% 200%; /* 使背景尺寸变大，为动画做准备 */
  border-radius: 18px;
  padding: 15px;
  /* flex: 0 1 calc(25% - 11.25px); */ /* Default flex basis for 4 items per row */
  flex: 0 1 calc(25% - 41.25px); /* 保持flex basis */
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
  cursor: pointer;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.5); /* 调整阴影以适应暗色背景 */
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1), background-position 0.6s ease; /* 添加background-position的过渡 */
  overflow: hidden;
  backdrop-filter: none;
  border: none;
  min-width: 200px;
}

.card-item:hover {
  transform: translateY(-15px) scale(1.04); /* 保持原有的悬停位移和缩放 */
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3); /* 调整悬停阴影 */
  background-position: right center; /* 悬停时移动背景位置 */
}

/* 调整卡片内部文字颜色以适应深色背景 */
.card-item .site-title {
  color: #ffffff; /* 白色标题 */
}

/* 调整环境按钮颜色以适应深色背景 */
.site-env-links button {
  background-color: rgba(255, 255, 255, 0.1); /* 半透明白色背景 */
  color: #ffffff; /* 白色文字 */
  border: 1px solid rgba(255, 255, 255, 0.3); /* 半透明白色边框 */
  border-radius: 6px;
  padding: 6px 8px;
  font-size: 0.8em;
  cursor: pointer;
  transition: all 0.3s ease;
  flex: 1;
  min-width: 0;
  text-align: center;
  font-weight: 500;
  position: relative;
  overflow: hidden;
  white-space: nowrap;
}

/* 环境按钮特定颜色悬停效果 */
.site-env-links button:nth-of-type(1):hover { background-color: rgba(24, 144, 255, 0.3); }
.site-env-links button:nth-of-type(2):hover { background-color: rgba(114, 46, 209, 0.3); }
.site-env-links button:nth-of-type(3):hover { background-color: rgba(250, 140, 22, 0.3); }
.site-env-links button:nth-of-type(4):hover { background-color: rgba(82, 196, 26, 0.3); }

/* 调整链接图标默认背景色 */
.default-icon {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
    font-size: 20px;
    font-weight: bold;
    border-radius: 10px;
    /* background-color will be set by getRandomColor in inline style */
}

/* Custom Context Menu Styles */
.context-menu {
    position: fixed; /* 固定定位 */
    background-color: #2a2a38; /* 深色背景 */
    border: 1px solid #333; /* 边框 */
    border-radius: 5px; /* 圆角 */
    padding: 5px 0; /* 内边距 */
    z-index: 2000; /* 确保在所有内容之上 */
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5); /* 阴影 */
}

.context-menu ul {
    list-style: none; /* 移除列表点 */
    margin: 0;
    padding: 0;
}

.context-menu li {
    padding: 8px 15px; /* 菜单项内边距 */
    cursor: pointer; /* 鼠标样式 */
    color: #cccccc; /* 文字颜色 */
    transition: background-color 0.2s ease; /* 过渡效果 */
}

.context-menu li:hover {
    background-color: #007bff; /* 悬停背景色 */
    color: white; /* 悬停文字颜色 */
}

.site-info-wrapper { /* Wrapper for icon and info */
    display: flex;
    align-items: center;
    gap: 20px; /* Adjusted gap */
    width: 100%;
    margin-bottom: 15px;
}

.site-icon {
  width: 60px; /* Adjusted size */
  height: 60px; /* Adjusted size */
  flex-shrink: 0;
  position: relative;
  border-radius: 14px; /* Adjusted border-radius */
  overflow: hidden;
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 2;
  box-shadow: 0 5px 12px rgba(0,0,0,0.15);
}

.card-item:hover .site-icon {
  transform: scale(1.15) rotate(4deg);
  box-shadow: 0 10px 20px rgba(0,0,0,0.25);
}

/* Subtle icon border glow on hover */
.site-icon::after {
    content: '';
    position: absolute;
    top: -4px;
    left: -4px;
    right: -4px;
    bottom: -4px;
    border-radius: 18px; /* Adjusted border-radius */
    background: radial-gradient(circle at center, rgba(0, 123, 255, 0.5) 0%, rgba(0, 255, 255, 0) 70%);
    background-size: 200% 200%;
    z-index: -1;
    opacity: 0;
    transition: opacity 0.3s ease;
}

.card-item:hover .site-icon::after {
    opacity: 1;
    animation: iconRadialGlow 1.5s linear infinite;
}

@keyframes iconRadialGlow {
    0% { background-position: 0% 0%; }
    100% { background-position: 100% 100%; }
}

.site-icon img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.site-info {
  flex-grow: 1; /* Allow site-info to take available space */
  overflow: hidden;
}

.site-title {
  font-size: 1.3em; /* Adjusted title size */
  font-weight: bold;
  margin-bottom: 0; /* Remove bottom margin as gap is on wrapper */
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: color 0.3s ease, transform 0.3s ease;
  z-index: 2;
}

.card-item:hover .site-title {
    color: #0056b3;
    transform: translateX(10px);
}

.site-env-links { /* Wrapper for environment buttons */
  display: flex;
  flex-wrap: nowrap; /* 确保按钮不换行 */
  gap: 5px; /* 减小按钮之间的间距 */
  z-index: 2;
  align-items: center;
  width: 100%;
  justify-content: space-between; /* 让按钮均匀分布 */
}

.site-env-links button {
  background-color: rgba(255, 255, 255, 0.1); /* 半透明白色背景 */
  color: #ffffff; /* 白色文字 */
  border: 1px solid rgba(255, 255, 255, 0.3); /* 半透明白色边框 */
  border-radius: 6px;
  padding: 6px 8px;
  font-size: 0.8em;
  cursor: pointer;
  transition: all 0.3s ease;
  flex: 1;
  min-width: 0;
  text-align: center;
  font-weight: 500;
  position: relative;
  overflow: hidden;
  white-space: nowrap;
}

/* 环境按钮特定颜色 */
.site-env-links button:nth-of-type(1) { /* 开发环境 */
  color: #1890ff;
  border-color: #1890ff;
  background-color: rgba(24, 144, 255, 0.05);
}

.site-env-links button:nth-of-type(2) { /* 测试环境 */
  color: #722ed1;
  border-color: #722ed1;
  background-color: rgba(114, 46, 209, 0.05);
}

.site-env-links button:nth-of-type(3) { /* 预发环境 */
  color: #fa8c16;
  border-color: #fa8c16;
  background-color: rgba(250, 140, 22, 0.05);
}

.site-env-links button:nth-of-type(4) { /* 生产环境 */
  color: #52c41a;
  border-color: #52c41a;
  background-color: rgba(82, 196, 26, 0.05);
}

.site-env-links button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* 响应式调整 */
@media (max-width: 1800px) { /* 在此断点以下显示3个卡片 */
  .card-item {
    flex: 0 1 calc(33.333% - 10px); /* 3个卡片 */
  }
}

@media (max-width: 1200px) { /* 在此断点以下显示2个卡片 */
  .card-item {
    flex: 0 1 calc(50% - 7.5px); /* 2个卡片 */
  }
}

@media (max-width: 768px) { /* 在此断点以下显示1个卡片 */
    .content-wrapper {
        max-width: none; /* 在此断点下取消最大宽度限制 */
        padding: 15px; /* 调整内边距 */
    }
  .card-item {
    flex: 0 1 100%; /* 1个卡片 */
  }
}

@media (max-width: 480px) {
   h1 {
       font-size: 20px;
   }

    .add-button {
        width: 35px;
        height: 35px;
        font-size: 20px;
    }

    .modal-content {
        padding: 20px;
    }

    .form-group input[type="text"],
    .form-group input[type="url"],
    .form-group input[type="password"] {
        padding: 8px;
        font-size: 14px;
    }

    .modal-actions button {
        padding: 8px 15px;
        font-size: 14px;
    }


    .search-bar {
        padding: 10px 15px;
        font-size: 14px;
        width: 95%;
        border-radius: 20px;
    }

    .search-bar:focus {
        width: 100%;
    }

    .card-item {
        flex-direction: column;
        align-items: flex-start;
        gap: 10px;
        padding: 15px;
        border-radius: 10px;
         box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
         min-width: 0;
         max-width: none;
    }

     .card-item:hover {
         transform: translateY(-5px);
         box-shadow: 0 8px 15px rgba(0, 0, 0, 0.15);
     }

    .site-info-wrapper {
        gap: 10px;
    }

    .site-icon {
        width: 40px;
        height: 40px;
         border-radius: 10px;
         box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    }

     .card-item:hover .site-icon {
         transform: scale(1.1) rotate(3deg);
         box-shadow: 0 4px 8px rgba(0,0,0,0.2);
     }

     .site-icon::after {
         top: -2px;
         left: -2px;
         right: -2px;
         bottom: -2px;
         border-radius: 12px;
     }

     @keyframes iconRadialGlow {
        0% { background-position: 0% 0%; }
        100% { background-position: 100% 100%; }
    }

     .default-icon {
         font-size: 20px;
         border-radius: 10px;
     }

    .site-title {
        font-size: 1em;
        text-align: center;
        width: 100%;
        white-space: normal;
        overflow: visible;
        text-overflow: clip;
    }

    .site-env-links {
        justify-content: space-between; /* Changed justification */
        width: 100%;
        gap: 6px;
         flex-wrap: wrap; /* Allow wrapping on very small screens if necessary */
    }

    .site-env-links button {
        padding: 4px 6px; /* Adjusted padding */
        font-size: 0.7em; /* Adjusted font size */
         border-radius: 3px;
         flex-grow: 1; /* Allow growing */
         min-width: 0; /* Allow shrinking */
    }

    .site-env-links button:hover {
        transform: translateY(-1px);
         box-shadow: 0 1px 4px rgba(0,0,0,0.1);
    }

}

.theme-buttons {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 10px;
  align-items: center;
}
.theme-img-btn {
  width: 38px;
  height: 38px;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 1px 4px rgba(0,0,0,0.15);
  outline: 2px solid #fff;
  transition: transform 0.2s;
  padding: 0;
  overflow: hidden;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
}
.theme-img-btn img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
  display: block;
}
.theme-img-btn:hover {
  transform: scale(1.15);
}
.theme-none-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  font-size: 16px;
  color: #888;
  background: #f5f5f5;
  border-radius: 50%;
  font-weight: bold;
}
</style>
