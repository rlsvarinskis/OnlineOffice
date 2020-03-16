var Graph = function()
{
	this.data = [];
	
	this.biggestX = 0;
	this.biggestY = 0;
	this.smallestX = Infinity;
	this.smallestY = Infinity;
	
	this.title = "Graph 2 good 4 you";
	this.titleSize = 46;
	this.titleFont = "Open sans condensed";
	this.titleColor = "#fff";
	
	this.keySize = 15;
	this.keyFont = "Open sans";
	this.keyColor = "#ddd";
	
	this.padding = {left: 100, bottom: 20, top: 20, right: 100};
}

Graph.prototype.addData = function(name, i, clr)
{
	if (typeof i == 'number')
		i = [i];
	if (i instanceof Array)
	{
		this.data.push({name: name, color: clr, data: i});
		
		if (i.length - 1 > this.biggestX)
			this.biggestX = i.length - 1;
		if (i.length - 1 < this.smallestX)
			this.smallestX = i.length - 1;
		
		for (var x = 0; x < i.length; x++)
		{
			if (i[x] > this.biggestY)
				this.biggestY = i[x];
			if (i[x] < this.smallestY)
				this.smallestY = i[x];
		}
		
		this.smallestX = 0;
	}
}

Graph.prototype.removeData = function(i)
{
	if (typeof i == 'number')
	{
		this.data[x].element.parentNode.removeChild(this.data[x].element);
		this.data.splice(i, 1);
	} else if (typeof i == 'string')
	{
		for (var x = 0; x < this.data.length; x++)
		{
			var d = this.data[x];
			if (d.name == i)
			{
				d.element.parentNode.removeChild(d.element);
				this.data.splice(x, 1);
				break;
			}
		}
	}
	
	for (var x = 0; x < this.data.length; x++)
	{
		var thedata = this.data[x].data;
		if (this.biggestX < (thedata.length - 1))
			this.biggestX = (thedata.length - 1);
		if (this.smallestX > (thedata.length - 1))
			this.smallestX = (thedata.length - 1);
		for (var y = 0; y < thedata.length; y++)
		{
			if (this.biggestY < thedata[y])
				this.biggestY = thedata[y];
			if (this.smallestY > thedata[y])
				this.smallestY = thedata[y];
		}
	}
	this.smallestX = 0;
}

Graph.prototype.drawData = function(canvas, ctx, left, bottom, w, h)
{
}

Graph.prototype.redraw = function(canvas, t, x, y, w, h)
{
}

Graph.prototype.drawTitle = function(ctx, x, y, width)
{
	ctx.font = this.titleSize + "px " + this.titleFont;
	ctx.fillStyle = this.titleColor;
	ctx.textAlign = "center";
	ctx.textBaseline = "top";
	
	ctx.fillText(this.title, x + width / 2, y);
	
	return this.titleSize;
}

Graph.prototype.drawKey = function(ctx, x1, y1, width)
{
	ctx.font = this.keySize + "px " + this.keyFont;
	ctx.fillStyle = this.keyColor;
	ctx.textAlign = "left";
	ctx.textBaseline = "bottom";
	
	var h = this.keySize;
	var x = 0;
	
	var w = 0;
	
	for (var i = 0; i < this.data.length; i++)
	{
		var nw = ctx.measureText(this.data[i].name).width + this.keySize + 30;
		w += nw;
		if (w > width - this.padding.left - this.padding.right)
		{
			x = this.drawKeyLine(ctx, w - nw - 20, x, h, i, x1, y1, width);
			h += this.keySize + 5;
			w = nw;
		}
	}
	x = this.drawKeyLine(ctx, w, x, h, this.data.length, x1, y1, width);
	
	return h;
}

Graph.prototype.drawKeyLine = function(ctx, w, x, h, i, x1, y1, width)
{
	var l = x1 + (width - w) / 2;
	for (; x < i; x++)
	{
		ctx.fillStyle = this.data[x].color;
		ctx.fillRect(l, y1 + h, this.keySize, -this.keySize);
		
		ctx.fillStyle = this.keyColor;
		ctx.fillText(this.data[x].name, l + this.keySize + 10, y1 + h + 3);
		
		l += ctx.measureText(this.data[x].name).width + 30 + this.keySize;
	}
	return x;
}

