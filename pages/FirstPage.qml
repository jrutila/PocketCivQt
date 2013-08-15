import QtQuick 2.0
import Sailfish.Silica 1.0
import Sailfish.Silica.theme 1.0
import FileIO 1.0
import GameCanvas 1.0

import 'qrc:///lib/HexagonTools/HexagonTools.js' as HexagonTools
import 'qrc:///lib/HexagonTools/Grid.js' as HexagonGrid
import 'qrc:///src/Map.js' as Game

Page {
    id: page
    
    FileIO {
        id: gameFile
        source: 'Documents/Olympus.map'
        onError: console.log(msg)        
    }

    // To enable PullDownMenu, place ourcontent in a SilicaFlickable
    SilicaFlickable {
        anchors.fill: parent
        
        // PullDownMenu and PushUpMenu must be declared in SilicaFlickable, SilicaListView or SilicaGridView
        PullDownMenu {
            MenuItem {
                text: "Show Page 2"
                onClicked: pageStack.push(Qt.resolvedUrl("SecondPage.qml"))	            
            }
        }
        
        // Tell SilicaFlickable the height of its content.
        contentHeight: childrenRect.height
        
        // Place our content in a Column.  The PageHeader is always placed at the top
        // of the page, followed by our content.
        Column {
            width: page.width
            spacing: Theme.paddingLarge
            PageHeader {
                title: "UI Template"
            }
            Flickable {
                width: page.width; height: 600;
                contentWidth: gameCanvas.width; contentHeight: gameCanvas.height;
                clip: true

                Canvas {
                    id: gameCanvas
                    width: 800
                    height: 500
                    property var map
                    renderStrategy: Canvas.Immediate

                    onPaint: {
                        var ctx = gameCanvas.getContext('2d')
                        var spec = gameFile.read()
                        var game = new Game.Game(spec)
                        gameCanvas.map = new Game.Map(gameCanvas.width, gameCanvas.height, game)
                        gameCanvas.map.paint(ctx)
                    }

                    MouseArea {
                        anchors.fill: parent
                        onClicked: gameCanvas.map.click(mouse.x, mouse.y)
                    }
                }
//                GameCanvas {
//                    id: gameCanvas
//                    width: 800
//                    height: 500
//                    spec: new Game.Game(gameFile.read())
//                }
            }
        }
    }
}


