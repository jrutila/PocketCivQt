import QtQuick 2.0

import 'qrc:///lib/HexagonTools/HexagonTools.js' as HexagonTools
import 'qrc:///lib/HexagonTools/Grid.js' as HexagonGrid
import 'qrc:///src/Map.js' as Game


Flickable {
    width: parent.width; height: 600;
    contentWidth: gameCanvas.width; contentHeight: gameCanvas.height;
    clip: true
    property var spec

    Image {
        id: imgMountain
        source: "image://res/modern/mtn.png"
        visible: false
    }
    Image {
        id: imgVolcano
        source: "image://res/modern/vol.png"
        visible: false
    }
    Image {
        id: imgDesert
        source: "image://res/modern/desert.png"
        visible: false
    }

//    Canvas {
//        id: cnv
//        width: 800
//        height: 500
//        visible: false;
//        renderStrategy: Canvas.Immediate
//    }

    Canvas {
        id: gameCanvas
        width: 800
        height: 500
        property var map
        renderStrategy: Canvas.Immediate

        onPaint: {
            //var ctx = gameCanvas.getContext('2d')
            //ctx.fillStyle = "red"
            //ctx.fillRect(40, 40, 90, 90)
            //ctx.globalCompositeOperation = 'source-in'
            //ctx.drawImage(img, 0, 0)
            //gameCanvas.getContext('2d').drawImage(cnv, 0, 0)
            var ctx = gameCanvas.getContext('2d')
            var game = new Game.Game(spec)
            gameCanvas.map = new Game.Map(gameCanvas.width, gameCanvas.height, game)
            gameCanvas.map.paint(ctx)
        }

        MouseArea {
            anchors.fill: parent
            onClicked: gameCanvas.map.click(mouse.x, mouse.y)
        }

        DropArea {
            anchors.fill: parent
            keys: [ 'tribe' ]
        }

        Rectangle {
            id: tribeCanvas
            width: 40
            height: 20
            color: "red"

            MouseArea {
                anchors.fill: parent
                drag.target: tribeCanvas
                Drag.keys: [ 'tribe' ]
            }
        }
    }
    //                GameCanvas {
    //                    id: gameCanvas
    //                    width: 800
    //                    height: 500
    //                    spec: new Game.Game(gameFile.read())
    //                }
}
