/// <reference path="angular.d.ts" />
/// <reference path="angular-resource.d.ts" />
/// <reference path="angular-route.d.ts" />
/// <reference path="common.ts" />

module demo2 {
    "use strict";
    class CustomersFactory {
        constructor(private $http) {
        }
        getCustomers(): ng.IPromise<any> {
            // Return a promise for AJAX Call
            return this.$http.get('data/customers.json');
        }
    }
    class OrdersFactory {
        constructor(private $http) {
        }
        getOrders(): ng.IPromise<any> {
            // Return a promise for AJAX Call
            return this.$http.get('data/orders.json');
        }
    }
    class OrderFactory {
        constructor(private $http) {
        }
        getOrder(customerId, orderId): ng.IPromise<any> {
            // Return a promise for AJAX Call
            return this.$http.get('data/order-' + customerId + '-'
                + orderId + '.json');
        }
    }
    class ItemFactory {
        constructor(private $http) {
        }
        getItem(customerId, orderId, itemNo) {
            // Must return a promise for AJAX Call but for  
            // now is returning hard-coded object
            return {
                success: (callback) => {
                    callback({
                        productName: 'Fake Name', brand: 'Brand'
                        , model: 'Model'
                    })
                }
            }
        }
    }

    export class App {
        private modules: any;
        private version: string;
        constructor(private env: common.Env) {
            this.version = '1.0.0';
            this.modules = {};
            this.modules['authfire'] = angular.module('authfire'
                , ['ngRoute', 'ngAnimate']);
            this.modules['orders'] = angular.module('orders'
                , ['ngRoute', 'ngAnimate']);
        }
        private buildRoutes() {
            var TEMPL_PREFIX = '';
            if (this.env == common.Env.TEST) {
                TEMPL_PREFIX = 'test/';
            }
            // console.log(this.modules);
            this.modules['orders'].config(
                ['$routeProvider', '$locationProvider'
                    , function($routeProvider, $locationProvider) {
                        $routeProvider.when('/', {  // Default Route
                            controller: 'CustomersController',
                            templateUrl: TEMPL_PREFIX + 'app/views/customers.html'/*,
                        resolve: { data: dataLoaderRunner }*/
                        }).when('/orders/:customerId', {
                                controller: 'OrdersController',
                                templateUrl: TEMPL_PREFIX + 'app/views/orders.html'
                            }).when('/orders/:customerId/:orderId', {
                                controller: 'OrderController',
                                templateUrl: TEMPL_PREFIX + 'app/views/order.html'
                            }).when('/item/:customerId/:orderId/:itemNo', {
                                controller: 'ItemController',
                                templateUrl: TEMPL_PREFIX + 'app/views/item.html'
                            }).
                            otherwise({
                                redirectTo: 'app/views/404.html'
                            });
                    }]);
        }
        private buildControllers() {
            this.modules['orders'].controller('CustomersController'
                , ['$scope', 'customersFactory', function(
                    $scope, customersFactory) {
                    $scope.customers = null;
                    customersFactory.getCustomers().success(function(custs) {
                        $scope.customers = custs;
                    });
                }]);
            this.modules['orders'].controller('OrdersController'
                , ['$scope', '$routeParams', 'ordersFactory', 'orderFactory', function(
                    $scope, $routeParams, ordersFactory, orderFactory) {
                    // console.log($scope); // Class Scope
                    // console.log($routeParams);
                    $scope.customerId = $routeParams.customerId;
                    var filtered = [];
                    var filter = (elem) => { 
                    return (elem.customerId == $scope.customerId)
                    };
                    ordersFactory.getOrders().success(function(orders) {
                        for (var i = 0; i < orders.length; i++) {
                            if (filter(orders[i])) {
                                filtered.push(orders[i]);
                            }
                        }
                        $scope.orders = filtered;
                    });
                }]);
            this.modules['orders'].controller('OrderController'
                , ['$scope', '$routeParams', 'orderFactory', function(
                    $scope, $routeParams, orderFactory) {
                    // console.log($routeParams);
                    $scope.customerId = $routeParams.customerId;
                    $scope.orderId = $routeParams.orderId;
                    orderFactory.getOrder($scope.customerId, $scope.orderId)
                        .success(function(order) {
                            $scope.order = order;
                        });
                }]);
            this.modules['orders'].controller('ItemController'
                , ['$scope', '$routeParams', 'itemFactory', function(
                    $scope, $routeParams, itemFactory) {
                    // console.log($routeParams);
                    $scope.customerId = $routeParams.customerId;
                    $scope.orderId = $routeParams.orderId;
                    $scope.itemNo = $routeParams.itemNo;

                    itemFactory.getItem($scope.customerId, $scope.orderId
                        , $scope.itemNo).success(
                        function(item) {
                            $scope.item = item;
                        });
                }]);
        }
        private buildFactories() {
            this.modules['orders'].factory('customersFactory'
                , ['$http', function($http) {
                    return new CustomersFactory($http);
                }]);

            this.modules['orders'].factory('ordersFactory'
                , ['$http', function($http) {
                    return new OrdersFactory($http);
                }]);

            this.modules['orders'].factory('orderFactory'
                , ['$http', function($http) {
                    return new OrderFactory($http);
                }]);

            this.modules['orders'].factory('itemFactory', ['$http'
                , function($http) {
                    return new ItemFactory($http);
                }]);
        }

        public getEnv() { return this.env; }

        public getEnvName() { return common.Env[this.env]; }

        public getVersion() { return this.version; }

        public getModules() { return this.modules; }

        public start() {
            this.buildRoutes();
            this.buildControllers()
            this.buildFactories();
        }
    }
}

var myDemoApp = new demo2.App(common.Env.DEVELOPMENT);
// Uso efeito colateral apenas para o Clousure Compiler 
// não remover o código das funções na otimização 
var myCollateral = [myDemoApp.getVersion(), myDemoApp.getEnvName()
    , myDemoApp.getModules()['orders'].name];
myDemoApp.start();
