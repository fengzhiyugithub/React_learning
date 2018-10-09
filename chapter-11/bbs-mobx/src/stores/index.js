/**
 * 此JS文件将stores中的所有store整合到一个stores并创建一个实例对象(只能有唯一一个实例对象)
 * import *Store from "./*Store"; 导入新建对象所在的文件
 * import *Api from "./api/Api"; 导入api模块下的api文件
 */
import AppStore from "./AppStore";
import AuthStore from "./AuthStore";
import PostsStore from "./PostsStore";
import CommentsStore from "./CommentsStore";
import UIStore from "./UIStore";
import authApi from "../api/authApi";
import postApi from "../api/postApi";
import commentApi from "../api/commentApi";

/// 创建实例对象，将*Api和*Store作为参数传入构造器使对应的store能使用它的属性和方法
const appStore = new AppStore();
const authStore = new AuthStore(authApi, appStore);
const postsStore = new PostsStore(postApi, appStore, authStore);
const commentsStore = new CommentsStore(commentApi, appStore, authStore);
const uiStore = new UIStore();

///整合到一个stores对象中方便根目录下的Provider的引入
const stores = {
  appStore,
  authStore,
  postsStore,
  commentsStore,
  uiStore
};
/// 默认导出接口
export default stores;