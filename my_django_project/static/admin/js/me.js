/**
 * Author: NamNV
 * Desciption: Thực hiện submit form
 * 
 * @params: Mảng các tham số được truyền vào
 * @options: Mảng các tùy chọn hoặc phân vùng làm việc
 */
function submitForm(url) {
	if(url != ""){
		$(formAdmin).attr('action', url);
	}
	$(formAdmin).submit();
}

/**
 * Author: NamNV
 * Desciption: Sự kiện nhấn enter ở ô input
 */
function keywordEnter() {
	$(formAdmin + ' input[name="filter_keyword"]').keypress(function (event) {
		if(event.charCode == 13) {
			event.preventDefault();
			$(formAdmin).submit();
		}
	});
}

/**
 * Author: NamNV
 * Desciption: Thực hiện sắp xếp danh sách
 * 
 * @orderColumn: Cột sẽ sắp xếp
 * @orderBy: Chiều sắp xếp
 */
function sortList(orderColumn, orderBy) {
	
	$(formAdmin + ' input[name="order_by"]').val(orderColumn);
	$(formAdmin + ' input[name="order"]').val(orderBy);
	
	$(formAdmin).submit();
}

/**
 * Author: NamNV
 * Desciption: Lấy thông tin khách hàng qua số đt
 * 
 * @phone: Số điện thoại cần check
 * @type: Phân loại xử lý
 */
async function checkContactExists(phone, option) {
	let list_level_sale_changeable = []
	await $.ajax({
		url: moduleAdmin + '/api/get-config',
		type: 'post',
		data: { code: 'sale.contact_level_sale_changeable' },
		success: function (res) {
			res = $.parseJSON(res);
			if(res.type == 'success'){
				list_level_sale_changeable = $.parseJSON(res.data.value)
			}
		}
	});
	let is_exists = false;
	if(phone) {
		if($('#adminFormModal').length) {
			formAdmin = '#adminFormModal';
		} else if($('#adminForm').length) {
			formAdmin = '#adminForm';
		}
		var ajaxUrl = moduleAdmin + '/api/get-contact';
		await $.ajax({
			url: ajaxUrl,
			type: 'POST',
			data: {
				phone: phone,
			},
			beforeSend: function() {
				pageLoading('loading', '.page-container');
			},
			success: function(result) {
				$('#result_check_contact').html('');
				$('.form-control').removeAttr('disabled');
				if(result != 'not-found') {
					result = $.parseJSON(result);
					if(result['store'] != '' && result['store'] != null && result['store'] != undefined) {
						var html = '<div class="alert alert-block alert-info" style="margin-bottom: 15px;">' + 
										'<p><b>Data kho. Bạn sẽ là người quản lý</b></p>' +
										'<p>Nhấn vào <a href="'+ moduleAdmin +'/contact/store/id/'+ result['id'] +'" class="btn btn-xs red">Nhập lại kho</a> nếu như bạn muốn quản lý lại liên hệ này</p>' +
									'</div>';
						$('#result_check_contact').html(html);
						$('.form-control').attr('disabled', 'disabled');
						$('input[name="phone"]').removeAttr('disabled');
					} else {
						var time_from_share_day = dateDiff(new Date(result['check_share_day']), new Date(), 'hours');
						var html = '';
						if(time_from_share_day > 48 && list_level_sale_changeable.includes(result.level_data)){
							html = '<div class="alert alert-block alert-info" style="margin-bottom: 15px;">' +
								'<p>Data này đang quản lý bởi '+ result['user_name'] + '</p>' +
								'<p><b>Bạn sẽ là người quản lý sau khi thêm data</b></p>' +
								'</div>'
							let userInfo = formAdmin ? $(formAdmin).data('user') : {};
							if(userInfo.id){
								$('[name="user_id"]').val(userInfo.id)
							}
							$('[name="id"]').val(result.id)
							loadDataToElement(result, 'exists');
						}else{
							html = '<div class="alert alert-block alert-danger" style="margin-bottom: 15px;">' +
								'<p><b>Data này đã có người quản lý</b></p>' +
								'<p>Người quản lý: '+ result['user_name'] +'</p>' +
								'</div>'
							$('.form-control').attr('disabled', 'disabled');
						}
						$('#result_check_contact').html(html);
						$('input[name="phone"]').removeAttr('disabled');
					}
					is_exists = true;
				} else {
					console.log('Không tìm thấy liên hệ');
				}
				
				pageLoading('close', '.page-container');
			},
			error: function (request, status, error) {
				xToastr('error', 'Lỗi không thể kiểm tra được khách hàng', '');
			}
		});
	} else {
		$('#result_check_contact').html('');
	}
	return is_exists;
}

/**
 * Author: NamNV
 * Desciption: Lấy thông tin khách hàng qua số điện thoại để làm hợp đồng
 * 
 * @phone: Số điện thoại cần check
 */
function checkContactToElement(phone, option) {
	if(phone) {
		var ajaxUrl = moduleAdmin + '/api/get-contact';
		
		$.ajax({
			url: ajaxUrl,
			type: 'POST',
			data: {
				phone: phone,
			},
			beforeSend: function() {
				pageLoading('loading', '.page-container');
			},
			success: function(result) {
				$('#result_check_contact').html('');
				$('.form-control').removeAttr('disabled');
				if(option == 'element') {
					$('.alert-danger').remove();
					$('.has-error').removeClass('has-error');
				}
				if(result != 'not-found') {
					var result = $.parseJSON(result);
					var html = '';
					if(result['store'] != '' && result['store'] != null && result['store'] != undefined) {
						html = 	'<div class="alert alert-block alert-success" style="margin-bottom: 15px;">' + 
										'<p><b>Data kho. Bạn sẽ là người quản lý</b></p>' +
									'</div>';
					} else {
						html = 	'<div class="alert alert-block alert-info" style="margin-bottom: 15px;">' + 
										'<p><b>Thông tin người quản lý</b></p>' +
										'<p>Người quản lý: '+ result['user_name'] + ' - ' + result['sale_group_name'] + ' - ' + result['sale_branch_name'] +'</p>' +
									'</div>';
					}
					
					$('#result_check_contact').html(html);
					
					if(option == 'element') {
						loadDataToElement(result, 'exists');
					}
				} else {
					var html = 	'<div class="alert alert-block alert-warning" style="margin-bottom: 15px;">' + 
									'<p><b>Data không tồn tại. Bạn sẽ là người quản lý</b></p>' +
								'</div>';
					$('#result_check_contact').html(html);
					
					if(option == 'element') {
						loadDataToElement(result, 'not-exists');
					}
				}
				
				pageLoading('close', '.page-container');
			},
			error: function (request, status, error) {
				xToastr('error', 'Lỗi không thể kiểm tra được khách hàng', '');
			}
		});
	} else {
		$('#result_check_contact').html('');
		$('.form-control').attr('disabled', 'disabled');
		$('input[name="phone"]').removeAttr('disabled');
		
		loadDataToElement(null, 'not-exists');
	}
}

