(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g=(g.D2L||(g.D2L = {}));g=(g.Siren||(g.Siren = {}));g.Parse = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

module.exports = require('siren-parser');

},{"siren-parser":3}],2:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var assert = require('./assert'),
    Field = require('./Field');

function Action(action) {
	var _this = this;

	if (action instanceof Action) {
		return action;
	}
	if (!(this instanceof Action)) {
		return new Action(action);
	}

	assert('object' === (typeof action === 'undefined' ? 'undefined' : _typeof(action)), 'action must be an object');
	assert('string' === typeof action.name, 'action.name must be a string');
	assert('string' === typeof action.href, 'action.href must be a string');
	assert('undefined' === typeof action.class || Array.isArray(action.class), 'action.class must be an array or undefined');
	assert('undefined' === typeof action.method || 'string' === typeof action.method, 'action.method must be a string or undefined');
	assert('undefined' === typeof action.title || 'string' === typeof action.title, 'action.title must be a string or undefined');
	assert('undefined' === typeof action.type || 'string' === typeof action.type, 'action.type must be a string or undefined');
	assert('undefined' === typeof action.fields || Array.isArray(action.fields), 'action.fields must be an array or undefined');

	this.name = action.name;
	this.href = action.href;

	if (action.class) {
		this.class = action.class;
	}

	this.method = action.method || 'GET';

	if (action.title) {
		this.title = action.title;
	}

	this.type = action.type || 'application/x-www-form-urlencoded';

	this._fieldsByName = {};
	this._fieldsByClass = {};
	this._fieldsByType = {};
	if (action.fields) {
		this.fields = [];

		action.fields.forEach(function (field) {
			var fieldInstance = new Field(field);
			_this.fields.push(fieldInstance);

			_this._fieldsByName[field.name] = fieldInstance;

			if (fieldInstance.type) {
				_this._fieldsByType[fieldInstance.type] = _this._fieldsByType[fieldInstance.type] || [];
				_this._fieldsByType[fieldInstance.type].push(fieldInstance);
			}

			if (fieldInstance.class) {
				fieldInstance.class.forEach(function (cls) {
					_this._fieldsByClass[cls] = _this._fieldsByClass[cls] || [];
					_this._fieldsByClass[cls].push(fieldInstance);
				});
			}
		});

		this.fields = action.fields;
	}
}

Action.prototype.hasClass = function (cls) {
	return this.class instanceof Array && this.class.indexOf(cls) > -1;
};

Action.prototype.hasField = function (fieldName) {
	return this.hasFieldByName(fieldName);
};

Action.prototype.hasFieldByName = function (fieldName) {
	return this._fieldsByName.hasOwnProperty(fieldName);
};

Action.prototype.hasFieldByClass = function (fieldClass) {
	return this._fieldsByClass.hasOwnProperty(fieldClass);
};

Action.prototype.hasFieldByType = function (fieldType) {
	return this._fieldsByType.hasOwnProperty(fieldType);
};

Action.prototype.getField = function (fieldName) {
	return this.getFieldByName(fieldName);
};

Action.prototype.getFieldByName = function (fieldName) {
	return this._fieldsByName[fieldName];
};

Action.prototype.getFieldByClass = function (fieldClass) {
	return this._getFirstOrUndefined('_fieldsByClass', fieldClass);
};

Action.prototype.getFieldsByClass = function (fieldClass) {
	return this._getSetOrEmpty('_fieldsByClass', fieldClass);
};

Action.prototype.getFieldByType = function (fieldType) {
	return this._getFirstOrUndefined('_fieldsByType', fieldType);
};

Action.prototype.getFieldsByType = function (fieldType) {
	return this._getSetOrEmpty('_fieldsByType', fieldType);
};

Action.prototype._getFirstOrUndefined = function (set, key) {
	var vals = this[set][key];

	return vals ? vals[0] : undefined;
};

Action.prototype._getSetOrEmpty = function (set, key) {
	var vals = this[set][key];

	return vals ? vals.slice() : [];
};

module.exports = Action;

},{"./Field":4,"./assert":6}],3:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var assert = require('./assert');

var Action = require('./Action'),
    Link = require('./Link');

