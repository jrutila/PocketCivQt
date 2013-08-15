
#include <QGuiApplication>
#include <QQuickView>
#include <QtQml>

#include "sailfishapplication.h"

#include "fileio.h"
#include "gamecanvas.h"
#include "resourceimageprovider.h"

Q_DECL_EXPORT int main(int argc, char *argv[])
{
    QScopedPointer<QGuiApplication> app(Sailfish::createApplication(argc, argv));

    qmlRegisterType<FileIO, 1>("FileIO", 1, 0, "FileIO");
    qmlRegisterType<GameCanvas>("GameCanvas", 1, 0, "GameCanvas");

    QQmlEngine engine;
    engine.addImageProvider(QLatin1String("res"), new ResourceImageProvider());

    QScopedPointer<QQuickView> view(Sailfish::createView("main.qml"));


    Sailfish::showView(view.data());
    
    return app->exec();
}


