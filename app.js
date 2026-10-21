// Bilde-kartlegging for temaer med 2 toppbilder
const temaBilder = {
    standard: ["", ""],
    dinosaur: ["Bilder/dinosaur_01.png", "Bilder/dinosaur_02.png"],
    eurovisjon: ["Bilder/eurovisjon_01.png", "Bilder/eurovisjon_02.png"],
    fest: ["Bilder/fest_01.png", "Bilder/fest_02.png"],
    halloween: ["Bilder/halloween_01.png", "Bilder/halloween_02.png"],
    host: ["Bilder/host_01.png", "Bilder/host_02.png"],
    jul: ["Bilder/jul_01.png", "Bilder/jul_02.png"],
    kryp: ["Bilder/kryp_01.png", "Bilder/kryp_02.png"],
    naturfag: ["Bilder/naturfag_01.png", "Bilder/naturfag_02.png"],
    racerbil: ["Bilder/racerbil_01.png", "Bilder/racerbil_02.png"],
    sjorover: ["Bilder/sjorover_01.png", "Bilder/sjorover_02.png"],
    sommer: ["Bilder/sommer_01.png", "Bilder/sommer_02.png"],
    sommerfugl: ["Bilder/sommerfugl_01.png", "Bilder/sommerfugl_02.png"],
    sport: ["Bilder/sport_01.png", "Bilder/sport_02.png"],
    verdensrommet: ["Bilder/verdensrommet_01.png", "Bilder/verdensrommet_02.png"],
    vinter: ["Bilder/vinter_01.png", "Bilder/vinter_02.png"]
};

let valgteKjeder = [];
let egedefinerteOrdValg = [];

document.addEventListener("DOMContentLoaded", () => {
    const placeholder = document.getElementById("placeholder-image");
    const oppgaveArkWrapper = document.getElementById("oppgave-ark-wrapper");
    if (placeholder) placeholder.style.display = "flex";

    // Sett opp automatisk skjuling ved opplastingsfeil på toppbildene
    ["ark-bilde-1", "ark-bilde-2"].forEach(id => {
        const img = document.getElementById(id);
        if (img) {
            img.onerror = function() {
                this.style.display = "none";
            };
        }
    });

    changeTheme("standard");
});

function toggleMenu() {
    const dropdown = document.getElementById("myDropdown");
    if (dropdown) dropdown.classList.toggle("show");
}

