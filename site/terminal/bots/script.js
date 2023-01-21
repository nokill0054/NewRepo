const kanalSayisi = document.getElementsByClassName("tab");
let odak = "m1";

function YeniMesaj(tab, mesaj, link)
{
    const kanal = document.getElementsByClassName("content " + tab);
    const message = document.createElement("div");
  	message.className = ($("#lightmode").attr("value") == 0) ? 'message' : 'message light';
    message.innerHTML = mesaj;
    if(link) {
        let coin = mesaj.split("<br>")[0];
        coin = coin.substring(3, coin.length-4);
        const link1 = `<br><a href='https://www.binance.com/en/futures/${coin}' target='_blank'><b>Binance</b></a> | `;
        const link2 = `<a href='#' class='coin' id='${coin}'><b>TraderClub</b></a>`;
        message.innerHTML += link1 + link2;
    }
    const zaman = new Date();
    let dakika = zaman.getMinutes(), saat = zaman.getHours();
    if(dakika < 10) dakika = `0${dakika}`;
    if(saat < 10) saat = `0${saat}`;
    saat = `${saat}:${dakika}`;
    const saatDom = document.createElement("div");
    saatDom.className = "saat"; saatDom.innerText = saat;
    message.appendChild(saatDom);
    kanal[0].appendChild(message);
    document.getElementsByClassName("content " + tab)[0].scroll({top:99999999});
    Clickable();
}

function BildirimGonder(baslik, icerik) { if(Notification.permission == "granted") new Notification(baslik, { body: icerik }); }

function asagiKaydir() { for(let i = 0; i < kanalSayisi; i++); document.getElementsByClassName("icerik")[i].scroll({top:99999999}); }

let hata = false;
const semboller = [];

const futures = "https://testnet.binancefuture.com";
const spot = "wss://stream.binance.com:9443";

fetch(`${futures}/fapi/v1/ticker/price`)
  .then(cevap => cevap.json()).then(veri => {
  for (let i = 0; i < veri.length; i++) {
    const coin = veri[i].symbol;
    if(coin.substring(coin.length-4) == "USDT")
      semboller.push(coin)
  }
})
  .catch(err => { hata = true; log(err); })
  .finally(sonuc => {
  if(!hata)
  {
    const gunluk = semboller.join("@ticker_1d/").toLowerCase() + "@ticker_1d";
    const anlik = semboller.join("@kline_1m/").toLowerCase() + "@kline_1m";
    let gunlukSorgu = new WebSocket(`${spot}/ws/${gunluk}`);
    let anlikSorgu = new WebSocket(`${spot}/ws/${anlik}`);
    Sorgula(gunlukSorgu, 0);
    Sorgula(anlikSorgu, 1);
  }
})