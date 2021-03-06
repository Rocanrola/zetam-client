require('./polyfills');

var reqwest = require('reqwest');
var z = {};

z.utils = require('./utils');
z.forms = require('./forms');
z.reqwest = reqwest;

z.components = {
    _all:[],
    getByName:function(name){
        var instances = [];
        for (var i = 0; i < this._all.length; i++) {
            if(this._all[i].name == name){
                instances.push(this._all[i]);
            }
        };
        return instances;
    }
};

 
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
    bindEvent:function(selector,eventName,methodName){
        var that = this;
        var nodes;

        if(typeof selector === 'string'){
            nodes = this.findAll(selector);
        }else{
            nodes = (selector instanceof window.Element) ? [selector] : selector;
        }
        
        for (var i = 0; i < nodes.length; i++) {
            nodes[i].addEventListener(eventName,function(e){
                that[methodName].call(that,e,this);
            });
        };
        return true;
    },
    controller:function(methodName,config,cb){
        if(typeof config == 'function'){
            cb = config;
            config = {};
        }
        
        reqwest({
            url: '/components/'+this.name+'/method/'+methodName, 
            data: config,
            method: 'get',
            type: 'json',
            success: function (res) {
                cb(res.err,res.res)
              // try { var r = JSON.parse(response); cb(r.err,r.res) }catch(e){ cb(response) };
            }
        })
    },
    on: function(channel, callback) {
            if (!this.channels) this.channels = [];
            if (!this.channels[channel]) this.channels[channel] = [];
            this.channels[channel].push({
                callback: callback
            });
            return this;
    },
    publish: function(channel) {
        var that = this;
        if(!this.channels || !this.channels[channel]) return false;
        var args = Array.prototype.slice.call(arguments, 1)

        z.utils.forEach(this.channels[channel],function(item) {
            item.callback.apply(that, args);
        })

        return this;
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
                name: componentName,
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

