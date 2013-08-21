
#include <QGuiApplication>
#include <QQuickView>
#include <QtQml>

#include "sailfishapplication.h"

#include "fileio.h"
#include "gamecanvas.h"
#include "resourceimageprovider.h"

Q_DECL_EXPORT int main(int argc, char *argv[])
{
//    QScopedPointer<QGuiApplication> app(Sailfish::createApplication(argc, argv));


//    QQuickView* viewer = Sailfish::createView("main.qml");
//    QScopedPointer<QQuickView> view(viewer);

//    Sailfish::showView(view.data());
    
//    return app->exec();
    QGuiApplication app(argc, argv);
    qmlRegisterType<FileIO, 1>("FileIO", 1, 0, "FileIO");
    qmlRegisterType<GameCanvas>("GameCanvas", 1, 0, "GameCanvas");
    QQuickView *viewer = new QQuickView();
    //CGuideMenu *cMenu = new CGuideMenu(viewer);
    viewer->engine()->addImageProvider(QLatin1String("res"), new ResourceImageProvider());
    viewer->setSource(QUrl::fromLocalFile("main_desktop.qml"));
    viewer->show();
    return app.exec();
}


