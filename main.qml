import QtQuick 2.0
import Sailfish.Silica 1.0
import "pages"
import 'qrc:///src/Map.js' as Game

ApplicationWindow
{
    id: appWindow
    initialPage: FirstPage { }
    cover: Qt.resolvedUrl("cover/CoverPage.qml")

//     Image {
//        id: land1
//        source: "image://res/land1.png";
//        Component.onCompleted: Game.drawLand()
//        //visible: false
//    }
}