var XYGraph = function()
{
	Graph.call(this);
	this.xaxis = {
		units: "",
		title: "Quarter",
		fencepost: true,
		lines: true,
		
		unitSize: 16,
		unitFont: "Gafata",
		unitColor: "#ddd",
		
		titleSize: 24,
		titleFont: "Gafata",
		titlePadding: 20,
		titleColor: "#fff"
	};
	
	this.yaxis = {
		units: " $",
		title: "Net worth (dollars)",
		lines: true,
		unitSize: 16,
		unitFont: "Gafata",
		unitColor: "#ddd",
		
		titleSize: 24,
		titleFont: "Gafata",
		titlePadding: 20,
		titleColor: "#fff"
	};
	this.titles = [];
	
	this.area = {top: 10, right: 20, bottom: 20, left: 20};
	this.keyPadding = {top: 20, bottom: 0};
	
	this.lineColor = "#ddd";
	this.lineWidth = 0.25;
}

XYGraph.prototype = new Graph();

Graph.prototype.setTitles = function(titles)
{
	if (titles instanceof Array)
		this.titles = titles;
}

XYGraph.prototype.redraw = function(canvas, t, x, y, width, height)
{	
	var ctx = canvas.getContext("2d");
	
	ctx.clearRect(x, y, width, height);
	
	var x1 = x + this.padding.left;
	var y1 = y + this.padding.top;
	
	var x2 = x + width - this.padding.right;
	var y2 = y + height - this.padding.bottom;
	
	y1 += this.drawTitle(ctx, x1, y1, x2 - x1) + this.keyPadding.top;
	y1 += this.drawKey(ctx, x1, y1, x2 - x1) + this.keyPadding.bottom + this.area.top;
	
	var rect = this.placeAxes(ctx, x1, y1, x2 - x1, y2 - y1);
	
	x1 += rect.x + this.area.left;
	x2 -= this.area.right;
	y1 += this.area.top;
	y2 -= rect.y + this.area.bottom;
	
	this.drawLines(ctx, x1, y1, x2 - x1, y2 - y1);
	this.drawData(ctx, x1, y1, x2 - x1, y2 - y1, t);
}

XYGraph.prototype.drawLines = function(ctx, x1, y1, w, h)
{
	ctx.strokeStyle = this.lineColor;
	ctx.lineWidth = this.lineWidth;
	ctx.beginPath();
	if (this.yaxis.lines)
		this.drawHorizontalLines(ctx, x1, y1, w, h);
	if (this.xaxis.lines)
		this.drawVerticalLines(ctx, x1, y1, w, h);
	ctx.stroke();
}
XYGraph.prototype.drawHorizontalLines = function(ctx, x1, y1, w, h)
{
	var lines = Math.floor(h / 40);
	var linedistance = h / lines;
	for (var x = 0; x <= lines; x++)
	{
		var h = y1 + Math.floor(x * linedistance) + 0.5;
		ctx.moveTo(x1, h);
		ctx.lineTo(x1 + w, h);
	}
}
XYGraph.prototype.drawVerticalLines = function(ctx, x1, y1, w, h)
{
	var xWidth = this.biggestX - this.smallestX + !this.xaxis.fencepost;
	
	var lines = Math.min(Math.floor(w / 80) + !this.xaxis.fencepost, xWidth);
	var distancePerTick = w / xWidth;
	var ticksPerLine = xWidth / lines;
	for (var x = 0; x <= lines; x++)
	{
		var xw = x1 + Math.round(Math.floor(x * ticksPerLine) * distancePerTick) - 0.5;
		ctx.moveTo(xw, y1);
		ctx.lineTo(xw, y1 + h);
	}
}