function Entity(entity) {
	var _this = this;

	if (entity instanceof Entity) {
		return entity;
	}
	if (!(this instanceof Entity)) {
		return new Entity(entity);
	}

	if ('object' !== (typeof entity === 'undefined' ? 'undefined' : _typeof(entity))) {
		entity = JSON.parse(entity);
	}

	assert('undefined' === typeof entity.rel || Array.isArray(entity.rel), 'entity.rel must be an array or undefined');
	assert('undefined' === typeof entity.title || 'string' === typeof entity.title, 'entity.title must be a string or undefined');
	assert('undefined' === typeof entity.type || 'string' === typeof entity.type, 'entity.type must be a string or undefined');
	assert('undefined' === typeof entity.properties || 'object' === _typeof(entity.properties), 'entity.properties must be an object or undefined');
	assert('undefined' === typeof entity.class || Array.isArray(entity.class), 'entity.class must be an array or undefined');
	assert('undefined' === typeof entity.actions || Array.isArray(entity.actions), 'entity.actions must be an array or undefined');
	assert('undefined' === typeof entity.links || Array.isArray(entity.links), 'entity.links must be an array or undefined');
	assert('undefined' === typeof entity.entities || Array.isArray(entity.entities), 'entity.entities must be an array or undefined');

	if (entity.rel) {
		// Only applies to sub-entities (required for them)
		this.rel = entity.rel;
	}

	if (entity.title) {
		this.title = entity.title;
	}

	if (entity.type) {
		this.type = entity.type;
	}

	if (entity.properties) {
		this.properties = entity.properties;
	}

	if (entity.class) {
		this.class = entity.class;
	}

	this._actionsByName = {};
	this._actionsByClass = {};
	this._actionsByMethod = {};
	this._actionsByType = {};
	if (entity.actions) {
		this.actions = [];
		entity.actions.forEach(function (action) {
			var actionInstance = new Action(action);
			_this.actions.push(actionInstance);
			_this._actionsByName[actionInstance.name] = actionInstance;

			if (actionInstance.method) {
				_this._actionsByMethod[actionInstance.method] = _this._actionsByMethod[actionInstance.method] || [];
				_this._actionsByMethod[actionInstance.method].push(actionInstance);
			}

			if (actionInstance.type) {
				_this._actionsByType[actionInstance.type] = _this._actionsByType[actionInstance.type] || [];
				_this._actionsByType[actionInstance.type].push(actionInstance);
			}

			if (actionInstance.class) {
				actionInstance.class.forEach(function (cls) {
					_this._actionsByClass[cls] = _this._actionsByClass[cls] || [];
					_this._actionsByClass[cls].push(actionInstance);
				});
			}
		});
	}

	this._linksByRel = {};
	this._linksByClass = {};
	this._linksByType = {};
	if (entity.links) {
		this.links = [];
		entity.links.forEach(function (link) {
			var linkInstance = new Link(link);
			_this.links.push(linkInstance);

			linkInstance.rel.forEach(function (rel) {
				_this._linksByRel[rel] = _this._linksByRel[rel] || [];
				_this._linksByRel[rel].push(linkInstance);
			});

			if (linkInstance.class) {
				linkInstance.class.forEach(function (cls) {
					_this._linksByClass[cls] = _this._linksByClass[cls] || [];
					_this._linksByClass[cls].push(linkInstance);
				});
			}

			if (linkInstance.type) {
				_this._linksByType[linkInstance.type] = _this._linksByType[linkInstance.type] || [];
				_this._linksByType[linkInstance.type].push(linkInstance);
			}
		});
	}

	this._entitiesByRel = {};
	this._entitiesByClass = {};
	this._entitiesByType = {};
	if (entity.entities) {
		this.entities = [];
		entity.entities.forEach(function (subEntity) {
			// Subentities must have a rel array
			assert(Array.isArray(subEntity.rel));

			var subEntityInstance = void 0;
			if ('string' === typeof subEntity.href) {
				subEntityInstance = new Link(subEntity);
			} else {
				subEntityInstance = new Entity(subEntity);
			}
			_this.entities.push(subEntityInstance);

			subEntityInstance.rel.forEach(function (rel) {
				_this._entitiesByRel[rel] = _this._entitiesByRel[rel] || [];
				_this._entitiesByRel[rel].push(subEntityInstance);
			});

			if (subEntityInstance.class) {
				subEntityInstance.class.forEach(function (cls) {
					_this._entitiesByClass[cls] = _this._entitiesByClass[cls] || [];
					_this._entitiesByClass[cls].push(subEntityInstance);
				});
			}

			if (subEntityInstance.type) {
				_this._entitiesByType[subEntityInstance.type] = _this._entitiesByType[subEntityInstance.type] || [];
				_this._entitiesByType[subEntityInstance.type].push(subEntityInstance);
			}
		});
	}
}

