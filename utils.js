module.exports = {
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
    },
    forEach:function(collection,cb){
        for (var i = 0; i < collection.length; i++) {
            cb(collection[i]);
        };
    },
    trim:function(text){
        return text.replace(/^\s+|\s+$/gm, '');
    },
    removeNode:function(node){
            node.parentNode.removeChild(node);
    },
    empty:function(node){
        while (node.firstChild) {
            node.firstChild.parentNode.removeChild(node.firstChild);
        }
    },
    getLocaleByHostname:function(hostname){
        var locales = {};
        locales['www.zonajobs.com.ar'] = 'ar';
        locales['www.zonajobs.com.mx'] = 'mx';
        locales['www.zonajobs.com.co'] = 'co';
        locales['www.zonajobs.com.ve'] = 've';
        locales['www.zonajobs.cl'] = 'cl';
        locales['www.zonajobs.co.cr'] = 'cr';
        locales['www.zonajobs.com.gt'] = 'gt';
        locales['www.zonajobs.com.ni'] = 'ni';
        locales['www.zonajobs.com.pa'] = 'pa';
        locales['www.zonajobs.com.pe'] = 'pe';
        locales['www.zonajobs.com.uy'] = 'uy';
        locales['www.zonajobs.es'] = 'es';
        locales['www.brajobs.com'] = 'br';
        return locales[hostname];
    }
}