XYGraph.prototype.placeAxes = function(ctx, x1, y1, w, h)
{
	var y = (this.xaxis.titlePadding + this.xaxis.unitSize + this.xaxis.titleSize);
	
	var x = this.placeNumbersY(ctx, x1, y1 + this.area.top, w, h - y - this.area.top - this.area.bottom);
	this.placeNumbersX(ctx, x1 + x + this.area.left, y1 + h - y, w - x - this.area.left - this.area.right, y);
	
	return {x: x, y: y};
}
XYGraph.prototype.placeNumbersX = function(ctx, x1, y1, width, height)
{
	ctx.font = this.xaxis.titleSize + "px " + this.xaxis.titleFont;
	ctx.fillStyle = this.xaxis.titleColor;
	ctx.textAlign = "center";
	ctx.textBaseline = "bottom";
	
	ctx.fillText(this.xaxis.title, x1 + width / 2, y1 + height);
	
	ctx.font = this.xaxis.unitSize + "px " + this.xaxis.unitFont;
	ctx.fillStyle = this.xaxis.unitColor;
	
	var xWidth = this.biggestX - this.smallestX;
	
	var lines = Math.min(Math.floor(width / 80), xWidth);
	var distancePerTick = width / (xWidth + !this.xaxis.fencepost);
	var ticksPerLine = (xWidth + !this.xaxis.fencepost) / (lines + !this.xaxis.fencepost);
	
	var xtra = 0;
	if (!this.xaxis.fencepost)
		xtra = distancePerTick / 2;
	
	for (var x = 0; x <= lines; x++)
	{
		var a = Math.floor(x * ticksPerLine);
		if (this.titles.length > a + this.smallestX && a + this.smallestX >= 0)
			ctx.fillText(this.titles[a + this.smallestX], x1 + xtra + a * distancePerTick, y1 + height - this.xaxis.titleSize - this.xaxis.titlePadding);
		else
			ctx.fillText((a + this.smallestX + 1) + this.xaxis.units, x1 + xtra + a * distancePerTick, y1 + height - this.xaxis.titleSize - this.xaxis.titlePadding);
	}
}
XYGraph.prototype.placeNumbersY = function(ctx, x1, y1, width, height)
{
	ctx.font = this.yaxis.unitSize + "px " + this.yaxis.unitFont;
	ctx.fillStyle = this.yaxis.unitColor;
	ctx.textAlign = "right";
	ctx.textBaseline = "middle";
	
	var yDif = this.biggestY - this.smallestY;
	
	var w = 0;
	
	var lines = Math.floor(height / 40);
	var linedistance = height / lines;
	for (var x = 0; x <= lines; x++)
		w = Math.max(w, ctx.measureText((Math.round((x * yDif / lines + this.smallestY) * 100) / 100) + this.yaxis.units).width);
	for (var x = 0; x <= lines; x++)
		ctx.fillText((Math.round((x * yDif / lines + this.smallestY) * 100) / 100) + this.yaxis.units, x1 + w + this.yaxis.titlePadding + this.yaxis.unitSize, y1 + height - (x * linedistance));
	
	ctx.save();
	
	ctx.textAlign = "center";
	ctx.font = this.yaxis.titleSize + "px " + this.yaxis.titleFont;
	ctx.fillStyle = this.yaxis.titleColor;
	ctx.translate(x1, y1 + height / 2);
	ctx.rotate(-Math.PI / 2);
	ctx.fillText(this.yaxis.title, 0, 0);
	
	ctx.restore();
	
	return w + this.yaxis.unitSize + this.yaxis.titlePadding;
}

var LineGraph = function()
{
	XYGraph.call(this);
}

LineGraph.prototype = new XYGraph();

LineGraph.prototype.drawData = function(ctx, x1, y1, w, h, t)
{
	ctx.save();
	ctx.beginPath();
	ctx.rect(x1, y1, w * t, h);
	//ctx.stroke();
	ctx.clip();
	
	var perdata = w / (this.biggestX - this.smallestX + !this.xaxis.fencepost);
	var pery = h / (this.biggestY - this.smallestY);
	
	if (!this.xaxis.fencepost)
		x1 += 0.5 * perdata;
	
	for (var x = 0; x < this.data.length; x++)
	{
		var thedata = this.data[x].data;
		ctx.strokeStyle = this.data[x].color;
		ctx.fillStyle = this.data[x].color;
		ctx.lineWidth = this.data[x].lineWidth ? this.data[x].lineWidth : 3;
		
		ctx.beginPath();
		ctx.moveTo(x1, y1 + h - (thedata[0] - this.smallestY) * pery);
		for (var y = 0; y < thedata.length; y++)
		{
			if (typeof thedata[y] != 'number' && y < thedata.length - 1)
				ctx.moveTo(x1 + perdata * (y + 1 - this.smallestX), y1 + h - (thedata[y + 1] - this.smallestY) * pery);
			ctx.lineTo(x1 + perdata * (y - this.smallestX), y1 + h - (thedata[y] - this.smallestY) * pery);
		}
		ctx.stroke();
		for (var y = 0; y < thedata.length; y++)
		{
			if (typeof thedata[y] != 'number')
				continue;
			ctx.fillRect(x1 + perdata * (y - this.smallestX) - 3, y1 + h - (thedata[y] - this.smallestY) * pery - 3, 6, 6);
		}
	}
	
	ctx.restore();
}