window.onclick = function(event) {
    if (!event.target.matches('.hamburger') && !event.target.matches('.hamburger span')) {
        const dropdowns = document.getElementsByClassName("dropdown-menu");
        for (let i = 0; i < dropdowns.length; i++) {
            const openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }
};

function changeTheme(themeName) {
    document.body.className = "theme-" + themeName;
    const themeSelect = document.getElementById("themeSelect");
    if (themeSelect) themeSelect.value = themeName;
    
    // Tegner oppgavene på nytt slik at de nye temabildene og aksentfargene legges på alle sider
    tegnOppgaver();
}

function hentKildeOrd(type) {
    if (typeof ordLister !== "undefined" && ordLister[type]) {
        return ordLister[type];
    }
    if (type === "25" && typeof ord25 !== "undefined") return ord25;
    if (type === "100" && typeof ord100 !== "undefined") return ord100;
    if (type === "222" && typeof ord222 !== "undefined") return ord222;
    if (type === "444" && typeof ord444 !== "undefined") return ord444;
    if (type === "alleord" && typeof alleord !== "undefined") return alleord;
    if (type === "ordkjedetest" && typeof ordkjedetest !== "undefined") return ordkjedetest;
    
    return [];
}

function oppdaterVisning() {
    const customTitleEl = document.getElementById("custom-title");
    const titleVal = customTitleEl ? customTitleEl.value : "Ordkjeder";
    
    // Oppdater overskrifter
    const h1El = document.querySelector(".a4-side:first-child .ark-tittel h1");
    if (h1El) h1El.innerText = titleVal || "Øvingsoppgaver:";
    
    const sekundaerTitler = document.querySelectorAll(".a4-side:not(:first-child) .ark-tittel h1");
    sekundaerTitler.forEach(h1 => {
        h1.innerText = titleVal || "Øvingsoppgaver:";
    });

    const fontSelect = document.getElementById("font-family");
    const fontSizeSelect = document.getElementById("font-size-select");
    const selectedFont = fontSelect ? fontSelect.value : "'Segoe UI', Arial, sans-serif";
    const fontSize = fontSizeSelect ? fontSizeSelect.value : "1.05rem";

    // Påfør font og skriftstørrelse i sanntid
    const sider = document.querySelectorAll(".a4-side");
    sider.forEach(side => {
        side.style.fontFamily = selectedFont;
    });

    const items = document.querySelectorAll(".ordkjede-item");
    items.forEach(item => {
        item.style.fontSize = fontSize;
    });
}

function genererOppgaver() {
    const ordlisteType = document.getElementById("select-ordliste").value;
    const antallKjeder = parseInt(document.getElementById("antall-oppgaver").value, 10) || 12;
    const ordPerKjede = parseInt(document.getElementById("ord-per-kjede").value, 10) || 4;
    const valgtOrdlengde = document.getElementById("select-ordlengde") ? document.getElementById("select-ordlengde").value : "alle";
    const kunUnike = document.getElementById("toggle-unike") ? document.getElementById("toggle-unike").checked : false;

    let kildeOrd = hentKildeOrd(ordlisteType);
    
    kildeOrd = filtrerOrdPaLengde(kildeOrd, valgtOrdlengde);

    if (egedefinerteOrdValg.length >= ordPerKjede) {
        kildeOrd = [...egedefinerteOrdValg];
    }

    if (!kildeOrd || kildeOrd.length === 0) {
        alert("Ingen ord i den valgte ordlisten passer med valgt ordlengde.");
        return;
    }

    valgteKjeder = [];

    if (kunUnike) {
        let tilgjengeligeOrd = [...new Set(kildeOrd)].sort(() => Math.random() - 0.5);
        const totaltBehov = antallKjeder * ordPerKjede;

        if (tilgjengeligeOrd.length < totaltBehov) {
            alert(`Siden «Kun unike ord» er valgt, trenger du ${totaltBehov} unike ord, men ordlisten har bare ${tilgjengeligeOrd.length} tilgjengelige ord med disse valgene.`);
        }

        for (let i = 0; i < antallKjeder; i++) {
            let kjedeOrd = [];
            for (let j = 0; j < ordPerKjede; j++) {
                if (tilgjengeligeOrd.length > 0) {
                    kjedeOrd.push(tilgjengeligeOrd.pop());
                } else {
                    break;
                }
            }
            if (kjedeOrd.length > 0) {
                valgteKjeder.push(kjedeOrd);
            }
        }
    } else {
        for (let i = 0; i < antallKjeder; i++) {
            let kjedeOrd = [];
            let tilfeldigeOrd = [...kildeOrd].sort(() => Math.random() - 0.5);
            
            for (let j = 0; j < ordPerKjede; j++) {
                kjedeOrd.push(tilfeldigeOrd[j % tilfeldigeOrd.length]);
            }
            valgteKjeder.push(kjedeOrd);
        }
    }

    tegnOppgaver();
}

function beregnTidForKjeder(antallKjeder) {
    if (!antallKjeder || antallKjeder <= 0) return "--";

    const sekunderPerKjede = 240 / 90;
    let totalSekunder = antallKjeder * sekunderPerKjede;
    let rundetSekunder = Math.round(totalSekunder / 5) * 5;

    if (rundetSekunder === 0) rundetSekunder = 5;

    const minutter = Math.floor(rundetSekunder / 60);
    const gjenstaendeSekunder = rundetSekunder % 60;

    if (minutter > 0 && gjenstaendeSekunder > 0) {
        return `${minutter} min ${gjenstaendeSekunder} sek`;
    } else if (minutter > 0) {
        return `${minutter} min`;
    } else {
        return `${rundetSekunder} sek`;
    }
}

function tegnOppgaver() {
    const wrapper = document.getElementById("oppgave-ark-wrapper");
    const placeholder = document.getElementById("placeholder-image");
    const isUpper = document.getElementById("toggle-upper") ? document.getElementById("toggle-upper").checked : false;
    const nummerModus = document.getElementById("nummerering-valg") ? document.getElementById("nummerering-valg").value : "alle";
    const antallKolonner = parseInt(document.getElementById("antall-kolonner").value, 10) || 3;
    const visFasit = document.getElementById("toggle-fasit") ? document.getElementById("toggle-fasit").checked : false;
    const fontSelect = document.getElementById("font-family");
    const selectedFont = fontSelect ? fontSelect.value : "'Segoe UI', Arial, sans-serif";

    if (valgteKjeder.length === 0) {
        if (placeholder) placeholder.style.display = "flex";
        if (wrapper) wrapper.innerHTML = "";
        return;
    }

    if (placeholder) placeholder.style.display = "none";
    wrapper.innerHTML = "";

    const kjederPerSide = 10 * antallKolonner;
    const maksKjeder = 4 * kjederPerSide;
    const reelleKjeder = valgteKjeder.slice(0, maksKjeder);

    const totaltAntall = reelleKjeder.length;
    const totaltSider = Math.ceil(totaltAntall / kjederPerSide);

    const themeName = document.getElementById("themeSelect") ? document.getElementById("themeSelect").value : "standard";
    const bilder = (typeof temaBilder !== "undefined" && temaBilder[themeName]) ? temaBilder[themeName] : ["", ""];

    let kjedeIndex = 0;

    for (let sideNummer = 1; sideNummer <= totaltSider; sideNummer++) {
        const sideDiv = document.createElement("div");
        sideDiv.className = "a4-side";
        sideDiv.style.fontFamily = selectedFont;

        const bilde1Src = bilder[0] || "";
        const bilde2Src = bilder[1] || "";
        const displayStyle1 = bilde1Src ? "block" : "none";
        const displayStyle2 = bilde2Src ? "block" : "none";


const customTitleEl = document.getElementById("custom-title");
const tittelTekst = (customTitleEl && customTitleEl.value) ? customTitleEl.value : "Ordkjeder";

        let overskriftHtml = "";
        let navnLinjeHtml = "";

        if (sideNummer === 1) {
            overskriftHtml = `<h1>${tittelTekst}</h1>`;
            navnLinjeHtml = `
                <div class="navn-linje">
                    <span>Navn: ____________________________________</span>
                </div>
            `;
        } else {
            overskriftHtml = `<h1 class="sekundaer-tittel">${tittelTekst}</h1>`;
            navnLinjeHtml = "";
        }

        let headerHtml = `
            <div class="ark-header">
                <img id="ark-bilde-1-s${sideNummer}" class="corner-img" src="${bilde1Src}" alt="" style="display: ${displayStyle1};">
                <div class="ark-tittel">
                    ${overskriftHtml}
                    ${navnLinjeHtml}
                </div>
                <img id="ark-bilde-2-s${sideNummer}" class="corner-img" src="${bilde2Src}" alt="" style="display: ${displayStyle2};">
            </div>
        `;

        let gridItemsHtml = "";
        for (let i = 0; i < kjederPerSide && kjedeIndex < totaltAntall; i++) {
            const kjede = reelleKjeder[kjedeIndex];
            const oppgaveNr = kjedeIndex + 1;

            let sammensatt = "";
            if (visFasit) {
                const skille = `<span class="fasit-skille">|</span>`;
                sammensatt = kjede.join(skille);
            } else {
                sammensatt = kjede.join("");
            }

            if (isUpper) {
                sammensatt = sammensatt.toUpperCase();
            }

            let prefixHtml = "";
            let suffixHtml = "";

            if (nummerModus === "alle") {
                prefixHtml = `<span class="ordkjede-nr">${oppgaveNr})</span> `;
            } else if (nummerModus === "rad") {
                if (oppgaveNr % antallKolonner === 0 || oppgaveNr === totaltAntall) {
                    suffixHtml = `<span class="rad-nr" style="margin-left: auto;">${oppgaveNr}</span>`;
                }
            }

            gridItemsHtml += `<div class="ordkjede-item">${prefixHtml}${sammensatt}${suffixHtml}</div>`;
            kjedeIndex++;
        }

        const gridHtml = `<div class="side-grid" style="grid-template-columns: repeat(${antallKolonner}, 1fr);">${gridItemsHtml}</div>`;

        // Kompakt og ren bunntekst
        let sumTekst = `S. ${sideNummer}: ___ / utført: ___`;

        if (sideNummer === totaltSider && totaltSider > 1) {
            sumTekst += ` &nbsp;|&nbsp; <strong>Totalt: ___ / ___ (av ${totaltAntall})</strong>`;
        } else if (totaltSider === 1) {
            sumTekst = `Riktige: ___ / utført: ___ (av ${totaltAntall})`;
        }

        const tidTekst = sideNummer === 1 ? `Tid: ${beregnTidForKjeder(totaltAntall)}` : `Side ${sideNummer} av ${totaltSider}`;

        const footerHtml = `
            <div class="ark-footer">
                <span>Ordkjeder - Norsk gjenkjenning</span>
                <span style="font-weight: bold; color: #2c3e50;">${tidTekst}</span>
                <span>${sumTekst}</span>
            </div>
        `;

        sideDiv.innerHTML = headerHtml + gridHtml + footerHtml;
        wrapper.appendChild(sideDiv);
    }
// Påfør valgt skriftstørrelse og font på de nylig tegnede oppgavene
    const fontSizeSelect = document.getElementById("font-size-select");
    const fontSize = fontSizeSelect ? fontSizeSelect.value : "1.05rem";
    
    document.querySelectorAll(".ordkjede-item").forEach(item => {
        item.style.fontSize = fontSize;
    });
}

function filtrerOrdPaLengde(ordListe, valgtLengde) {
    if (!ordListe || ordListe.length === 0) return [];
    if (!valgtLengde || valgtLengde === "alle") return ordListe;

    let maksBokstaver = 99;
    if (valgtLengde === "1-3") maksBokstaver = 3;
    if (valgtLengde === "1-4") maksBokstaver = 4;
    if (valgtLengde === "1-5") maksBokstaver = 5;
    if (valgtLengde === "1-6") maksBokstaver = 6;

    return ordListe.filter(ord => ord.length <= maksBokstaver);
}

function nullstillValg() {
    // Tilbakestill felter om de finnes i HTML
    const customTitleEl = document.getElementById("custom-title");
    if (customTitleEl) customTitleEl.value = "Ordkjedetest";

    const ordlisteEl = document.getElementById("select-ordliste");
    if (ordlisteEl) ordlisteEl.value = "ordkjedetest";

    const ordlengdeEl = document.getElementById("select-ordlengde");
    if (ordlengdeEl) ordlengdeEl.value = "alle";

    const nummereringEl = document.getElementById("nummerering-valg");
    if (nummereringEl) nummereringEl.value = "rad";

    const antallOppgaverEl = document.getElementById("antall-oppgaver");
    if (antallOppgaverEl) antallOppgaverEl.value = "30";

    const ordPerKjedeEl = document.getElementById("ord-per-kjede");
    if (ordPerKjedeEl) ordPerKjedeEl.value = "4";

    const kolonnerEl = document.getElementById("antall-kolonner");
    if (kolonnerEl) kolonnerEl.value = "3";

    const fontSizeEl = document.getElementById("font-size-select");
    if (fontSizeEl) fontSizeEl.value = "1.05rem";

    const fontFamilyEl = document.getElementById("font-family");
    if (fontFamilyEl) fontFamilyEl.value = "'Segoe UI', Arial, sans-serif";

    const themeSelectEl = document.getElementById("themeSelect");
    if (themeSelectEl) themeSelectEl.value = "standard";

    const upperEl = document.getElementById("toggle-upper");
    if (upperEl) upperEl.checked = false;

    const fasitEl = document.getElementById("toggle-fasit");
    if (fasitEl) fasitEl.checked = false;

    const unikeEl = document.getElementById("toggle-unike");
    if (unikeEl) unikeEl.checked = false;

    // Tøm valgte ord og kjeder
    egedefinerteOrdValg = [];
    valgteKjeder = [];

    // Tilbakestill tema til standard
    changeTheme("standard");

    // Nullstill visningen til starttilstand (viser placeholder og tømmer arkene)
    tegnOppgaver();
}

/* MODAL FUNKSJONALITET FOR Å VELGE ORD */
function apneVelgSelvModal() {
    document.getElementById("velg-selv-modal").style.display = "flex";
    filtrerModalListe();
}

function lukkVelgSelvModal() {
    document.getElementById("velg-selv-modal").style.display = "none";
}

function filtrerModalListe() {
    const sok = document.getElementById("modal-sok-input").value.toLowerCase();
    const listeContainer = document.getElementById("modal-oppgave-liste");
    const ordlisteType = document.getElementById("select-ordliste").value;
    const valgtOrdlengde = document.getElementById("select-ordlengde") ? document.getElementById("select-ordlengde").value : "alle";
    
    let kildeOrd = hentKildeOrd(ordlisteType);
    kildeOrd = filtrerOrdPaLengde(kildeOrd, valgtOrdlengde);

    listeContainer.innerHTML = "";

    const unikeOrd = [...new Set(kildeOrd)];

    unikeOrd.forEach(ord => {
        if (ord.toLowerCase().includes(sok)) {
            const isChecked = egedefinerteOrdValg.includes(ord);
            
            const itemDiv = document.createElement("div");
            itemDiv.style.fontSize = "0.9rem";
            itemDiv.style.padding = "4px";
            itemDiv.style.borderBottom = "1px solid #eee";
            itemDiv.innerHTML = `
                <label style="display: flex; align-items: center; gap: 6px; cursor: pointer;">
                    <input type="checkbox" ${isChecked ? "checked" : ""} onchange="toggleOrdIModal('${ord.replace(/'/g, "\\'")}')">
                    <span>${ord}</span>
                </label>
            `;
            listeContainer.appendChild(itemDiv);
        }
    });

    oppdaterAntallValgteModal();
}

function toggleOrdIModal(ord) {
    const idx = egedefinerteOrdValg.indexOf(ord);
    if (idx > -1) {
        egedefinerteOrdValg.splice(idx, 1);
    } else {
        egedefinerteOrdValg.push(ord);
    }
    oppdaterAntallValgteModal();
}

function oppdaterAntallValgteModal() {
    document.getElementById("antall-valgte-teller").innerText = egedefinerteOrdValg.length;
}

function nullstillValgteIModal() {
    egedefinerteOrdValg = [];
    filtrerModalListe();
}

function brukEgendefinerteOrd() {
    if (egedefinerteOrdValg.length > 0) {
        genererOppgaver();
    }
    lukkVelgSelvModal();
}