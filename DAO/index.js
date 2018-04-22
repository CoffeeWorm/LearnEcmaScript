var BaseLocalStorage = function(preId, timeSign) {
  //定义本地存储数据库前缀
  this.preId = preId;
  //定义时间戳与数据存储之间的拼接符
  this.timeSign = timeSign || '|-|';
}
//本地存储类原型方法
BaseLocalStorage.prototype = {
  //重新指定constructor指针
  constructor: BaseLocalStorage,
  //定义操作状态
  status: {
    SUCCESS: 0, //成功
    FAILURE: 1, //失败
    OVERFLOW: 2, //溢出
    TIMEOUT: 3 //过期
  },
  // 保存本地存储连接
  storage: localStorage || window.localStorage,
  //获取本地存储数据库真实字段
  getKey: function(key) {
    return this.preId + key;
  },
  //添加（修改）数据
  set: function(key, value, time) {
    //默认操作状态是成功
    var status = this.status.SUCCESS,
      //获取真实字段
      key = this.getKey(key);
    try {
      //参数时间参数时获取时间戳
      time = new Date(time).getTime() || time.getTime();
    } catch (e) {
      //传入时间参数或者时间参数有误获取默认时间：一个月
      time = new Date().getTime() + 1000 * 60 * 60 * 24 * 31;
    }
    try {
      //向数据库中添加数据
      this.storage.setItem(key, time + this.timeSign + value);
    } catch (e) {
      //溢出失败，返回溢出状态
      status = this.status.OVERFLOW;
    }
    //有回调函数则执行回调函数并传入参数操作状态，真实数据字段标识以及存储数据值
    // callback();
  },
  //获取数据
  get: function(key) {
    //默认操作状态是成功
    var status = this.status.SUCCESS,
      //获取真实字段
      key = this.getKey(key),
      //默认值为空
      value = null,
      //时间戳与存储数据之间的斌接符长度
      timeSignLen = this.timeSign.length,
      //缓存当前对象
      that = this,
      //时间戳与存储数据之间的拼接符起始位置
      index,
      //时间戳
      time,
      //最终获取的数据
      result;
    try {
      //获取字段对应的数据字符串
      value = that.storage.getItem(key)
    } catch (e) {
      result = {
        //获取失败时 返回失败状态，数据结果为null
        status: that.storage.FAILURE,
        value: null
      };
      // 执行回调并返回
      callback();
      return result;
    }

    if (value) {
      //获取时间戳与存储数据之的拼接符起始位置
      index = value.indexOf(that.timeSign);
      //获取时间戳
      time = +value.slice(0, index);
      //如果事件为过期
      if (new Date(time).getTime() > new Date().getTime() || time == 0) {
        //获取数据结果(拼接符后面的字符串)
        value = value.slice(index + timeSignLen);
      } else {
        //过期则结果为null
        value = null;
        //设置状态为过期状态
        stauts = that.stauts.TIMEOUT;
        //删除该字段
        that.remove(key);
      }
    } else {
      //未获取数据字符串状态为失败状态
      status = that.status.FAILURE;
    }
    //设置结果
    result = {
      status: status,
      value: value
    }
    //执行回调
    // callback();
    //返回结果
    return result;

  },
  //删除数据
  remove: function(key) {
    //设置默认操作状态为失败
    var status = this.status.FAILURE,
      //获取实际数据字段名字
      key = this.getKey(key),
      //设置默认数据结果为空
      value = null;
    try {
      //获取字段对应的数据
      value = this.storage.getItem(key);
    } catch (e) {}
    //如果数据存在
    if (value) {
      try {
        //删除数据
        this.storage.removeItem(key);
        //设置操作成功
        stauts = this.stauts.SUCCESS;
      } catch (e) {}
    }
    //执行回调
    // callback();
  }
}