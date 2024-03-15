var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');

Page({
  data: {
    navList: [],
    currentCategory: {},
    currentCategoryId: 0,
    currentCategoryName: '',

    banner: [],
    channel: [],
    indexGoods: [],
    page: 1,
    size: 10,
  },

  getIndexData: function () {
    let that = this;
    util.request(api.IndexUrl).then(function (res) {
      console.log(res.data)
      console.log("111111111111111111")
      if (res.errno === 0) {
        that.setData({
          indexGoods: res.data.indexGoodsList,
          banner: res.data.banner,
          channel: res.data.channel
        });
      }
    });
  },

  getIndexMore: function () {
    let that = this;
    util.request(api.IndexMore, {
      page: this.data.page,
      size: this.data.size
    }).then(function (res) {
      console.log(res.data)
      if (res.errno === 0) {
        that.setData({
          indexGoods: that.data.indexGoods.concat(res.data),
        });
      }
    });
  },

  onLoad: function (options) {
    this.getCatalog();
    this.getIndexData();
  },

  getCatalog: function () {
    let that = this;
    wx.showLoading({
      title: '加载中...',
    });
    util.request(api.CatalogList).then(function (res) {
      that.setData({
        navList: res.data.allCategory,
        currentCategory: res.data.subCategory,
        currentCategoryId: res.data.allCategory[0].id,
        currentCategoryName: res.data.allCategory[0].name
      });
      wx.hideLoading();
    });

  },
  getCurrentCategory: function (id, name) {
    let that = this;
    this.setData({
      currentCategoryId: id,
      currentCategoryName: name
    })
    util.request(api.CatalogCurrent + "/" + id)
      .then(function (res) {
        that.setData({
          currentCategory: res.data,
        });
      });
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },

  onPullDownRefresh: function () {
    console.log("上拉刷新")
    this.onLoad()
    setTimeout(function callback() {
      wx.stopPullDownRefresh()
    }, 500)
  },

  onReachBottom: function () {
    console.log("拉到底")
    this.setData({
      page: this.data.page + 1
    })
    this.getIndexMore()
  },

  switchCate: function (event) {
    var that = this;
    var currentTarget = event.currentTarget;
    if (this.data.currentCategory.id == event.currentTarget.dataset.id) {
      return false;
    }
    this.getCurrentCategory(event.currentTarget.dataset.id, event.currentTarget.dataset.name);
  }
})