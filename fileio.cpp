#include "fileio.h"
#include <QFile>
#include <QTextStream>

#include <QDebug>

FileIO::FileIO(QObject *parent) :
    QObject(parent)
{

}

QString FileIO::read()
{
    qDebug() << "Opening source: " << mSource;
    if (mSource.isEmpty()){
        emit error("source is empty");
        return QString();
    }

    QFile file(mSource);
    QString fileContent;
    if ( file.open(QIODevice::ReadOnly) ) {
        qDebug("Reading file");
        QString line;
        QTextStream t( &file );
        do {
            line = t.readLine();
            fileContent += line + '\n';
         } while (!line.isNull());

        file.close();
    } else {
        emit error("Unable to open the file");
        return QString();
    }
    return fileContent;
}

bool FileIO::write(const QString& data)
{
    if (mSource.isEmpty())
        return false;

    QFile file(mSource);
    if (!file.open(QFile::WriteOnly | QFile::Truncate))
        return false;

    QTextStream out(&file);
    out << data;

    file.close();

    return true;
}
