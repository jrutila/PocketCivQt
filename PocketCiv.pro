# The name of your app
TARGET = PocketCiv

# C++ sources
SOURCES += main.cpp \
    fileio.cpp \
    gamecanvas.cpp \
    resourceimageprovider.cpp

# C++ headers
HEADERS += \
    fileio.h \
    gamecanvas.h \
    resourceimageprovider.h

# QML files and folders
qml.files = *.qml pages cover main.qml

# The .desktop file
desktop.files = PocketCiv.desktop

# Please do not modify the following line.
include(sailfishapplication/sailfishapplication.pri)

OTHER_FILES = \
    rpm/PocketCiv.yaml \
    rpm/PocketCiv.spec \
    res/welcome.jpg \
    lib/HexagonTools/js/HexCalcs.js \
    lib/HexagonTools/js/HexagonTools.js \
    lib/HexagonTools/js/Grid.js

RESOURCES += \
    PocketCiv.qrc