var AreaGraph = function()
{
	XYGraph.call(this);
}

AreaGraph.prototype = new XYGraph();

AreaGraph.prototype.drawData = function(ctx, x1, y1, w, h, t)
{
	if (this.smallestY > 0)
		this.smallestY = 0;
	
	if (this.biggestY < 0)
		this.biggestY = 0;
	
	var perdata = w / (this.biggestX - this.smallestX + !this.xaxis.fencepost);
	var pery = h / (this.biggestY - this.smallestY);
	
	if (!this.xaxis.fencepost)
		x1 += 0.5 * perdata;
	
	ctx.globalAlpha = 0.5;
	
	for (var x = 0; x < this.data.length; x++)
	{
		var thedata = this.data[x].data;
		ctx.fillStyle = this.data[x].color;
		ctx.lineWidth = this.data[x].lineWidth ? this.data[x].lineWidth : 3;
		
		ctx.beginPath();
		ctx.moveTo(x1, y1 + h + this.smallestY * pery);
		for (var y = 0; y < thedata.length; y++)
		{
			if (typeof thedata[y] != 'number')
			{
				ctx.lineTo(x1 + perdata * (y - 1 - this.smallestX), y1 + h + this.smallestY * pery);
				ctx.lineTo(x1 + perdata * (y + 1 - this.smallestX), y1 + h + this.smallestY * pery);
				continue;
			}
			ctx.lineTo(x1 + perdata * (y - this.smallestX), y1 + h - (thedata[y] * t - this.smallestY) * pery);
			//sum[y] += thedata[y];
		}
		ctx.lineTo(x1 + perdata * (thedata.length - 1 - this.smallestX), y1 + h + this.smallestY * pery);
		ctx.fill();
	}
	ctx.globalAlpha = 1;
	
	for (var x = 0; x < this.data.length; x++)
	{
		var thedata = this.data[x].data;
		ctx.strokeStyle = this.data[x].color;
		ctx.fillStyle = this.data[x].color;
		ctx.lineWidth = this.data[x].lineWidth ? this.data[x].lineWidth : 3;
		
		ctx.beginPath();
		ctx.moveTo(x1, y1 + h - (thedata[0] * t - this.smallestY) * pery);
		for (var y = 0; y < thedata.length; y++)
		{
			if (typeof thedata[y] != 'number' && y < thedata.length - 1)
				ctx.moveTo(x1 + perdata * (y + 1 - this.smallestX), y1 + h - (thedata[y + 1] * t - this.smallestY) * pery);
			ctx.lineTo(x1 + perdata * (y - this.smallestX), y1 + h - (thedata[y] * t - this.smallestY) * pery);
		}
		ctx.stroke();
		
		for (var y = 0; y < thedata.length; y++)
		{
			if (typeof thedata[y] != 'number')
				continue;
			ctx.fillRect(x1 + perdata * (y - this.smallestX) - 3, y1 + h - (thedata[y] * t - this.smallestY) * pery - 3, 6, 6);
		}
	}
}

var BarGraph = function()
{
	XYGraph.call(this);
	this.barPadding = 2;
	this.indexPadding = 10;
}

BarGraph.prototype = new XYGraph();

BarGraph.prototype.drawData = function(ctx, x1, y1, w, h, t)
{
	ctx.save();
	ctx.beginPath();
	ctx.rect(x1, y1, w, h);
	//ctx.stroke();
	ctx.clip();
	
	var perdata = w / (this.biggestX - this.smallestX + 1);
	var pery = h / (this.biggestY - this.smallestY);
	var perbar = (perdata - this.indexPadding * 2) / this.data.length - this.barPadding * 2;
	
	//ctx.globalAlpha = 0.5;
	
	for (var y = this.smallestX; y < this.biggestX + 1; y++)
	{
		for (var x = 0; x < this.data.length; x++)
		{
			if (this.data[x].length <= y || typeof this.data[x].data[y] != 'number')
				continue;
			
			ctx.fillStyle = this.data[x].color;
			ctx.fillRect(x1 + this.indexPadding + perdata * (y - this.smallestX) + perbar * x + this.barPadding * x * 2 + this.barPadding, y1 + h + this.smallestY * pery, perbar, -this.data[x].data[y] * pery * t);
		}
	}
	
	/*ctx.globalAlpha = 1;
	
	for (var y = this.smallestX; y < this.biggestX; y++)
	{
		for (var x = 0; x < this.data.length; x++)
		{
			if (this.data[x].length <= y || typeof this.data[x].data[y] != 'number')
				continue;
			ctx.lineWidth = this.data[x].lineWidth ? this.data[x].lineWidth : 3;
			ctx.strokeStyle = this.data[x].color;
			ctx.strokeRect(left + perdata * (y - this.smallestX) + perbar * x + ctx.lineWidth / 2, canvas.height - bottom + this.smallestY * pery, perbar - ctx.lineWidth, -this.data[x].data[y] * pery * t);
		}
	}*/
	ctx.restore();
}

