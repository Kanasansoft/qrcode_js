/*
 Array extra support (ver 1.0 / 2005-09-13)
  by ma.la http://ma.la/

 Licence: GPL
  http://www.gnu.org/copyleft/gpl.html
*/

Array.prototype.forEach = function(callback,thisObject){
	for(var i=0,len=this.length;i<len;i++)
		callback.call(thisObject,this[i],i,this)
}
Array.prototype.map = function(callback,thisObject){
	for(var i=0,res=[],len=this.length;i<len;i++)
		res[i] = callback.call(thisObject,this[i],i,this);
	return res
}
Array.prototype.filter = function(callback,thisObject){
	for(var i=0,res=[],len=this.length;i<len;i++)
		callback.call(thisObject,this[i],i,this) && res.push(this[i]);
	return res
}
Array.prototype.indexOf = function(searchElement,fromIndex){
	var i = (fromIndex < 0) ? this.length+fromIndex : fromIndex || 0;
	for(;i<this.length;i++)
		if(searchElement === this[i]) return i;
	return -1
}
Array.prototype.lastIndexOf = function(searchElement,fromIndex){
	var max = this.length-1;
	var i = (fromIndex < 0)   ? Math.max(max+1 + fromIndex,0) :
			(fromIndex > max) ? max :
			max-(fromIndex||0) || max;
	for(;i>=0;i--)
		if(searchElement === this[i]) return i;
	return -1
}
Array.prototype.every = function(callback,thisObject){
	for(var i=0,len=this.length;i<len;i++)
		if(!callback.call(thisObject,this[i],i,this)) return false;
	return true
}
Array.prototype.some = function(callback,thisObject){
	for(var i=0,len=this.length;i<len;i++)
		if(callback.call(thisObject,this[i],i,this)) return true;
	return false
}
/*
  and more extra methods
*/
Array.prototype.clone = function(){
	return Array.apply(null,this)
};

(function(){
 var native_sort = Array.prototype.sort;
 Array.prototype.sortIt = function(){return native_sort.apply(this,arguments)}
 var native_reverse = Array.prototype.reverse;
 Array.prototype.reverseIt = function(){return native_reverse.apply(this,arguments)}
})();
Array.prototype.sort = function(){
	var tmp = this.clone();
	return tmp.sortIt.apply(tmp,arguments)
}
Array.prototype.reverse = function(){
	var tmp = this.clone();
	return tmp.reverseIt.apply(tmp,arguments)
}

Array.prototype.last = function(){
	return this[this.length-1]
}
Array.prototype.compact = function(){
	return this.remove("");
}
Array.prototype.uniq = function(){
	var tmp = {};
	var len = this.length;
	for(var i=0;i<this.length;i++){
		if(tmp.hasOwnProperty(this[i])){
			this.splice(i,1);
			if(this.length == i){break}
			i--;
		}else{
			tmp[this[i]] = true;
		}
	}
	return this;
}
Array.prototype.select = function(func){
	var result = [];
	for(var i=0;i<this.length;i++)
		func(this[i],i) && result.push(this[i]);
	return result;
}

// 遅延検索。numには取り急ぎ欲しい件数、hit時に実行する関数
Array.prototype.lazyselect = function(func,num,callback){
	var result = [];
	var count  = 0;
	var self   = this;
	for(var i=0;i<this.length;i++){
		if(func(this[i],i)){
			count++;
			result.push(this[i])
		}
		if(count == num){i++; break;}
	}
	(function(){
		if(i == self.length){arguments.callee.kill();return;}
		if(func(self[i],i)){
			result.push(self[i]);
			callback({
				result : result,
				thread : arguments.callee
			});
			window.status = "追加"+i;
		}
		i++
	}).bg(10);
	return result;
}

Array.prototype.append = function(val){
	this.push(val);
	return this
}
Array.prototype.remove = function(to_remove){
	return this.select(function(val){
		return val != to_remove ? true : false
	});
}
/*
 配列を条件で分割する、trueになったら新しい行に。
*/
Array.prototype.splitter = function(callback,thisObject){
	var res = [];
	var tmp = [];
	for(var i=0,len=this.length;i<len;i++)
		callback.call(thisObject,this[i],i,this) ? 
			(tmp.push(this[i]),res.push(tmp),tmp=[]) : 
			 tmp.push(this[i]);
	tmp.length ? res.push(tmp) : 0;
	return res;
}
// n個数ずつに分割する
// [1,2,3,4,5].splitPer(2) = [[1,2],[3,4],[5]];
Array.prototype.splitPer = function(num){
	return this.splitter(function(v,i){return i%num==num-1});
}
// n個数に分割する
// [1,2,3,4,5].splitTo(2) => [[1,2,3],[4,5]]
Array.prototype.splitTo = function(num){
	var per = Math.ceil(this.length / num);
	return this.splitter(function(v,i){return i%per==per-1});
}


