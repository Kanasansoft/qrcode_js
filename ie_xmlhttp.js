/*
 XMLHttpRequest for IE (ver 1.0 / 2005-09-03)
  by ma.la http://ma.la/

 Licence: GPL
  http://www.gnu.org/copyleft/gpl.html
*/
(function(){
if(typeof ActiveXObject == "function" && typeof XMLHttpRequest == "undefined"){
	XMLHttpRequest = function(){
		var self = this;
		var props = "readyState,responseText,responseXML,status,statusText".split(",");
		this.readyState  = 0;
		this.__request__ = new ActiveXObject("Microsoft.XMLHTTP");
		this.__request__.onreadystatechange = function(){
			for(var i=0;i<props.length;i++){
				try{
					self[props[i]] = self.__request__[props[i]]
				}catch(e){
				}
			}
			self.onreadystatechange();
			self.readyState == 4 && self.onload();
		}
		this.onreadystatechange = function(){};
		this.onload = function(){}
	}
	var methods = "open,abort,send,setRequestHeader,getResponseHeader,getAllResponseHeaders".split(",");
	var make_method = function(name){
		XMLHttpRequest.prototype[name] = function(){
			var params = new Array(arguments.length);
			for(var i=0;i<params.length;i++) params[i] = "_"+i;
			return Function(
				params.join(","),
				["return this.__request__.",name,"(",params.join(","),")"].join("")
			).apply(this,arguments);
		}
	};
	for(var i=0;i<methods.length;i++) make_method(methods[i]);
}
})();