/**
 * SMS
 * @param {*} $
 */
!function($) {
    "use strict";

    var SMS = function() {
    };

    // Show action
    SMS.prototype.sendOTP = function(user_customer_id) {
        $.ajax({
            type: 'POST',
            url: $.App.urlAdmin('admin/sms/send-otp'),
            data: {'csrfmiddlewaretoken': csrftoken, 'user_customer_id': user_customer_id},
            beforeSend: function() {
                $.App.loader();
            },
            success: function(res) {
                $.NotificationApp.send(res.success ? 'success': 'error', res.message, {stack: 1});
                $.App.loader('hide');
                if (res.success) {
                    $('#item_'+user_customer_id+' td.otp').text(res.data);
                }
            },
            error: function () {
                $.App.loader('hide');
            }
        });
    },

    $.SMS = new SMS, $.SMS.Constructor = SMS
}(window.jQuery)