/**
 * Author: NamNV
 * Desciption: Lấy thông tin khách hàng qua số điện thoại để làm hợp đồng
 *
 * @phone: Số điện thoại cần check
 */
function checkContractToElement(phone, option) {
	if(phone) {
		var ajaxUrl = moduleAdmin + '/api/get-contact';
		$.ajax({
			url: ajaxUrl,
			type: 'POST',
			data: {
				phone: phone,
				check_user: true
			},
			beforeSend: function() {
				pageLoading('loading', '.page-container');
			},
			success: function(result) {
				if(result == 'not-found') {
					$('#result_check_contact').html('');
					$('.form-control').removeAttr('disabled');
					if(option == 'element') {
						$('.alert-danger').remove();
						$('.has-error').removeClass('has-error');
					}

					var html = 	'<div class="alert alert-block alert-success" style="margin-bottom: 15px;">' +
						'<p><b>Bạn sẽ là người quản lý khách hàng này</b></p>' +
						'</div>';
					$('#result_check_contact').html(html);

					if(option == 'element') {
						loadDataToElement(result, 'not-exists');
					}
				} else {
					var result = $.parseJSON(result);
					var html = '';
					if(result.error) {
						var html = 	'<div class="alert alert-block alert-danger" style="margin-bottom: 15px;">' +
								'<p><b>'+ result.msg +'</b></p>' +
							'</div>';
						$('#result_check_contact').html(html);
					} else {
						$('#result_check_contact').html('');
						$('.form-control').removeAttr('disabled');
						if(option == 'element') {
							$('.alert-danger').remove();
							$('.has-error').removeClass('has-error');
						}
						if(option == 'element') {
							loadDataToElement(result, 'exists');
						}
					}
					$('#result_check_contact').html(html);
				}
				pageLoading('close', '.page-container');
			},
			error: function (request, status, error) {
				xToastr('error', 'Lỗi không thể kiểm tra được khách hàng', '');
			}
		});
	} else {
		$('#result_check_contact').html('');
		$('.form-control').attr('disabled', 'disabled');
		$('input[name="phone"]').removeAttr('disabled');

		loadDataToElement(null, 'not-exists');
	}
}

/**
 * Author: NamNV
 * Desciption: Load data nhận được vào các element
 * 
 * @data: Dữ liệu đầu vào
 * @option: Phân loại thực hiện
 */
function loadDataToElement(data, option) {
	switch(option) {
	    case 'exists':
	    	if($('#adminFormModal').length) {
	    		formAdmin = '#adminFormModal';
	    	} else if($('#adminForm').length) {
				formAdmin = '#adminForm';
			}
	    	$(formAdmin + ' .form-control').not('.not-push').each(function(key, value) {
				var name = $(this).attr('name');
				if(data[name]) {
					if($(this).hasClass('select2')) {
						var parent_name = $(this).attr('data-parent-name');
						if(parent_name) {
							$(this).attr('data-parent', data[parent_name]);
						}
						$(this).select2('val', data[name]);
					} else {
						var value = $(this).attr('data-value');
						if(value) {
							$(this).val(value);
						} else {
							$(this).val(data[name]);
						}
					}
				}
			});

	        break;
	    case 'not-exists':
	    	if($('#adminFormModal').length) {
	    		formAdmin = '#adminFormModal';
	    	}
	    	$(formAdmin + ' .form-control').not('.not-push').each(function(key, value) {
	    		var name = $(this).attr('name');
				if($(this).hasClass('select2')) {
					var option_first 		= $('option:first', this).val();
					var parent_name 		= $(this).attr('data-parent-name');
					var parent_option_first = $('option:first', 'select[name="'+ parent_name +'"]').val();
					if(parent_name) {
						$(this).attr('data-parent', parent_option_first);
					} else {
						$(this).removeAttr('data-parent');
					}
					$(this).select2('val', option_first);
				} else {
					var value 				= $(this).attr('data-value');
					if(name != 'phone') {
						if(value) {
							$(this).val(value);
						} else {
							$(this).val('');
						}
					}
				}
			});
	    	
	        break;
	}
}

/**
 * Author: NamNV
 * Desciption: Load data nhận được vào các element
 * 
 * @action: Action thực hiện
 * @option: Đối tượng mở rộng
 */
function contractTool(action, option) {
	Form.extendedModals('ajax');
		
	var ajaxUrl	= moduleAdmin + '/contract/' + action;
    var $modal 	= $('#ajax-modal');
    
    $('body').modalmanager('loading');
	$modal.load(ajaxUrl, option, function(){
		if($modal.html() == 'no-access') {
			modalMessage($modal, '<div class="alert alert-danger">Bạn không có quyền truy cập vào mục này</div>');
		}
		if($modal.html() == 'not-found') {
			modalMessage($modal, '<div class="alert alert-danger">Không tìm thấy dữ liệu hoặc đường dẫn không tồn tại</div>');
		}

  		$modal.modal();
  	});
    
    $modal.on('click', '.save-close', function(){
    	$.ajax({
			url: ajaxUrl,
			type: 'POST',
			data: $modal.find('form').serialize(),
			beforeSend: function() {
				$modal.modal('loading');
				$modal.find('.btn').addClass('disabled');
			},
			success: function(result) {
				if(result == 'success') {
					$modal.modal('hide');
					location.reload();
				} else {
					$modal.modal('loading');
					$modal.find('.btn').removeClass('disabled');
					$modal.find('.modal-body').html(result);
					reloadScript();
				}
			},
			error: function (request, status, error) {
				console.log(error);
			}
		});
	});
    
    $modal.on('shown.bs.modal', function (e) {
		if($modal.outerHeight() > $(window).outerHeight()) {
			$modal.css({'margin-top': '0px', 'top': '0'});
		}
		reloadScript();
	});
	$modal.on('hidden.bs.modal', function (e) {
		$modal.html('');
	});
}

/**
 * Author: NamNV
 * Desciption: Popup ajax đến action
 * 
 * @ajaxUrl: Link đến Action thực hiện
 * @option: Đối tượng mở rộng
 */