Entity.prototype.hasAction = function (actionName) {
	return this.hasActionByName(actionName);
};

Entity.prototype.hasActionByName = function (actionName) {
	return this._actionsByName.hasOwnProperty(actionName);
};

Entity.prototype.hasActionByClass = function (actionClass) {
	return this._actionsByClass.hasOwnProperty(actionClass);
};

Entity.prototype.hasActionByMethod = function (actionMethod) {
	return this._actionsByMethod.hasOwnProperty(actionMethod);
};

Entity.prototype.hasActionByType = function (actionType) {
	return this._actionsByType.hasOwnProperty(actionType);
};

Entity.prototype.hasClass = function (cls) {
	return this.class instanceof Array && this.class.indexOf(cls) > -1;
};

Entity.prototype.hasEntity = function (entityRel) {
	return this.hasEntityByRel(entityRel);
};

Entity.prototype.hasEntityByRel = function (entityRel) {
	return this._entitiesByRel.hasOwnProperty(entityRel);
};

Entity.prototype.hasEntityByClass = function (entityClass) {
	return this._entitiesByClass.hasOwnProperty(entityClass);
};

Entity.prototype.hasEntityByType = function (entityType) {
	return this._entitiesByType.hasOwnProperty(entityType);
};

Entity.prototype.hasLink = function (linkRel) {
	return this.hasLinkByRel(linkRel);
};

Entity.prototype.hasLinkByRel = function (linkRel) {
	return this._linksByRel.hasOwnProperty(linkRel);
};

Entity.prototype.hasLinkByClass = function (linkClass) {
	return this._linksByClass.hasOwnProperty(linkClass);
};

Entity.prototype.hasLinkByType = function (linkType) {
	return this._linksByType.hasOwnProperty(linkType);
};

Entity.prototype.hasProperty = function (property) {
	return this.hasOwnProperty('properties') && this.properties.hasOwnProperty(property);
};

Entity.prototype.getAction = function (actionName) {
	return this.getActionByName(actionName);
};

Entity.prototype.getActionByName = function (actionName) {
	return this._actionsByName[actionName];
};

Entity.prototype.getActionByClass = function (actionClass) {
	return this._getFirstOrUndefined('_actionsByClass', actionClass);
};

Entity.prototype.getActionsByClass = function (actionClass) {
	return this._getSetOrEmpty('_actionsByClass', actionClass);
};

Entity.prototype.getActionByMethod = function (actionMethod) {
	return this._getFirstOrUndefined('_actionsByMethod', actionMethod);
};

Entity.prototype.getActionsByMethod = function (actionMethod) {
	return this._getSetOrEmpty('_actionsByMethod', actionMethod);
};

Entity.prototype.getActionByType = function (actionType) {
	return this._getFirstOrUndefined('_actionsByType', actionType);
};

Entity.prototype.getActionsByType = function (actionType) {
	return this._getSetOrEmpty('_actionsByType', actionType);
};

Entity.prototype.getLink = function (linkRel) {
	return this.getLinkByRel(linkRel);
};

Entity.prototype.getLinks = function (linkRel) {
	return this.getLinksByRel(linkRel);
};

Entity.prototype.getLinkByRel = function (linkRel) {
	return this._getFirstOrUndefined('_linksByRel', linkRel);
};

Entity.prototype.getLinksByRel = function (linkRel) {
	return this._getSetOrEmpty('_linksByRel', linkRel);
};

Entity.prototype.getLinkByClass = function (linkClass) {
	return this._getFirstOrUndefined('_linksByClass', linkClass);
};

Entity.prototype.getLinksByClass = function (linkClass) {
	return this._getSetOrEmpty('_linksByClass', linkClass);
};

Entity.prototype.getLinkByType = function (linkType) {
	return this._getFirstOrUndefined('_linksByType', linkType);
};

Entity.prototype.getLinksByType = function (linkType) {
	return this._getSetOrEmpty('_linksByType', linkType);
};