BarGraph.prototype.placeNumbersX = function(ctx, x1, y1, width, height)
{
	ctx.font = this.xaxis.titleSize + "px " + this.xaxis.titleFont;
	ctx.fillStyle = this.xaxis.titleColor;
	ctx.textAlign = "center";
	ctx.textBaseline = "bottom";
	
	ctx.fillText(this.xaxis.title, x1 + width / 2, y1 + height);
	
	ctx.font = this.xaxis.unitSize + "px " + this.xaxis.unitFont;
	ctx.fillStyle = this.xaxis.unitColor;
	
	var xWidth = this.biggestX - this.smallestX;
	
	var lines = Math.min(Math.floor(width / 80), xWidth);
	var distancePerTick = width / (xWidth + 1);
	var ticksPerLine = (xWidth + 1) / (lines + 1);
	
	var xtra = distancePerTick / 2;
	
	for (var x = 0; x <= lines; x++)
	{
		var a = Math.floor(x * ticksPerLine);
		if (this.titles.length > a + this.smallestX && a + this.smallestX >= 0)
			ctx.fillText(this.titles[a + this.smallestX], x1 + xtra + a * distancePerTick, y1 + height - this.xaxis.titleSize - this.xaxis.titlePadding);
		else
			ctx.fillText((a + this.smallestX + 1) + this.xaxis.units, x1 + xtra + a * distancePerTick, y1 + height - this.xaxis.titleSize - this.xaxis.titlePadding);
	}
}
BarGraph.prototype.drawVerticalLines = function(ctx, x1, y1, w, h)
{
	var xWidth = this.biggestX - this.smallestX + 1;
	
	var lines = Math.min(Math.floor(w / 80) + 1, xWidth);
	var distancePerTick = w / xWidth;
	var ticksPerLine = xWidth / lines;
	for (var x = 0; x <= lines; x++)
	{
		var xw = x1 + Math.round(Math.floor(x * ticksPerLine) * distancePerTick) - 0.5;
		ctx.moveTo(xw, y1);
		ctx.lineTo(xw, y1 + h);
	}
}

var PercentageGraph = function(canvas)
{
	
}

var PieGraph = function()
{
	Graph.call(this);
}

PieGraph.prototype = new Graph();

PieGraph.prototype.redraw = function(canvas, t, x, y, width, height)
{	
	var ctx = canvas.getContext("2d");
	
	ctx.clearRect(x, y, width, height);
	
	var x1 = x + this.padding.left;
	var y1 = y + this.padding.top;
	
	var x2 = x + width - this.padding.right;
	var y2 = y + height - this.padding.bottom;
	
	y1 += this.drawTitle(ctx, x1, y1, x2 - x1)/* + this.keyPadding.top*/;
	y1 += this.drawKey(ctx, x1, y1, x2 - x1)/* + this.keyPadding.bottom + this.area.top*/;
	
	//x1 += this.area.left;
	//x2 -= this.area.right;
	//y1 += this.area.top;
	//y2 -= this.area.bottom;
	
	this.drawData(ctx, x1, y1, x2 - x1, y2 - y1, t);
}

