import { get, post, put } from "../utils/request";
import url from "../utils/url"; ///导入网络请求对应的utils模块的url文件
/// 导出方法的默认接口，其他模块直接调用getPostList()、getPostById()等四个方法
export default {
  /// 箭头函数实现接口方法与url的一个映射
  getPostList: () => get(url.getPostList()),
  getPostById: id => get(url.getPostById(id)),
  createPost: data => post(url.createPost(), data),
  updatePost: (id, data) => put(url.updatePost(id), data)
};
