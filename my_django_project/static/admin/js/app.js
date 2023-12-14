/*
Template Name: Ubold - Responsive Bootstrap 4 Admin Dashboard
Author: CoderThemes
Website: https://coderthemes.com/
Contact: support@coderthemes.com
File: Layout
*/

/**
 * LeftSidebar
 * @param {*} $
 */
!function ($) {
    'use strict';

    var LeftSidebar = function () {
        this.body = $('body'),
        this.window = $(window)
    };

    /**
     * Reset the theme
     */
    LeftSidebar.prototype._reset = function() {
        this.body.removeAttr('data-sidebar-color');
        this.body.removeAttr('data-sidebar-size');
        this.body.removeAttr('data-sidebar-showuser');
    },

    /**
     * Changes the color of sidebar
     * @param {*} color
     */
    LeftSidebar.prototype.changeColor = function(color) {
        this.body.attr('data-sidebar-color', color);
        this.parent.updateConfig("sidebar", { "color": color });
    },

    /**
     * Changes the size of sidebar
     * @param {*} size
     */
    LeftSidebar.prototype.changeSize = function(size) {
        this.body.attr('data-sidebar-size', size);
        this.parent.updateConfig("sidebar", { "size": size });
    },

    /**
     * Toggle User information
     * @param {*} showUser
     */
    LeftSidebar.prototype.showUser = function(showUser) {
        this.body.attr('data-sidebar-showuser', showUser);
        this.parent.updateConfig("sidebar", { "showuser": showUser });
    },

    /**
     * Initilizes the menu
     */
    LeftSidebar.prototype.initMenu = function() {
        var self = this;

        var layout = $.LayoutThemeApp.getConfig();
        var sidebar = $.extend({}, layout ? layout.sidebar: {});
        var defaultSidebarSize = sidebar.size ? sidebar.size : 'default';

        // resets everything
        this._reset();

        // Left menu collapse
        $('.button-menu-mobile').on('click', function (event) {
            event.preventDefault();
            var sidebarSize = self.body.attr('data-sidebar-size');
            if (self.window.width() >= 993) {
                if (sidebarSize === 'condensed') {
                    self.changeSize(defaultSidebarSize);
                } else {
                    self.changeSize('condensed');
                }
            } else {
                self.changeSize(defaultSidebarSize);
                self.body.toggleClass('sidebar-enable');
            }
        });

        // sidebar - main menu
        if ($("#side-menu").length) {
            var navCollapse = $('#side-menu li .collapse');

            // open one menu at a time only
            navCollapse.on({
                'show.bs.collapse': function (event) {
                    var parent = $(event.target).parents('.collapse.show');
                    $('#side-menu .collapse.show').not(parent).collapse('hide');
                }
            });

            // activate the menu in left side bar (Vertical Menu) based on url
            $("#side-menu a").each(function () {
                var pageUrl = window.location.href.split(/[?#]/)[0];
                if (this.href == pageUrl) {
                    $(this).addClass("active");
                    $(this).parent().addClass("menuitem-active");
                    $(this).parent().parent().parent().addClass("show");
                    $(this).parent().parent().parent().parent().addClass("menuitem-active"); // add active to li of the current link

                    var firstLevelParent = $(this).parent().parent().parent().parent().parent().parent();
                    if (firstLevelParent.attr('id') !== 'sidebar-menu')
                        firstLevelParent.addClass("show");

                    $(this).parent().parent().parent().parent().parent().parent().parent().addClass("menuitem-active");

                    var secondLevelParent = $(this).parent().parent().parent().parent().parent().parent().parent().parent().parent();
                    if (secondLevelParent.attr('id') !== 'wrapper')
                        secondLevelParent.addClass("show");

                    var upperLevelParent = $(this).parent().parent().parent().parent().parent().parent().parent().parent().parent().parent();
                    if (!upperLevelParent.is('body'))
                        upperLevelParent.addClass("menuitem-active");
                }
            });
        }


        // handling two columns menu if present
        var twoColSideNav = $("#two-col-sidenav-main");
        if (twoColSideNav.length) {
            var twoColSideNavItems = $("#two-col-sidenav-main .nav-link");
            var sideSubMenus = $(".twocolumn-menu-item");

            // showing/displaying tooltip based on screen size
            // if (this.window.width() >= 585) {
            //     twoColSideNavItems.tooltip('enable');
            // } else {
            //     twoColSideNavItems.tooltip('disable');
            // }

            var nav = $('.twocolumn-menu-item .nav-second-level');
            var navCollapse = $('#two-col-menu li .collapse');

            // open one menu at a time only
            navCollapse.on({
                'show.bs.collapse': function () {
                    var nearestNav = $(this).closest(nav).closest(nav).find(navCollapse);
                    if (nearestNav.length)
                        nearestNav.not($(this)).collapse('hide');
                    else
                        navCollapse.not($(this)).collapse('hide');
                }
            });

            twoColSideNavItems.on('click', function (e) {
                var target = $($(this).attr('href'));

                if (target.length) {
                    e.preventDefault();

                    twoColSideNavItems.removeClass('active');
                    $(this).addClass('active');

                    sideSubMenus.removeClass("d-block");
                    target.addClass("d-block");

                    // showing full sidebar if menu item is clicked
                    $.LayoutThemeApp.leftSidebar.changeSize('default');
                    return false;
                }
                return true;
            });

            // activate menu with no child
            var pageUrl = window.location.href; //.split(/[?#]/)[0];
            twoColSideNavItems.each(function () {
                if (this.href === pageUrl) {
                    $(this).addClass('active');
                }
            });


            // activate the menu in left side bar (Two column) based on url
            $("#two-col-menu a").each(function () {
                if (this.href == pageUrl) {
                    $(this).addClass("active");
                    $(this).parent().addClass("menuitem-active");
                    $(this).parent().parent().parent().addClass("show");
                    $(this).parent().parent().parent().parent().addClass("menuitem-active"); // add active to li of the current link

                    var firstLevelParent = $(this).parent().parent().parent().parent().parent().parent();
                    if (firstLevelParent.attr('id') !== 'sidebar-menu')
                        firstLevelParent.addClass("show");

                    $(this).parent().parent().parent().parent().parent().parent().parent().addClass("menuitem-active");

                    var secondLevelParent = $(this).parent().parent().parent().parent().parent().parent().parent().parent().parent();
                    if (secondLevelParent.attr('id') !== 'wrapper')
                        secondLevelParent.addClass("show");

                    var upperLevelParent = $(this).parent().parent().parent().parent().parent().parent().parent().parent().parent().parent();
                    if (!upperLevelParent.is('body'))
                        upperLevelParent.addClass("menuitem-active");

                    // opening menu
                    var matchingItem = null;
                    var targetEl = '#' + $(this).parents('.twocolumn-menu-item').attr("id");
                    $("#two-col-sidenav-main .nav-link").each(function () {
                        if ($(this).attr('href') === targetEl) {
                            matchingItem = $(this);
                        }
                    });
                    if (matchingItem) matchingItem.trigger('click');
                }
            });
        }
    },

    /**
     * Initilize the left sidebar size based on screen size
     */
    LeftSidebar.prototype.initLayout = function() {
        // in case of small size, activate the small menu
        if ((this.window.width() >= 768 && this.window.width() <= 1028) || this.body.data('keep-enlarged')) {
            this.changeSize('condensed');
        } else {
            this.changeSize('default');
        }
    },

    /**
     * Initilizes the menu
     */
    LeftSidebar.prototype.init = function() {
        var self = this;
        this.initMenu();
        this.initLayout();

        // on window resize, make menu flipped automatically
        this.window.on('resize', function (e) {
            e.preventDefault();
            self.initLayout();
        });
    },

    $.LeftSidebar = new LeftSidebar, $.LeftSidebar.Constructor = LeftSidebar
}(window.jQuery),


/**
 * Topbar
 * @param {*} $
 */
function ($) {
    'use strict';

    var Topbar = function () {
        this.body = $('body'),
        this.window = $(window)
    };

    /**
     * Initilizes the menu
     */
    Topbar.prototype.initMenu = function() {
        // Serach Toggle
        $('#top-search').on('click', function (e) {
            $('#search-dropdown').addClass('d-block');
        });

        // hide search on opening other dropdown
        $('.topbar-dropdown').on('show.bs.dropdown', function () {
            $('#search-dropdown').removeClass('d-block');
        });

        //activate the menu in topbar(horizontal menu) based on url
        $(".navbar-nav a").each(function () {
            var pageUrl = window.location.href.split(/[?#]/)[0];
            if (this.href == pageUrl) {
                $(this).addClass("active");
                $(this).parent().addClass("active");
                $(this).parent().parent().addClass("active");

                $(this).parent().parent().parent().addClass("active");
                $(this).parent().parent().parent().parent().addClass("active");
                if($(this).parent().parent().parent().parent().hasClass('mega-dropdown-menu')){
                    $(this).parent().parent().parent().parent().parent().addClass("active");
                    $(this).parent().parent().parent().parent().parent().parent().addClass("active");

                }else{
                    var child = $(this).parent().parent()[0].querySelector('.dropdown-item');
                    if(child){
                        var pageUrl = window.location.href.split(/[?#]/)[0];
                        if(child.href == pageUrl || child.classList.contains('dropdown-toggle'))
                            child.classList.add("active");
                    }
                }
                var el = $(this).parent().parent().parent().parent().addClass("active").prev();
                if (el.hasClass("nav-link"))
                    el.addClass('active');
            }
        });

        // Topbar - main menu
        $('.navbar-toggle').on('click', function (event) {
            $(this).toggleClass('open');
            $('#navigation').slideToggle(400);
        });


        //Horizontal Menu (For SM Screen)
        var AllNavs = document.querySelectorAll('ul.navbar-nav .dropdown .dropdown-toggle');

        var isInner = false;

        AllNavs.forEach(function(element) {
            element.addEventListener('click',function(event){
                if(!element.parentElement.classList.contains('nav-item')){
                    isInner = true;
                    element.parentElement.parentElement.classList.add('show');
                    var parent = element.parentElement.parentElement.parentElement.querySelector('.nav-link');
                    parent.ariaExpanded = true;
                    parent.classList.add("show");
                    bootstrap.Dropdown.getInstance(element).show();
                }
            });

            element.addEventListener('hide.bs.dropdown', function(event){
                if(isInner){
                    event.preventDefault();
                    event.stopPropagation();
                    isInner = false;
                }
            });
        });

    },

    /**
     * Changes the color of topbar
     * @param {*} color
     */
    Topbar.prototype.changeColor = function(color) {
        this.body.attr('data-topbar-color', color);
        this.parent.updateConfig("topbar", { "color": color });
    },

    /**
     * Initilizes the menu
     */
    Topbar.prototype.init = function() {
        this.initMenu();
    },
    $.Topbar = new Topbar, $.Topbar.Constructor = Topbar
}(window.jQuery),


/**
 * RightBar
 * @param {*} $
 */
function ($) {
    'use strict';

    var RightBar = function () {
        this.body = $('body'),
        this.window = $(window)
    };

    /**
     * Select the option based on saved config
    */
    RightBar.prototype.selectOptionsFromConfig = function() {
       var self = this;

        var config = self.layout.getConfig();

        if (config) {
            $('.right-bar input[type=checkbox]').prop('checked',false);
            $('input[type=checkbox][name=color-scheme-mode][value=' + config.mode + ']').prop('checked', true);
            $('input[type=checkbox][name=width][value=' + config.width + ']').prop('checked', true);
            $('input[type=checkbox][name=menus-position][value=' + config.menuPosition + ']').prop('checked', true);

            $('input[type=checkbox][name=leftsidebar-color][value=' + config.sidebar.color + ']').prop('checked', true);
            $('input[type=checkbox][name=leftsidebar-size][value=' + config.sidebar.size + ']').prop('checked', true);
            $('input[type=checkbox][name=leftsidebar-user]').prop('checked', config.sidebar.showuser);

            $('input[type=checkbox][name=topbar-color][value=' + config.topbar.color + ']').prop('checked', true);
        }
    },

    /**
     * Toggles the right sidebar
     */
    RightBar.prototype.toggleRightSideBar = function() {
        var self = this;
        self.body.toggleClass('right-bar-enabled');
        self.selectOptionsFromConfig();
    },

    /**
     * Initilizes the right side bar
     */
    RightBar.prototype.init = function() {
        var self = this;

        // right side-bar toggle
        $(document).on('click', '.right-bar-toggle', function () {
            self.toggleRightSideBar();
        });

        $(document).on('click', 'body', function (e) {
            // hiding search bar
            if($(e.target).closest('#top-search').length !== 1) {
                $('#search-dropdown').removeClass('d-block');
            }
            if ($(e.target).closest('.right-bar-toggle, .right-bar').length > 0) {
                return;
            }

            if ($(e.target).closest('.left-side-menu, .side-nav').length > 0 || $(e.target).hasClass('button-menu-mobile')
                || $(e.target).closest('.button-menu-mobile').length > 0) {
                return;
            }

            $('body').removeClass('right-bar-enabled');
            $('body').removeClass('sidebar-enable');
            return;
        });

        // overall color scheme
        $('input[type=checkbox][name=color-scheme-mode]').change(function () {
            self.layout.changeMode($(this).val(),true);
            self.selectOptionsFromConfig();

        });

        // width mode
        $('input[type=checkbox][name=width]').change(function () {
            self.layout.changeLayoutWidth($(this).val());
            self.selectOptionsFromConfig();

        });

        // menus-position
        $('input[type=checkbox][name=menus-position]').change(function () {
            self.layout.changeMenuPositions($(this).val());
            self.selectOptionsFromConfig();

        });

        // left sidebar color
        $('input[type=checkbox][name=leftsidebar-color]').change(function () {
            self.layout.leftSidebar.changeColor($(this).val());
            self.selectOptionsFromConfig();

        });

        // left sidebar size
        $('input[type=checkbox][name=leftsidebar-size]').change(function () {
            self.layout.leftSidebar.changeSize($(this).val());
            self.selectOptionsFromConfig();

        });

        // left sidebar user information
        $('input[type=checkbox][name=leftsidebar-user]').change(function (e) {
            self.layout.leftSidebar.showUser(e.target.checked);
            self.selectOptionsFromConfig();

        });

        // topbar
        $('input[type=checkbox][name=topbar-color]').change(function () {
            self.layout.topbar.changeColor($(this).val());
            self.selectOptionsFromConfig();


        });

        // reset
        $('#resetBtn').on('click', function (e) {
            e.preventDefault();
            // reset to default
            self.layout.reset();
            self.selectOptionsFromConfig();
        });
    },

    $.RightBar = new RightBar, $.RightBar.Constructor = RightBar
}(window.jQuery),


/**
 * Layout and theme manager
 * @param {*} $
 */

function ($) {
    'use strict';

    // Layout and theme manager

    var LayoutThemeApp = function () {
        this.body = $('body'),
        this.window = $(window),
        this.config = {},
        // styles
        this.defaultBSStyle = $("#bs-default-stylesheet"),
        this.defaultAppStyle = $("#app-default-stylesheet"),
        this.darkBSStyle = $("#bs-dark-stylesheet"),
        this.darkAppStyle = $("#app-dark-stylesheet");
    };

    /**
    * Preserves the config in memory
    */
    LayoutThemeApp.prototype._saveConfig = function(newConfig) {
        this.config = $.extend(this.config, newConfig);
        // NOTE: You can make ajax call here to save preference on server side or localstorage as well
    },

    /**
     * Update the config for given config
     * @param {*} param
     * @param {*} config
     */
    LayoutThemeApp.prototype.updateConfig = function(param, config) {
        var newObj = {};
        if (typeof config === 'object' && config !== null) {
            var originalParam = this.config[param];
            newObj[param] = $.extend(originalParam, config);
        } else {
            newObj[param] = config;
        }
        this._saveConfig(newObj);
    }

    /**
     * Loads the config - takes from body if available else uses default one
     */
     LayoutThemeApp.prototype.loadConfig = function() {
        var bodyConfig = JSON.parse(this.body.attr('data-layout') ? this.body.attr('data-layout') : '{}');

        var config = $.extend({}, {
            mode: "light",
            width: "fluid",
            menuPosition: 'fixed',
            sidebar: {
                color: "light",
                size: "default",
                showuser: false
            },
            topbar: {
                color: "dark"
            },
            showRightSidebarOnPageLoad: false
        });
        if (bodyConfig) {
            config = $.extend({}, config, bodyConfig);
        };
        return config;
    },

    /**
    * Apply the config
    */
    LayoutThemeApp.prototype.applyConfig = function() {
        // getting the saved config if available
        this.config = this.loadConfig();

        // activate menus
        this.leftSidebar.init();

        this.topbar.init();

        this.leftSidebar.parent = this;

        this.topbar.parent = this;


        // mode
        this.changeMode(this.config.mode);


        // width
        this.changeLayoutWidth(this.config.width);

        // menu position
        this.changeMenuPositions(this.config.menuPosition);

        // left sidebar
        var sidebarConfig = $.extend({}, this.config.sidebar);
        this.leftSidebar.changeColor(sidebarConfig.color);
        this.leftSidebar.changeSize(sidebarConfig.size);
        this.leftSidebar.showUser(sidebarConfig.showuser);

        // topbar
        var topbarConfig = $.extend({}, this.config.topbar);
        this.topbar.changeColor(topbarConfig.color);
    },

    /**
     * Toggle dark or light mode
     * @param {*} mode
     */
    LayoutThemeApp.prototype.changeMode = function(mode,fromCheckbox) {
        var self = this;

        // sets the theme
        switch (mode) {
            case "dark": {
                this.body.prepend("")
                this.body.css({'visibility': 'hidden', 'opacity': 0});
                this.defaultBSStyle.attr("disabled", true);
                this.defaultAppStyle.attr("disabled", true);

                this.darkBSStyle.attr("disabled", false);
                this.darkAppStyle.attr("disabled", false);

                setTimeout(function() {
                    self.body.css({'visibility': 'visible', 'opacity': 1});
                }, 500);

                if(fromCheckbox){
                    this.leftSidebar.changeColor("dark");
                    this._saveConfig({ mode: mode, sidebar: $.extend({}, this.config.sidebar, { color: 'dark' }) });
                }
                this._saveConfig({ mode: mode});
                break;
            }
            default: {
                this.body.css({'visibility': 'hidden', 'opacity': 0});
                this.defaultBSStyle.attr("disabled", false);
                this.defaultAppStyle.attr("disabled", false);

                this.darkBSStyle.attr("disabled", true);
                this.darkAppStyle.attr("disabled", true);

                setTimeout(function() {
                    self.body.css({'visibility': 'visible', 'opacity': 1});
                }, 500);

                if(fromCheckbox){
                this.leftSidebar.changeColor("light");
                this._saveConfig({ mode: mode, sidebar: $.extend({}, this.config.sidebar, { color: 'light' }) });
                }
                this._saveConfig({ mode: mode});
                break;
            }
        }

        this.rightBar.selectOptionsFromConfig();
    }

    /**
     * Changes the width of layout
     */
    LayoutThemeApp.prototype.changeLayoutWidth = function(width) {
        switch (width) {
            case "boxed": {
                this.body.attr('data-layout-width', 'boxed');
                // automatically activating condensed
                $.LeftSidebar.changeSize("condensed");
                this._saveConfig({ width: width });
                break;
            }
            default: {
                this.body.attr('data-layout-width', 'fluid');
                // automatically activating provided size
                var bodyConfig = JSON.parse(this.body.attr('data-layout') ? this.body.attr('data-layout') : '{}');
                $.LeftSidebar.changeSize(bodyConfig && bodyConfig.sidebar ? bodyConfig.sidebar.size : "default");
                this._saveConfig({ width: width });
                break;
            }
        }
        this.rightBar.selectOptionsFromConfig();
    }

    /**
     * Changes menu positions
     */
    LayoutThemeApp.prototype.changeMenuPositions = function(position) {
        this.body.attr("data-layout-menu-position", position);
        this._saveConfig({ menuPosition: position });

    }

    /**
     * Clear out the saved config
     */
    LayoutThemeApp.prototype.clearSavedConfig = function() {
        this.config = {};
    },

    /**
     * Gets the config
     */
    LayoutThemeApp.prototype.getConfig = function() {
        return this.config;
    },

    /**
     * Reset to default
     */
    LayoutThemeApp.prototype.reset = function() {
        this.clearSavedConfig();
        this.applyConfig();
    },

    // Active menu
    LayoutThemeApp.prototype.activeMenu = function() {
        const url = window.location.hash.trim();

        $('.topnav-menu a').each(function() {
            if($(this).attr('href') == url) {
                $(this).addClass('active').parents('li').addClass('active');
            }
        });
    },

    // Document resize
    LayoutThemeApp.prototype.resize = function() {
        let h_window = window.innerHeight;
        let h_topnav = $('.topnav').innerHeight();
        let h_page_title = $('.page-title').innerHeight();
        let h_page_filter = $('.card-filter').innerHeight();
        let h_pagination = $('.card-pagination').innerHeight();
        let h_table_list = h_window - h_page_filter - h_page_title - h_pagination - h_topnav - 40;
        $('#form-index .table-responsive').css({'min-height': h_table_list + 'px'});
    },

    // Init
    LayoutThemeApp.prototype.init = function() {
        // this.leftSidebar = $.LeftSidebar;
        // this.topbar = $.Topbar;

        // this.leftSidebar.parent = this;
        // this.topbar.parent = this;

        // this.applyConfig();

        this.activeMenu();
        this.resize();
        window.addEventListener('resize', function(event) {
            $.LayoutThemeApp.resize();
        }, true);
    },

    $.LayoutThemeApp = new LayoutThemeApp, $.LayoutThemeApp.Constructor = LayoutThemeApp
}(window.jQuery);
/*
Template Name: Ubold - Responsive Bootstrap 4 Admin Dashboard
Author: CoderThemes
Website: https://coderthemes.com/
Contact: support@coderthemes.com
File: Main Js File
*/

/**
 * Components
 * @param {*} $
 */
!function ($) {
    "use strict";

    var Components = function () { };

    //initializing tooltip
    Components.prototype.initTooltipPlugin = function () {
        $.fn.tooltip && $('[data-bs-toggle="tooltip"]').tooltip()
    },

    //initializing popover
    Components.prototype.initPopoverPlugin = function () {
        $.fn.popover && $('[data-bs-toggle="popover"]').popover()
    },

    //initializing toast
    Components.prototype.initToastPlugin = function() {
        $.fn.toast && $('[data-bs-toggle="toast"]').toast()
    },

    //initializing form validation
    Components.prototype.initFormValidation = function () {
        $(".needs-validation").on('submit', function (event) {
            $(this).addClass('was-validated');
            if ($(this)[0].checkValidity() === false) {
                event.preventDefault();
                event.stopPropagation();
                return false;
            }
            return true;
        });
    },

    // Counterup
    Components.prototype.initCounterUp = function() {
        var delay = $(this).attr('data-delay')?$(this).attr('data-delay'):100; //default is 100
        var time = $(this).attr('data-time')?$(this).attr('data-time'):1200; //default is 1200
         $('[data-plugin="counterup"]').each(function(idx, obj) {
            $(this).counterUp({
                delay: delay,
                time: time
            });
         });
    },

    //peity charts
    Components.prototype.initPeityCharts = function() {
        $('[data-plugin="peity-pie"]').each(function(idx, obj) {
            var colors = $(this).attr('data-colors')?$(this).attr('data-colors').split(","):[];
            var width = $(this).attr('data-width')?$(this).attr('data-width'):20; //default is 20
            var height = $(this).attr('data-height')?$(this).attr('data-height'):20; //default is 20
            $(this).peity("pie", {
                fill: colors,
                width: width,
                height: height
            });
        });
        //donut
         $('[data-plugin="peity-donut"]').each(function(idx, obj) {
            var colors = $(this).attr('data-colors')?$(this).attr('data-colors').split(","):[];
            var width = $(this).attr('data-width')?$(this).attr('data-width'):20; //default is 20
            var height = $(this).attr('data-height')?$(this).attr('data-height'):20; //default is 20
            $(this).peity("donut", {
                fill: colors,
                width: width,
                height: height
            });
        });

        $('[data-plugin="peity-donut-alt"]').each(function(idx, obj) {
            $(this).peity("donut");
        });

        // line
        $('[data-plugin="peity-line"]').each(function(idx, obj) {
            $(this).peity("line", $(this).data());
        });

        // bar
        $('[data-plugin="peity-bar"]').each(function(idx, obj) {
            var colors = $(this).attr('data-colors')?$(this).attr('data-colors').split(","):[];
            var width = $(this).attr('data-width')?$(this).attr('data-width'):20; //default is 20
            var height = $(this).attr('data-height')?$(this).attr('data-height'):20; //default is 20
            $(this).peity("bar", {
                fill: colors,
                width: width,
                height: height
            });
         });
    },

    Components.prototype.initKnob = function() {
        $('[data-plugin="knob"]').each(function(idx, obj) {
           $(this).knob();
        });
    },

    Components.prototype.initTippyTooltips = function () {
        if($('[data-plugin="tippy"]').length > 0){
            tippy('[data-plugin="tippy"]');
        }
    },

    Components.prototype.initShowPassword = function () {
        $("[data-password]").on('click', function() {
            if($(this).attr('data-password') == "false"){
                $(this).siblings("input").attr("type", "text");
                $(this).attr('data-password', 'true');
                $('i', this).addClass("fa-eye").removeClass('fa-eye-slash');
            } else {
                $(this).siblings("input").attr("type", "password");
                $(this).attr('data-password', 'false');
                $('i', this).addClass("fa-eye-slash").removeClass('fa-eye');
            }
        });
    },

    Components.prototype.initMultiDropdown = function () {
        $('.dropdown-menu a.dropdown-toggle').on('click', function(e) {
            if (!$(this).next().hasClass('show')) {
              $(this).parents('.dropdown-menu').first().find('.show').removeClass("show");
            }
            var $subMenu = $(this).next(".dropdown-menu");
            $subMenu.toggleClass('show');

            return false;
        });
    },

    //initilizing
    Components.prototype.init = function () {
        this.initTooltipPlugin(),
        this.initPopoverPlugin(),
        this.initToastPlugin(),
        this.initFormValidation(),
        this.initCounterUp(),
        this.initPeityCharts(),
        this.initKnob();
        this.initTippyTooltips();
        this.initShowPassword();
        this.initMultiDropdown();
    },

    $.Components = new Components, $.Components.Constructor = Components

}(window.jQuery),

/**
 * Portlet
 * @param {*} $
 */
function($) {
    "use strict";

    /**
    Portlet Widget
    */
    var Portlet = function() {
        this.$body = $("body"),
        this.$portletIdentifier = ".card",
        this.$portletCloser = '.card a[data-toggle="remove"]',
        this.$portletRefresher = '.card a[data-toggle="reload"]'
    };

    //on init
    Portlet.prototype.init = function() {
        // Panel closest
        var $this = this;
        $(document).on("click",this.$portletCloser, function (ev) {
            ev.preventDefault();
            var $portlet = $(this).closest($this.$portletIdentifier);
                var $portlet_parent = $portlet.parent();
            $portlet.remove();
            if ($portlet_parent.children().length == 0) {
                $portlet_parent.remove();
            }
        });

        // Panel Reload
        $(document).on("click",this.$portletRefresher, function (ev) {
            ev.preventDefault();
            var $portlet = $(this).closest($this.$portletIdentifier);
            // This is just a simulation, nothing is going to be reloaded
            $portlet.append('<div class="card-disabled"><div class="card-portlets-loader"></div></div>');
            var $pd = $portlet.find('.card-disabled');
            setTimeout(function () {
                $pd.fadeOut('fast', function () {
                    $pd.remove();
                });
            }, 500 + 300 * (Math.random() * 5));
        });
    },

    $.Portlet = new Portlet, $.Portlet.Constructor = Portlet

}(window.jQuery),

/**
 * Dragula
 * @param {*} $
 */
function ($) {
    "use strict";

    var Dragula = function () {
        this.$body = $("body")
    };

    /* Initializing */
    Dragula.prototype.init = function () {
        $('[data-plugin="dragula"]').each(function () {
            var containersIds = $(this).data("containers");
            var containers = [];
            if (containersIds) {
                for (var i = 0; i < containersIds.length; i++) {
                    containers.push($("#" + containersIds[i])[0]);
                }
            } else {
                containers = [$(this)[0]];
            }

            // if handle provided
            var handleClass = $(this).data("handleclass");

            // init dragula
            if (handleClass) {
                dragula(containers, {
                    moves: function (el, container, handle) {
                        return handle.classList.contains(handleClass);
                    }
                });
            } else {
                dragula(containers);
            }
            
        });

    },

    //init dragula
    $.Dragula = new Dragula, $.Dragula.Constructor = Dragula

}(window.jQuery),

/**
 * NotificationApp
 * @param {*} $
 */
function($) {
    'use strict';

    var NotificationApp = function() {
    };


    /**
     * Send Notification
     * @param {*} type e.g error, info, warning, success
     * @param {*} body body text
     * @param {*} options object key e.g position, hideAfter, stack, heading, showHideTransition
     */
    NotificationApp.prototype.send = function(type, body, options={}) {
        let position = options.position ? options.position : 'bottom-center';
        let hideAfter = options.hideAfter ? options.hideAfter : 5000;
        let stack = options.stack ? options.stack : 20;
        let loader = options.loader ? options.loader : false;
        let loaderBg = options.loaderBg ? options.loaderBg : '#FFFFFF';
        let textAlign = options.textAlign ? options.textAlign : 'center';

        var config = {
            text: body,
            icon: type,
            position: position,
            hideAfter: hideAfter,
            stack: stack,
            loader: loader,
            loaderBg: loaderBg,
            textAlign: textAlign
        };

        if (options.heading) config.heading = options.heading;
        if (options.showHideTransition) config.showHideTransition = options.showHideTransition;

        // $.toast().reset('all');
        $.toast(config);
    },

    $.NotificationApp = new NotificationApp, $.NotificationApp.Constructor = NotificationApp

}(window.jQuery),

/**
 * Gallery
 * @param {*} $
 */
function($) {
    "use strict";

    var Gallery = function() {
    };

    // Submit form filter
    Gallery.prototype.load = function() {
        Fancybox.bind("a.fancybox", {});
    },

    // On init
    Gallery.prototype.init = function() {
        this.load();
    },

    $.Gallery = new Gallery, $.Gallery.Constructor = Gallery

}(window.jQuery),

/**
 * Modal
 * @param {*} $
 */
function($) {
    'use strict';

    var Modal = function() {
    };

    Modal.prototype.create = function(modal_id, title, content, is_form=true, options = {}) {
        const width = options.width ? options.width : 'modal-md';
        const submit_text = options.submit_text ? options.submit_text : 'Lưu';
        const btn_save = is_form ? `<button type="button" class="btn save btn-blue waves-effect waves-light"><i class="fa-regular fa-check me-1"></i> ${submit_text}</button>` : '';
        let modal_header = ''
        if (title){
            modal_header = `<div class="modal-header">
                <h4 class="modal-title">${title}</h4>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>`;
        } else {
            modal_header = '<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>';
        }
        let class_extend = is_form ? 'modal-form' : '';
        const xhtml = `<div id="${modal_id.replace('#', '')}" class="modal fade ${class_extend}" tabindex="-1" role="dialog" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered ${width}">
                <div class="modal-content">
                    ${modal_header}
                    <div class="modal-body box-content">
                        ${content}
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-light" data-bs-dismiss="modal"><i class="fa-regular fa-xmark me-1"></i> Đóng</button>
                        ${btn_save}
                    </div>
                </div>
            </div>
        </div>`;

        if($(modal_id).length) $(modal_id).remove();
        $('body').append(xhtml);
        
        const modal = new bootstrap.Modal(modal_id, {'backdrop': true});
        modal.show();
        if (content) $.Form.initBox($(modal_id));
        return modal;
    },

    Modal.prototype.notify = function(title, content, options = {}) {
        var modal_id = '#modal-notify';
        let width = options.width ? options.width : 'modal-md';

        let xhtml = `<div id="modal-notify" class="modal fade" tabindex="-1" role="dialog" aria-hidden="true">
                        <div class="modal-dialog modal-dialog-centered ${width}">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h4 class="modal-title">${title}</h4>
                                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div class="modal-body">
                                    ${content}
                                </div>
                                <div class="modal-footer">
                                    <button type="button" class="btn btn-light" data-bs-dismiss="modal">Đóng</button>
                                </div>
                            </div>
                        </div>
                    </div>`;

        if($(modal_id).length) $(modal_id).remove();
        $('body').append(xhtml);
        
        let modal = new bootstrap.Modal(modal_id, {'backdrop': true});
        modal.show();

        return modal;
    },

    Modal.prototype.alert = function(content, type) {
        var modal_id = '#modal-alert';

        let icon = '<i class="fe-check-circle h1 text-white"></i>';
        let title = 'Thông báo';
        if(type == 'warning') {
            icon = '<i class="fe-alert-triangle h1 text-white"></i>';
            title = 'Cảnh báo';
        } else if (type == 'info') {
            icon = '<i class="fe-info h1 text-white"></i>';
            title = 'Thông tin';
        } else if (type == 'danger') {
            icon = '<i class="fe-slash h1 text-white"></i>';
            title = 'Thông báo';
        }
        
        let xhtml = `<div id="modal-alert" class="modal fade" tabindex="-1" role="dialog" aria-hidden="true">
                        <div class="modal-dialog modal-sm modal-dialog-centered">
                            <div class="modal-content modal-filled bg-${type}">
                                <div class="modal-body p-4">
                                    <div class="text-center">
                                        ${icon}
                                        <h4 class="mt-2 text-white">${title}</h4>
                                        <p class="mt-3 text-white">${content}</p>
                                        <button type="button" class="btn btn-light my-2" data-bs-dismiss="modal">Đóng</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>`;

        if($(modal_id).length) $(modal_id).remove();
        $('body').append(xhtml);
        
        let modal = new bootstrap.Modal(modal_id, {'backdrop': true});
        modal.show();

        return modal;
    },

    Modal.prototype.popupImage = function(url, options = {}) {
        var modal_id = '#modal-image';
        let width = options.width ? options.width : 'modal-xl';

        let xhtml = `<div id="modal-image" class="modal fade" tabindex="-1" role="dialog" aria-hidden="true">
                        <div class="modal-dialog modal-dialog-centered modal-xl justify-content-center">
                            <div class="modal-content flex-row w-auto">
                                <img src="${url}">
                            </div>
                        </div>
                    </div>`;

        if($(modal_id).length) $(modal_id).remove();
        $('body').append(xhtml);
        
        let modal = new bootstrap.Modal(modal_id, {'backdrop': true});
        modal.show();

        return modal;
    },

    Modal.prototype.custom = function(content, options = {}) {
        var modal_id = `#${options.modal_id ? options.modal_id : 'modal-notify'}`;
        var type_modal = options.type_modal ? options.type_modal : 'modal-right';
        let width = options.width ? options.width : 'modal-sm';
        let style = options.style ? options.style : '';
        
        let xhtml = `<div id=${modal_id.replace('#', '')} class="modal fade" tabindex="-1" role="dialog" aria-hidden="true">
                        <div class="modal-dialog ${type_modal} ${width}" style="${style}">
                        <div class="modal-content">
                        <div class="border-0">
                        ${content}
                    </div>
                        </div>
                    </div>`;

        if($(modal_id).length) $(modal_id).remove();
        $('body').append(xhtml);
        
        let modal = new bootstrap.Modal(modal_id, {'backdrop': true});
        modal.show();

        return modal;
    },

    
    Modal.prototype.callView = async function(url, title='', is_form=false) {
        const modal_id = '#modal-call-view';
        url = $.App.urlAdmin(url);
        const modal = $.Modal.create(modal_id, title, '', is_form, {'width': 'modal-xl'});
        $(`${modal_id} .modal-body`).addClass('box-content').attr('view-url', url);
        await $.App.loadBoxContent($(`${modal_id} .modal-body`), url=url);
        $(modal_id).on('hide.bs.modal', function(){
            $(this).remove();
        });
        return modal;
    },
    Modal.prototype.callFormView = async function(url, parent_box_id='', title = '', initial={}) {
        const modal = await this.callView(url, title, true);
        const modal_id = '#modal-call-view';
        if (Object.keys(initial).length) {
            Object.keys(initial).forEach(key => {
                if ($(`${modal_id} [name="${key}"]`).length && !$(`${modal_id} [name="${key}"]`).val()) {
                    $(`${modal_id} [name="${key}"]`).val(initial[key]).trigger('change');
                    // $.Form.ckeditorRebuild()
                }
            });
        }
        $(`${modal_id} .btn.save`).click(function() {
            var form_data = $(`${modal_id} form`).serialize();
            $.ajax({
                type: 'POST',
                url: $.App.urlAdmin(url),
                data: form_data,
                beforeSend: function() {
                    $.App.loader();
                    $.Form.hideError($(`${modal_id} form`));
                },
                success: function(res) {
                    if (res.success) {
                        $.NotificationApp.send('success', res.message, {stack: 1});
                        modal.hide();
                        if (parent_box_id) {
                            $.App.loadBoxContent($(parent_box_id));
                        } else {
                            $.App.load();
                        }
                        $.App.loader('hide');
                        return;
                    }
                    if (res.hasOwnProperty('notify') && res.notify) {
                        $.NotificationApp.send('error', res.message, {stack: 1});
                    } else {
                        $.Form.showError(res.message, 'errors' in res ? res.errors : [], $(`${modal_id} form`));
                    }
                    $.App.loader('hide');
                },
                error: function () {
                    $.App.loader('hide');
                }
            });
        });
    },

    Modal.prototype.callDelete = async function(url, data=[], parent_box_id='') {
        if (!data) {
            $.NotificationApp.send('error', 'Không có phần tử được chọn', {stack: 1});
            return;
        }
        const modal_id = '#modal-delete';
        const modal_content = '<div class="alert alert-danger border-0" role="alert">Bạn có chắc chắn muốn xoá <b>'+ data.length +'</b> phần tử đã chọn? <br>Sau khi xoá sẽ không thể khôi phục lại</div>';
        const modal = this.create(modal_id, 'Xoá dữ liệu', modal_content, {'submit_text': 'Xác nhận xoá'});

        $(modal_id).on('click', '.btn.save', function(e) {
            e.preventDefault();
            var form_data = new FormData();
            form_data.append('csrfmiddlewaretoken', csrftoken);
            data.forEach(val => {
                form_data.append('ids', val);
            });
            $.ajax({
                type: 'POST',
                url: $.App.urlAdmin(url),
                data: form_data,
                dataType: 'json',
                contentType: false,
                processData: false,
                beforeSend: function() {
                    $.App.loader();
                }
            }).done(function(res) {
                if (res.success) {
                    $.NotificationApp.send('success', res.message, {stack: 1});
                    modal.hide();
                    if (parent_box_id) {
                        $.App.loadBoxContent($(parent_box_id));
                    } else {
                        $.App.load();
                    }
                    $.App.loader('hide');
                    return;
                }
                $.App.loader('hide');
            });
        });
    },

    $.Modal = new Modal, $.Modal.Constructor = Modal
}(window.jQuery),

/**
 * Form
 * @param {*} $
 */
function($) {
    "use strict";

    var Form = function() {
        
    };

    // Selectize
    Form.prototype.autonumber = function(element=null) {
        if (!element) element = $('.autonumber');
        if (!element.length) return;
        element.each(function(i, e) {
            let config = {
                decimalPlaces: 0
            }
            new AutoNumeric(e, config);
        });
    },

    // Selectize
    Form.prototype.selectize = function() {
        $.each($('.selectize-select'), function() {
            let $this = $(this);
            let id = $this.attr('id');
            if (!id) return false;
            
            let configs = {}
            if($this.hasClass('ajax')) {
                configs = {
                    valueField: "id",
                    labelField: 'text',
                    searchField: "text",
                    create: false,
                    preload: true,
                    load: function (query, callback) {
                        // if (!query.length) return callback();
                        $.ajax({
                            url: $this.data('ajax-url') ? $this.data('ajax-url') : `/${$.App.apiPrefix}/select-category/`,
                            type: "GET",
                            error: function () {
                                callback();
                            },
                            success: function (res) {
                                callback(res.data);
                            },
                        });
                    },
                };
            } else {
                configs = {
                    create: false,
                    // sortField: {
                    //     field: 'text',
                    //     direction: 'asc'
                    // },
                    // dropdownParent: 'body'
                }
            }

            // configs.placeholder = $this.attr('placeholder') ? $this.attr('placeholder') : 'Chọn'
            $('#'+ id).selectize(configs);
        });
    },

    // Select2
    Form.prototype.select2 = function(element=null, type=null) {
        if(!element) element = $('.select2');
        if (!element.length) return;
        if (!type) {
            element.each(function() {
                let config = {
                    width: '100%',
                    language: 'vi'
                };
                const ajax_url = $(this).attr('ajax-url');
                if (ajax_url) {
                    config['minimumInputLength'] = 3;
                    config['allowClear'] = true;
                    config['placeholder'] = '- Chọn -';
                    config['ajax'] = {
                        delay: 500,
                        url: $.App.urlAdmin(ajax_url),
                        dataType: 'json',
                        data: function (params) {
                            var query = {
                              keyword: params.term,
                            }
                            return query;
                        },
                        processResults: function (res, params) {
                            const data = res.data || []
                            return {
                                results: $.map(data, function (item) {
                                    return {
                                        text: item.label,
                                        id: item.value
                                    };
                                })
                            };
                        }
                    };
                }
                $(this).select2(config);
            });
            return;
        }
        element.select2(type);
    },

    Form.prototype.rebuildSelect2 = function(element, options=null) {
        if (!element.length) return;
        element.select2('destroy');
        if (options) {
            let option_html = '';
            options.forEach(item => {
                option_html += '<option value="'+ item['value'] +'">'+ item['label'] +'</option>';
            });
            element.html(option_html);
        }
        this.select2(element);
    },


    // Alias
    Form.prototype.init_alias = function(box=null) {
        if (!box) box = $('body');
        // Change name
        box.find('[name="name"], input[alias-to]').on('change', function() {
            const name = $(this).attr('name');
            const alias = $(this).attr('alias-to') || 'slug';
            $.Form.alias(box.find('[name="'+ name +'"]'), box.find('[name="'+ alias +'"]'));
        });
    }
    Form.prototype.alias = function(fromElement=null, toElement=null, reload = false) {
        if (!fromElement) fromElement = $('[name="name"]');
        if (!toElement) toElement = $('[name="slug"]');
        if(fromElement.length && toElement.length) {
            if(toElement.val() == '' || reload == true) {
                toElement.val(this.convertAlias(fromElement.val()));
            }
        }
    },
    Form.prototype.convertAlias = function(val) {
        val = val.trim();
        val = val.toLowerCase();
        val = val.replace(/à|ả|ã|á|ạ|ă|ằ|ẳ|ẵ|ắ|ặ|â|ầ|ẩ|ẫ|ấ|ậ/g,"a");
        val = val.replace(/è|ẻ|ẽ|é|ẹ|ê|ề|ể|ễ|ế|ệ/g,"e");
        val = val.replace(/ì|ỉ|ĩ|í|ị/g,"i");
        val = val.replace(/ò|ỏ|õ|ó|ọ|ô|ồ|ổ|ỗ|ố|ộ|ơ|ờ|ở|ỡ|ớ|ợ/g,"o");
        val = val.replace(/ù|ủ|ũ|ú|ụ|ư|ừ|ử|ữ|ứ|ự/g,"u");
        val = val.replace(/ỳ|ỷ|ỹ|ý/g,"y");
        val = val.replace(/đ/g,"d");
        val = val.replace(/!|@|\$|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'| |\"|\“|\”|\&|\#|\[|\]|~/g,"-");
        val = val.replace(/-+-/g,"-");
        val = val.replace(/^\-+|\-+$/g,"");
        return val
    },

    // Picker
    Form.prototype.datepicker = function (element=null, type=null) {
        flatpickr.localize(flatpickr.l10ns.vn);
        flatpickr.l10ns.default.firstDayOfWeek = 1;
        if (!element && !type){
            $('.datepicker-default').flatpickr({
            });
            $('.datepicker-range').flatpickr({
                mode: "range",
            });
            return;
        }
        if (!element) element = type=='range' ? $('.datepicker-range') : $('.datepicker-default');
        if (!element.length) return;
        let config = {};
        if (type == 'range') {
            config['mode'] = 'range';
        }
        element.flatpickr(config);
    },

    // Picker
    Form.prototype.datetimepicker = function (element=null) {
        if (!element) element = $('.datepicker-datetime');
        if (!element.length) return;
        flatpickr.localize(flatpickr.l10ns.vn);
        flatpickr.l10ns.default.firstDayOfWeek = 1;
        element.flatpickr({
            enableTime: true,
            time_24hr: true,
            dateFormat: 'Y-m-d H:i:S',
            enableSeconds:true
        });
    },

    // Form mask
    Form.prototype.inputMask = function (element=null) {
        if (!element) element = $('[data-toggle="input-mask"]');
        if (!element.length) return;
        element.each(function (idx, obj) {
            var maskFormat = $(obj).data("maskFormat");
            var reverse = $(obj).data("reverse");
            if (reverse != null)
                $(obj).mask(maskFormat, {'reverse': reverse});
            else
                $(obj).mask(maskFormat);
        });
    },

    // Ckeditor
    Form.prototype.ckeditor = function (element=null) {
        if (!element) element = $('.editor');
        if (!element.length) return;
        
        window.editor = {};
        const simple_toolbar = {
            items: [
                'undo', 'redo',
                // '|', 'heading',
                // '|', 'fontfamily', 'fontsize', //'fontColor', 'fontBackgroundColor',
                '|', 'bold', 'italic', 'strikethrough',
                // '|', 'bulletedList', 'numberedList', 'todoList', 'outdent', 'indent'
            ],
            shouldNotGroupWhenFull: true
        }
        element.each(function() {
            let config = { licenseKey: '', }
            const is_simple_editor = Boolean($(this).attr('simple-editor'));
            if (is_simple_editor) {
                config['toolbar'] = simple_toolbar;
                config['sanitizer'] = {
                    rules: {
                        elements: {
                            // Chỉ chấp nhận các thẻ trong danh sách này
                            $: ['p', 'strong', 's', 'i', 'b', 'span'],
                        },
                    },
                };
                config['clipboard'] = {
                    pastePlainText: true
                };
            }
            ClassicEditor
                .create(document.querySelector('#'+ $(this).attr('id')), config)
                .then(editor => {
                    window.editor[$(this).attr('name')] = editor;
                    editor.model.document.on('change:data', () => {
                        editor.updateSourceElement();
                    })
                })
                .catch(error => {
                    console.error(error);
                });
        });
    },
    // Form.prototype.ckeditorRebuild = function () {
    //     if (window.editor) {
    //         window.editor.destroy().then(() => {
    //             window.editor = null;
    //             // Phiên bản CKEditor đã được hủy
    //             this.ckeditor()
    //         }).catch(error => {
    //             console.error('Lỗi khi hủy phiên bản CKEditor:', error);
    //         });
    //     } else {
    //         this.ckeditor()
    //     }
    // }

    // Get Cookie
    Form.prototype.getCookie = function (name) {
        var cookieValue = null;
        if (document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    },

    // Hide error
    Form.prototype.hideError = function(form=null) {
        if (form) {
            form.find('#page-error').remove();
            form.find('.input-error .error').remove();
            form.find('.input-error').removeClass('input-error');
            return;
        }
        $('#page-error').remove();
        $('.input-error .error').remove();
        $('.input-error').removeClass('input-error');
    },

    // Show error
    Form.prototype.showError = function(error_message, errors=[], form=null) {
        if(!error_message) error_message = 'Có lỗi xảy ra! Vui lòng kiểm tra lại dữ liệu nhập.';
        const alert = '<div id="page-error" class="alert alert-danger alert-dismissible border-0">'+ error_message +'<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>';
        if (form) {
            form.prepend(alert);
        } else {
            $('#page-title').after(alert);
        }
        $.each(errors, function(key, val) {
            if (form) {
                form.find('#input-'+ key).addClass('input-error').append('<div class="error">'+ val[0] +'</div>');
            } else {
                $('#input-'+ key).addClass('input-error').append('<div class="error">'+ val[0] +'</div>');
            }
        })
    },

    // Submit form
    Form.prototype.submit = function(context={}, form=null) {
        if (!form) form = $('form.form-data')[0];
        const router = window.location.hash.trim();
        const current_hash = router.slice(1, router.length);
        let url = context.url ? context.url : current_hash;
        let formData = new FormData(form);
        // Check đúng editor của form này thì mới cho update
        if(window.editor){
            Object.keys(window.editor).forEach(key => {
                const item = window.editor[key];
                if ($(item.sourceElement.form).attr('id') != $(form).attr("id") || !formData || !formData.has(key)) return;
                formData.set(key, item.getData());
            });
        }

        if(context.view) formData.append('view', context.view);
        $.ajax({
            type: 'POST',
            url: url,
            data: formData,
            dataType: 'json',
            contentType: false,
            processData: false,
            beforeSend: function() {
                $.App.loader();
                $.Form.hideError();
            }
        }).done(function(res) {
            if(!res.hasOwnProperty('success') || !res.success) {
                if (res.hasOwnProperty('notify') && res.notify) {
                    $.NotificationApp.send('error', res.message, {stack: 1});
                } else {
                    $.Form.showError(res.message, 'errors' in res ? res.errors : []);
                }
            } else {
                $.NotificationApp.send('success', res.message, {stack: 1});
                if(res.next_url && current_hash != res.next_url) {
                    window.location.hash = $.App.urlAdmin(res.next_url);
                    return true;
                }
                $.App.load();
            }
            $.App.loader('hide');
        });
    },

    // Dynamic add field
    Form.prototype.dynamicAddField = function() {
        const box_id = '#dynamic-field';
        const fields = {
            'code': 'Mã',
            'phone': 'Điện thoại',
            'email': 'Email',
            'address': 'Địa chỉ',
            'image': 'Hình ảnh',
            'description': 'Mô tả',
            'content': 'Nội dung',
            'value': 'Giá trị khác',
            'parent_id': 'Lựa chọn',
        };
        
        let modal_id = '#modal-dynamic';
        let modal_content = '';
        $.each(fields, function(key, val) {
            if(!$('[name="fields_name_'+ key +'"]').length) {
                modal_content += `<div class="form-check m-1">
                                    <input name="list_field" type="checkbox" class="form-check-input" id="check-${key}" value="${key}">
                                    <label class="form-check-label" for="check-${key}">${val} - ${key}</label>
                                </div>`;
            }
        });
        let modal = $.Modal.create(modal_id, 'Thêm', modal_content);

        $(modal_id).on('click', '.btn.save', function(e) {
            e.preventDefault();
            let form_fields = '';
            $(modal_id + ' [name="list_field"]').each(function () { 
                if ($(this).is(':checked')) {
                    let name = $(this).val();
                    let field_item = `
                        <div class="col-12 col-md-4 col-xl-4">
                            <div class="form-group">
                                <label class="form-label">Tên hiển thị</label>
                                <div class="input">
                                    <input type="text" name="fields_label_${name}" value="${fields[name]}" class="form-control">
                                </div>
                            </div>
                        </div>
                        <div class="col-12 col-md-4 col-xl-2 offset-xl-1">
                            <div class="form-group">
                                <label class="form-label">Tên trường</label>
                                <div class="input">
                                    ${name}
                                    <input type="hidden" name="fields_name_${name}" value="${name}">
                                </div>
                            </div>
                        </div>
                        <div class="col-12 col-md-4 col-xl-2">
                            <div class="form-group">
                                <label class="form-label">Bắt buộc nhập</label>
                                <div class="input">
                                    <div class="form-check form-switch"><input type="checkbox" name="fields_required_${name}" value="True" class="form-check-input"></div>
                                </div>
                            </div>
                        </div>
                        <div class="col-12 col-md-4 col-xl-2">
                            <div class="form-group">
                                <label class="form-label">Hiển thị ngoài danh sách</label>
                                <div class="input">
                                    <div class="form-check form-switch"><input type="checkbox" name="fields_list_${name}" value="True" class="form-check-input"></div>
                                </div>
                            </div>
                        </div>
                        <div class="col-12 col-md-4 col-xl-1">
                            <div class="form-group">
                                <label class="form-label">Xoá</label>
                                <div class="input">
                                    <a href="javascript:;" style="font-size: 20px;" onclick="$(this).parents('.row:first').remove()"><i class="fa-regular fa-trash-can text-danger"></i></a>
                                </div>
                            </div>
                        </div>
                    `;
                    form_fields += `<div class="row">${field_item}<div class="col-12"><hr class="mt-0 mb-2"></div></div>`;
                }
            });

            $(box_id).append(form_fields);
            modal.hide();
        });
    },

    // Form add field
    Form.prototype.formAddField = function() {
        const box_id = '#form-field';
        const fields = {
            'name': 'Họ tên',
            'phone': 'Điện thoại',
            'email': 'Email',
            'address': 'Địa chỉ',
            'product': 'Sản phẩm',
        };
        
        let modal_id = '#modal-form';
        let modal_content = '';
        $.each(fields, function(key, val) {
            if(!$('[name="fields_name_'+ key +'"]').length) {
                modal_content += `<div class="form-check m-1">
                                    <input name="list_field" type="checkbox" class="form-check-input" id="check-${key}" value="${key}">
                                    <label class="form-check-label" for="check-${key}">${val} - ${key}</label>
                                </div>`;
            }
        });
        let modal = $.Modal.create(modal_id, 'Thêm', modal_content);

        $(modal_id).on('click', '.btn.save', function(e) {
            e.preventDefault();
            let form_fields = '';
            $(modal_id + ' [name="list_field"]').each(function () { 
                if ($(this).is(':checked')) {
                    let name = $(this).val();
                    let field_item = '';
                    field_item += `<div class="col-12 col-md-4 col-xl-4">
                                        <div class="form-group">
                                            <label class="form-label">Tên hiển thị</label>
                                            <div class="input">
                                                <input type="text" name="fields_label_${name}" value="${fields[name]}" class="form-control">
                                            </div>
                                        </div>
                                    </div>`;
                    field_item += `<div class="col-12 col-md-4 col-xl-1"></div>`;
                    field_item += `<div class="col-12 col-md-4 col-xl-2">
                                        <div class="form-group">
                                            <label class="form-label">Tên trường</label>
                                            <div class="input">
                                                ${name}
                                                <input type="hidden" name="fields_name_${name}" value="${name}">
                                            </div>
                                        </div>
                                    </div>`;
                    field_item += `<div class="col-12 col-md-4 col-xl-2">
                                        <div class="form-group">
                                            <label class="form-label">Bắt buộc nhập</label>
                                            <div class="input">
                                                <div class="form-check form-switch"><input type="checkbox" name="fields_required_${name}" value="True" class="form-check-input"></div>
                                            </div>
                                        </div>
                                    </div>`;
                    field_item += `<div class="col-12 col-md-4 col-xl-2">
                                        <div class="form-group">
                                            <label class="form-label">Hiển thị ngoài danh sách</label>
                                            <div class="input">
                                                <div class="form-check form-switch"><input type="checkbox" name="fields_list_${name}" value="True" class="form-check-input"></div>
                                            </div>
                                        </div>
                                    </div>`;
                    field_item += `<div class="col-12 col-md-4 col-xl-1">
                                        <div class="form-group">
                                            <label class="form-label">Xoá</label>
                                            <div class="input">
                                                <a href="javascript:;" style="font-size: 20px;" onclick="$(this).parents('.row:first').remove()"><i class="fa-regular fa-trash-can"></i></a>
                                            </div>
                                        </div>
                                    </div>`;
                    
                    form_fields += '<div class="row">'+ field_item +'<div class="col-12"><hr class="mt-0 mb-2"></div></div>';
                }
            });

            $(box_id).append(form_fields);
            modal.hide();
        });
    },

    // Load location
    Form.prototype.loadSelectLocation = function(parent_id, child_input_name=null) {
        if (!child_input_name) child_input_name = 'province_id';
        let type = 'province';
        if (child_input_name.includes('district')) type = 'district';
        if (child_input_name.includes('ward')) type = 'ward';
        
        const selector_name = `select[name="${child_input_name}"]`;
        const emptyOption = {'value': '', 'label': '- Chọn -'};
        if (['province', 'district'].includes(type)) {
            if (type == 'province') {
                let selector_child = selector_name.replace(type, 'district');
                $.Form.rebuildSelect2($(selector_child), [emptyOption]);
            }
            let selector_ward = selector_name.replace(type, 'ward');
            $.Form.rebuildSelect2($(selector_ward), [emptyOption]);
        }
        if (!parent_id) {
            $.Form.rebuildSelect2($(selector_name), [emptyOption]);
            return;
        }
        $.ajax({
            type: 'GET',
            url: `${$.App.apiPrefix}/select-location`,
            data: {
                type: type,
                parent_id: parent_id
            },
            dataType: 'json',
            beforeSend: function() {
                $.App.loader();
            },
        }).done(function(res) {
            $.Form.rebuildSelect2($(selector_name), res.data);
            $.App.loader('hide');
        });
    },

    // Load Marketing Source
    Form.prototype.loadSelectMarketingSource = function(channelId, selectorName) {
        const element = $(`select[name="${selectorName}"]`);
        const emptyOption = {'value': '', 'label': '- Chọn -'};
        if (!channelId) {
            $.Form.rebuildSelect2(element, [emptyOption]);
            return;
        }
        $.ajax({
            type: 'GET',
            url: `${$.App.apiPrefix}/select-marketing-source`,
            data: {
                channel_id: channelId,
            },
            dataType: 'json',
            beforeSend: function() {
                $.App.loader();
            },
        }).done(function(res) {
            $.Form.rebuildSelect2(element, res.data);
            $.App.loader('hide');
        });
    },

    // Load Sequence Course Detail Lesson
    Form.prototype.loadSequenceCourseDetailLesson = function(chapterId, selectorName) {
        const element = $(`input[name="${selectorName}"]`);
        if (!chapterId) {
            element.val(255).trigger('change');
            return;
        }
        $.ajax({
            type: 'GET',
            url: `${$.App.apiPrefix}/chapter/last-lesson`,
            data: {
                chapter_id: chapterId,
            },
            dataType: 'json',
            beforeSend: function() {
                $.App.loader();
            },
        }).done(function(res) {
            if (!res.data) {
                element.val(255).trigger('change');
                $.App.loader('hide');
                return;
            }
            element.val(res.data['input_sequence']+1).trigger('change');
            $.App.loader('hide');
        });
    },
    // Load Sequence Course Detail Task
    Form.prototype.loadSequenceCourseDetailTask = function(lessonId, selectorName) {
        const element = $(`input[name="${selectorName}"]`);
        const form = element.closest('form');
        if (!lessonId) {
            element.val(255);
            return;
        }
        $.ajax({
            type: 'GET',
            url: `${$.App.apiPrefix}/sequence-course-detail-task`,
            data: {
                lesson_id: lessonId,
            },
            dataType: 'json',
            beforeSend: function() {
                $.App.loader();
            },
        }).done(function(res) {
            element.val(res.data);
            $.App.loader('hide');
        });
    },

    // Load location
    Form.prototype.loadTopic = function(selectorParentName, selectorName) {
        const selectorParent = $(`[name="${selectorParentName}"]`);
        const element = $(`select[name="${selectorName}"]`);
        const emptyOption = {'value': '', 'label': '- Chọn -'};
        if (!selectorParent.val()) {
            $.Form.rebuildSelect2(element, [emptyOption]);
            return;
        }
        $.ajax({
            type: 'GET',
            url: `${$.App.apiPrefix}/select-topic`,
            data: {
                parent_id: selectorParent.val(),
                has_empty: Boolean(element.attr('multiple')) ? '' : 1
            },
            dataType: 'json',
            beforeSend: function() {
                $.App.loader();
            },
        }).done(function(res) {
            $.Form.rebuildSelect2(element, res.data);
            $.App.loader('hide');
        });
    },

    // loadUserCustomer
    Form.prototype.loadUserCustomer = function(element=null) {
        if (!element) element = $('[name="phone"]');
        const form = element.closest('form');
        const prefix_name = $(element).attr('name').replace('phone', '');
        const value = $(element).val();
        if (!value) {
            $.Form.loadUserCustomerToInput(form, {}, {'prefix_name': prefix_name});
            return;
        }
        $.ajax({
            type: 'GET',
            url: `${$.App.apiPrefix}/get-user-customer`,
            data: {
                phone: value
            },
            dataType: 'json',
            beforeSend: function() {
                $.App.loader();
            },
        }).done(function(res) {
            const data = res.success ? res.data : {};
            $.Form.loadUserCustomerToInput(form, data, {'prefix_name': prefix_name});
            $.App.loader('hide');
        });
    },
    Form.prototype.loadUserCustomerToInput = function (form, data={}, options={}) {
        const prefix_name = options.prefix_name ? options.prefix_name : '';
        if (!data || !Object.keys(data).length) {
            form.find(`[name="user_customer_id"]`).val('');
            form.find('.form-control').each(function() {
                const name = $(this).attr('name');
                if (name == prefix_name+'phone') return;
                if (!prefix_name || name.includes(prefix_name)) {
                    $(this).val('').trigger('change');
                }
            });
            return;
        }
        const address_ids = ['country_id', 'district_id', 'ward_id', 'gender'];
        address_ids.forEach(key => {
            if (key in data) {
                form.find(`[name="${prefix_name}${key}"]`).val(data[key]).trigger('change');
            }
        });
        form.find(`[name="user_customer_id"]`).val(data['user_customer_id']);
        Object.keys(data).forEach(key => {
            if (address_ids.includes(key)) return;
            form.find(`[name="${prefix_name}${key}"]`).val(data[key]);
        });
    }

    // toggleInputType
    Form.prototype.toggleInputType = function(element=null) {
        if (!element) element = $('[name="type"]');
        const form = element.parents('form');
        const isCheckBox = Boolean(element.attr('type') == 'checkbox');
        const contentType = isCheckBox ? element.attr('name') : element.val();
        if (['image', 'audio', 'video'].includes(contentType) && !form.find('.box-input-content[content-type="'+ contentType +'"]').length) contentType = 'media';
        form.find('.box-input-content').hide();
        if (isCheckBox) {
            if (element.is(':checked')){
                form.find('.box-input-content[content-type="'+ contentType +'"]').show();
            }
            return;
        }
        form.find('.box-input-content[content-type="'+ contentType +'"]').show();
    },

    // Submit editable
    Form.prototype.submitBoxEditable = function(url, element, key=null) {
        if (!key) key = 'value';
        let box = element.parents('.box-editable');
        if (!box) box = $('.box-editable');
        const box_content = box.find('.box-editable-content');
        const value = box.find('.box-editable-input .form-control').val();
        if (box_content.text() == value) {
            $.Form.cancelBoxEditable(element);
            return;
        };
        let form_data = new FormData();
        form_data.append('csrfmiddlewaretoken', csrftoken);
        form_data.append(key, value);
        $.ajax({
            type: 'POST',
            url: $.App.urlAdmin(url),
            data: form_data,
            dataType: 'json',
            contentType: false,
            processData: false,
            beforeSend: function() {
                $.App.loader();
            },
        }).done(function(res) {
            $.NotificationApp.send(res.success ? 'success' : 'error', res.message, {stack: 1});
            if (res.success) {
                box_content.text(value);
                $.Form.cancelBoxEditable(element);
            }
            $.App.loader('hide');
        });
    },
    // Open editable
    Form.prototype.openEditable = function(url, element=null, key=null) {
        if (!element) element = $('.box-editable-info');
        const box = element.parents('.box-editable');
        const value = box.find('.box-editable-content').text();
        const box_editable_input = `<div class="box-editable-input">
            <textarea class="form-control min-w-200">${value}</textarea>
            <div class="d-flex justify-content-between">
                <i class="fst-italic text-primary cursor-pointer" onclick="$.Form.submitBoxEditable('${url}', $(this), '${key}');">Lưu</i>
                <i class="fst-italic text-danger cursor-pointer" onclick="$.Form.cancelBoxEditable($(this));">Hủy</i>
            </div>
        </div>`;
        element.hide();
        box.append(box_editable_input);
    },
    // Cancel
    Form.prototype.cancelBoxEditable = function(element=null) {
        let box = element.parents('.box-editable');
        if (!box) box = $('.box-editable');
        // Close
        box.find('.box-editable-info').show();
        box.find('.box-editable-input').remove();
    }

    // Submit editable
    Form.prototype.submitSelectable = function(url, element, key=null) {
        if (!url || !element) return;
        if (!key) key = element.attr('name') || 'value';
        let form_data = new FormData();
        form_data.append('csrfmiddlewaretoken', csrftoken);
        form_data.append(key, element.val());
        $.ajax({
            type: 'POST',
            url: $.App.urlAdmin(url),
            data: form_data,
            dataType: 'json',
            contentType: false,
            processData: false,
            beforeSend: function() {
                $.App.loader();
            },
        }).done(function(res) {
            $.NotificationApp.send(res.success ? 'success' : 'error', res.message, {stack: 1});
            if (!res.success) {
                const old_value = element.data('old-val');
                element.val(old_value).trigger('change');
            } else {
                element.data('old-val', element.val())
            }
            $.App.loader('hide');
        });
    }

    // init FormBox
    Form.prototype.initBox = function(box_element) {
        this.datepicker(box_element.find('.datepicker-default'));
        this.datepicker(box_element.find('.datepicker-range'), 'range');
        this.datetimepicker(box_element.find('.datepicker-datetime'));
        this.init_alias(box_element);
        this.inputMask(box_element.find('[data-toggle="input-mask"]'));
        this.autonumber(box_element.find('.autonumber'));
        this.select2(box_element.find('.select2'));
        this.ckeditor(box_element.find('.editor'));
    }

    // On init
    Form.prototype.init = function() {
        this.datepicker();
        this.datetimepicker();
        this.init_alias();
        this.alias();
        this.inputMask();
        this.autonumber();
        this.select2();
        setTimeout(() => { this.ckeditor(); }, 0); 
    },

    $.Form = new Form, $.Form.Constructor = Form

}(window.jQuery),

/**
 * List
 * @param {*} $
 */
function($) {
    "use strict";

    var List = function() {
    };

    // Show action
    List.prototype.showAction = function() {
        if($('[name="ids"]:checked').length) {
            $('.btn-action').removeClass('d-none');
        } else {
            $('.btn-action').addClass('d-none');
        }
    },

    // Change sort
    List.prototype.changeSort = function() {
        $('input.sort-order').change(function() {
            $('[name="ids"]', $(this).parents('tr')).prop('checked', true);
            let val = isNaN(parseInt($(this).val())) ? 0 : parseInt($(this).val())
            $(this).val(val);
            $.List.showAction();
        });
    },

    // Table select all
    List.prototype.checkAll = function() {
        $('body').on('click', '.table thead th.checkbox .form-check-input', function(){
            $(this).parents('.table').find('tbody td.checkbox input:checkbox').prop('checked', this.checked);
            $.List.showAction();
        });
        $('body').on('click', '.table tbody td.checkbox .form-check-input', function(){
            const table = $(this).parents('table');
            const check_all = Boolean(table.find('tbody td.checkbox .form-check-input:checked').length === table.find('tbody td.checkbox .form-check-input').length);
            table.find('thead th.checkbox input:checkbox').prop('checked', check_all);
            $.List.showAction();
        });
    },

    // Submit form filter
    List.prototype.filter = function(context={}, form=null) {
        if (!(form && form.length)) form = $('form.form-filter');
        const box_content = $(form.parents('.box-content'));
        const form_id = form.attr('id');
        const router = window.location.hash.trim();
        const current_hash = router.slice(1, router.length);
        let url  = context.url;
        if (!url) {
            url = form.attr('action');
            if (!url && box_content.length) url = box_content.attr('view-url');
            if (!url) url = window.location.href;
        }
        url = $.App.urlAdmin(url);
        let data = form.serializeArray();
        let data_filter = [];
        let list_pass = ['csrfmiddlewaretoken'];
        let list_remove = ['ids'];
        $.each(data, function(key, item) {
            let data_push = {name: item['name'], value: item['value'].trim()}
            if (context.clear_data && !list_pass.includes(data_push['name'])) data_push['value'] = '';
            if (!list_remove.includes(data_push['name'])) {
                data_filter.push(data_push)
            }
        });
        data_filter.push({name: 'item_per_page', value: $('[name="item_per_page"][data-form="'+form_id+'"]').val() || 20})
        $.ajax({
            type: 'POST',
            url: url,
            data: data_filter,
            dataType: 'json',
            beforeSend: function() {
                $.App.loader();
            }
        }).done(function(res) {
            if (box_content.length) {
                $.App.loadBoxContent(box_content);
                return;
            }
            const next_url = res.next_url || url;
            if(current_hash != $.App.urlAdmin(next_url)) {
                window.location.hash = $.App.urlAdmin(next_url);
                return true;
            }
            $.App.load();
            $.App.loader('hide');
        });
    },

    // Change active
    List.prototype.active = function(value, element, form=null) {
        if (!form) form = $('form.form-filter');
        const box_content = $(form.parents('.box-content'));
        const router = window.location.hash.trim();
        const current_hash = router.slice(1, router.length);
        let url = form.attr('action');
        if (!url) {
            if (box_content.length) url = box_content.attr('view-url');
            if (!url) url = window.location.href;
        }
        url = $.App.urlAdmin(url +'/active');

        if(element) {
            $('[name="ids"]').prop('checked', false);
            $(element).parents('tr').find('[name="ids"]').prop('checked', true);
        }

        if($('[name="ids"]:checked').length <= 0) {
            $.Modal.alert('Vui lòng chọn phần tử cần thao tác', 'danger');
            return false;
        }

        var form_data = new FormData();
        form_data.append('csrfmiddlewaretoken', csrftoken);
        form_data.append('value', value);

        $('[name="ids"]').each(function () { 
            if ($(this).is(':checked')) {
                form_data.append('ids', $(this).val());
            }
        });

        $.ajax({
            type: 'POST',
            url: url,
            data: form_data,
            dataType: 'json',
            contentType: false,
            processData: false,
            beforeSend: function() {
                $.App.loader();
            }
        }).done(function(res) {
            $.NotificationApp.send(res.success ? 'success' : 'error', res.message, {stack: 1});
            if (!res.success){
                $.App.loader('hide');
                return;
            }
            if (box_content.length) {
                $.App.loadBoxContent(box_content);
                return;
            }
            if(res.next_url && current_hash != $.App.urlAdmin(res.next_url)) {
                window.location.hash = $.App.urlAdmin(res.next_url);
                return;
            }
            $.App.load();
            $.App.loader('hide');
        });
    },

    // Delete
    List.prototype.delete = function(form=null, data=[]) {
        if (!form) form = $('form.form-filter');
        const box_content = $(form.parents('.box-content'));
        const router = window.location.hash.trim();
        const current_hash = router.slice(1, router.length);
        let url = form.attr('action');
        if (!url) {
            if (box_content.length) url = box_content.attr('view-url');
            if (!url) url = window.location.href;
        }
        url = $.App.urlAdmin(url +'/delete');
        if (!(Array.isArray(data) && data.length > 0)) {
            data = []
            $('[name="ids"]').each(function () { 
                if ($(this).is(':checked')) {
                    data.push($(this).val());
                }
            });
        }
        if(data.length <= 0) {
            $.Modal.alert('Vui lòng chọn phần tử cần thao tác', 'danger');
            return false;
        }
        let modal_id = '#modal-delete';
        let modal_content = '<div class="alert alert-danger border-0" role="alert">Bạn có chắc chắn muốn xoá <b>'+ data.length +'</b> phần tử đã chọn? <br>Sau khi xoá sẽ không thể khôi phục lại</div>';
        let modal = $.Modal.create(modal_id, 'Xoá dữ liệu', modal_content, {'submit_text': 'Xác nhận xoá'});

        $(modal_id).on('click', '.btn.save', function(e) {
            e.preventDefault();
            var form_data = new FormData();
            form_data.append('csrfmiddlewaretoken', csrftoken);
            data.forEach(val => {
                form_data.append('ids', val);
            });
            $.ajax({
                type: 'POST',
                url: url,
                data: form_data,
                dataType: 'json',
                contentType: false,
                processData: false,
                beforeSend: function() {
                    $.App.loader();
                }
            }).done(function(res) {
                $.NotificationApp.send(res.success ? 'success' : 'error', res.message, {stack: 1});
                if (!res.success){
                    $.App.loader('hide');
                    return;
                }
                modal.hide();
                if (box_content.length) {
                    $.App.loadBoxContent(box_content);
                    return;
                }
                if(res.next_url && current_hash != $.App.urlAdmin(res.next_url)) {
                    window.location.hash = $.App.urlAdmin(res.next_url);
                    return;
                }
                $.App.load();
                $.App.loader('hide');
            });
        });
    },

    // Sort
    List.prototype.sort = function(form=null) {
        if (!form) form = $('form.form-filter');
        const router = window.location.hash.trim();
        const current_hash = router.slice(1, router.length);
        const url = $.App.urlAdmin((form.attr('action') || window.location.href) + '/sort');

        if($('[name="ids"]:checked').length <= 0) {
            $.Modal.alert('Vui lòng chọn phần tử cần thao tác', 'danger');
            return false;
        }

        var form_data = new FormData();
        form_data.append('csrfmiddlewaretoken', csrftoken);

        $('[name="ids"]').each(function () { 
            if ($(this).is(':checked')) {
                form_data.append('sort_'+ $(this).val(), $('input.sort-order', $(this).parents('tr')).val());
            }
        });

        $.ajax({
            type: 'POST',
            url: url,
            data: form_data,
            dataType: 'json',
            contentType: false,
            processData: false,
            beforeSend: function() {
                $.App.loader();
            }
        }).done(function(res) {
            if(!res.hasOwnProperty('success') || !res.success) {
                $.NotificationApp.send('error', res.message, {stack: 1});
            } else {
                $.NotificationApp.send('success', res.message, {stack: 1});
                if(res.next_url && current_hash != $.App.urlAdmin(res.next_url)) {
                    window.location.hash = $.App.urlAdmin(res.next_url);
                    return true;
                }
                $.App.load();
            }
            $.App.loader('hide');
        });
    },

    // Move
    List.prototype.move = function(id, type, form=null) {
        if (!form) form = $('form.form-filter');
        const router = window.location.hash.trim();
        const current_hash = router.slice(1, router.length);
        const url = $.App.urlAdmin((form.attr('action') || window.location.href) + '/sort');

        if(!id || !type) {
            $.Modal.alert('Vui lòng chọn phần tử cần thao tác', 'danger');
            return false;
        }

        var form_data = new FormData();
        form_data.append('csrfmiddlewaretoken', csrftoken);
        form_data.append('id', id);
        form_data.append('type', type);

        $.ajax({
            type: 'POST',
            url: url,
            data: form_data,
            dataType: 'json',
            contentType: false,
            processData: false,
            beforeSend: function() {
                $.App.loader();
            }
        }).done(function(res) {
            if(!res.hasOwnProperty('success') || !res.success) {
                $.NotificationApp.send('error', res.errors, {stack: 1});
            } else {
                $.NotificationApp.send('success', res.message, {stack: 1});
                if(res.next_url && current_hash != $.App.urlAdmin(res.next_url)) {
                    window.location.hash = $.App.urlAdmin(res.next_url);
                    return true;
                }

                $.App.load();
            }
            $.App.loader('hide');
        });
    },

    // Load more
    List.prototype.loadmore = function (btnShowmore) {
        const nextPage = parseInt(btnShowmore.attr('next-page'));
        const totalPage = parseInt(btnShowmore.attr('total-page'));
        const box_selector = btnShowmore.closest('.box-loadmore').parent('.box-content');
        const view_url = box_selector.attr('view-url');
        let data = {
            'is_subview': 1,
            ...box_selector.data()
        }
        $.ajax({
            type: 'GET',
            url: $.App.urlAdmin(view_url + '/page/' + nextPage),
            data: data,
            dataType: 'html',
            beforeSend: function() {
                $.App.loader();
            },
            success: function(res) {
                if (res) {
                    box_selector.find('.list-items-content').append(res);
                    $.Form.initBox(box_selector);
                    if (nextPage >= totalPage) {
                        btnShowmore.remove();
                    } else {
                        btnShowmore.attr('next-page', nextPage+1)
                    }
                } else {
                    btnShowmore.remove();
                }
                $.App.loader('hide');
            },
            error: function(xhr) {
                btnShowmore.hide();
            }
        });
    }

    // On init
    List.prototype.init = function() {
        this.checkAll();
        this.changeSort();
    },
    $.List = new List, $.List.Constructor = List
}(window.jQuery),

/**
 * App
 * @param {*} $
 */
function ($) {
    'use strict';

    var App = function () {};

    // Load app
    App.prototype.load = async function(url) {
        if(!$('#app').length) return
        const router = window.location.hash.trim();
        const current_hash = router.slice(1, router.length);
        if (!url) {
            url = (router !== '') ? router.slice(1, router.length) : '/';
            if(url === '/') {
                window.location.hash = `/${$.App.adminPrefix}`;
                return;
            }
        }

        await $.ajax({
            type: 'GET',
            url: url,
            dataType: 'html',
            beforeSend: function() {
                $.App.loader();
                $('.selectize-dropdown').remove();
            },
            success: function(result) {
                if($(result).find('.page-title .title').length) {
                    document.title = $(result).find('.page-title .title').text();
                }
                $('#app').html(result);
                $.App.init();
                $.App.loader('hide');
            },
            error: function (xhr) {
                const res = JSON.parse(xhr.responseText);
                if(res.next_url && current_hash != $.App.urlAdmin(res.next_url)) {
                    window.location.hash = $.App.urlAdmin(res.next_url);
                    return true;
                }
            }
        });
    },

    // Load content to box
    App.prototype.loadBoxContent = async function(box_selector, url=null, type=null) {
        if (!url) url = box_selector.attr('view-url');
        if (!url){
            $.NotificationApp.send('error', 'Không thể tải dữ liệu', {stack: 1});
            return;
        }
        let has_response = false;
        await $.ajax({
            type: 'GET',
            url: $.App.urlAdmin(url),
            data: {
                'is_subview': 1,
                ...this.convertKeysToSnakeCase(box_selector.data())
            },
            dataType: 'html',
            beforeSend: function() {
                $.App.loader();
            },
            success: function(res) {
                if (res) has_response = true;
                if (type == 'append') {
                    box_selector.append(res);
                } else {
                    box_selector.html(res);
                }
                $.Form.initBox(box_selector);
                $.App.loader('hide');
            },
            error: function (xhr) {
                $.App.loader('hide');
            }
        });
        return has_response;
    },

    // 
    App.prototype.adminPrefix = 'admin'
    App.prototype.apiPrefix = 'api'
    // Url Admin
    App.prototype.urlAdmin = function(url) {
        if (!url) return url
        if(url.search('#') > 0) {
            url = url.split('#');
            return url[1];
        }
        return url;
    },

    // Url Admin
    App.prototype.loader = function(type, target='#preloader') {
        if(type == 'hide') {
            $(target).hide();
        } else {
            $(target).show();
        }
    },

    // Cut text
    App.prototype.cutText = function(text, numWords=20) {
        const tempElement = $('<div></div>').html(text);
        const content = tempElement.text().trim();
        const words = content.split(' ');
        if (words.length <= numWords) {
            return text;
        } else {
            const truncatedText = words.slice(0, numWords).join(' ');
            return truncatedText + ' ...';
        }
    }

    // Convert camelCase to snake_case
    App.prototype.camelToSnake = function(text) {
        return text.replace(/[A-Z]/g, match => "_" + match.toLowerCase());
    }

    //  Convert key của obj sang snake_case
    App.prototype.convertKeysToSnakeCase = function(obj) {
        if (typeof obj !== 'object' || obj === null) {
            return obj; // Trả về giá trị không phải đối tượng
        }
      
        if (Array.isArray(obj)) {
            // Nếu đối tượng là một mảng, duyệt qua từng phần tử và chuyển đổi khóa
            return obj.map(item => this.convertKeysToSnakeCase(item));
        }
      
        // Nếu đối tượng là một đối tượng, duyệt qua tất cả các khóa và chuyển đổi chúng
        const newObj = {};
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                const snakeKey = this.camelToSnake(key);
                newObj[snakeKey] = this.convertKeysToSnakeCase(obj[key]);
            }
        }
        return newObj;
    }

    // format number hiển thị dạng x.xxx.xxx.xxx
    App.prototype.formatNumberWithCommas = function(number) {
        // Kiểm tra nếu number là một số hợp lệ
        if (typeof number !== 'number' || isNaN(number)) {
            return 'Số không hợp lệ';
        }
        return number.toLocaleString('vi-VN');
    }

    //initilizing
    App.prototype.init = function () {
        $.Portlet.init();
        $.Components.init();
        $.Gallery.init();
        $.Dragula.init();
        $.Form.init();
        $.List.init();
        $.LayoutThemeApp.init();
        // Config Ajax
        $(document).on({
            ajaxStart: function(){
                // $.App.loader();
            },
            ajaxStop: function(){
                // $.App.loader('hide');
            },
            ajaxError: function(e, xhr, settings) {
                const res = JSON.parse(xhr.responseText);
                const message = res.message || 'Lỗi không thể xử lý'
                $.NotificationApp.send('error', message, {stack: 1});
            }
        });

        // Scroll to fix header
        // $('.topnav').scrollToFixed({zIndex: 1001});
    },

    $.App = new App, $.App.Constructor = App
}(window.jQuery),

function ($) {
    "use strict";
    $.App.init();

    $.App.load();
    $(window).on('hashchange', function () {
        $.App.load();
    });
}(window.jQuery);

Waves.init(); // Waves Effect
feather.replace(); // Feather Icons


$(document).ready(function() {
    // Onchagne alias 
    $('body').on('change', '.input-group-alias, .input-group-alias input', function(){
        $(this).val($.Form.convertAlias($(this).val()))
    });
    // Select thì lọc
    $('body').on('change', '.form-filter .auto_filter', function() {
        $.List.filter({}, $(this).parents('.form-filter'));
    });
    // Clear filter
    $('body').on('click', '.form-filter .act-clear-filter', function(e) {
        e.preventDefault();
        $.List.filter({clear_data: true}, $(this).parents('.form-filter'));
    });
    // Thay đổi item per page
    $('body').on('change', '[name="item_per_page"]', function() {
        const form_id = $(this).data('form');
        $.List.filter({}, $('#'+form_id));
    });
    // Submit form filter
    $('body').on('submit', '.form-filter', function(e) {
        e.preventDefault();
        $.List.filter({}, $(this));
    });
    // Sorting list
    $('body').on('click', 'th.sorting', function() {
        let form_id = $(this).parents('.table').data('form');
        let form = form_id ? $('#'+form_id) : '';
        if (!form.length) {
            form = $(this).parents('.card-table').prev(".form-filter");
        }
        if (!form.length) {
            $.NotificationApp.send('error', 'Không thể sắp xếp', {stack: 1});
            return;
        }
        let order_by = $(this).hasClass('sorting_asc') ? '-'+ $(this).data('name') : $(this).data('name');
        form.append('<input type="hidden" name="order_by" value="'+ order_by +'">');
        $.List.filter({}, form);
    });
    // Phân trang box content
    $('body').on('click', '.box-content .page-item .page-link', function (e){
        e.preventDefault();
        if ($(this).parents('.page-item').hasClass('active')) return;
        $.App.loadBoxContent($(this).parents('.box-content'), $(this).attr('href'));
    });
    // Load box content
    $('body').on('click', '.box-load-content .load-content', function (e){
        e.preventDefault();
        $.App.loadBoxContent($(this).parents('.box-load-content').find('.box-content'));
    });
    $(document).on('select2:open', () => {
        document.querySelector('.select2-container--open .select2-search__field').focus();
    });

    // Td edit able
    $('body').on('click', '.box-editable .box-editable-content', function() {
        $(this).hide();
        $(this).parents('.box-editable').find('.box-editable-input').show();
    });
    // Reload alias
    $('body').on('click', '.reload-alias', function(e) {
        e.preventDefault();
        const input = $(this).parent().find('input');
        const from = input.attr('alias-from');
        $.Form.alias($(this).parents('form').find('[name="'+ from +'"]'), input, true);
    });

    // Load more
    $('body').on('click', '.btn-loadmore', function() {
        $.List.loadmore($(this));
    });

    $('body').on('submit', '#form-login', function(e) {
        e.preventDefault();
        $.Form.submit();
    });

    // Comment
    $('body').on('submit', '.form-comment', function(e) {
        e.preventDefault();
        const form = $(this);
        const relId = form.attr('rel-id');
        const relType = form.attr('rel-type');
        if (!relId || !relType) {
            $.NotificationApp.send('error', 'Không thể lấy thông tin bài viết.', {stack: 1});
            return;
        }
        const content = form.find('input[name="content"]').val();
        if (!content) {
            $.NotificationApp.send('error', 'Hãy nhập nội dung.', {stack: 1});
            return;
        }
        // form.attr('submitting', true);
        const cmtId = form.attr('data-id');
        const form_data = new FormData();
        form_data.append('csrfmiddlewaretoken', csrftoken);
        form_data.append('content', content);
        let url = $.App.urlAdmin(`${$.App.adminPrefix}/post-comment/add`);
        if (cmtId) {
            url = $.App.urlAdmin(`${$.App.adminPrefix}/post-comment/${cmtId}/edit`);
        } else {
            form_data.append('rel_id', relId);
            form_data.append('rel_type', relType);
            const parentCmt = form.closest('.cmt-item');
            if (parentCmt.length) {
                const parent_id = parentCmt.data('id');
                if (parent_id) {
                    form_data.append('parent_id', parent_id);
                }
            }
        }
        $.ajax({
            type: 'POST',
            url: url,
            data: form_data,
            dataType: 'json',
            contentType: false,
            processData: false,
            beforeSend: function() {
                $.App.loader();
            },
            success: function(res){
                $.NotificationApp.send(res.success ? 'success' : 'error', res.message, {stack: 1});
                if (res.success) {
                    // Nếu là chỉnh sửa
                    if (cmtId) {
                        const cmtDetail = $(`.cmt-item[data-id="${cmtId}"]`).find('.cmt-item-info').first().find('.cmt-item-detail').first();
                        cmtDetail.find('.cmt-content').text(content);
                        if (!cmtDetail.find('.cmt-updated').length) {
                            cmtDetail.find('.cmt-content').after('<i class="text-muted fs-6 cmt-updated">Đã chỉnh sửa</i>');
                        }
                        form.remove();
                    } else {
                        // Nếu là thêm mới
                        form.trigger('reset');
                        if (!form.parent().children('.list-cmt').length) {
                            form.before('<div class="list-cmt"></div>');
                        }
                        form.parent().children('.list-cmt').prepend(res.data);
                        const totalCmts = parseInt($(`#post-${relId} .total-comments`).text()) || 0;
                        $(`#post-${relId} .total-comments`).text(totalCmts+1);
                        form.parents('.cmt-item').each(function() {
                            const totalChild = parseInt($(this).attr('total-child')) || 0;
                            $(this).attr('total-child', totalChild+1);
                        });
                    }
                }
                // form.data('submitting', false);
                $.App.loader('hide');
            },
            error: function () {
                // form.data('submitting', false);
                $.App.loader('hide');
            }
        }); 
    });
    // Loadmore comment
    $('body').on('click', '.loadmore-cmts', function(e) {
        e.preventDefault();
        const _this = $(this);
        const boxComment = _this.closest('.box-comment').length ? _this.closest('.box-comment') : _this.closest('.box-content');
        const viewUrl = boxComment.attr('view-url');
        if (!viewUrl) {
            $.NotificationApp.send('error', 'Không thể tải dữ liệu.', {stack: 1});
            return
        }
        // Lấy comment cha (nếu có)
        let disIds = [];
        let boxListCmt = _this.parent().children('.list-cmt');
        if (boxListCmt.length) { 
            // Lấy ids các comment vừa thêm vào
            boxListCmt.find('.cmt-item.just-added').each(function(){
                const id = $(this).data('id');
                if (!disIds.includes(id)) disIds.push(id);
            });
        }
        const totalPage = _this.attr('total-page') || 1;
        const params = {'dis_ids': disIds};
        const parentId = _this.closest('.cmt-item').data('id');
        if (parentId) {
            params['parent_id'] = parentId;
        }
        let nextPage = _this.attr('next-page') ? parseInt(_this.attr('next-page')) : 1;
        $.ajax({
            type: 'GET',
            url: $.App.urlAdmin(`${viewUrl}/page/${nextPage}`),
            data: params,
            traditional: true,
            beforeSend: function() {
                $.App.loader();
            },
            success: function(res){
                if (boxListCmt.length) {
                    boxListCmt.append(res);
                } else {
                    // Trường hợp xem phản hồi, DOM list-cmt chưa có
                    if (_this.closest('.cmt-item-info').children('.form-comment').length){
                        _this.closest('.cmt-item-info').children('.form-comment').before(res);
                    } else {
                        _this.closest('.cmt-item-info').append(res);
                    }
                    // Gán lại vì mới thêm DOM list-cmt
                    boxListCmt = _this.closest('.cmt-item-info').children('.list-cmt');
                }
                nextPage++;
                if (nextPage > totalPage) {
                    _this.remove();
                } else {
                    _this.attr('next-page', nextPage);
                }
                // form.data('submitting', false);
                $.App.loader('hide');
            },
            error: function () {
                // form.data('submitting', false);
                $.App.loader('hide');
            }
        }); 
    });
    //  Reply comment
    $('body').on('click', '.cmt-reply', function(e) {
        e.preventDefault();
        const _this = $(this);
        const parent = _this.closest('.cmt-item');
        const parent_id = parent.data('id');
        if (!parent_id) {
            $.NotificationApp.send('error', 'Không thể phản hồi bình luận này.', {stack: 1});
        }
        // Click vào xem phản hồi
        _this.parent().children('.loadmore-cmts').trigger('click');
        // Hiển thị form
        const boxComment = _this.closest('.box-comment').length ? _this.closest('.box-comment') : _this.closest('.box-content');
        const form = boxComment.children('.form-comment').clone();
        const cmtItemInfo = parent.find('.cmt-item-info').first();
        if (!cmtItemInfo.children('.form-comment').length) {
            _this.parents('.list-cmt').last().find('.form-comment').remove();
            parent.find('.cmt-item-info').first().append(form);
        }
        cmtItemInfo.children('.form-comment').removeAttr('data-id');
        cmtItemInfo.children('.form-comment').find('input').val('').focus();
    });
    //  Edit comment
    $('body').on('click', '.cmt-edit', function(e) {
        e.preventDefault();
        const _this = $(this);
        const boxComment = _this.closest('.box-comment').length ? _this.closest('.box-comment') : _this.closest('.box-content');
        const form = boxComment.children('.form-comment').clone();
        const cmtItem = _this.closest('.cmt-item');
        const cmtItemInfo = cmtItem.find('.cmt-item-info').first();
        const content = cmtItemInfo.find('.cmt-content').first().text();
        if (!cmtItemInfo.children('.form-comment').length) {
            _this.parents('.list-cmt').last().find('.form-comment').remove();
            cmtItem.find('.cmt-item-info').first().append(form);
        }
        cmtItemInfo.children('.form-comment').attr('data-id', cmtItem.attr('data-id'));
        cmtItemInfo.children('.form-comment').find('input').val(content).focus();
    });
    // Delete comment
    $('body').on('click', '.cmt-delete', function(e) {
        e.preventDefault();
        const _this = $(this);
        const cmtItem = _this.closest('.cmt-item');
        const id = cmtItem.data('id');

        const modal_content = '<div class="alert alert-danger border-0" role="alert">Bạn có chắc chắn muốn xoá bình luận đã chọn?<br>Tất cả các bình luận con cũng sẽ bị xóa. <br>Sau khi xoá sẽ không thể khôi phục lại.</div>';
        const modal = $.Modal.create('#modal-delete', 'Xoá bình luận', modal_content, {'submit_text': 'Xác nhận xoá'});

        $('#modal-delete').on('click', '.btn.save', function(e) {
            e.preventDefault();
            var form_data = new FormData();
            form_data.append('csrfmiddlewaretoken', csrftoken);
            form_data.append('ids', id);
            $.ajax({
                type: 'POST',
                url: $.App.urlAdmin(`${$.App.adminPrefix}/post-comment/delete`),
                data: form_data,
                dataType: 'json',
                contentType: false,
                processData: false,
                beforeSend: function() {
                    $.App.loader();
                },
                success: function(res) {
                    $.NotificationApp.send(res.success ? 'success' : 'error', res.message, {stack: 1});
                    if (res.success) {
                        modal.hide();
                        const totalChild = parseInt(cmtItem.attr('total-child')) || 0;
                        const boxComment = _this.closest('.box-comment').length ? _this.closest('.box-comment') : _this.closest('.box-content');
                        const relId = boxComment.children('.form-comment').attr('rel-id');
                        const totalCmts = parseInt($(`#post-${relId} .total-comments`).text()) || 0;
                        $(`#post-${relId} .total-comments`).text(totalCmts>totalChild ? totalCmts-totalChild-1 : 0);
                        cmtItem.remove();
                    }
                    $.App.loader('hide');
                },
                error: function () {
                    $.App.loader('hide');
                }
            });
        });
    });
});