PieGraph.prototype.drawData = function(ctx, x1, y1, w, h, t)
{
	ctx.save();
	ctx.beginPath();
	ctx.rect(x1, y1, w, h);
	//ctx.stroke();
	ctx.clip();
	
	var total = 0;
	var depth = 0;
	
	for (var i = 0; i < this.data.length; i++)
	{
		this.data[i].data.color = this.data[i].color;
		var s = this.sum(this.data[i].data)
		this.data[i].data.sum = s.sum;
		total += s.sum;
		depth = Math.max(depth, s.depth);
	}
	
	depth++;
	
	var tot = 1 - 1 / Math.pow(2, depth);
	
	var cur = -0.5 * Math.PI;
	
	for (var i = 0; i < this.data.length; i++)
	{
		var ang = cur + this.data[i].data.sum * Math.PI / total * t;
		console.log(ang / Math.PI * 180 + " degrees");
		console.log(Math.sin(ang) + " sin");
		console.log(Math.cos(ang) + " cos");
		cur = this.paint(ctx, x1 + w / 2 + Math.cos(ang) * 5, y1 + h / 2 + Math.sin(ang) * 5, Math.min(w, h) / 2 - 5 * Math.min(depth, 2), t, this.data[i].data, total, cur, 0.5 / tot, 0, 0);
	}
	
	ctx.restore();
}

PieGraph.prototype.sum = function(a)
{
	if (a instanceof Array)
		while (a.length == 1)
			a = a[0];
	
	if (a instanceof Array && a.length == 0)
		return {sum: 0, depth: 0};
	
	if (typeof a == 'number')
	{
		return {sum: a, depth: 0};
	} else if (a instanceof Array)
	{
		a.sum = 0;
		var depth = 0;
		for (var i = 0; i < a.length; i++)
		{
			var s = this.sum(a[i]);
			a.sum += s.sum;
			depth = Math.max(depth, s.depth + 1);
		}
		return {sum: a.sum, depth: depth};
	}
	return {sum: 0, depth: 0};
}

PieGraph.prototype.paint = function(ctx, x, y, r, t, a, total, cur, p, st, first)
{
	if (a.color)
	{
		ctx.fillStyle = a.color;
		ctx.strokeStyle = a.color;
	}
	if (a.lineWidth)
		ctx.lineWidth = a.lineWidth;
	
	if (a instanceof Array)
		while (a.length == 1)
			a = a[0];
	
	if (a instanceof Array && a.length == 0)
		return cur;
	
	if (typeof a == 'number')
	{
		var end = cur + a * 2 / total * Math.PI * t;
		
		ctx.beginPath();
		ctx.arc(x, y, r * (p + st), cur, end);
		ctx.arc(x, y, r * st + 5 * first, end, cur, true);
		ctx.closePath();
		ctx.fill();
		
		return end;
	} else if (a instanceof Array)
	{
		var old = ctx.fillStyle;
		var cur2 = cur;
		for (var i = 0; i < a.length; i++)
		{
			//ctx.fillStyle = "rgb(" + Math.floor(Math.random() * 256) + ", " + Math.floor(Math.random() * 256) + ", " + Math.floor(Math.random() * 256) + ")";
			cur2 = this.paint(ctx, x, y, r, t, a[i], total, cur2,  p / 2, st + p, 1);
		}
		ctx.fillStyle = old;
		
		var end = cur + a.sum * 2 / total * Math.PI * t;
		
		ctx.beginPath();
		ctx.arc(x, y, r * (p + st), cur, end);
		ctx.arc(x, y, r * st + 5 * first, end, cur, true);
		ctx.fill();
		return end;
	}
	return cur;
}

var WebGraph = function(canvas, values)
{
	this.values = values;
	//Polygon that displays smaller polygon inside it
}

var redraw = function(g, c, t)
{
	var doDraw = function(g, c, start, t)
	{
		var timePassed = new Date().getTime() - start;
		if (c.scrollWidth != c.width || c.scrollHeight != c.height)
		{
			c.width = c.scrollWidth;
			c.height = c.scrollHeight;
		}
		if (timePassed < t)
		{
			var nt = ease(timePassed, 0, 1, t);
			//g.redraw(c, nt, c.width / 3 - c.width * nt / 3, 0, c.width * 2 / 3, c.height);
			g.redraw(c, nt, 0, 0, c.width, c.height);
			window.requestAnimationFrame(function(){doDraw(g, c, start, t);});
		} else
		{
			//g.redraw(c, 1, 0, 0, c.width * 2 / 3, c.height);
			g.redraw(c, 1, 0, 0, c.width, c.height);
		}
	}
	doDraw(g, c, new Date().getTime(), t);
}

var ease = function (t, b, c, d)
{
	t /= d / 2;
	if (t < 1) return c / 2 * t * t + b;
	t--;
	return -c / 2 * (t * (t - 2) - 1) + b;
};