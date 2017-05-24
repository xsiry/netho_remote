define(function(require, exports, module) {
  $.root_ = $('body');
  module.exports = {
    init: function() {
      this._bindUI();
      this._buildMenu();
      this._main();
    },
    _main: function() {
      relogin();
    },
    _bindUI: function() {
      $.root_.off('click', '.remote_bbtn').on('click', '.remote_bbtn', function(e) {
        var name = 'remote';
        $('.netbar_list_btn').show();
        activeBtn(name);
      })
      $.root_.off('click', '.account_bbtn').on("click", '.account_bbtn', function(e) {
        var name = 'account';
        $('.netbar_list_btn').hide();
        activeBtn(name);
      })
      $.root_.off('click', '.netbar_choose').on("click", '.netbar_choose', function(e) {
        $('.remote_bbtn').click();
        $('.netbar_list_mask').hide();
      })
      $.root_.off('click', '.open_netbar_list').on("click", '.open_netbar_list', function(e) {
          $('.netbar_list_mask').show();
      })
      $.root_.off('click', '.account_mnt').on('click', '.account_mnt', function(e) {
        loadURL('../apps/accountMnt.html');
      })
      $.root_.off('click', '.feedback').on('click', '.feedback', function(e) {
        loadURL('../apps/feedback.html');
      })
    },
    _buildMenu: function() {
      buildMenu();
      buildNetbarList();
    }
  };

  function buildNetbarList() {
    var html = "";
    html += '<div class="form-group has-feedback search_block">'
         + '<input type="text" class="form-control input_search" placeholder="搜索">'
         + '<span class="glyphicon glyphicon-search form-control-feedback icon" aria-hidden="true"></span>'
         + '</div><ul>';

    for (var i = 0; i < 20; i++) {
      html += '<li><a href="javascript:void(0)" class="netbar_choose"><i>'
           + '<svg class="svg_icon" viewBox="0 0 1024 1024">'
           + '<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#remote_svg"></use>'
           + '</svg></i><span>远程网吧' + i + '号</span>'
           + '<i class="pull-right"><svg class="svg_icon" viewBox="0 0 1024 1024">'
           + '<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#right_svg"></use></svg></i></a></li>';
    }

    html += '</ul>';

    $('div.netbar_list').append(html);
  }

  function buildMenu() {
    var menus = [{
      classT: 'bbtn remote_bbtn',
      text: '远程维护'
    }, {
      classT: 'bbtn account_bbtn',
      text: '我的账号',
    }]

    var html = '';
    for (var i in menus) {
      var m = menus[i];
      html += '<a href="javascript:void(0);">';
      html += '<div class="' + m.classT + '">' + m.text + '</div></a>';
    }

    $('div.menus').append(html);
  }

  function activeBtn(name) {
    $('div.bbtn').css('color', '#43b2e7').css('background-color', 'inherit');
    loadURL('../apps/' + name + '.html');
    $('div.' + name + '_bbtn').css('color', '#FFF').css('background-color', '#43b2e7');
  }

  function loadURL(a) {
    var b = $('div.content');
    $.ajax({
      "type": "GET",
      "url": a,
      "dataType": "html",
      "cache": !0,
      "beforeSend": function() {
        b.removeData().html(""),
          b.html('<div class="dropload-load"><span class="loading"></span>加载中...</div>'),
          b[0] == $("#content")[0] && ($("body").find("> *").filter(":not(" + ignore_key_elms + ")").empty().remove(),
            drawBreadCrumb(),
            $("html").animate({
              "scrollTop": 0
            }, "fast"))
      },
      "success": function(a) {
        b.css({
            "opacity": "0.0"
          }).html(a).delay(50).animate({
            "opacity": "1.0"
          }, 300),
          a = null,
          b = null
      },
      "error": function(c, d, e) {
        b.html('<h4 class="ajax-loading-error"><i class="fa fa-warning txt-color-orangeDark"></i> Error requesting <span class="txt-color-red">' + a + "</span>: " + c.status + ' <span style="text-transform: capitalize;">' + e + "</span></h4>")
      },
      "async": !0
    })
  }

  function loginOut() {
    $.ajax({
      type: 'GET',
      contentType: 'application/json',
      url: '/wxroot/loginOut.do',
      dataType: 'json',
      success: function(data) {
        if (data) {
          location.href = "/wxroot/login.html";
        }
      },
      error: function(e) {}
    });
  }

  function relogin() {
    $(document).ajaxComplete(function(event, xhr, settings) {
      if (xhr.getResponseHeader("sessionstatus") == 'timeout') {
        $('.noping_msg').show();
      }
    })
  }
})
