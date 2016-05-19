/* global describe, it, beforeEach, expect */

describe('parse', function() {
	var component,
		sirenObj;

	beforeEach(function () {
		component = document.createElement('d2l-siren-parser');

		sirenObj = {
			"class": [ "order" ],
			"properties": {
				"orderNumber": 42,
				"itemCount": 3,
				"status": "pending"
			},
			"entities": [
				{
					"class": [ "items", "collection" ],
					"rel": [ "http://x.io/rels/order-items" ],
					"href": "http://api.x.io/orders/42/items"
				},
				{
					"class": [ "info", "customer" ],
					"rel": [ "http://x.io/rels/customer" ],
					"properties": {
						"customerId": "pj123",
						"name": "Peter Joseph"
					},
					"links": [
						{ "rel": [ "self" ], "href": "http://api.x.io/customers/pj123" }
					]
				}
			],
			"actions": [
				{
					"name": "add-item",
					"title": "Add Item",
					"method": "POST",
					"href": "http://api.x.io/orders/42/items",
					"type": "application/x-www-form-urlencoded",
					"fields": [
						{ "name": "orderNumber", "type": "hidden", "value": "42" },
						{ "name": "productCode", "type": "text" },
						{ "name": "quantity", "type": "number" }
					]
				}
			],
			"links": [
				{ "rel": [ "self" ], "href": "http://api.x.io/orders/42" },
				{ "rel": [ "previous" ], "href": "http://api.x.io/orders/41" },
				{ "rel": [ "next" ], "href": "http://api.x.io/orders/43" }
			]
		};
	});

	it('should parse', function () {
		var parsed = component.parse(sirenObj);

		expect(parsed).to.exist;

		expect(parsed.class).to.be.instanceOf(Array);
		expect(parsed.class.length).to.equal(1);
		expect(parsed.properties).to.exist;
		expect(parsed.entities).to.be.instanceOf(Array);
		expect(parsed.entities.length).to.equal(2);
		expect(parsed.links).to.be.instanceOf(Array);
		expect(parsed.links.length).to.equal(3);
		expect(parsed.actions).to.be.instanceOf(Array);
		expect(parsed.actions.length).to.equal(1);
	});

});
