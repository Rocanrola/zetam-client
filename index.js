
require('./polyfills');

var reqwest = require('reqwest');
var z = {};

z.components = Object.create({
    _all:[],
    getByName:function(){
        
    }
});

z.utils = {
    extend: function(child) {
        var superPrototype = this;

        var subPrototype = function(){
            superPrototype.apply(this,arguments);
        };
        subPrototype.prototype = Object.create(superPrototype.prototype);

        for (var p in child) {
            subPrototype.prototype[p] = child[p];
        }

        return subPrototype;
    }
}
z.Component = function(config) {
    z.components._all.push(this);
    config = config || {};

    this.el = config.el || null;
    this.id = config.id || null;
    this.template = config.template || '';

    this.init();
}
z.Component.prototype = {
    init:function(){},
    onRender:function(){},
    find: function(query) {
        return this.el.querySelector(query);
    },
    findAll: function(query) {
        return this.el.querySelectorAll(query);
    },
    pullTemplate:function(cb){
        var that = this;
        reqwest({
            url: 'components/'+this.name+'/template', 
            method: 'get', 
            success: function (template) {
              that.template = template;
              that.onPullTemplate.call(that);
              cb(template);
            }
        })
    },
    controller:function(methodName,config,cb){
        if(typeof config == 'function'){
            cb = config;
            config = {};
        }
        
        reqwest({
            url: 'components/'+this.name+'/'+methodName, 
            data: config,
            method: 'get', 
            success: function (response) {
              try { var r = JSON.parse(response); cb(r) }catch(e){ cb(response) };
            }
        })
    },
    onPullTemplate:function(){}
}
z.Component.extend = z.utils.extend;

z.registerComponent = function(child) {
    z.components[child.name] = z.Component.extend(child);
}

z.initDomComponents = function() {
    var domComponents = document.querySelectorAll('[data-component]');

    for (var i = 0; i < domComponents.length; i++) {
        var componentName = domComponents[i].getAttribute('data-component');
        if (componentName in z.components) {
            var newComponent = new z.components[componentName]({
                el: domComponents[i],
                id: domComponents[i].getAttribute('id')
            });
        }
    };
};

if(window){
    window.z = z;
}

module.exports = z;