/*
 date_extra.js

*/

if(typeof Locale == "undefined") Locale = {};
Locale.jp = {
 abday   : ["日", "月", "火", "水", "木", "金", "土"],
 day     : ["日曜日", "月曜日", "火曜日", "水曜日", "木曜日", "金曜日", "土曜日"],
 abmon   : [" 1月", " 2月", " 3月", " 4月", " 5月", " 6月", " 7月", " 8月", " 9月", "10月", "11月", "12月"],
 mon     : ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
 d_t_fmt : "%Y年%m月%d日 %H時%M分%S秒",
 d_fmt   : "%Y年%m月%d日",
 t_fmt   : "%H時%M分%S秒",
 am_pm   : ["午前", "午後"],
 t_fmt_ampm : "%p%H時%M分%S秒"
}
Locale.en = {
 abday   : ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
 day     : ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
 abmon   : ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
 mon     : ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
 d_t_fmt : "%a %b %d %Y",
 d_fmt   : "%d/%m/%Y",
 t_fmt   : "%H:%M:%S",
 am_pm   : ["AM", "PM"]
}

// locale指定、グローバル
Date.setLocale = function(lc){
	Date.prototype.locale = lc
}
// locale指定、そのオブジェクトに対してのみ
Date.prototype.setLocale = function(lc){
	this.locale = lc;
	return this;
}

// うるう年を判別する
Date.isleap = function(year){
 return ((year % 400) == 0) ? 1 :
		((year % 100) == 0) ? 0 :
		((year % 4)   == 0) ? 1 :
		 0;
}
Date.prototype.isleap = function(){
	return Date.isleap(this.getFullYear())
}
Date.month_yday = [
	[0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334, 365],
	[0, 31, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335, 366]
];
/*
 tm object like ruby
  mon : 1-12
  yday: 1-366
*/
Date.prototype.tm = function(){
	with(this){return {
		year : getFullYear(),
		mon  : getMonth() + 1,
		mday : getDate(),
		yday : Date.month_yday[isleap()][getMonth()] + getDate(),
		wday : getDay(),
		hour : getHours(),
		min  : getMinutes(),
		sec  : getSeconds()
	}}
}
/*
http://www.microsoft.com/japan/msdn/library/default.asp?url=/japan/msdn/library/ja/cpref/html/frlrfSystemGlobalizationDateTimeFormatInfoClassTopic.asp 
*/
Date.prototype.toObject = function(){
	var zerofill = function(keta){
		return function(){return ("0".x(keta) + this).slice(-keta)}
	}
	with(this.tm()){
	var o = {
		yyyy : year,
		M    : mon,
		d    : mday,
		t    : Locale[this.locale].am_pm[(hour < 12 ) ? 0 : 1],
		h    : hour % 12 || 12,
		H    : hour,
		m    : min,
		s    : sec
	}}
	o.yy = this.getYear().format(zerofill(2));
	"M d H h m s".split(" ").forEach(function(v){
		o[v+v] = o[v].format(zerofill(2))
	});
	return o;
}
Date.prototype.strfObject = function(){
	var self = this;
	var tm = this.tm();
	var o  = this.toObject();
	var lc = Locale[this.locale];
	var lazy = function(f){
		var tmp = {};
		tmp.toString = function(){return self.strftime(f)}
		return tmp;
	}
	return {
		"a" : lc.abday[tm.wday],
		"A" : lc.day[tm.wday],
		"b" : lc.abmon[tm.mon-1],
		"B" : lc.mon[tm.mon-1],
		"c" : lazy(lc.d_t_fmt),
		"d" : o.dd,
		"H" : o.HH,
		"I" : o.hh,
		"j" : tm.yday,
		"M" : o.mm,
		"m" : o.MM,
		"p" : o.t,
		"S" : o.ss,
		"U" : "",
		"w" : tm.wday,
		"W" : "",
		"x" : lazy(lc.d_fmt),
		"X" : lazy(lc.t_fmt),
		"Y" : o.yyyy,
		"y" : o.yy,
		"z" : "",
		"Z" : ""
	}
}
Date.prototype.strftime = function(format){
	var obj = this.strfObject();
	return format.replace(/%(\w{1})/g,function(){
		var arg = arguments;
		return obj[arg[1]]
	})
}
Date.prototype.format = function(){

};
/*
 Function.prototype
*/

