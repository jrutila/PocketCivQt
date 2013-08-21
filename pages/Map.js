var HT = HT || HexagonTools.HT || {}
var Map = Map || {}
var Region = Region || {}
var Sea = Sea || {}
var Land = Land || {}
var Game = Game || {}

Map = function(width, height, map) {
    this.grid = new HT.Grid(width, height, 14, 9)
    this.hex = {}
    this.map = map
    for (var h = 0; h < this.grid.Hexes.length; h++)
    {
        var hex = this.grid.Hexes[h]        
        this.hex[hex.Id] = map.hex[hex.PathCoOrdY][hex.PathCoOrdX]
    }
}

function drawLand(ctx, region) {

    var land = Qt.createQmlObject('import QtQuick 2.0; Image { source: "image://res/modern/land'+region+'.png"; visible: false; }', parent)
    ctx.globalCompositeOperation = 'source-in';
    ctx.drawImage(land, 0, 0)
}

var regionCount = 8
var landRegion = regionCount
var seaRegion = regionCount+1

Map.prototype.paint = function(ctx) {
    var hexCnvs = new Array()
    var hexCtxs = new Array()
    for (var i = 0; i < regionCount+2; i++)
    {
        var hexCnv = Qt.createQmlObject('import QtQuick 2.0; Canvas { anchors.fill: parent; renderStrategy: Canvas.Immediate; visible: false; }', parent)
        hexCnvs.push(hexCnv)
        hexCtxs.push(hexCnv.getContext('2d'))
    }

    for (var h = 0; h < this.grid.Hexes.length; h++)
    {
        var hex = this.grid.Hexes[h]
        if ("id" in this.hex[hex.Id])
        {
            var ctxid = this.hex[hex.Id].id            
            if (ctxid <= regionCount)
                hex.paint(hexCtxs[ctxid-1])
        } else {
            if (this.hex[hex.Id].toString() === "Land")
                hex.paint(hexCtxs[landRegion])
            if (this.hex[hex.Id].toString() === "Sea")
                hex.paint(hexCtxs[seaRegion])
        }
    }

    for (var i = 0; i < regionCount; i++)
    {
        drawLand(hexCtxs[i], i+1)
        ctx.drawImage(hexCnvs[i], 0, 0)
    }

    var land = Qt.createQmlObject('import QtQuick 2.0; Image { source: "image://res/modern/land.png"; visible: false; }', parent)
    hexCtxs[landRegion].globalCompositeOperation = 'source-in';
    hexCtxs[landRegion].drawImage(land, 0, 0)
    ctx.drawImage(hexCnvs[landRegion], 0, 0)

    var sea = Qt.createQmlObject('import QtQuick 2.0; Image { source: "image://res/modern/water.png"; visible: false; }', parent)
    hexCtxs[seaRegion].globalCompositeOperation = 'source-in';
    hexCtxs[seaRegion].drawImage(sea, 0, 0)
    ctx.drawImage(hexCnvs[seaRegion], 0, 0)

    for (var i = 0; i < regionCount; i++)
    {
        //hexCnvs[i].destroy()
        //hexCtxs[i].destroy()
    }
    for (var r = 1; r <= regionCount; r++)
        for (var h = 0; h < this.grid.Hexes.length; h++)
        {
            var hex = this.grid.Hexes[h]
            if ("id" in this.hex[hex.Id])
            {
                var rid = this.hex[hex.Id].id
                if (rid === r)
                {
                    var neigh = this.grid.GetNeighbors(hex.Id)
                    for (var n = 0; n < neigh.length; n++)
                    {
                        if (this.hex[neigh[n].Id].id !== rid)
                        {
                            ctx.beginPath()
                            ctx.moveTo(hex.Points[n].X, hex.Points[n].Y)
                            ctx.lineTo(hex.Points[(n+1)%6].X, hex.Points[(n+1)%6].Y)
                            ctx.closePath()
                            ctx.lineWidth = 1
                            ctx.strokeStyle = "black"
                            ctx.stroke()
                        }
                    }
                }
            }
        }
}

Map.prototype.click = function(x, y) {
    var p = {}
    p.X = x
    p.Y = y
    var hex = this.grid.GetHexAt(p)
    console.log(hex.Id)
    console.log(this.hex[hex.Id])
}

Region = function(id) {
    this.id = id
}

Sea = function() {
}

Land = function() {
}

Land.prototype.toString = function() {
    return "Land"
}

Sea.prototype.toString = function() {
    return "Sea"
}

Region.prototype.toString = function() {
    return "Region "+this.id
}

function getRegion(spec)
{
    spec = spec.split(';')
    if (spec[0] == "0")
        return new Region(parseInt(spec[1]))
    else if (spec[0] == "1")
        return new Land()
    else
        return new Sea()
}

Game = function(spec) {
    this.hex = []

    var a = spec.split("\n"), i

    for (i = 0; i < a.length; i++)
    {
        if (a[i].lastIndexOf('map.hex', 0) === 0)
        {
            var h = a[i].split('=')[0].split('.')
            var r = a[i].split('=')[1]
            var x = parseInt(h[2])
            var y = parseInt(h[3])
            if (!(y in this.hex))
                this.hex[y] = []
            this.hex[y][x] = getRegion(r)
        }
    }
}
