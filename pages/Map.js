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
        console.log(hex.PathCoOrdX)
        this.hex[hex.Id] = map.hex[hex.PathCoOrdY][hex.PathCoOrdX]
    }
}

function drawLand(ctx, region) {

    var land = Qt.createQmlObject('import QtQuick 2.0; Image { source: "qrc:///res/res/modern/land'+region+'.png"; visible: false; }', appWindow)
    ctx.globalCompositeOperation = 'source-in';
    ctx.drawImage(land, 0, 0)
}

Map.prototype.paint = function(ctx) {
    var hexCnvs = new Array()
    var hexCtxs = new Array()
    for (var i = 0; i < 8; i++)
    {
        var hexCnv = Qt.createQmlObject('import QtQuick 2.0; Canvas { width: 800; height: 500; renderStrategy: Canvas.Immediate; visible: false; }', appWindow)
        hexCnvs.push(hexCnv)
        hexCtxs.push(hexCnv.getContext('2d'))
    }

    for (var h = 0; h < this.grid.Hexes.length; h++)
    {
        var hex = this.grid.Hexes[h]
        if ("id" in this.hex[hex.Id])
        {
            var ctxid = this.hex[hex.Id].id
            console.log(ctxid)
            hex.paint(hexCtxs[ctxid-1])
        } else {
            hex.draw(ctx)
        }
    }
    //MapPainter.paintContext(ctx)

    for (var i = 0; i < 8; i++)
    {
        drawLand(hexCtxs[i], i+1)
        ctx.drawImage(hexCnvs[i], 0, 0)
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
