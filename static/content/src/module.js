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
        var rowobj = $(this);
        var netbarid = rowobj.data("netbarid");
        _netbarid = netbarid;
        $('.remote_bbtn').click();
        $('.netbar_list_mask').hide();
        e.preventDefault();
        rowobj = null;
      })
      $.root_.off('input propertychange', '.input_search').on("input propertychange", '.input_search', function(e) {
          buildNetbarList(true);
          $('div.netbar_list ul').empty();
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

      /* 远程桌面 */
      // 菜单
      $.root_.off('click', '.menus_switch').on('click', '.menus_switch', function(e) {
        var rowobj = $(this);
        if ($('.remote_desktop_menus').is('.x_hide')) {
          $('.remote_desktop_menus').removeClass('x_hide').addClass('x_show').find('.menus_switch').text('close');
        }else {
          $('.remote_desktop_menus').removeClass('x_show').addClass('x_hide').find('.menus_switch').text('open');
        }
        e.preventDefault();
        rowobj = null;
      })
      // 鼠标模式
      $.root_.off('change', 'input:radio[name="touchedMode"]').on('change', 'input:radio[name="touchedMode"]', function(e) {
        var rowobj = $(this);
        $('#remote_desktop').contents().find('#' + rowobj.val()).trigger('click');
        e.preventDefault();
        rowobj = null;
      })
      // 键盘模式
      $.root_.off('change', 'input:radio[name="imeMode"]').on('change', 'input:radio[name="imeMode"]', function(e) {
        var rowobj = $(this);
        $('#remote_desktop').contents().find('#' + rowobj.val()).trigger('click');
        e.preventDefault();
        rowobj = null;
      })
      // 自适应窗口
      $.root_.off('change', 'input:checkbox[name="fitMode"]').on('change', 'input:checkbox[name="fitMode"]', function(e) {
        var rowobj = $(this);
        $('#remote_desktop').contents().find('#' + rowobj.val()).trigger('click');
        e.preventDefault();
        rowobj = null;
      })
      // 缩小
      $.root_.off('click', '.x_zoom_out').on('click', '.x_zoom_out', function(e) {
        var rowobj = $(this);
        $('#remote_desktop').contents().find('#zoom-out').trigger('click');
        e.preventDefault();
        rowobj = null;
      })
      // 放大
      $.root_.off('click', '.x_zoom_in').on('click', '.x_zoom_in', function(e) {
        var rowobj = $(this);
        $('#remote_desktop').contents().find('#zoom-in').trigger('click');
        e.preventDefault();
        rowobj = null;
      })
      // 退出远程
      $.root_.off('click', '.x_login_out').on('click', '.x_login_out', function(e) {
        var rowobj = $(this);
        $('.remote_desktop_block').hide();
        $('#remote_desktop').contents().find('.ng-binding.logout').trigger('click');
        setTimeout("$('#remote_desktop').contents().find('.ng-binding.ng-scope.logout.button').trigger('click')", 500);
        setTimeout("$('iframe.remote_desktop').attr('src', '');", 1000);
        e.preventDefault();
        rowobj = null;
      })
    },
    _buildMenu: function() {
      buildMenu();
      buildNetbarList();
    }
  };

  function buildNetbarList(searchBool) {
    var qhstrParams = { qjson: [{}]};
    if (searchBool) {
      var netbarname = $('.input_search').val();
      qhstrParams = {"qjson":[{},{"netbarname": netbarname}],"qjsonkeytype":[{"netbarname":"LIKE_ALL"}]}
    }
    $.ajax({
      type: 'POST',
      url: _addr + 'ywh_queryTableList/?',
      data: {
        source: 'netbar_info',
        qtype: 'select@online',
        qhstr: JSON.stringify(qhstrParams),
        sortname: 'netbarname',
        sortorder: 'ASC'
      },
      dataType: 'json',
      success: function(msg) {
        if (!searchBool) {
          var html = "";
          html += '<div class="form-group has-feedback search_block">'
               + '<input type="text" class="form-control input_search" placeholder="搜索">'
               + '<span class="glyphicon glyphicon-search form-control-feedback icon" aria-hidden="true"></span>'
               + '</div><ul></ul>';

          $('div.netbar_list').append(html);
        }

        if (msg) {
          var list = ''
          for (var i = 0; i < msg.length; i++) {
            list += '<li><a href="javascript:void(0)" class="netbar_choose" data-netbarid=' + msg[i].netbarid + '><i>'
                 + '<svg class="svg_icon" viewBox="0 0 1024 1024">'
                 + '<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#remote_svg"></use>'
                 + '</svg></i><span>' + msg[i].netbarname + '</span>'
                 + '<i class="pull-right"><svg class="svg_icon" viewBox="0 0 1024 1024">'
                 + '<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#right_svg"></use></svg></i></a></li>';
          }
          $('div.netbar_list ul').append(list);
        }

      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {
        console.log("请求对象XMLHttpRequest: " + XMLHttpRequest.responseText.substring(0, 50) + " ,错误类型textStatus: " + textStatus + ",异常对象errorThrown: " + errorThrown.substring(0, 50));
      }
    });
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
