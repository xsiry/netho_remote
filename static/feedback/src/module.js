define(function(require, exports, module) {
  $.root_ = $('.feedback_main');
  module.exports = {
    init: function() {
      this._bindUI();
    },
    _bindUI: function() {
      $.root_.off('change', '.upload_files').on('change', '.upload_files', function() {
        imgChange();
      })
    },
  };

  function imgChange() {
    //获取点击的文本框
    var file = $(".upload_files");
    //存放图片的父级元素
    var fileList = file.get(0).files;
    //遍历获取到得图片文件
    for (var i = 0; i < fileList.length; i++) {
      var img_length = $('.z_photo').children('img').length;
      var imgUrl = window.URL.createObjectURL(fileList[i]);
      var imgObj = $('<div class="z_addImg"><img src=' + imgUrl + '></img></div>');
      if ( img_length <= 5) {
        img_length >= 5 ? $('.z_file').hide() : $('.z_file').show();
        $('.z_photo').prepend(imgObj);
      }
    };
  };

})
