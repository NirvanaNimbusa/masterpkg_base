/*jslint node: true */
/*global angular */
/*global document */

(function () {
    "use strict";

    /**
     * pageTitle - Directive for set Page title - mata title
     */
    function pageTitle($rootScope, $timeout) {
        return {
            link: function(scope, element) {
                var listener = function(event, toState, toParams, fromState, fromParams) {
                    // Default title - load on Dashboard 1
                    var title = 'MasterASP | Admin';
                    // Create your own title pattern
                    if (toState.data && toState.data.pageTitle) title = 'MasterASP | ' + toState.data.pageTitle;
                    $timeout(function() {
                        element.text(title);
                    });
                };
                $rootScope.$on('$stateChangeStart', listener);
            }
        }
    }

    /**
     * sideNavigation - Directive for run metsiMenu on sidebar navigation
     */
    function sideNavigation($timeout) {
        return {
            restrict: 'A',
            link: function(scope, element) {

                // Call the metsiMenu plugin and plug it to sidebar navigation
                $timeout(function(){
                    element.metisMenu();
                });

                var sidebar = element.parent();
                sidebar.slimScroll({
                    height: '100%',
                    railOpacity: 0.9,
                });
            }
        };
    }


    /**
     * iboxTools - Directive for iBox tools elements in right corner of ibox
     */
    function iboxTools($timeout) {
        return {
            restrict: 'A',
            scope: true,
            templateUrl: 'views/common/ibox_tools.html',
            controller: function ($scope, $element) {
                // Function for collapse ibox
                $scope.showhide = function () {
                    var ibox = $element.closest('div.ibox');
                    var icon = $element.find('i:first');
                    var content = ibox.find('div.ibox-content');
                    content.slideToggle(200);
                    // Toggle icon from up to down
                    icon.toggleClass('fa-chevron-up').toggleClass('fa-chevron-down');
                    ibox.toggleClass('').toggleClass('border-bottom');
                    $timeout(function () {
                        ibox.resize();
                        ibox.find('[id^=map-]').resize();
                    }, 50);
                },
                    // Function for close ibox
                    $scope.closebox = function () {
                        var ibox = $element.closest('div.ibox');
                        ibox.remove();
                    }
            }
        };
    }

    /**
     * iboxTools with full screen - Directive for iBox tools elements in right corner of ibox with full screen option
     */
    function iboxToolsFullScreen($timeout) {
        return {
            restrict: 'A',
            scope: true,
            templateUrl: 'views/common/ibox_tools_full_screen.html',
            controller: function ($scope, $element) {
                // Function for collapse ibox
                $scope.showhide = function () {
                    var ibox = $element.closest('div.ibox');
                    var icon = $element.find('i:first');
                    var content = ibox.find('div.ibox-content');
                    content.slideToggle(200);
                    // Toggle icon from up to down
                    icon.toggleClass('fa-chevron-up').toggleClass('fa-chevron-down');
                    ibox.toggleClass('').toggleClass('border-bottom');
                    $timeout(function () {
                        ibox.resize();
                        ibox.find('[id^=map-]').resize();
                    }, 50);
                };
                // Function for close ibox
                $scope.closebox = function () {
                    var ibox = $element.closest('div.ibox');
                    ibox.remove();
                };
                // Function for full screen
                $scope.fullscreen = function () {
                    var ibox = $element.closest('div.ibox');
                    var button = $element.find('i.fa-expand');
                    $('body').toggleClass('fullscreen-ibox-mode');
                    button.toggleClass('fa-expand').toggleClass('fa-compress');
                    ibox.toggleClass('fullscreen');
                    setTimeout(function() {
                        $(window).trigger('resize');
                    }, 100);
                }
            }
        };
    }
    /**
     * templateFactory - Factory for all template
     */
    function templateFactory($rootScope, $state){

        var menuOpen = true;

        function closeMenu(){
            if(menuOpen){
                if ($(document).width() < 769) {
                    $("body").removeClass("mini-navbar");
                }else{
                    $("body").addClass("mini-navbar");
                }
                $('#side-menu').removeClass('fadeIn');
                $('#side-menu').addClass('time02');
                $('#side-menu').addClass('fadeOut');
            }
            menuOpen = false;
        };
        function openMenu(){
            if(!menuOpen) {
                if ($(document).width() < 769) {
                    $("body").addClass("mini-navbar");
                }else{
                    $("body").removeClass("mini-navbar");
                }
                $('#side-menu').removeClass('time02');
                $('#side-menu').removeClass('fadeOut');
                $('#side-menu').addClass('fadeIn');
            }
            menuOpen = true;
        }

        return {
            minimalizaSidebar: function (action) {

                if($state.current.url.indexOf("edit")>=0){
                    closeMenu();
                    return;
                }

                switch(action){
                    case 'min':
                        closeMenu();
                    break;
                    case 'max':
                        openMenu();
                    break;
                    default:
                        if(menuOpen){
                            closeMenu();
                        }else{
                            openMenu();
                        }
                    break;
                }
                setTimeout(function () {
                    $rootScope.$broadcast("minimalizaSidebar");
                }, 1000);
                return;
            }
        }
    }

    /**
     * minimalizaSidebar - Directive for minimalize sidebar
     */
    function minimalizaSidebar(templateFactory) {
        return {
            restrict: 'A',
            template: '<a id="btnMenu" class="navbar-minimalize minimalize-styl-2 btn btn-primary btn-home" href="" ng-click="minimalize()"><i class="fa fa-bars"></i></a>',
            controller: function ($scope, $element) {
                $scope.minimalize = function () {
                    templateFactory.minimalizaSidebar();
                }
            }
        };
    }


    function config($stateProvider, $urlRouterProvider, IdleProvider, KeepaliveProvider) {
        $stateProvider.state("forbiden", {
            parent     : "site",
            url        : "/forbiden",
            templateUrl: 'templates/template_admin/forbiden.html'
        });
        $stateProvider.state("timeout", {
            parent     : "site",
            url        : "/timeout",
            templateUrl: 'templates/template_admin/timeout.html'
        });


        IdleProvider.idle(5);
        IdleProvider.timeout(120);
    }

    angular.module('masterasp', [
        'ui.bootstrap',
        'ngIdle',
        'principal'
    ])
        .factory('templateFactory', templateFactory)
        .directive('pageTitle', pageTitle)
        .directive('sideNavigation', sideNavigation)
        .directive('iboxTools', iboxTools)
        .directive('minimalizaSidebar', minimalizaSidebar)
        .directive('iboxToolsFullScreen', iboxToolsFullScreen)
        .config(config)
        .run(function($rootScope, $state, templateFactory, $interval) {

            var listener = function(event, toState, toParams, fromState, fromParams) {
                if(toState && toState.url.indexOf("edit")>=0){
                    templateFactory.minimalizaSidebar('min');
                }else{
                    templateFactory.minimalizaSidebar('max');
                }
            };
            $rootScope.$on('$stateChangeStart', listener);

            $rootScope.$state = $state;
            angular.element("body").addClass("fixed-sidebar");
            angular.element("body").addClass("fixed-nav");

            // TODO interfiere en el rendimiento?
            $interval(function(){
                if(!navigator.onLine){
                    sweetAlert("Offline", "No internet connection", "warning");
                }
            }, 5000);

            // Minimalize menu when screen is less than 768px
            $(window).bind("load resize", function() {
                if ($(document).width() < 769) {
                    $('body').addClass('body-small');
                    templateFactory.minimalizaSidebar('min');
                } else {
                    $('body').removeClass('body-small')
                }
            })
        });

})();

