import { observable, action } from "mobx";

/**
 * PostModel类中的可观测属性与数据库表中的字段对应，认为是一个中间类
 */
class PostModel {
  // store与id为不可观测属性， MobX中不可观测属性是指对MobX数据流不会产生影响
  store;
  id;
  @observable title;
  @observable content;
  @observable vote;
  @observable author;
  @observable createdAt;
  @observable updatedAt;
  /// 构造器
  constructor(store, id, title, content, vote, author, createdAt, updatedAt) {
    this.store = store;
    this.id = id;
    this.title = title;
    this.content = content;
    this.vote = vote;
    this.author = author;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
  
  // 根据JSON对象更新帖子
  @action updateFromJS(json) {
    this.title = json.title;
    this.content = json.content;
    this.vote = json.vote;
    this.author = json.author;
    this.createdAt = json.createdAt;
    this.updatedAt = json.updatedAt;
  }

  // 静态方法，创建新的PostModel实例
  static fromJS(store, object) {
    return new PostModel(
      store,
      object.id,
      object.title,
      object.content,
      object.vote,
      object.author,
      object.createdAt,
      object.updatedAt
    );
  }

}

export default PostModel;
