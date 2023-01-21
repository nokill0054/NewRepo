function styleChart()
{
    chart.applyOptions({
		width: $("#chart").width(),
		height: $("#chart").height(),
        layout: {
            textColor: 'gray',
            backgroundColor: '#0E1621',
            fontSize: 15,
            fontFamily: "'Trebuchet MS', Roboto, Ubuntu, sans-serif"
        },
        /*watermark: {
            visible: true, // Arkaplan yazısı durumu
            color: "#ceca0966", // Arkaplan yazısı rengi
            text: "SCALPER", // Arkaplan yazısı metni
            vertAlign: "top", // Arkaplan yazısı dikey konumu
            horzAlign: "left", // Arkaplan yazısı yatay konumu
            fontSize: 25 // Arkaplan yazısı boyutu
        },*/
        rightPriceScale: {
            autoScale: true, // Grafiği dikey ölçeklenedirir
            mode: 0, // Değer gösterge modu (0-3)
            invertScale: false, // Değerleri ters çeviri
            alignLabels: false, // Etiketleri ayır
            scaleMargins: { bottom: 0.1, top: 0.1 }, // Grafikte dikey boşluğu ayarlar
            borderVisible: true, // Değerlerin kenarlık görünümü
            borderColor: "gray", // Değerlerin kenarlık rengi
            entireTextOnly: true, // Anlamadım
            visible: true, // Değerlerin gösterge durumu
            drawTicks: false, // Değerlerin yanındaki küçük çizgi
        },
        leftPriceScale: {
            autoScale: false, // Grafiği dikey ölçeklenedirir
            mode: 0, // Değer gösterge modu (0-3)
            invertScale: false, // Değerleri ters çeviri
            alignLabels: false,
            //scaleMargins: { top: 0.9, bottom: 0.1 }, // Grafikte dikey boşluğu ayarlar (Hata)
            borderVisible: true, // Değerlerin kenarlık görünümü
            borderColor: "gray", // Değerlerin kenarlık rengi
            entireTextOnly: true, // Anlamadım
            visible: false, // Değerlerin gösterge durumu
            drawTicks: false, // Değerlerin yanındaki küçük çizgi
        },
        overlayPriceScales: {}, // Anlamadım
        timeScale: {
            rightOffset: 0, // Sağdan mum boşluğu
            barSpacing: 7, // Mumlar arası boşluk
            minBarSpacing: 0.5, // Minimumlar arası boşluk
            fixLeftEdge: false, // Grafiği sola kaydırmayı önler
            fixRightEdge: false, // Grafiği sağa kaydırmayı önler
            lockVisibleTimeRangeOnResize: false, // Grafik yeniden boyutlandırırken zaman aralığının değiştirir
            rightBarStaysOnScroll: false, // Genişletme esnasına muma kilitlenir
            borderVisible: true, // Zaman aralığı çizgisi
            borderColor: "gray", // Zaman aralığı çizgisi rengi
            visible: true, // Zaman aralığının gösterge durumu
            timeVisible: true, // Zaman aralığında saati göster
            secondsVisible: false, // Saniyeyi göster
            shiftVisibleRangeOnNewBar: true, // Canlı veride dene
            //tickMarkFormatter: TickMarkFormatter({ year: 2019, month: 6, day: 1 }, 0, 'en-US'), // Tarih görünüm formatı
        },
        crosshair: {
            mode: 0, // İmleç modu: 0) Normal, 1) Yapışkan
            vertLine: {
                color: "gray", // Dikey imleç çizgisi rengi
                width: 1, // Dikey imleç çizgisi kalınlığı (1-4)
                style: 1, // Dikey imleç çizgisi stili (0-4)
                visible: true, // Dikey imleç çizgisi görünümü
                labelVisible: true, // Tarih göstergesi
                labelBackgroundColor: "black" // Tarih göstergesi arkaplan rengi
            },
            horzLine: {
                color: "gray", // Yatay imleç çizgisi rengi
                width: 1, // Yatay imleç çizgisi kalınlığı (1-4)
                style: 1, // Yatay imleç çizgisi stili (0-4)
                visible: true, // Yatay imleç çizgisi görünümü
                labelVisible: true, // Tarih göstergesi
                labelBackgroundColor: "black" // Tarih göstergesi arkaplan rengi
            }
        },
        grid: {
            vertLines: { color: "#2d303c" }, // Dikey çizgi renkleri
            horzLines: { color: "#2d303c" }, // Yatay çizgi renkleri
        },
        handleScale: { axisDoubleClickReset: false }
    });
    $(".coinList").css("height", $("#chart").height() - 45)
}