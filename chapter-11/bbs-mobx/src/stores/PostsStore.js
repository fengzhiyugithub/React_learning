import { observable, action, toJS } from "mobx";
import PostModel from "../models/PostModel";//导入需要的PostModel类

class PostsStore {
  api;
  appStore;
  authStore;
  @observable posts = [];  // 数组的元素是PostModel的实例，存储帖子
    ///此构造器在index.js实例化时使用；后面可以使用api、appStore、authStore的属性和方法
  constructor(api, appStore, authStore) {
    this.api = api;
    this.appStore = appStore;
    this.authStore = authStore;
  }

  // 根据帖子id，获取当前store中的帖子
  getPost(id) {
    return this.posts.find(item => item.id === id);
  }

  // 从服务器获取帖子列表
  @action fetchPostList() {
    this.appStore.increaseRequest();///requestQuantity+1，当前进行的请求数量+1
      /**
       * .then()是异步处理，先执行this.api.getPostList()获取帖子列表，然后执行then()
       */
    return this.api.getPostList().then(
      action(data => {
        this.appStore.decreaseRequest();///requestQuantity-1，当前进行的请求数量-1
        if (!data.error) {///如果获取的data没有出错
          this.posts.clear();///清空帖子列表
            /**
             * 先执行箭头函数部分，将post作为参数传入PostModel.fromJS()
             * 再调用PostModel.fromJS(this, post)创建PostModel实例，
             * 然后执行this.posts.push()添加到帖子列表中
             * data.forEach()是对data的所有帖子进行一个遍历
             */
          data.forEach(post => this.posts.push(PostModel.fromJS(this, post)));
            /**
             * 创建一个Promise对象并返回a resolved promise，data没出错时调用
             */
          return Promise.resolve();
        } else {//数据出错
          this.appStore.setError(data.error);//数据出错,调用appStore设置错误信息
            /**
             * 创建一个Promise对象,返回a rejected promise，出错时调用这个方法
             */
          return Promise.reject();//这里是请求数据出错的一个表示
        }
      })
    );
  }

  // 从服务器获取帖子详情
  @action fetchPostDetail(id) {
    this.appStore.increaseRequest();
    return this.api.getPostById(id).then(
      action(data => {
        this.appStore.decreaseRequest();
        if (!data.error && data.length === 1) {///数据没有出错且数据长度为1（因为id是唯一的）
          const post = this.getPost(id);
          // 如果store中当前post已存在，更新post；否则，添加post到store
          if (post) {
            post.updateFromJS(data[0]);
          } else {
            this.posts.push(PostModel.fromJS(this, data[0]));
          }
          return Promise.resolve();
        } else {
          this.appStore.setError(data.error);
          return Promise.reject();
        }
      })
    );
  }
  
  // 新建帖子
  @action createPost(post) {
      //新建帖子，使用扩展运算符...添加到post
    const content = { ...post, author: this.authStore.userId, vote: 0 };
    this.appStore.increaseRequest();
    return this.api.createPost(content).then(
      action(data => {
        this.appStore.decreaseRequest();
        if (!data.error) {
          this.posts.unshift(PostModel.fromJS(this, data));
          return Promise.resolve();
        } else {
          this.appStore.setError(data.error);
          return Promise.reject();
        }
      })
    );
  }

  // 更新帖子
  @action updatePost(id, post) {
    this.appStore.increaseRequest();
    return this.api.updatePost(id, post).then(
      action(data => {
        this.appStore.decreaseRequest();
        if (!data.error) {
          const oldPost = this.getPost(id);
          if (oldPost) {
            /* 更新帖子的API，返回数据中的author只包含authorId，
               因此需要从原来的post对象中获取完整的author数据。
               toJS是MobX提供的函数，用于把可观测对象转换成普通的JS对象。 */
              /**
               * toJS()是MobX提供的，这里将可观测对象转换为toJS()对象是将可观测对象转化为json格式便于
               * 调用updateFromJS(data)作为参数传入
               * 在MobX2.2前的命名为toJSON()
               */
            data.author = toJS(oldPost.author);

            oldPost.updateFromJS(data);
          } 
          return Promise.resolve();
        } else {
          this.appStore.setError(data.error);
          return Promise.reject();
        }
      })
    );
  }
}

export default PostsStore;
