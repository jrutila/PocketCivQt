import QtQuick 2.0
import 'qrc:///src/Map.js' as Game

Image {
    source: "qrc:///res/res/modern/land1.png";
    Component.onStatusChanged: Game.FinishDrawLand()
}
