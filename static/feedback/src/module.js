define(function(require, exports, module) {
  $.root_ = $('.feedback_main');
  var _uploadIndex = 0;
  var _files = [];

  module.exports = {
    init: function() {
      this._bindUI();
    },
    _bindUI: function() {
      $.root_.off('change', '.upload_files').on('change', '.upload_files', function(e) {
        var rowobj = $(this);
        imgChange(rowobj);
        e.preventDefault();
        rowobj = null;
      })
      $.root_.off('click', '.close_svg_btn').on('click', '.close_svg_btn', function(e) {
        var rowobj = $(this);
        deleteCanvas(rowobj);
        e.preventDefault();
        rowobj = null;
      })
      $.root_.off('click', '.btn_submit').on('click', '.btn_submit', function(e) {
        var rowobj = $(this);
        submitFeedBack();
        e.preventDefault();
        rowobj = null;
      })
    },
  };

  function imgChange(rowobj) {
    $.each(rowobj.get(0).files, function(index, file) {
      var reader = new FileReader();
      reader.onload = function(event) {
        object = {};
        object.filename = file.name;
        object.data = event.target.result;
        createCanvas(object);
      };
      reader.readAsDataURL(file);
    });
  }

  function createCanvas(o) {
    var length = $('.z_photo').children('.x_canvas').length;
    if (length == 5) {
      $('.x_add_div').hide();
      return;
    };
    _uploadIndex += 1;
    var html = '<div class="x_canvas">'
             + '<a href="javascript:void(0);" data-filename="'+ o.filename +'" class="close_svg_btn"><i><svg class="svg_icon x_add_close_svg" viewBox="0 0 1024 1024">'
             + '<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#close_svg"></use></svg></i></a>'
             + '<canvas class="canvas_index_' + _uploadIndex + '" width="110" height="110" style="display:block;border-radius: 0.5rem;"></canvas>'
             + '</div>';
    var x_canvas = $(html);
    $('.z_photo').prepend(x_canvas);

    var canvas = $('.canvas_index_' + _uploadIndex).get(0);
    var cxt = canvas.getContext('2d');
    var img = new Image();
    img.src = o.data;
    img.onload = function() {
      cxt.drawImage(img, 0, 0, 110, 110);
      var imgData = canvas.toDataURL("image/jpeg", 0.9);
      var imgBase64 = imgData.split(',')[1];
      _files.push({filename: o.filename, data: imgBase64});
    }
  }

  function deleteCanvas(rowobj) {
    var files = [];
    var filename = rowobj.data("filename");
    rowobj.parent().remove();
    $('.x_add_div').show();
    $.each(_files, function(i, o) {
      if (o.filename != filename) {
        files.push(o);
      }
    })
    _files = files;
  }

  function submitFeedBack() {
    var msg = $('pre.flex').text();
    var uploadImg = _files;

    if (!msg && !uploadImg) return;

    $.ajax({
      type: 'POST',
      url: _addr + 'feedbackSubmit/?',
      data: {
        'msg' : msg,
        'imgs': JSON.stringify(uploadImg)
      },
      dataType: 'json',
      success: function(msg) {
        console.log("success");
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {
        console.log("请求对象XMLHttpRequest: " + XMLHttpRequest.responseText.substring(0, 50) + " ,错误类型textStatus: " + textStatus + ",异常对象errorThrown: " + errorThrown.substring(0, 50));
      }
    });
  }
})
