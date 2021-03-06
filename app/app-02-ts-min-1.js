var d;
(function(e) {
	(function(a) {
		a[a.PRODUCTION = 0] = "PRODUCTION";
		a[a.TEST = 1] = "TEST";
		a[a.DEVELOPMENT = 2] = "DEVELOPMENT"
	})(e.g || (e.g = {}));
	var k = e.g, l = function() {
		function a(b) {
			this.d = b
		}
		a.prototype.r = function() {
			return this.d.get("data/customers.json")
		};
		return a
	}(), m = function() {
		function a(b) {
			this.d = b
		}
		a.prototype.t = function() {
			return this.d.get("data/orders.json")
		};
		return a
	}(), n = function() {
		function a(b) {
			this.d = b
		}
		a.prototype.s = function(b, a) {
			return this.d.get("data/order-" + b + "-" + a + ".json")
		};
		return a
	}(), p = function() {
		function a(b) {
			this.d = b
		}
		a.prototype.getItem = function() {
			return {
				f : function(b) {
					b({
						I : "Fake Name",
						C : "Brand",
						F : "Model"
					})
				}
			}
		};
		return a
	}(), q = function() {
		function a(b) {
			this.k = b;
			this.version = "1.0.0";
			this.a = {};
			this.a.B = angular.u("authfire", [ "ngRoute", "ngAnimate" ]);
			this.a.v = angular.u("orders", [ "ngRoute", "ngAnimate" ])
		}
		a.prototype.p = function() {
			var b = "";
			this.k == k.A && (b = "test/");
			this.a.orders.D(function(a) {
				a.j("/", {
					c : "CustomersController",
					i : b + "app/views/customers.html"
				}).j("/orders/:customerId", {
					c : "OrdersController",
					i : b + "app/views/orders.html"
				}).j("/orders/:customerId/:orderId", {
					c : "OrderController",
					i : b + "app/views/order.html"
				}).j("/item/:customerId/:orderId/:itemNo", {
					c : "ItemController",
					i : b + "app/views/item.html"
				}).H({
					J : "/error/404.html"
				})
			})
		};
		a.prototype.n = function() {
			this.a.orders.c("CustomersController", function(b, a) {
				b.q = null;
				a.r().f(function(a) {
					b.q = a
				})
			});
			this.a.orders.c("OrdersController", function(b, a, c) {
				b.b = a.b;
				var g = [];
				c.t().f(function(a) {
					for (var f = 0; f < a.length; f++)
						a[f].b == b.b && g.push(a[f]);
					b.v = g
				})
			});
			this.a.orders.c("OrderController", function(b, a, c) {
				console.log(a);
				b.b = a.b;
				b.e = a.e;
				c.s(b.b, b.e).f(function(a) {
					b.G = a
				})
			});
			this.a.orders.c("ItemController", function(b, a, c) {
				console.log(a);
				b.b = a.b;
				b.e = a.e;
				b.l = a.l;
				c.getItem(b.b, b.e, b.l).f(function(a) {
					b.item = a
				})
			})
		};
		a.prototype.o = function() {
			this.a.orders.h("customersFactory", function(a) {
				return new l(a)
			});
			this.a.orders.h("ordersFactory", function(a) {
				return new m(a)
			});
			this.a.orders.h("orderFactory", function(a) {
				return new n(a)
			});
			this.a.orders.h("itemFactory", function(a) {
				return new p(a)
			})
		};
		a.prototype.start = function() {
			this.p();
			this.n();
			this.o()
		};
		return a
	}();
	e.m = q
})(d || (d = {}));
var h = new d.m(d.g.w);
console.log("ENVIRONMENT = " + h.k);
h.start();