Function.prototype.isFunction = true;

/*
 インスタンス生成
*/
Function.prototype.New = 
Function.prototype.newInstance = function(){
	for(var i=0,arg=[];i<arguments.length;i++) arg.push("arguments["+i+"]");
	eval("var ins = new this("+arg.join(",")+")");
	return ins;
}
/*
 関数変形
*/
Function.prototype.getbody = function(){
	var m;
	return (m=this.toString().match(RE.func_body)) ? m[1] : "";
}
Function.prototype.getname = function(){
	var m;
	return (m=this.toString().match(RE.func_name)) ? m[1] : "";
}
Function.prototype.getargs = function(){
	var m;
	return (m=this.toString().match(RE.func_args)) ? m[1].split(/\s*,\s*/) : [];
}
// 使われている変数名を取得する
Function.prototype.getvars = function(){
	var body = this.getbody();
	var list = [];
	body.replace(/var ([\w$]+)/g,function(){
		list.push(arguments[1])
	});
	return list;
}

// 関数名を変更する
Function.prototype.rename = function(name){
	var self = this;
	eval("var tmp = function "+name+"("+self.getargs().join(",")+")"+"{return self.apply(this,arguments)}");
	return tmp
}
// 引数名を変更する
Function.prototype.renameArgs = function(arg){
	var self = this;
	eval("var tmp = function " + self.getname() + "(" + arg.join(",")+")"+"{return self.apply(this,arguments)}");
	return tmp
}
// 関数を再構築する
Function.prototype.rebuild = function(){
	var self = this;
	return Function(
		self.getargs().join(","),
		self.getbody()
	);
}
// withで囲むように変形する
Function.prototype.rebuildWith = function(base){
	var self = this;
	var tmp  = new Function(
		self.getargs().join(","),
		"with(arguments.callee.__base__){" + self.getbody() + "}"
	);
	tmp.__base__ = base;
	return tmp;
}
/*
 callとapplyを上書きして別の関数が実行されるようにする
*/
Function.prototype.swap = function(func){
	this.call  = function(){return func.apply(arguments[0],arguments.toArray().slice(1))}
	this.apply = function(){return func.apply(arguments[0],arguments[1])}
	return this;
}
/*
 固定
*/
Function.prototype.applied = function(thisObj,args){
	var self = this;
	return function(){
		return self.apply(thisObj,args)
	}
}
Function.prototype.bindThis = function(thisObj){
	var self = this;
	return function(){
		return self.apply(thisObj,arguments)
	}
}



/*
 関数をその場所で宣言しなおす。
*/
Function.prototype.to_here = function(str){
	return "var str = " + this
}
/*
 その場でevalで評価するために変形する。
  bodyからreturn を削除。
  引数は返値を格納する変数を文字列で。
*/
Function.prototype.to_eval = function(re){
	var self = this;
	return "try{" 
		+ self.getbody().replace(/(function.*?\{[^}]*?\})|(return)/g,
			function(){return $1 ? $0 : "throw"}.replace_callback()
		)
		+ "}catch(e){"
		+ (re ? "var " + re + " = e" : "")
		+ "}"
}

/*
 AOP
*/
// 引数の加工
Function.prototype.addBefore = function(func){
	var self = this;
	return function(){
		var args = func(arguments);
		return (args) ? self.apply(this,args) : self.apply(this,arguments)
	}
}
// 返値の加工
Function.prototype.addAfter  = function(func){
	var self = this;
	return function(){
		var old_rv = self.apply(this,arguments);
		var result = func(old_rv,arguments);
		return (result) ? result : old_rv;
	}
}
// 関数を置き換える
Function.prototype.addAround = function(func){
	return function(){
		return func.apply(this,arguments);
	}
}


/*
 Number.prototype
  2005-09-15
*/
Number.prototype.isNumber = true;

function zerofill(keta){
	return function(){return ("0".x(keta) + this).slice(-keta)}
}
// 指定桁数になるよう0で埋めたstringを返す
Number.prototype.zerofill = function(keta){
	return ("0".x(keta) + this).slice(-keta)
}
// 文字列に変換する際の関数を指定する
Number.prototype.format = function(func){
	this.toString = func;
	return this;
}
/*
 Object.prototype

*/
Object.extend = function(destination, source) {
	for (property in source) {
		source.own(property) &&
			(destination[property] = source[property])
	}
	return destination;
}
Object.prototype.extend = function(object) {
  return Object.extend.apply(this, [this, object]);
}
/*
Object.prototype.own = function(key){
	return this.hasOwnProperty(key)
}
*/
Object.prototype.own = Object.prototype.hasOwnProperty;