function popupAction(ajaxUrl, option) {
	var current_data = '';
	let view = option['view'] ? '-' + option['view'] : '';
	Form.extendedModals('ajax' + view);
	var $modal = $('#ajax-modal' + view);
	$('body').modalmanager('loading');
	$modal.load(ajaxUrl, option, function(){
		if($modal.html() == 'no-access') {
			modalMessage($modal, '<div class="alert alert-danger">Bạn không có quyền truy cập vào mục này</div>');
		}
		if($modal.html() == 'not-found') {
			modalMessage($modal, '<div class="alert alert-danger">Không tìm thấy dữ liệu hoặc đường dẫn không tồn tại</div>');
		}

		$modal.modal();
	});

	$modal.on('click', '.save-close', function(){
		var data = $modal.find('form').serialize();
		var id_form = $modal.find('form').attr('id');
		if(id_form && $modal.find('form').hasClass('has-file')){
			data = new FormData(document.getElementById(id_form));
			$.ajax({
				url: ajaxUrl,
				type: 'POST',
				data: data,
				processData: false,
				contentType: false,
				beforeSend: function() {
					$modal.modal('loading');
					$modal.find('.btn').addClass('disabled');
				},
				success: function(result) {
					if(result == 'success') {
						$modal.modal('hide');
						location.reload();
					} else {
						$modal.modal('loading');
						$modal.find('.btn').removeClass('disabled');
						$modal.find('.modal-body').html(result);
						reloadScript();
					}
				},
				error: function (request, status, error) {
					console.log(error);
				}
			});
		}else{
			$.ajax({
				url: ajaxUrl,
				type: 'POST',
				data: data,
				beforeSend: function() {
					$modal.modal('loading');
					$modal.find('.btn').addClass('disabled');
				},
				success: function(result) {
					if(result === 'success') {
						$modal.modal('hide');
						location.reload();
					} else {
						$modal.modal('loading');
						$modal.find('.btn').removeClass('disabled');
						$modal.find('.modal-body').html(result);
						reloadScript();
					}
				},
				error: function (request, status, error) {
					console.log(error);
				}
			});
		}
	});

	$modal.on('shown.bs.modal', function (e) {
		current_data = $modal.find('form').serialize();
		if($modal.outerHeight() > $(window).outerHeight()) {
			$modal.css({'margin-top': '0px', 'top': '0'});
		}
		reloadScript();
	});
	$modal.on('hide.bs.modal', function (e) {
		// console.log(current_data);
		// console.log($modal.find('form').serialize());
		// if(current_data !== $modal.find('form').serialize()) {
		// 	if(!confirm('Dữ liệu thay đổi chưa được lưu. Bạn vẫn muốn thoát')) {
		// 		return e.preventDefault();
		// 	}
		// }
	});
	$modal.on('hidden.bs.modal', function (e) {
		$modal.html('');
	});
}
function popupActionOverride(ajaxUrl, option) {
	Form.extendedModals('ajax-override');
	var $modal = $('#ajax-modal-override');
	$('body').modalmanager('loading');
	$modal.load(ajaxUrl, option, function () {
		$modal.modal();
	});

	$modal.on('click', '.save-close', function () {
		$.ajax({
			url       : ajaxUrl,
			type      : 'POST',
			data      : $modal.find('form').serialize(),
			beforeSend: function () {
				$modal.modal('loading');
				$modal.find('.btn').addClass('disabled');
			},
			success   : function (result) {
				if (result == 'success') {
					$modal.modal('hide');
				} else {
					$modal.modal('loading');
					$modal.find('.btn').removeClass('disabled');
					$modal.find('.modal-body').html(result);
					reloadScript();
				}
			},
			error     : function (request, status, error) {
				console.log(error);
			}
		});
	});

	$modal.on('shown.bs.modal', function (e) {
		reloadScript();
	});
	$modal.on('hidden.bs.modal', function (e) {
		$modal.html('');
	});

	$modal.on('click', '.submit-button', function () {
		$.ajax({
			url       : ajaxUrl,
			type      : 'POST',
			data      : $modal.find('form').serialize(),
			beforeSend: function () {
				$modal.modal('loading');
				$modal.find('.btn').addClass('disabled');
			},
			success   : function (result) {
				if (result == 'success') {
				} else {
					$modal.modal('loading');
					$modal.find('.btn').removeClass('disabled');
					$modal.find('.modal-body').html(result);
					reloadScript();
				}
			},
			error     : function (request, status, error) {
				console.log(error);
			}
		});
	});
}


/**
 * Author: NamNV
 * Desciption: Load url action
 */
function load_action(parent, url, params) {
	$.ajax({
		url: url,
		type: 'POST',
		data: params,
		beforeSend: function() {
			$(parent).html('Đang tải dữ liệu...');
		},
		success: function(result) {
			$(parent).html(result);
			Form.init();
		}
	});
}

/**
 * Author: NamNV
 * Desciption: Load Ajax Link Report
 * 
 * @parent: Nơi hiển thị nội dung
 * @url: Link
 * @options: params
 */
