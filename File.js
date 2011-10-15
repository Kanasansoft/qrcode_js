function File(filename,mode){
	this.offset = 0;
	this.binmode = (/bin/.test(mode)) ? true : false ;
	var req = new XMLHttpRequest;
	if(this.binmode) filename+=".hex";
	req.open("GET",filename,false);
	req.send(null);
	this.file = req.responseText;
}
File.open = function(filename,mode){
	return new File(filename,mode)
}

File.prototype.read = function(length){
	if(this.binmode){length *= 2}
	var res = this.file.substr(this.offset,length)
	this.offset += length;
	if(this.binmode){
		res = res.pack();
	}
	return res
}

File.prototype.close = null;

