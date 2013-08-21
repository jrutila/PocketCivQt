import QtQuick 2.0
import FileIO 1.0
import './Game' as Game

Rectangle {
    id: appWindow
        width: 800
        height: 600

        FileIO {
            id: gameFile
            source: 'maps/Olympus.map'
            onError: console.log(msg)
        }

        Game.GameMap {
            spec: gameFile.read()
        }
}