function load_report(parent, url, options) {
	if(!(parent).length) return false;

	var ajaxUrl	= url;
	var data = null;
	if(options != null) {
		data = $.parseJSON(options.replace(/'/gi, '"'));
	}
	
	$.ajax({
		url: ajaxUrl,
		type: 'GET',
		data: data,
		beforeSend: function() {
		},
		success: function(result) {
			if(result == 'no-access') {
				$(parent).remove();
				return false;
			}
			if(result == 'not-found') {
				result = '<div class="alert alert-danger">Không tìm thấy dữ liệu hoặc đường dẫn không tồn tại</div>';
			}
			$(parent).html(result);
		}
	});
}

/**
 * Author: NamNV
 * Desciption: Load Ajax Page
 * 
 * @parent: Nơi hiển thị nội dung
 * @url: Link
 * @options: params
 */
function ajax_load_page(parent, url, options) {
	var data = null;
	if(options != null) {
		data = $.parseJSON(options.replace(/'/gi, '"'));
	}
	
	$.ajax({
		url: url,
		type: 'POST',
		data: data,
		beforeSend: function() {
			pageLoading('loading', parent);
		},
		success: function(result) {
			$(parent).html(result);
			pageLoading('close', parent);
			Form.init();
		}
	});
}

/**
 * Author: NamNV
 * Desciption: Load Ajax Page Append
 * 
 * @parent: Nơi hiển thị nội dung
 * @url: Link
 * @options: params
 */
function ajax_load_page_append(parent, url, options) {
	var ajaxUrl	= url;
	var data 	= $.parseJSON(options.replace(/'/gi, '"'));
	
	$.ajax({
		url: ajaxUrl,
		type: 'POST',
		data: data,
		beforeSend: function() {
			pageLoading('loading', parent);
		},
		success: function(result) {
			$(parent + ' table tbody').append(result);
			pageLoading('close', parent);
			Form.init();
		}
	});
}

/**
 * Author: NamNV
 * Desciption: Thêm lịch sử chăm sóc bằng ajax
 * 
 * @id: Id liên hệ
 */
function add_contact_history(id) {
	Form.extendedModals('ajax');
		
	var ajaxUrl	= moduleAdmin + '/contact/add-history';
    var $modal 	= $('#ajax-modal');
    
    $('body').modalmanager('loading');
	$modal.load(ajaxUrl, {id: id}, function(){
		if($modal.html() == 'no-access') {
			modalMessage($modal, '<div class="alert alert-danger">Bạn không có quyền truy cập vào mục này</div>');
		}
		if($modal.html() == 'not-found') {
			modalMessage($modal, '<div class="alert alert-danger">Không tìm thấy dữ liệu hoặc đường dẫn không tồn tại</div>');
		}
  		$modal.modal();
  	});
    
    $modal.on('click', '.save-close', function(){
    	$.ajax({
			url: ajaxUrl,
			type: 'POST',
			data: $modal.find('form').serialize(),
			beforeSend: function() {
				$modal.modal('loading');
				$modal.find('.btn').addClass('disabled');
			},
			success: function(result) {
				if(result == 'success') {
					$modal.modal('hide');
					location.reload();
				} else {
					$modal.modal('loading');
					$modal.find('.btn').removeClass('disabled');
					$modal.find('.modal-body').html(result);
					reloadScript();
				}
			},
			error: function (request, status, error) {
				console.log(error);
			}
		});
	});
    
    $modal.on('shown.bs.modal', function (e) {
		if($modal.outerHeight() > $(window).outerHeight()) {
			$modal.css({'margin-top': '0px', 'top': '0'});
		}
		reloadScript();
	});
	$modal.on('hidden.bs.modal', function (e) {
		$modal.html('');
	});
}

/**
 * Author: NamNV
 * Desciption: Thay đổi trạng thái
 * 
 * @type: Phân loại thực hiện là nhiều hay một phần tử: item/multi
 * @option: Là Id nếu type = item, load trạng thái 0/1 nếu type = multi
 */
function changeStatus(type, option) {
	var itemStatus = option;
	var loading = true;
	if(type == 'item') {
		loading = false;
		$('#tr_' + option + ' .checkboxes').attr('checked', true);
		$('#tr_' + option + ' .checkboxes').parents('tr').addClass("active");
		
		itemStatus = $('#tr_' + option + ' .control.status').attr('data-status');
	}
	
	var itemId = [];
	$(formAdmin + ' .checkboxes').each(function () {
		checked = $(this).is(":checked");
        if (checked) {
        	itemId.push($(this).val());
        }
    });
	
	if(itemId.length > 0) {
		var actionForm  = $(formAdmin).attr('action').split('/');
    	var ajaxUrl 	= '/' + actionForm[1] + '/' + actionForm[2] + '/status';
    	if(actionForm[0] != '') {
    		ajaxUrl 	= '/' + actionForm[0] + '/' + actionForm[1] + '/status';
    	}
		var classRemove = (itemStatus == 0) ? 'fa-toggle-off' : 'fa-toggle-on';
		var classAdd 	= (itemStatus == 0) ? 'fa-toggle-on' : 'fa-toggle-off';
		var statusNew 	= (itemStatus == 0) ? 1 : 0;

		$.ajax({
			url: ajaxUrl,
			type: 'POST',
			data: {
				cid: itemId,
				status: itemStatus
			},
			beforeSend: function() {
				pageLoading('loading', '.table-scrollable');
			},
			success: function(result) {
				if(result == 'no-access') {
					xToastr('error', xMessage['no-access'], '');
				} else {
					for(var i = 0; i < itemId.length; i++) {
						if(statusNew == 1) {
							$('#tr_' + itemId[i] + ' .control.status').addClass('active');
						} else {
							$('#tr_' + itemId[i] + ' .control.status').removeClass('active');
						}
						$('#tr_' + itemId[i] + ' .control.status i').removeClass(classRemove).addClass(classAdd);
						$('#tr_' + itemId[i] + ' .control.status').attr({'onclick': 'javascript:changeStatus(\'item\', \''+ itemId[i] +'\');', 'data-status': statusNew});
						$('#tr_' + itemId[i] + ' .checkboxes').attr('checked', false);
						$('#tr_' + itemId[i] + ' .checkboxes').parents('tr').removeClass("active");
					}
					
					$(formAdmin + ' .group-checkable').attr('checked', false);
					if(loading == true) {
						location.reload();
					}
				}
				
				pageLoading('close', '.table-scrollable');
			},
			complete: function(){
			}
		});
	} else {
		xToastr('error', xMessage['no-checked'], '');
	}
}

/**
 * Author: NamNV
 * Desciption: Thay đổi trạng thái
 */
function updateStatus(element) {
	var action		= $(element).attr('action') ? $(element).attr('action') : 'status';
	var actionForm  = $(formAdmin).attr('action').split('/');
	var ajaxUrl 	= '/' + actionForm[1] + '/' + actionForm[2] + '/' + action;
	if(actionForm[0] != '') {
		ajaxUrl 	= '/' + actionForm[0] + '/' + actionForm[1] + '/' + action;
	}
	var itemStatus	= parseInt($(element).attr('data-status'));
	var classRemove = (itemStatus == 0) ? 'default' : 'green';
	var classAdd 	= (itemStatus == 0) ? 'green' : 'default';
	var statusNew 	= (itemStatus == 0) ? 1 : 0;
	
	$.ajax({
		url: ajaxUrl,
		type: 'POST',
		data: {
			id: $(element).attr('data-id'),
			fields: $(element).attr('data-fields'),
			value: itemStatus
		},
		beforeSend: function() {
			pageLoading('loading', '.table-scrollable');
		},
		success: function(result) {
			if(result == 'no-access') {
				xToastr('error', xMessage['no-access'], '');
			} else {
					$(element).removeClass(classRemove).addClass(classAdd);
					$(element).attr({'onclick': 'javascript:updateStatus(this);', 'data-status': statusNew});
			}
			
			pageLoading('close', '.table-scrollable');
		},
		complete: function(){
		}
	});
}

/**
 * Author: NamNV
 * Desciption: Duyệt hóa đơn
 * 
 * @ajaxUrl: Đường dẫn đến action duyệt
 * @trId: Id của tr cần xử lý
 */
function confirmCheckBill(ajaxUrl, trId) {
	Form.extendedModals('ajax');
	
    var $modal 	= $('#ajax-modal');
    
    $('body').modalmanager('loading');
	$modal.load(ajaxUrl, null, function(){
		if($modal.html() == 'no-access') {
			modalMessage($modal, '<div class="alert alert-danger">Bạn không có quyền truy cập vào mục này</div>');
		}
		if($modal.html() == 'not-found') {
			modalMessage($modal, '<div class="alert alert-danger">Không tìm thấy dữ liệu hoặc đường dẫn không tồn tại</div>');
		}

  		$modal.modal();
  	});
    
    $modal.on('click', '.save-close', function(){
    	$.ajax({
			url: ajaxUrl,
			type: 'POST',
			data: $modal.find('form').serialize(),
			beforeSend: function() {
				$modal.modal('loading');
				$modal.find('.btn').addClass('disabled');
			},
			success: function(result) {
				var data = JSON.parse(result);
				
				$(trId + ' .checked').html(data['checked_format']);
				$(trId + ' .checked_id').html(data['checked_user']);
				if($(trId + ' .btn-check').hasClass('default')) {
					$(trId + ' .btn-check').removeClass('default').addClass('green').removeAttr('onclick').attr('title', 'Hóa đơn này đã được duyệt');
				}
				
				$modal.modal('hide');
			},
			error: function (request, status, error) {
				console.log(error);
			}
		});
	});
    
    $modal.on('shown.bs.modal', function (e) {
		if($modal.outerHeight() > $(window).outerHeight()) {
			$modal.css({'margin-top': '0px', 'top': '0'});
		}
		reloadScript();
	});
	$modal.on('hidden.bs.modal', function (e) {
		$modal.html('');
	});
}

/**
 * Author: NamNV
 * Desciption: Xóa phần tử
 * 
 * @type: Phân loại thực hiện là nhiều hay một phần tử: item/multi
 * @option: Là Id nếu type = item, ngược lại all - xóa tất cả các phần tử được chọn
 */
function deleteItem(type, option) {
	var itemId = [];
	
	if(type == 'item') {
		$('#tr_' + option + ' .checkboxes').attr('checked', true);
		$('#tr_' + option + ' .checkboxes').parents('tr').addClass("active");
		
		itemId.push(option);
	} else {
		$(formAdmin + ' .checkboxes').each(function () {
			checked = $(this).is(":checked");
	        if (checked) {
	        	itemId.push($(this).val());
	        }
	    });
	}
	
	if(itemId.length > 0) {
		Form.extendedModals('confirm');
		var $modal 	= $('#confirm-modal');
		
		$modal.modal();
		$modal.find('.modal-body').html("Nếu xóa phần tử sẽ không thể khôi phục lại. Bạn có chắc chắn muốn xóa?");
	    $modal.on('click', '.confirm', function(){
	    	var actionForm  = $(formAdmin).attr('action').split('/');
	    	var ajaxUrl 	= '/' + actionForm[1] + '/' + actionForm[2] + '/delete';
	    	if(actionForm[0] != '') {
	    		ajaxUrl 	= '/' + actionForm[0] + '/' + actionForm[1] + '/delete';
	    	}
			submitForm(ajaxUrl);
		});
	    
		$modal.on('hidden.bs.modal', function (e) {
			$modal.html('');
		});
	} else {
		xToastr('error', xMessage['no-checked'], '');
	}
}

/**
 * Author: NamNV
 * Desciption: Sắp xếp list
 */
function changeOrdering() {
	var itemId = [];

	$(formAdmin + ' .checkboxes').each(function () {
		checked = $(this).is(":checked");
		if (checked) {
			itemId.push($(this).val());
		}
	});

	if(itemId.length > 0) {
		var ajaxUrl = $(formAdmin).attr('action').replace('/filter', '/ordering');
		submitForm(ajaxUrl);
	} else {
		xToastr('error', xMessage['no-checked'], '');
	}
}

/**
 * Author: NamNV
 * Desciption: Chuyển quyền liên hệ
 */
function changeUser() {
	var itemId = [];
	$(formAdmin + ' .checkboxes').each(function () {
		checked = $(this).is(":checked");
		if (checked) {
			itemId.push($(this).val());
		}
	});
	if(itemId.length > 0) {
		var ajaxUrl = $(formAdmin).attr('action').replace('/filter', '/change-user');
		console.log(ajaxUrl);
		popupAction(ajaxUrl, {ids: itemId, sale_branch_id: $('[name="filter_sale_branch"]').val()});
		//submitForm(ajaxUrl);
	} else {
		xToastr('error', xMessage['no-checked'], '');
	}
}

/**
 * Author: NamNV
 * Desciption: Thu hồi data về kho
 */
function backStore() {
	var ids = [];
	$(formAdmin + ' .checkboxes').each(function () {
		checked = $(this).is(":checked");
		if (checked) {
			ids.push($(this).val());
		}
	});
	if(ids.length > 0) {
		var ajaxUrl = $(formAdmin).attr('action').replace('/filter', '/back-store');
		popupAction(ajaxUrl, {ids: ids});
	} else {
		xToastr('error', xMessage['no-checked'], '');
	}
}

/**
 * Author: NamNV
 * Desciption: Gửi email/sms
 */
function marketingSender(el) {
	var itemId = [];
	$(formAdmin + ' .checkboxes').each(function () {
		checked = $(this).is(":checked");
		if (checked) {
			itemId.push($(this).val());
		}
	});
	if(itemId.length > 0) {
		let ajaxUrl = moduleAdmin + '/contact/marketing-sender';
		let params = { user_customer_ids: itemId };
		let el_data = $(el).data();
		if(el_data) {
			$.each(el_data, function(key, val) {
				params[key] = val;
			})
		}

		popupAction(ajaxUrl, params);
	} else {
		xToastr('error', xMessage['no-checked'], '');
	}
}

/**
 * Author: NamNV
 * Desciption: Di chuyển Node
 */
function moveNode(id, type) {
	var ajaxUrl = moduleAdmin + '/' + controllerName + '/move';
	
	$.ajax({
		url: ajaxUrl,
		type: 'POST',
		data: {
			'move-id': id,
			'move-type': type
		},
		beforeSend: function() {
			pageLoading('loading', '.page-container');
		},
		success: function(result) {
			if(result == 'no-access') {
				xToastr('error', xMessage['no-access'], '');
			} else if(result == 'record-exists'){
				xToastr('error', xMessage['record-exists'], '');
			} else {
				$('#row_' + id).remove(),
				xToastr('success', xMessage['success'], '');
			}
			
			pageLoading('close', '.page-container');
			location.reload();
		},
		complete: function(){
		}
	});
}

/**
 * Author: NamNV
 * Desciption: Submit form
 * 
 * @type: Loại: Lưu, Lưu & Mới,Lưu & Đóng
 */
function controlSubmitForm(type) {
	var itemId = [];
	if(type != undefined) {
		if($('input[name="control-action"]').size() > 0) {
			$('input[name="control-action"]').val(type);
		} else {
			$(formAdmin).append('<input type="hidden" name="control-action" value="'+ type +'">');
		}
	}
	
	var ajaxUrl = $(formAdmin).attr('action');
	pageLoading('loading', 'body');
	submitForm(ajaxUrl);
}

/**
 * Author: NamNV
 * Desciption: Submit form & Confirm
 * 
 * @type: Loại: Lưu, Lưu & Mới,Lưu & Đóng
 * @message: Nội dung thông báo xác nhận comfirm
 */
function controlSubmitFormConfirm(type, message) {
	Form.extendedModals('confirm');
	var $modal 	= $('#confirm-modal');
	
	$modal.modal();
	$modal.find('.modal-body').html(message);
    $modal.on('click', '.confirm', function(){
    	var itemId = [];
    	if(type != undefined) {
    		if($('input[name="control-action"]').size() > 0) {
    			$('input[name="control-action"]').val(type);
    		} else {
    			$(formAdmin).append('<input type="hidden" name="control-action" value="'+ type +'">');
    		}
    	}
    	
    	var ajaxUrl = $(formAdmin).attr('action');
    	submitForm(ajaxUrl);
	});
    
	$modal.on('hidden.bs.modal', function (e) {
		$modal.html('');
	});
}

/**
 * Author: NamNV
 * Desciption: Submit form & Stack
 * 
 * @type: Loại: Lưu, Lưu & Mới,Lưu & Đóng
 * @message: Nội dung thông báo xác nhận comfirm
 */
function controlSubmitFormStack(type, message) {
	Form.extendedModals('stack');
	var $modal 	= $('#stack-modal');
	
	$modal.modal();
	$modal.find('.control-label').html(message);
	$modal.on('click', '.save', function(){
		if($modal.find('input[name="input-stack"]').val() && $modal.find('input[name="input-stack"]').val() != '') {
			var itemId = [];
			if(type != undefined) {
				if($('input[name="control-action"]').size() > 0) {
					$('input[name="control-action"]').val(type);
				} else {
					$(formAdmin).append('<input type="hidden" name="control-action" value="'+ type +'">');
				}
			}
			
			$(formAdmin).append('<input type="hidden" name="input-stack" value="'+ $modal.find('input[name="input-stack"]').val() +'">');
			
			var ajaxUrl = $(formAdmin).attr('action');
			submitForm(ajaxUrl);
		} else {
			xToastr('error', 'Vui lòng nhập ' + message, '');
		}
	});
	
	$modal.on('hidden.bs.modal', function (e) {
		$modal.html('');
	});
}


/**
 * Author: NamNV
 * Desciption: Check all list table
 */
function checkAll() {
	if(!$(formAdmin).length) {
		formAdmin = '#tab-content';
	}

	$(formAdmin + ' .table .group-checkable').change(function () {
        var set = $(this).attr("data-set");
        var checked = $(this).is(":checked");
        var total_check = 0;
        $(set).each(function () {
            if (checked) {
                $(this).attr("checked", true);
                $(this).parents('tr').addClass("active");
				total_check++;
            } else {
                $(this).attr("checked", false);
                $(this).parents('tr').removeClass("active");
            }                    
        });
        if(total_check > 0) {
        	$('.show_choice').removeClass('hide');
		} else {
			$('.show_choice').addClass('hide');
		}
    });

    $(formAdmin + ' .table tbody tr .checkboxes').change(function(){
         $(this).parents('tr').toggleClass("active");

		if($(formAdmin + ' .table tbody tr .checkboxes').is(":checked") > 0) {
			$('.show_choice').removeClass('hide');
		} else {
			$('.show_choice').addClass('hide');
		}
    });
}

/**
 * Author: NamNV
 * Desciption: Chọn file upload với textbox
 */
function openFile(field, group) {
    window.KCFinder = {
        callBack: function(url) {
        	$(formAdmin + ' input[name="'+ field +'"]').val(url);
        	$(formAdmin + ' #view_'+ field).attr({'href': url}).css('display', 'inline-block');
        	$(formAdmin + ' #remove_'+ field).css('display', 'inline-block');
            window.KCFinder = null;
        }
    };
    window.open('/public/scripts/kcfinder/browse.php?type?opener=ckeditor&type='+ group +'&langCode=vi', 'kcfinder_textbox',
        'status=0, toolbar=0, location=0, menubar=0, directories=0, ' +
        'resizable=1, scrollbars=0, width=1000, height=600'
    );
}

/**
 * Author: NamNV
 * Desciption: Xóa trắng ô file upload với textbox
 */
function removeFile(field) {
	$(formAdmin + ' input[name="'+ field +'"]').val('');
	$(formAdmin + ' #view_'+ field).attr({'href': ''}).css('display', 'none');
	$(formAdmin + ' #remove_'+ field).css('display', 'none');
}

/**
 * Author: NamNV
 * Desciption: Hide/Show button up/down table-tree
 * Note: Developer
 */
function buttonListTree() {
	if($(formAdmin + ' .table-tree').size() > 0) {
		var elements = $(formAdmin + ' .table-tree').find('.spinner-input');
		elements.each(function(index, el) {
			var levelCurrent 	= $(this).attr('data-level');
			var valueCurrent 	= $(this).val();
            var levelNext 		= elements.eq(index + 1).attr('data-level');
            var valueNext 		= elements.eq(index + 1).val();
            
            if(valueCurrent == 1) {
            	$(this).parent().addClass('hide-up');
            }
            
            if((levelCurrent != levelNext) && (valueCurrent >= valueNext)) {
            	$(this).parent().addClass('hide-down');
            }
		});
	}
}

/**
 * Author: NamNV
 * Desciption: Page loading
 */
function pageLoading(type, el) {
	if(!el) {
		el = 'body';
	}
	
	if(type == 'loading') {
		App.blockUI(el);
	} else if(type == 'close'){
		App.unblockUI(el);
	}
}

/**
 * Author: NamNV
 * Desciption: Cập nhật nội dung vào modal
 */
function modalMessage(modal, message) {
	var xhtml = '<div class="modal-header">' +
					'<button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>' +
					'<h4 class="modal-title">Thông báo từ hệ thống</h4>' +
				'</div>' +
				'<div class="modal-body">'+ message +'</div>' +
				'<div class="modal-footer">' +
					'<button type="button" data-dismiss="modal" class="btn btn-default">Đóng</button>' +
				'</div>'; 
	$(modal).html(xhtml);
}

/**
 * Author: NamNV
 * Desciption: Tạo đường dẫn tính
 */
function createAlias(source, target) {
	var data = $(source).val();
	if(!$(target).val() || $(target).val() == '' || $('input[name="id"]').val() == '') {
		data= data.toLowerCase();
		
		data = data.replace(/à|ả|ã|á|ạ|ă|ằ|ẳ|ẵ|ắ|ặ|â|ầ|ẩ|ẫ|ấ|ậ/g,"a");
		data = data.replace(/è|ẻ|ẽ|é|ẹ|ê|ề|ể|ễ|ế|ệ/g,"e");
		data = data.replace(/ì|ỉ|ĩ|í|ị/g,"i");
		data = data.replace(/ò|ỏ|õ|ó|ọ|ô|ồ|ổ|ỗ|ố|ộ|ơ|ờ|ở|ỡ|ớ|ợ/g,"o");
		data = data.replace(/ù|ủ|ũ|ú|ụ|ư|ừ|ử|ữ|ứ|ự/g,"u");
		data = data.replace(/ỳ|ỷ|ỹ|ý/g,"y");
		data = data.replace(/đ/g,"d");
		data = data.replace(/!|@|\$|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'| |\"|\“|\”|\&|\#|\[|\]|~/g,"-");
		data = data.replace(/-+-/g,"-");
		data = data.replace(/^\-+|\-+$/g,"");
		
		$(target).val(data);
	}
}


/**
 * Author: NamNV
 * Desciption: Toastr
 */
function xToastr(type, msg, title) {
	toastr.options = {
	  "closeButton": true,
	  "debug": false,
	  "positionClass": "toast-top-right",
	  "onclick": null,
	  "showDuration": 300,
	  "hideDuration": 300,
	  "timeOut": 4000,
	  "extendedTimeOut": 1000,
	  "showEasing": "swing",
	  "hideEasing": "linear",
	  "showMethod": "fadeIn",
	  "hideMethod": "fadeOut"
	}

    toastr[type](msg, title); // Wire up an event handler to a button in the toast, if it exists
}

/**
 * Author: NamNV
 * Desciption: Popup Preview Image/Video/Iframe
 * Source: fancyapps.com
 */
function fancyboxPreview(className) {
	$("." + className).fancybox({
		openEffect	: 'elastic',
		closeEffect	: 'elastic'
	});
}

/**
 * Author: NamNV
 * Desciption: Chặn copy nội dung
 */
function noCopy() {
	$('body').css({
		'-webkit-touch-callout': 'none',
		'-webkit-user-select': 'none',
		'-moz-user-select': 'none',
		'-ms-user-select': 'none',
		'-o-user-select': 'none',
		'user-select': 'none'
	});
	document.onselectstart = new Function ("return false");
    if (window.sidebar){
        document.onmousedown = false;
        document.onclick = true;
    }
}

/**
 * Author: NamNV
 * Desciption: Chặn chuột phải
 */
function noRightMouse() {
	$(document).bind("contextmenu",function(e){
		e.preventDefault();
	});
}

/**
 * Author: NamNV
 * Desciption: sự kiện click tr vào table
 */
function trClick() {
	$(".table-hover tr").click(function(){
		/*if($(this).hasClass('active')) {
			$(this).removeClass('active');
			$('.checkboxes', this).attr("checked", false);
		} else {
			$('.checkboxes', this).attr("checked", true);
			$(this).addClass('active');
		}

		if($(formAdmin + ' .table tbody tr .checkboxes').is(":checked") > 0) {
			$('.show_choice').removeClass('hide');
		} else {
			$('.show_choice').addClass('hide');
		}*/
	});
}

/**
 * @typeChart: Kiểu biểu đồ: column, line, bar
 */
function reportChart(arrChart, nameChart, typeChart, colorChart){
	Highcharts.setOptions({
		lang: {
			thousandsSep: ','
		}
	});
	var dataChart = arrChart;
	var w_window = $(window).width();
	if(colorChart == undefined) {
		colorChart = ['#2f7ed8', '#0d233a', '#d64e00', '#910000', '#1aadce', '#492970', '#f28f43', '#77a1e5', '#c42525', '#a6c96a'];
	}
	switch (typeChart){
		case "column":
		case "bar":
			if(w_window < 900) {
				typeChart = "bar";
			}
			var myChart = Highcharts.chart(nameChart, {
				colors: colorChart,
		        chart: {
		            type: typeChart
		        },
		        title: { text: '' },
		        yAxis: { title: { text: '' } },
		        legend: {
		            enabled: true
		        },
		        plotOptions: {
		            series: {
		                borderWidth: 0,
		                dataLabels: {
		                    enabled: true,
	                    	formatter: function () {
	                    		return Highcharts.numberFormat(this.y,0);
	                    	}
		                },
	                    maxPointWidth: 50,
	                    groupPadding: typeChart == 'bar' ? 0.1 : 0.35
		            }
		        },
		        tooltip: {
		            pointFormat: '<b>{point.y}</b>'
		        },
		        xAxis: {
		            categories: dataChart.categories,
		        },
		        series: dataChart.series,
		    });
			if(typeChart == 'column') {
				myChart.setSize(null, 450, false);
			}
			if(typeChart == 'bar') {
				var heightColumn = (dataChart.series.length) * 40;
				if(dataChart.categories.length == 1) {
					heightColumn = (dataChart.series.length) * 60;
				}
				var heightChart = (dataChart.categories.length * heightColumn) > 300 ? dataChart.categories.length * heightColumn : 300;
				myChart.setSize(null, heightChart, false);
			}
			break;
		case "pie":
			var myChartPie =  Highcharts.chart(nameChart, {
		        chart: {
		            type: typeChart
		        },
		        title: {
		            text: ''
		        },
		        tooltip: {
		            pointFormat: '<b>{point.y:,.1f}</b>'
		        },
		        plotOptions: {
		            pie: {
		                allowPointSelect: true,
		                cursor: 'pointer',
		                dataLabels: {
		                    enabled: true,
		                    format: '<b>{point.name}</b>: {point.percentage:.1f} %',
		                    style: {
		                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
		                    }
		                }
		            }
		        },
		        series: [{data : dataChart}]
		    });
			break;
	}
}

/*
* Table Export
* */
function checkNumber(value) {
	var regex = /^[0-9]\d*(((,\d{3}){1,3})?(\.\d{0,2})?)$/;
	if (regex.test(value)) {
		var twoDecimalPlaces = /\.\d{2}$/g;
		var oneDecimalPlace = /\.\d{1}$/g;
		var noDecimalPlacesWithDecimal = /\.\d{0}$/g;

		if(value.match(twoDecimalPlaces)) {
			return value;
		}
		if(value.match(noDecimalPlacesWithDecimal)) {
			return value+'00';
		}
		if(value.match(oneDecimalPlace )) {
			return value+'0';
		}
		if(value.charAt(0) === '0') {
			return null;
		} else {
			return parseInt(value.replace(/[^0-9]+/g,""));
		}
	}

	return null;
}

function tableExport(id, file_name = 'export'){
	if(!id) id = '#table-manager table';
	pageLoading('loading');

	var ignoreRow = [];
	$(id + ' tr').each(function(key, val) {
		if($(this).hasClass('hidden')) {
			ignoreRow.push(key);
		}
	});

	TableExport.prototype.typeConfig.date.assert = function(value){return false;};
	TableExport.prototype.formatValue = function(isTrimWhitespace, string) {
		if(checkNumber(string) !== null) {
			return checkNumber(string);
		}
		return isTrimWhitespace ? string.trim() : string;
	}

	var table = TableExport($(id), {
		headers: true,                      // (Boolean), display table headers (th or td elements) in the <thead>, (default: true)
		footers: true,                      // (Boolean), display table footers (th or td elements) in the <tfoot>, (default: false)
		formats: ["xlsx", "csv", "txt"],    // (String[]), filetype(s) for the export, (default: ['xlsx', 'csv', 'txt'])
		filename: file_name,                 // (id, String), filename for the downloaded file, (default: 'id')
		bootstrap: true,                   // (Boolean), style buttons using bootstrap, (default: true)
		exportButtons: false,                // (Boolean), automatically generate the built-in export buttons for each of the specified formats (default: true)
		position: "bottom",                 // (top, bottom), position of the caption element relative to table, (default: 'bottom')
		ignoreRows: ignoreRow,              // (Number, Number[]), row indices to exclude from the exported file(s) (default: null)
		ignoreCols: null,                   // (Number, Number[]), column indices to exclude from the exported file(s) (default: null)
		trimWhitespace: true,               // (Boolean), remove all leading/trailing newlines, spaces, and tabs from cell text in the exported file(s) (default: false)
		RTL: false,                         // (Boolean), set direction of the worksheet to right-to-left (default: false)
		sheetname: "Data",
	});

	var exportData = table.getExportData();
	var xlsxData = exportData['tableexport-1'].xlsx; // Replace with the kind of file you want from the exportData
	table.export2file(xlsxData.data, xlsxData.mimeType, xlsxData.filename, xlsxData.fileExtension, xlsxData.merges, xlsxData.RTL, xlsxData.sheetname)

	pageLoading('close');
}

/**
 * Author: NamNV
 * Desciption: Function replace all trong javascript
 */
String.prototype.replaceAll = function (find, replace) {
	var str = this;
	return str.replace(new RegExp(find.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g'), replace);
};

if (!String.prototype.sprintf) {
	String.prototype.sprintf = function() {
		var args = arguments;
		return this.replace(/{(\d+)}/g, function(match, number) {
			return typeof args[number] != 'undefined'
				? args[number]
				: match
				;
		});
	};
}

/**
 * Author: NamNV
 * Desciption: Nạp lại các thư viện script khi sử dụng ajax, modal
 */
function reloadScript() {
	App.init();
  	Form.init();
}

/**
 * Author: NamNV
 * Desciption: Sự kiện chung toàn hệ thống
 */
function init() {
	$('input.date-picker').attr('autocomplete', 'off');

	// Thêm trình soạn thảo cho textarea
	if($('.editor_full').length) {
		$('.editor_full').each(function () {
			var id = $(this).attr('id') ? $(this).attr('id') : $(this).attr('name');
			CKEDITOR.replace(id, {
				customConfig: 'config.js'
			});
		})
	}
	if($('.editor_basic').length) {
		$('.editor_basic').each(function () {
			var id = $(this).attr('id') ? $(this).attr('id') : $(this).attr('name');
			CKEDITOR.replace(id, {
				customConfig: 'config-basic.js'
			});
		})
	}

	if($('input[name^="ordering"]').length) {
		$('input[name^="ordering"]').change(function() {
			var parent = $(this).parents('tr');
			$('.checkboxes', parent).attr("checked", true);

			if($(formAdmin + ' .table tbody tr .checkboxes').is(":checked") > 0) {
				$('.show_choice').removeClass('hide');
			} else {
				$('.show_choice').addClass('hide');
			}
		});
	}

	$('.page-content').css('min-height', window.innerHeight - $('.page-control').outerHeight() - $('.header.navbar').outerHeight() - $('.page-filter').outerHeight() - $('.page-tabs').outerHeight() - 30 + 'px');
}

document.addEventListener("DOMContentLoaded", function() {
	init();
	//noCopy();
	//noRightMouse();
	trClick();
	keywordEnter();
	checkAll();
});

/**
 * Author: AnhNT
 * Desciption: Check cho phép data test tiếp
 */
function continueTest(data){
	$.ajax({
		url: moduleAdmin + '/form-data/continue-test',
		type: 'POST',
		data: data,
		beforeSend: function() {
			pageLoading('loading', '.page-container');
		},
		success: function(result) {
			result = JSON.parse(result);
			xToastr(result.type, result.content);
			pageLoading('close', '.page-container');
		},
		error: function (request, status, error) {
			xToastr('error', 'Lỗi hệ thống, vui lòng thử lại sau!', '');
		}
	});
}

/**
 * Author: AnhNT
 * Desciption: Input number only
 */
$(document).ready(function(){
	$("body").on("keypress keyup blur", ".num-only", function (event) {
		$(this).val($(this).val().replace(/[^0-9\.]/g,''));
		if ((event.which != 46 || $(this).val().indexOf('.') != -1) && (event.which < 48 || event.which > 57)) {
			event.preventDefault();
		}
	});
})

/**
 * Author: AnhNT
 * Desciption: Format - unformat number
 */
function formatNumber(number){
	return number ? number.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') : 0;
}
function unFormatNumber(str){
	return str ? parseInt(str.replace(/,/g, "")) : 0;
}
/**
 * Author: AnhNT
 * Desciption: Format - unformat number
 */
function formatDateToView(data_date, time = false){
	let dd = data_date.getDate().toString();
	let mm = (data_date.getMonth()+1).toString();
	const yyyy = data_date.getFullYear();
	let str = `${dd.padStart(2, '0')}/${mm.padStart(2, '0')}/${yyyy}`;
	if(time){
		let hours = data_date.getHours().toString();
		let minutes = data_date.getMinutes().toString();
		let seconds = data_date.getSeconds().toString();
		str += ` ${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}:${seconds.padStart(2, '0')}`;
	}
	return str;
}

// Copy to Clipboard
$(document).ready(function(){
    $('body').on('click', '.copy-this', function(e){
    	e.preventDefault();
		var range = document.createRange();
		var sel = window.getSelection();
		range.setStartBefore(this.firstChild);
		range.setEndAfter(this.lastChild);
		sel.removeAllRanges();
		sel.addRange(range);
		try {
			document.execCommand('copy');
		} catch(err) {
			console.error('Unable to copy');
		}
	});
});

function dateDiff(dt1, dt2, type = 'day') {
	var date1 = Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate(), dt1.getHours(), dt1.getMinutes(), dt1.getSeconds());
	var date2 = Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate(), dt2.getHours(), dt2.getMinutes(), dt2.getSeconds());
	var dateDiff = Math.floor((date2 - date1)/(1000 * 60 * 60));
	if(type == 'second'){
		dateDiff = Math.floor((date2 - date1)/1000);
	}
	if(type == 'minute'){
		dateDiff = Math.floor((date2 - date1)/(1000*60));
	}
	if(type == 'hour'){
		dateDiff = Math.floor((date2 - date1)/(1000*60*60));
	}
	if(type == 'day'){
		dateDiff = Math.floor((date2 - date1)/(1000*60*60*24));
	}
	return dateDiff;
}