Entity.prototype.getSubEntity = function (entityRel) {
	return this.getSubEntityByRel(entityRel);
};

Entity.prototype.getSubEntities = function (entityRel) {
	return this.getSubEntitiesByRel(entityRel);
};

Entity.prototype.getSubEntityByRel = function (entityRel) {
	return this._getFirstOrUndefined('_entitiesByRel', entityRel);
};

Entity.prototype.getSubEntitiesByRel = function (entityRel) {
	return this._getSetOrEmpty('_entitiesByRel', entityRel);
};

Entity.prototype.getSubEntityByClass = function (entityClass) {
	return this._getFirstOrUndefined('_entitiesByClass', entityClass);
};

Entity.prototype.getSubEntitiesByClass = function (entityClass) {
	return this._getSetOrEmpty('_entitiesByClass', entityClass);
};

Entity.prototype.getSubEntityByType = function (entityType) {
	return this._getFirstOrUndefined('_entitiesByType', entityType);
};

Entity.prototype.getSubEntitiesByType = function (entityType) {
	return this._getSetOrEmpty('_entitiesByType', entityType);
};

Entity.prototype._getFirstOrUndefined = function (set, key) {
	var vals = this[set][key];

	return vals ? vals[0] : undefined;
};

Entity.prototype._getSetOrEmpty = function (set, key) {
	var vals = this[set][key];

	return vals ? vals.slice() : [];
};

module.exports = Entity;

},{"./Action":2,"./Link":5,"./assert":6}],4:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var assert = require('./assert');

var VALID_TYPES = ['hidden', 'text', 'search', 'tel', 'url', 'email', 'password', 'datetime', 'date', 'month', 'week', 'time', 'datetime-local', 'number', 'range', 'color', 'checkbox', 'radio', 'file'];

function Field(field) {
	if (field instanceof Field) {
		return field;
	}
	if (!(this instanceof Field)) {
		return new Field(field);
	}

	assert('object' === (typeof field === 'undefined' ? 'undefined' : _typeof(field)), 'field must be an object');
	assert('string' === typeof field.name, 'field.name must be a string');
	assert('undefined' === typeof field.class || Array.isArray(field.class), 'field.class must be an array or undefined');
	assert('undefined' === typeof field.type || 'string' === typeof field.type && VALID_TYPES.indexOf(field.type.toLowerCase()) > -1, 'field.type must be a valid field type string or undefined');
	assert('undefined' === typeof field.title || 'string' === typeof field.title, 'field.title must be a string or undefined');

	this.name = field.name;

	if (field.class) {
		this.class = field.class;
	}

	if (field.type) {
		this.type = field.type;
	}

	if (field.hasOwnProperty('value')) {
		this.value = field.value;
	}

	if (field.title) {
		this.title = field.title;
	}
}

Field.prototype.hasClass = function (cls) {
	return this.class instanceof Array && this.class.indexOf(cls) > -1;
};

module.exports = Field;

},{"./assert":6}],5:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var assert = require('./assert');

function Link(link) {
	if (link instanceof Link) {
		return link;
	}
	if (!(this instanceof Link)) {
		return new Link(link);
	}

	assert('object' === (typeof link === 'undefined' ? 'undefined' : _typeof(link)), 'link must be an object');
	assert(Array.isArray(link.rel), 'link.rel must be an array');
	assert('string' === typeof link.href, 'link.href must be a string');
	assert('undefined' === typeof link.class || Array.isArray(link.class), 'link.class must be an array or undefined');
	assert('undefined' === typeof link.title || 'string' === typeof link.title, 'link.title must be a string or undefined');
	assert('undefined' === typeof link.type || 'string' === typeof link.type, 'link.type must be a string or undefined');

	this.rel = link.rel;
	this.href = link.href;

	if (link.class) {
		this.class = link.class;
	}

	if (link.title) {
		this.title = link.title;
	}

	if (link.type) {
		this.type = link.type;
	}
}

Link.prototype.hasClass = function (cls) {
	return this.class instanceof Array && this.class.indexOf(cls) > -1;
};

module.exports = Link;

},{"./assert":6}],6:[function(require,module,exports){
'use strict';

module.exports = function (expectation, msg) {
	if (!expectation) {
		throw new Error(msg);
	}
};

},{}]},{},[1])(1)
});