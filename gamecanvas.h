#ifndef GAMECANVAS_H
#define GAMECANVAS_H

#include <QtQuick>
#include <QObject>
#include <QPainter>

class GameCanvas : public QQuickPaintedItem
{
    Q_OBJECT
    Q_PROPERTY(QVariantMap spec
               READ spec
               WRITE setSpec)
public:
    explicit GameCanvas(QQuickPaintedItem *parent = 0)
        : QQuickPaintedItem(parent)
    {

    }
    void setSpec(const QVariantMap spec) { mSpec = &spec; }
    const QVariantMap spec() { return *mSpec; }

protected:
    void paint(QPainter *painter)
    {
        /*
        painter->setPen(Qt::red);
        painter->setFont(QFont("Arial", 30));

        if (mSpec == NULL)
        {
            painter->drawText(100, 100, 400, 400, Qt::AlignCenter, "Load game...");
        } else {
            painter->drawText(100, 100, 400, 400, Qt::AlignCenter, mSpec['hex'][0][0]);
        }
        */
    }

    /*
    void paintEvent(QPaintEvent *event)
    {
        QPainter painter(this);
    }
    */
    
signals:
    //void specChanged(QVariantMap& spec);
    
public slots:


private:
    const QVariantMap * mSpec;
    
};

#endif // GAMECANVAS_H
