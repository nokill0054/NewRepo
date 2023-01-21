const anlikHacimler = [], gunlukHacimler = [];

function Kontrol(ara, liste) 
{
    for (let i = 0; i < liste.length; i++)
    if(liste[i][0] == ara) return i;
    return -1;
}

function Sorgula(sorgu, tur)
{
    sorgu.onmessage = function(sonuc) {
        const json = JSON.parse(sonuc.data);
        const gunlukIndex = Kontrol(json.s, gunlukHacimler);
        const anlikIndex = Kontrol(json.s, anlikHacimler);

        if(tur == 0) // Günlük Hacimler
        { 
            if(gunlukIndex < 0) 
                gunlukHacimler.push([json.s, parseFloat(json.v).toFixed()]);
            else gunlukHacimler[gunlukIndex][1] = parseFloat(json.v).toFixed();
        }
        else if(tur == 1 && gunlukIndex >= 0 ) // Anlık Hacimler
        {
            let yuzde = json.k.v / gunlukHacimler[gunlukIndex][1] * 100;
            if(anlikIndex < 0)
                anlikHacimler.push([json.s, yuzde.toFixed(2)]);
            else anlikHacimler[anlikIndex][1] = yuzde.toFixed(2);

            if(!hacimBildiri.includes(json.s) && yuzde >= 3) {
                hacimBildiri.push(json.s);
                const topHacim = parseInt(json.k.v) + parseInt(gunlukHacimler[gunlukIndex][1]);
                const hacim = topHacim.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
                const mesaj = `<b>${json.s}</b><br>Hacim: +${yuzde.toFixed(2)}%<br>24s Hacim: ${hacim} ${json.s.substring(json.s.length-4, 0)}`;
                YeniMesaj("v3", mesaj, true);
                BildirimGonder(json.s, `Hacim: +${yuzde.toFixed(2)}%`)
            }
        }
        if(tur == 1) // Price Değerleri
        {
            const open = parseFloat(json.k.o);
            const high = parseFloat(json.k.h);
            const low = parseFloat(json.k.l);
            const highDegisim = (high-open)/open*100;
            const lowDegisim = (low-open)/open*100;
            const index = Kontrol(json.s, anlikHacimler);
            let yuzde;
            if(index >= 0) yuzde = anlikHacimler[index][1];
            if(!degerBildiri.includes(json.s)&& ((lowDegisim <= -1 && lowDegisim >= -4) || (highDegisim <= 4 && highDegisim >= 1))) {
                if(yuzde >= 0.8)
                {
                    degerBildiri.push(json.s); let mesaj;
                    if(highDegisim > lowDegisim * -1) {
                        mesaj = `<b>${json.s}</b><br>Değer: +${highDegisim.toFixed(2)}% 🟢`;
                        mesaj += `<br>Önceki Değer: ${open}<br>Anlık Değer: ${high}`;
                        BildirimGonder(json.s, `Değer: +${highDegisim.toFixed(2)}% 🟢`);
                    }
                    else {
                        mesaj = `<b>${json.s}</b><br>Değer: ${lowDegisim.toFixed(2)}% 🔴`;
                        mesaj += `<br>Önceki Değer: ${open}<br>Anlık Değer: ${low}`;
                        BildirimGonder(json.s, `Değer: ${lowDegisim.toFixed(2)}% 🔴`);
                    }
                    YeniMesaj("m1", mesaj, true);
                }
                else if (!radarBildiri.includes(json.s)) radarBildiri.push(json.s);
            }
        }
    }
}
    
function SorguyuKapat(sorgu) { sorgu.close(); }