const { log, error } = console;
let chart, created = true;

var chartStyle = 1;
var coin = "BTCUSDT";
var interval = "1h";
function changeData(coin, interval, chartStyle) {
  const getData = async () => {
    const resp = await fetch(`http://api.traderclub.com.tr:442/${coin}/${interval}`);
    const data = await resp.json();
    return data;
  };

  const renderChart = async () => {
    const chartProperties = {
      timeScale: {
        timeVisible: true,
        secondsVisible: true,
      },
      pane: 0,
    };
    let domElement = document.getElementById('chart');
    if (!created) {
      domElement.remove();
      domElement = document.createElement("div");
      domElement.className = "chart";
      domElement.id = "chart";
      domElement.style.width = chartStyle.width;
      domElement.style.height = chartStyle.height;
      document.getElementsByClassName("content")[0].prepend(domElement);
    }
    chart = LightweightCharts.createChart(domElement, chartProperties);
    const candleSeries = chart.addCandlestickSeries(); styleChart();
    const klinedata = await getData();
    let data, prevClose = 0, prevOpen = 0;

    if(chartStyle == 1) {
      data = klinedata.map((data, i) => {
        const HAClose = (data.open + data.high + data.low + data.close) / 4;
        const HAOpen = (prevOpen + prevClose) / 2;
        const HAHigh = (data.open > data.close) ? data.open : data.close;
        const HALow = (data.open < data.close) ? data.open : data.close;

        prevClose = data.close;
        prevOpen = data.open;

        return { time: data.time, open: HAOpen, high: HAHigh, low: HALow, close: HAClose }
      })
      candleSeries.setData(data);
    } else candleSeries.setData(klinedata);

    const deger = klinedata[0].open;
    if (deger < 0.1) {
      candleSeries.applyOptions({
        priceFormat: {
          type: 'price',
          precision: deger.toString().length - 2,
          minMove: 0.0000001,
        }
      });
    }

    //VOLUME
    const volumeSeries = chart.addHistogramSeries({
      priceScaleId: 'other',
      scaleMargins: { top: 0.8, bottom: 0, },
      priceLineVisible: false, lastValueVisible: false
    });
    const volume_data = klinedata
    .filter((d) => d.sma)
    .map(function(d) {
      color = "#fff";
      if (d.open > d.close) color = "#ff5e4275";
      else color = "#33b59975";
      return ({ time: d.time, value: d.volume, color})
    });
    volumeSeries.setData(volume_data);

    //SMA
    const sma_series = chart.addLineSeries({ color: '#ff5e42', lineWidth: 2, priceLineVisible: false, lastValueVisible: false });
    const sma_data = klinedata
      .filter((d) => d.sma)
      .map((d) => ({ time: d.time, value: d.sma }));
    sma_series.setData(sma_data);

    //EMA
    const ema_series = chart.addLineSeries({ color: '#33b599', lineWidth: 2, priceLineVisible: false, lastValueVisible: false });
    const ema_data = klinedata
      .filter((d) => d.ema)
      .map((d) => ({ time: d.time, value: d.ema }));
    ema_series.setData(ema_data);

    //MARKERS
    candleSeries.setMarkers(
      klinedata
        .filter((d) => d.long || d.short)
        .map((d) =>
          d.long
            ? {
              time: d.time,
              position: 'belowBar',
              color: '#33b599',
              shape: 'arrowUp',
              text: 'LONG',
            }
            : {
              time: d.time,
              position: 'aboveBar',
              color: '#ff5e42',
              shape: 'arrowDown',
              text: 'SHORT',
            }
        )
    );

    //RSI
    const rsi_series = chart.addLineSeries({
      color: '#33b59975',
      lineWidth: 2,
      pane: 1,
      
    });
    const rsi_data = klinedata
      .filter((d) => d.rsi)
      .map((d) => ({ time: d.time, value: d.rsi }));
    rsi_series.setData(rsi_data);

    //MACD FAST
    const macd_fast_series = chart.addLineSeries({
      color: 'blue',
      lineWidth: 2,
      pane: 2,
    });
    const macd_fast_data = klinedata
      .filter((d) => d.macd_fast)
      .map((d) => ({ time: d.time, value: d.macd_fast }));
    macd_fast_series.setData(macd_fast_data);

    //MACD SLOW
    const macd_slow_series = chart.addLineSeries({
      color: '#ff5e42',
      lineWidth: 2,
      pane: 2,
    });
    const macd_slow_data = klinedata
      .filter((d) => d.macd_slow)
      .map((d) => ({ time: d.time, value: d.macd_slow }));
    macd_slow_series.setData(macd_slow_data);

    //MACD HISTOGRAM
    const macd_histogram_series = chart.addHistogramSeries({
      pane: 3,
      lineWidth: 2,
      rightPriceScale: { scaleMargins: { bottom: 0, top: 0 }}
    });
    const macd_histogram_data = klinedata
      .filter((d) => d.macd_histogram)
      .map((d) => ({
        time: d.time,
        value: d.macd_histogram,
        color: d.macd_histogram > 0 ? '#33b599' : '#ff5e42',
      }));
    macd_histogram_series.setData(macd_histogram_data);

    let ws = new WebSocket(`wss://stream.binance.com:9443/ws/${coin.toLowerCase()}@kline_${interval}`)
    ws.onmessage = (result) => {
    const json = JSON.parse(result.data)
    var data = { time: Math.round((json.k.t / 1000) + 3600 * 3), open: parseFloat(json.k.o), high: parseFloat(json.k.h), low: parseFloat(json.k.l), close: parseFloat(json.k.c), volume: parseFloat(json.k.v) };
    
    color = "#fff";
    if (json.k.o > json.k.c) color = "#ff5e4275";
    else color = "#33b59975";
    volumeSeries.update({ time: data.time, value: data.volume, color: color });
    candleSeries.update(data)};
  };

  renderChart();
  created = false;
} changeData(coin, interval, chartStyle);