Object.prototype.extend({
	forEach : function(callback,thisObject){
		for(var i in this)
			this.own(i) && callback.call(thisObject,this[i],i,this)
	},
	every : function(callback,thisObject){
		for(var i in this)
			if(this.own(i)){
				if(!callback.call(thisObject,this[i],i,this)) return false;
			}
		return true;
	},
	keys : function(){
		var tmp = [];
		for(var i in this) this.own(i) && tmp.push(i);
		return tmp;
	},
	values : function(){
		var tmp = [];
		for(var i in this) this.own(i) && tmp.push(this[i]);
		return tmp;
	},
	each : function(func){
		for(var i in this) this.own(i) && func(this[i],i,this)
	},
	map  : function(callback,thisObject){
		var tmp = {};
		for(var i in this)
			this.own(i) && (tmp[i] = callback.call(thisObject,this[i],i,this));
		return tmp
	},
	toArray : function(){
		var tmp = [];
		for(var i=0;i<this.length;i++) tmp[i] = this[i];
		return tmp;
	},
	loop : function(func){
		for(var i=0;i<this.length;i++){
			if(this.hasOwnProperty(i)) func(i,this[i],this)
		}
	}
});
Object.prototype.getClassName = function(){
	return this.constructor.getname();
}


/*
 RegExp.prototype
*/

RegExp.prototype.isRegExp = true;

RE = Regexp = RegExp;
RegExp.escape = function(str){
	return str.replace(/(\\|\[|\]|\(|\)|\{|\}|\^|\-|\$|\||\+|\*|\?|\.|\!)/g,"\\$1");
};

// よく使われる正規表現を高速化
RE.func_body = /\{((:?.|\n)*)\}/;
RE.func_name = /function ([\w$]+)/;
RE.func_args = /\(([^)]*)/;

function MatchData(){
	var self = this;
	this.leftContext = this.pre_match  = new LazyString(function(){
		return self.input.slice(0,self.index)
	});
	this.rightContext = this.post_match = new LazyString(function(){
		return self.input.slice(self.index+self.$0.length)
	});
	return this;
}
MatchData.prototype.update = function(a){
	this.lastMatch = this.$0 = a[0];
	this.match = this.captures = [];
	for(var i=1;i<a.length-2;i++){
		this.match.push(a[i]);
		this["$"+i] = a[i];
	}
	this.index = a[a.length-2];
	this.input = this.$_ = a[a.length-1];
}

// 関数をreplaceのcallbackとして使いやすいように
Function.prototype.replace_callback = function(thisObject){
	var self = this;
	var match = new MatchData();
	var newfunc = self.rebuildWith(match);
	return function(){
		match.update(arguments);
		return newfunc.call(thisObject)
	}
}



/*
 String.prorotype

*/
String.prototype.isString = true;
String.prototype.x = function(l){
	for(var i=0,tmp="";i<l;i++) tmp+=this;
	return tmp;
}
String.prototype.chars = function() { return(this.split("")) }
String.prototype.toRegExp = function(){
	return new RegExp(this);
}



// 遅延評価される数値
function LazyNumber(func){
	this.toString = function(base){
		return base ? (func()).toString(base) : func()
	};
	this.isLazy = true;
}
// 遅延評価される文字列
function LazyString(func){
	this.toString = func;
	this.length = new LazyNumber(function(){return func().toString().length});
	this.isLazy = true;
}
LazyString.methods = [
	"split","substr","substring","slice","concat","toUpperCase","toLowerCase",
	"search","match","replace","charAt","length"
];
(function(){
	var m = LazyString.methods;
	var mm = function(method){
		return function(){
			var tmp = this.toString();
			return tmp[method].apply(tmp,arguments)
		}
	}
	for(var i=0;i<m.length;i++){
		LazyString.prototype[m[i]] = mm(m[i]);
	}
})();
Function.prototype.bg = function(ms){
	this.PID = setInterval(this,ms);
	return this;
}
Function.prototype.kill = function(){
	clearInterval(this.PID)
}
/*
 var a = function(v){alert(v)};
 var b = a.later(100);
 b("testtest");
 b.cancel(); // cancel
 b.notify(); // do 
*/
Function.prototype.later = function(ms){
	var self = this;
	var func = function(){
		var arg = func.arguments;
		var apply_to = this;
		var later_func = function(){
			self.apply(apply_to,arg)
		};
		var PID = setTimeout(later_func,ms);
		return {
			cancel : function(){clearTimeout(PID)},
			notify : function(){clearTimeout(PID);later_func()}
		}
	};
	return func;
};
Function.prototype.wait = Function.prototype.later;
