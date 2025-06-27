import axios from "axios";

// 创建axios实例
const api = axios.create({
  baseURL: "/api", // 统一使用相对路径，由服务器配置来处理代理
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

// 获取标签列表
export const getLabelList = async () => {
  try {
    const response = await api.get("/lable/getList");
    return response.data;
  } catch (error) {
    console.error("获取标签列表失败:", error);
    throw error;
  }
};

// 获取所有分类和网址
export const getAllCategories = async () => {
  try {
    const response = await api.get("/categories");
    return response.data;
  } catch (error) {
    console.error("获取分类失败:", error);
    throw error;
  }
};

// 获取单个分类的网址
export const getCategoryLinks = async (categoryId) => {
  try {
    const response = await api.get(`/categories/${categoryId}/links`);
    return response.data;
  } catch (error) {
    console.error("获取分类网址失败:", error);
    throw error;
  }
};

// 添加新分类
export const addCategory = async (categoryData) => {
  try {
    const response = await api.post("/categories", categoryData);
    return response.data;
  } catch (error) {
    console.error("添加分类失败:", error);
    throw error;
  }
};

// 添加新网址
export const addLink = async (categoryId, linkData) => {
  try {
    const response = await api.post(
      `/categories/${categoryId}/links`,
      linkData
    );
    return response.data;
  } catch (error) {
    console.error("添加网址失败:", error);
    throw error;
  }
};

// 更新分类
export const updateCategory = async (categoryId, categoryData) => {
  try {
    const response = await api.put(`/categories/${categoryId}`, categoryData);
    return response.data;
  } catch (error) {
    console.error("更新分类失败:", error);
    throw error;
  }
};

// 更新网址
export const updateLink = async (categoryId, linkId, linkData) => {
  try {
    const response = await api.put(
      `/categories/${categoryId}/links/${linkId}`,
      linkData
    );
    return response.data;
  } catch (error) {
    console.error("更新网址失败:", error);
    throw error;
  }
};

// 删除分类
export const deleteCategory = async (categoryId) => {
  try {
    const response = await api.delete(`/categories/${categoryId}`);
    return response.data;
  } catch (error) {
    console.error("删除分类失败:", error);
    throw error;
  }
};

// 删除网址
export const deleteLink = async (categoryId, linkId) => {
  try {
    const response = await api.delete(
      `/categories/${categoryId}/links/${linkId}`
    );
    return response.data;
  } catch (error) {
    console.error("删除网址失败:", error);
    throw error;
  }
};

// 搜索网址
export const searchLinks = async (keyword) => {
  try {
    const response = await api.get("/search", {
      params: { keyword },
    });
    return response.data;
  } catch (error) {
    console.error("搜索网址失败:", error);
    throw error;
  }
};

// 删除标签
export const deleteLabel = async (labels_id) => {
  try {
    const response = await api.delete("/lable/delete", {
      params: { labels_id },
    });
    return response.data;
  } catch (error) {
    console.error("删除标签失败:", error);
    throw error;
  }
};

// 保存标签
export const saveLabel = async (labelData) => {
  try {
    const response = await api.post("/lable/save", labelData);
    return response.data;
  } catch (error) {
    console.error("保存标签失败:", error);
    throw error;
  }
};

// 编辑标签
export const updateLabel = async (labelData) => {
  try {
    const response = await api.post("/lable/update", labelData);
    return response.data;
  } catch (error) {
    console.error("编辑标签失败:", error);
    throw error;
  }
};
