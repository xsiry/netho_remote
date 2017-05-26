define(function(require, exports, module) {
  $.root_ = $('.account_main');
  module.exports = {
    init: function() {
      this._bindUI();
      this._main();
    },
    _main: function() {
      loadAdminConfig();
    },
    _bindUI: function() {
      $.root_.off('click', '.service_tel').on('click', '.service_tel', function(e) {

      })
    }
  };

  function loadAdminConfig() {
    $.ajax({
      type: 'GET',
      url: '/ywhsrcweb/' + 'ywh_queryTableList/?',
      data: {
        source: 'sys_user',
        qtype: 'online'
      },
      dataType: 'json',
      success: function(msg) {
        $('div.admin_info .admin_name').text(msg.username);
        _admin_id = msg.sysusid;
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {
        console.log("请求对象XMLHttpRequest: " + XMLHttpRequest.responseText.substring(0, 50) + " ,错误类型textStatus: " + textStatus + ",异常对象errorThrown: " + errorThrown.substring(0, 50));
      }
    });
  }
})