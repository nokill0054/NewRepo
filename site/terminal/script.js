var clickable = true;
function Clickable() {
	$(".coin").on("click", function() {
		if (clickable) {
			clickable = false;
			const coinName = $(this).attr("id");
			coin = coinName;
			$(".price-value").css("display", "none");
			$(".arrow").css("display", "none");
			$(".coin-name").text(`${coinName}`);
			$(".price-value").attr("id", coinName);
			changeData(coin, interval, chartStyle);
			setTimeout(() => { clickable = true }, 500);
		}
	})
}

$(".interval").on("click", function() {
	$(".interval").removeClass("active");
	$(this).attr("class", "interval active");
	interval = $(this).attr("name");
	changeData(coin, interval, chartStyle);
})

$(".chart-style").on("click", function() {
	$(".chart-style").removeClass("active");
	$(this).addClass("active");
	chartStyle = ($(this).attr("id") == "heikin-ashi") ? 1 : 0;
	changeData(coin, interval, chartStyle);
})

$(".tab").on("click", function() {
	$(".tab").removeClass("active")
	$(this).addClass("active")
	$(".content").removeClass("active")
	$(`.content.${$(this).text().toLowerCase()}`).addClass("active")
})

$(".list-selector").on("click", function(event) {
	$(".options").toggleClass("active");
	event.stopPropagation();
})

$(window).click(function() {
	$(".options").removeClass("active");
});

var chartScale = { };
window.onresize = function() {
	chart.applyOptions({ 
		width: $("#chart").width(),
		height: $("#chart").height()
	});
	chartScale = { width: $("#chart").width(), height: $("#chart").height()}
}

const list = document.getElementsByClassName("list")[0];
const symbol = list.getElementsByClassName("coin-symbol");
$(".search-bar").on("keyup", function() {
	const input = document.getElementsByClassName("search-bar")[0];
	const filter = input.value.toUpperCase();
	for (let i = 0; i < symbol.length; i++) {
		const text = symbol[i].innerText;
		if (text.toUpperCase().indexOf(filter) > -1)
		symbol[i].parentElement.style.display = "";
		else symbol[i].parentElement.style.display = "none";
	}
})

fetch('https://api1.binance.com/api/v3/ticker/24hr')
.then(coins => coins.json())
.then(data => {
	data.forEach(data => {
		const symbol = data.symbol;
		const lastPrice = parseFloat(data.lastPrice);
		
		if(symbol.substr(symbol.length-4) == "USDT" && lastPrice != 0) {
			const priceCh = data.priceChange;
			const priceChPer = data.priceChangePercent;
			
			var newCoin = document.createElement("tr")
			newCoin.className = "coin";
			newCoin.id = symbol;
			
			var coinSymbol = document.createElement("td")
			coinSymbol.className = "coin-symbol";
			coinSymbol.innerText = symbol;
			
			var coinPrice = document.createElement("td")
			coinPrice.className = "coin-price";
			coinPrice.innerText = lastPrice.toPrecision(7).replace(".", ",");
			
			var coinChange = document.createElement("td")
			coinChange.className = "coin-change";
			coinChange.innerText = parseFloat(priceCh).toFixed(5);
			
			var coinChangePer = document.createElement("td")
			coinChangePer.className = "coin-change-per";
			coinChangePer.innerText = parseFloat(priceChPer).toFixed(2) + "%";
			
			if(parseFloat(priceCh) < 0) {
				coinChange.style.color = "#FF0000";
				coinChangePer.style.color = "#FF0000";
			}
			else {
				coinChange.style.color = "#22AA93";
				coinChangePer.style.color = "#22AA93";
			}
			
			newCoin.appendChild(coinSymbol);
			newCoin.appendChild(coinPrice);
			newCoin.appendChild(coinChange);
			newCoin.appendChild(coinChangePer);
			
			document.getElementsByClassName("coins")[0].appendChild(newCoin)
			$(".coins-table").append(newCoin)
		}
	});
}).finally(Clickable)

$(".price-value").css("display", "none")
$(".arrow").css("display", "none")
let ws = new WebSocket(`wss://stream.binance.com:9443/ws/!ticker@arr`)
ws.onmessage = (result) => {
	const json = JSON.parse(result.data)
	json.forEach(data => {
		const symbol = data.s;
		const usdt = symbol.substr(symbol.length-4) == "USDT";
		let color = "#FFF", arrow = "up";
		if (usdt) {
			let listItem = document.getElementById(symbol);
			const price = parseFloat(data.c);
			listItem.children[1].innerText = price.toPrecision(7).replace(".", ",");
			listItem.children[2].innerText = parseFloat(data.p).toFixed(5);
			listItem.children[3].innerText = parseFloat(data.P).toFixed(2) + "%";

			if ($(".price-value").attr("id") == symbol) {
				if (price < 0.001) $(".price-value").text(price.toFixed(9).replace(".", ","));
				else if (price < 0.1) $(".price-value").text(price.toFixed(7).replace(".", ","));
				else if (price < 10) $(".price-value").text(price.toFixed(5).replace(".", ","));
				else $(".price-value").text(price.toFixed(2).replace(".", ",").replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.'));
				if (data.P > 0){ color = "#00DC3B"; arrow = "arrow up"; }
				else { color = "#FF0000"; arrow = "arrow down"; }
				$(".price-value").css("color", color);
				$(".price-value").css("display", "block");
				$(".arrow").attr("class", arrow);
				$(".arrow").css("display", "block");
			}
		}
	});
}

setInterval(() => {
	const zaman = new Date();
    let saniye = zaman.getSeconds(), dakika = zaman.getMinutes(), saat = zaman.getHours();
    if(saniye < 10) saniye = `0${saniye}`;
    if(dakika < 10) dakika = `0${dakika}`;
    if(saat < 10) saat = `0${saat}`;
    saat = `${saat}:${dakika}:${saniye} (UTC+3)`;
	$(".date-time").text(saat)
}, 1000)

let hacimBildiri = [], degerBildiri = [], radarBildiri = [];
setInterval(() => { hacimBildiri = []; degerBildiri = []; radarBildiri = []; }, 1000*60*10);