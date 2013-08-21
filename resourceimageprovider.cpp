#include "resourceimageprovider.h"

ResourceImageProvider::ResourceImageProvider()
    : QQuickImageProvider(QQmlImageProviderBase::Image)
{

}

ResourceImageProvider::~ResourceImageProvider()
{

}

QImage ResourceImageProvider::requestImage(const QString& id, QSize* size, const QSize& requestedSize)
{
    QString rsrcid = "res/" + id;
    QImage image(rsrcid);
    QImage result;

    if (requestedSize.isValid()) {
        result = image.scaled(requestedSize, Qt::KeepAspectRatio);
    } else {
        result = image;
    }
    *size = result.size();
    return result;
}
