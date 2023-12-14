!function ($) {
    'use strict';

    var FileManager = function () {
        this.fm = '#fm';
        this.fm_modal = '#fm-modal';
        this.fm_type = 'images';
        this.btn_insert_url = '#fm-btn-insert-url';
        this.btn_item_selected = '#fm-btn-item-selected';
        this.btn_item_edit = '#fm-btn-item-edit';
        this.btn_item_delete = '#fm-btn-item-delete';
        this.btn_folder_edit = '#fm-btn-folder-edit';
        this.btn_folder_delete = '#fm-btn-folder-delete';
        this.url = '/admin/file-manager';
    };

    // Load app
    FileManager.prototype.load = async function(folder) {
        var $this = this;

        if($($this.fm).length) {
            $.ajax({
                type: 'GET',
                url: $this.url,
                data: {
                    type: $this.fm_type,
                    folder: folder
                },
                dataType: 'html',
                beforeSend: function() {
                    $.App.loader();
                }
            }).done(function(result) {
                $($this.fm).html(result);
                $this.breadcrumb();

                // let h_window = $(window).height();
                // let h_wrapper = h_window - 190;

                // $($this.fm).find('.fm-wrapper').css({'max-height': h_wrapper +'px'});
        
                $.App.loader('hide');
                return true;
            });
        }
    },

    // Popup file manager
    FileManager.prototype.popup = async function(element, type = 'images') {
        var $this = this;
        this.fm_type = type;

        let xhtml = `<div id="fm-modal" class="modal fade" tabindex="-1" role="dialog" aria-hidden="true">
            <div class="modal-dialog modal-dialog-scrollable modal-full-width modal-dialog-centered">
                <div class="modal-content" id="fm"></div>
            </div>
        </div>`;

        if($($this.fm_modal).length) $($this.fm_modal).remove();
        $('body').append(xhtml);

        await this.load();

        let modal = new bootstrap.Modal($this.fm_modal, {'backdrop': true});
        modal.show();

        $($this.fm_modal).on('click', '.fm-file .item', function(event) {
            $('.fm-folder .item').removeClass('active');
            $this.folderSelected();
            
            if (!event.ctrlKey && !event.metaKey) {
                $('.fm-file .item').removeClass('active');
            }
            $(this).toggleClass('active');
            $this.itemSelected();
        });

        $($this.fm_modal).on('dblclick', '.fm-file .item', function() {
            if(element.model) {
                $.FileManager.ckeditorInsertImage(element);
            } else {
                $.FileManager.inputInsertImage(element);
            }

            modal.hide();
        });

        $($this.fm_modal).on('click', $this.btn_item_selected, function() {
            if(element.model) {
                $.FileManager.ckeditorInsertImage(element);
            } else {
                $.FileManager.inputInsertImage(element);
            }

            modal.hide();
        });

        $($this.fm_modal).on('click', $this.btn_insert_url, function() {
            if(!$('[name="fm-url"]').val()) {
                $('[name="fm-url"]').focus();
                return false;
            }
            if(element.model) {
                $.FileManager.ckeditorInsertImage(element);
            } else {
                $.FileManager.inputInsertImage(element);
            }

            modal.hide();
        });
            
        $($this.fm_modal).on('dblclick', '.fm-folder .item', function(event) {
            $this.load($(this).data('path'));
        });
            
        $($this.fm_modal).on('click', '.fm-folder .item', function(event) {
            $('.fm-folder .item').removeClass('active');
            $(this).toggleClass('active');
            $this.folderSelected();

            $('.fm-file .item').removeClass('active');
            $this.itemSelected();
        });

        $($this.fm_modal).on('click', '#fm-btn-back-folder', function(event) {
            $this.load($(this).data('path'));
        });
    },

    // Breadcrumb
    FileManager.prototype.breadcrumb = function() {
        var $this = this;
        const title = this.fm_type == 'images' ? 'Hình ảnh' : 'File';

        let current_folder = $($this.fm_modal).find('.fm-page').data('path');
        let xhtml = `<span onclick="$.FileManager.load('')">${title}</span>`;
        if(current_folder) {
            let split_path = current_folder.split('/');
            let next_path = '';
            $.each(split_path, function(key, val) {
                if (!val) return
                next_path += '/' + val;
                xhtml += `<i>|</i><span onclick="$.FileManager.load('${next_path}')">${val}</span>`;
            })
        }
        $($this.fm_modal).find('.modal-header .modal-title').html(xhtml);
    },

    // Upload file
    FileManager.prototype.upload = function() {
        var $this = this;
        var form_data = new FormData();
        form_data.append("csrfmiddlewaretoken", $($this.fm_modal).find('[name="csrfmiddlewaretoken"]').val());

        // Read selected files
        var totalfiles = document.getElementById('fm-files').files.length;
        if (!totalfiles) { return false; }
        for (var index = 0; index < totalfiles; index++) {
            form_data.append("files", document.getElementById('fm-files').files[index]);
        }
        
        // AJAX request
        $.ajax({
            url: $this.url + '/upload', 
            type: 'post',
            data: form_data,
            dataType: 'json',
            contentType: false,
            processData: false,
            beforeSend: function() {
                $.App.loader();
            },
            success: function (res) {
                if (res.permission) {
                    $.Modal.alert(res.permission, 'danger');
                } else {
                    let xhtml = '';
                    $.each(res.data, function(key, val) {
                        if(val.error) {
                            xhtml += `<div class="alert alert-danger border-0"><b>${val.name}</b>: ${val.error}</div>`;
                        }
                    });
                    if(xhtml != '') {
                        $.Modal.notify('Thông báo', xhtml);
                    }
                    $this.load();
                }
                $('#fm-files').val('');
                $.App.loader('hide');
            }
        });
    },

    FileManager.prototype.itemEdit = function() {
        var $this = this;
        let current_file = $($this.fm_modal).find('.fm-file .item.active');
        if(!current_file.length) {
            $.Modal.alert('Vui lòng chọn file', 'danger');
            return false;
        }

        let modal_id = '#fm-modal-file';
        let modal_content = '<div class="form-group"><div class="input"><input type="text" name="file_name" class="form-control"></div><div class="error d-none"></div></div>';
        let modal = $.Modal.form(modal_id, 'Sửa file', modal_content);
        let file_name = $('.name', current_file).text();

        $(modal_id).on('shown.bs.modal', function (event) {
            $(this).find('.form-control').focus().val(file_name);
        })

        $(modal_id).on('click', '.btn.save', function(event) {
            var form_data = new FormData();
            form_data.append("csrfmiddlewaretoken", $($this.fm_modal).find('[name="csrfmiddlewaretoken"]').val());
            form_data.append("file_name", $(modal_id).find('.form-control').val());
            form_data.append("file_path", current_file.data('url'));

            // AJAX request
            $.ajax({
                url: $this.url + '/item-edit', 
                type: 'post',
                data: form_data,
                dataType: 'json',
                contentType: false,
                processData: false,
                beforeSend: function() {
                    $.App.loader();
                },
                success: function (res) {
                    if (res.permission) {
                        $.Modal.alert(res.permission, 'danger');
                    } else if (res.error) {
                        $(modal_id).find('.form-group').addClass('input-error');
                        $(modal_id).find('.error').removeClass('d-none').text(res.error);
                        $(this).find('.form-control').focus();
                    } else {
                        modal.hide();
                        $this.load();
                    }
                    $.App.loader('hide');
                }
            });
        });
    },

    FileManager.prototype.itemDelete = function() {
        var $this = this;
        let items = $($this.fm_modal).find('.fm-file .item.active');
        if(!items.length) {
            $.Modal.alert('Vui lòng chọn file', 'danger');
            return false;
        }

        let modal_id = '#fm-modal-file';
        let modal_content = `<div class="alert alert-danger border-0" role="alert">Bạn có chắc chắn muốn xoá <b>${items.length}</b> phần tử đã chọn? <br>Sau khi xoá sẽ không thể khôi phục lại</div>`;
        let modal = $.Modal.form(modal_id, 'Xoá file', modal_content, {'submit_text': 'Xác nhận xoá'});

        $(modal_id).on('click', '.btn.save', function(event) {
            var form_data = new FormData();
            form_data.append("csrfmiddlewaretoken", $($this.fm_modal).find('[name="csrfmiddlewaretoken"]').val());
            $.each(items, function() {
                form_data.append("file_path", $(this).data('url'));
            })

            // AJAX request
            $.ajax({
                url: $this.url + '/item-delete', 
                type: 'post',
                data: form_data,
                dataType: 'json',
                contentType: false,
                processData: false,
                beforeSend: function() {
                    $.App.loader();
                },
                success: function (res) {
                    if (res.permission) {
                        $.Modal.alert(res.permission, 'danger');
                    } else if (res.error) {
                        $(modal_id).find('.form-group').addClass('input-error');
                        $(modal_id).find('.error').removeClass('d-none').text(res.error);
                        $(this).find('.form-control').focus();
                    } else {
                        modal.hide();
                        $this.load();
                    }
                    $.App.loader('hide');
                }
            });
        });
    },

    FileManager.prototype.itemSelected = function() {
        var $this = this;
        let count = $($this.fm_modal).find('.fm-file .item.active').length;

        if(count) {
            $($this.btn_item_selected).find('.count').text(count);
            $($this.btn_item_selected).removeClass('d-none');
            $($this.btn_item_delete).find('.count').text(count);
            $($this.btn_item_delete).removeClass('d-none');
            if(count == 1) {
                $($this.btn_item_edit).removeClass('d-none');
            } else {
                $($this.btn_item_edit).addClass('d-none');
            }
        } else {
            $($this.btn_item_selected).find('.count').text(0);
            $($this.btn_item_selected).addClass('d-none');
            $($this.btn_item_delete).find('.count').text(0);
            $($this.btn_item_delete).addClass('d-none');
            $($this.btn_item_edit).addClass('d-none');
        }
    },

    FileManager.prototype.folderAdd = function() {
        var $this = this;
        let modal_id = '#fm-modal-folder';
        let modal_content = '<div class="form-group"><div class="input"><input type="text" name="folder_name" class="form-control"></div><div class="error d-none"></div></div>';
        let modal = $.Modal.form(modal_id, 'Thêm thư mục', modal_content);

        $(modal_id).on('shown.bs.modal', function (event) {
            $(this).find('.form-control').focus();
        })

        $(modal_id).on('click', '.btn.save', function(event) {
            var form_data = new FormData();
            form_data.append("csrfmiddlewaretoken", $($this.fm_modal).find('[name="csrfmiddlewaretoken"]').val());
            form_data.append("folder_name", $(modal_id).find('.form-control').val());

            // AJAX request
            $.ajax({
                url: $this.url + '/folder-add', 
                type: 'post',
                data: form_data,
                dataType: 'json',
                contentType: false,
                processData: false,
                beforeSend: function() {
                    $.App.loader();
                },
                success: function (res) {
                    if (res.permission) {
                        $.Modal.alert(res.permission, 'danger');
                    } else if (res.error) {
                        $(modal_id).find('.form-group').addClass('input-error');
                        $(modal_id).find('.error').removeClass('d-none').text(res.error);
                        $(this).find('.form-control').focus();
                    } else {
                        modal.hide();
                        $this.load();
                    }
                    $.App.loader('hide');
                }
            });
        });
    },

    FileManager.prototype.folderEdit = function() {
        var $this = this;
        let current_folder = $($this.fm_modal).find('.fm-folder .item.active');
        if(!current_folder.length) {
            $.Modal.alert('Vui lòng chọn thư mục', 'danger');
            return false;
        }

        let modal_id = '#fm-modal-folder';
        let modal_content = '<div class="form-group"><div class="input"><input type="text" name="folder_name" class="form-control"></div><div class="error d-none"></div></div>';
        let modal = $.Modal.form(modal_id, 'Sửa thư mục', modal_content);
        
        $(modal_id).on('shown.bs.modal', function (event) {
            $(this).find('.form-control').focus().val($('span', current_folder).text());
        })

        $(modal_id).on('click', '.btn.save', function(event) {
            var form_data = new FormData();
            form_data.append("csrfmiddlewaretoken", $($this.fm_modal).find('[name="csrfmiddlewaretoken"]').val());
            form_data.append("folder_name", $(modal_id).find('.form-control').val());
            form_data.append("folder_path", current_folder.data('path'));

            // AJAX request
            $.ajax({
                url: $this.url + '/folder-edit', 
                type: 'post',
                data: form_data,
                dataType: 'json',
                contentType: false,
                processData: false,
                beforeSend: function() {
                    $.App.loader();
                },
                success: function (res) {
                    if (res.permission) {
                        $.Modal.alert(res.permission, 'danger');
                    } else if (res.error) {
                        $(modal_id).find('.form-group').addClass('input-error');
                        $(modal_id).find('.error').removeClass('d-none').text(res.error);
                        $(this).find('.form-control').focus();
                    } else {
                        modal.hide();
                        $this.load();
                    }
                    $.App.loader('hide');
                }
            });
        });
    },

    FileManager.prototype.folderDelete = function() {
        var $this = this;
        let current_folder = $($this.fm_modal).find('.fm-folder .item.active');
        if(!current_folder.length) {
            $.Modal.alert('Vui lòng chọn thư mục', 'danger');
            return false;
        }

        let modal_id = '#fm-modal-folder';
        let modal_content = '<div class="alert alert-danger bg-danger text-white border-0" role="alert">Nếu xoá thư mục sẽ xoá toàn bộ file bên trong. Bạn có chắc chắn muốn xoá không?</div>';
        let modal = $.Modal.form(modal_id, 'Xoá thư mục', modal_content, {'submit_text': 'Xác nhận xoá'});

        $(modal_id).on('click', '.btn.save', function(event) {
            var form_data = new FormData();
            form_data.append("csrfmiddlewaretoken", $($this.fm_modal).find('[name="csrfmiddlewaretoken"]').val());
            form_data.append("folder_path", current_folder.data('path'));

            // AJAX request
            $.ajax({
                url: $this.url + '/folder-delete', 
                type: 'post',
                data: form_data,
                dataType: 'json',
                contentType: false,
                processData: false,
                beforeSend: function() {
                    $.App.loader();
                },
                success: function (res) {
                    if (res.permission) {
                        $.Modal.alert(res.permission, 'danger');
                    } else if (res.error) {
                        $.Modal.alert(res.error, 'danger');
                    } else {
                        modal.hide();
                        $this.load();
                    }
                    $.App.loader('hide');
                }
            });
        });
    },

    FileManager.prototype.folderSelected = function() {
        var $this = this;
        let count = $($this.fm_modal).find('.fm-folder .item.active').length;

        if(count && count === 1) {
            $($this.btn_folder_edit).removeClass('d-none');
            $($this.btn_folder_delete).removeClass('d-none');
        } else {
            $($this.btn_folder_edit).addClass('d-none');
            $($this.btn_folder_delete).addClass('d-none');
        }
    },

    FileManager.prototype.ckeditorInsertImage = function(editor) {
        var $this = this;
        let content = '';

        if($($this.fm_modal).find('.fm-file .item.active').length > 0) {
            $.each($($this.fm_modal).find('.fm-file .item.active'), function() {
                content += '<p><img src="'+ $(this).attr('data-url') +'"></p>';
            });
        } else if ($($this.fm_modal).find('[name="fm-url"]').val()) {
            content += '<p><img src="'+ $($this.fm_modal).find('[name="fm-url"]').val() +'"></p>';
        }
        
        const viewFragment = editor.data.processor.toView(content);
        const modelFragment = editor.data.toModel(viewFragment);

        editor.model.insertContent(modelFragment);
    },

    FileManager.prototype.inputInsertImage = function(element) {
        var $this = this;

        if($('#'+ element + ' .list-thumb .row').length) {
            let input_name = $('#'+ element + ' input[name="images"]').attr('name');
            let xhtml_item = '';
            if($($this.fm_modal).find('.fm-file .item.active').length > 0) {
                $.each($($this.fm_modal).find('.fm-file .item.active'), function() {
                    let url = $(this).attr('data-url');
                    let thumb = $.FileManager.getThumb(url, 'small');
                    xhtml_item += `<div class="col-6 col-sm-4 col-md-3 col-lg-2 col-item"><div class="item mb-2"><a href="${url}"><img class="w-100 rounded" src="${thumb}"></a><i class="fe-x" onclick="$(this).parents('.col-item').remove()"></i><input type="hidden" name="${input_name}_data" value="${url}"></div></div>`;
                });
            } else if ($($this.fm_modal).find('[name="fm-url"]').val()) {
                let url = $($this.fm_modal).find('[name="fm-url"]').val();
                let thumb = $($this.fm_modal).find('[name="fm-url"]').val();
                xhtml_item += `<div class="col-6 col-sm-4 col-md-3 col-lg-2 col-item"><div class="item mb-2"><a href="${url}"><img class="w-100 rounded" src="${thumb}"></a><i class="fe-x" onclick="$(this).parents('.col-item').remove()"></i><input type="hidden" name="${input_name}_data" value="${url}"></div></div>`;
            }

            $('#'+ element + ' .list-thumb .row').append(xhtml_item);
        } else {
            let url = '';
            let thumb = '';
            if($($this.fm_modal).find('.fm-file .item.active').length > 0) {
                url = $($this.fm_modal).find('.fm-file .item.active').attr('data-url');
                thumb = $.FileManager.getThumb(url, 'small');
            } else if ($($this.fm_modal).find('[name="fm-url"]').val()) {
                url = $($this.fm_modal).find('[name="fm-url"]').val();
                thumb = $($this.fm_modal).find('[name="fm-url"]').val();
            }
            $('#'+ element + ' input').val(url);
            $('#'+ element + ' .thumb').html(`<a class="fancybox" href="${url}"><img src="${thumb}"></a>`);
        }
    },

    FileManager.prototype.getThumb = function(url, type) {
        return url.replace('/images/full', '/images/'+ type)
    },

    //initilizing
    FileManager.prototype.init = function() {
        // this.load();
    },

    $.FileManager = new FileManager, $.FileManager.Constructor = FileManager
}(window.jQuery),

function ($) {
    "use strict";
    $.FileManager.init();
}(window.jQuery);
