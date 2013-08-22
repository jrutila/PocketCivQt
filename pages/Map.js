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
    this.regionHexes = Array(Array(), Array(), Array(), Array(), Array(), Array(), Array(), Array())
    for (var h = 0; h < this.grid.Hexes.length; h++)
    {
        var hex = this.grid.Hexes[h]        
        var reg = map.hex[hex.PathCoOrdY][hex.PathCoOrdX]
        this.hex[hex.Id] = reg
        if ("id" in reg)
            this.regionHexes[reg.id-1].push(hex)
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
    {
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

        var reg = Regions[r-1]
        var effects = reg.effects
        for (var e = 0; e < reg.effects.length; e++)
        {
            var reghex = this.regionHexes[r-1][e]
            switch (reg.effects[e])
            {
                case 'M':
                    ctx.drawImage(imgMountain, reghex.TopLeftPoint.X, reghex.TopLeftPoint.Y)
                    break;
                case 'V':
                    ctx.drawImage(imgVolcano, reghex.TopLeftPoint.X, reghex.TopLeftPoint.Y)
                    break;
                case 'D':
                    ctx.drawImage(imgDesert, reghex.TopLeftPoint.X, reghex.TopLeftPoint.Y)
                    break;
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
    this.tribes = 0
    this.effects = Array()
    this.hexes = Array()
}

var Sea = {
    toString: function() {
        return "Sea"
    }
}

var Land = {
    toString: function() {
        return "Land"
    }
}

Region.prototype.toString = function() {
    var ret = "Region "+this.id
    ret += this.effects
    if (this.tribes > 0)
        ret += " T:"+this.tribes
    return ret
}

var Regions = [ new Region(1),
                new Region(2),
                new Region(3),
                new Region(4),
                new Region(5),
                new Region(6),
                new Region(7),
                new Region(8) ]

function getRegion(spec)
{
    spec = spec.split(';')
    if (spec[0] == "0")
        return Regions[parseInt(spec[1])-1]
    else if (spec[0] == "1")
        return Land
    else
        return Sea
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
            var reg = getRegion(r)
            this.hex[y][x] = reg
        }
        if (a[i].lastIndexOf('region.', 0) === 0)
        {
            var regspec = a[i].split('=')[1].split(';')
            var regid = parseInt(a[i].split('=')[0].split('.')[1])

            Regions[regid-1].tribes = parseInt(regspec[3])
            for (var e = 0; e < regspec[4].length; e++)
                Regions[regid-1].effects.push(regspec[4][e])
        }
    }
}
