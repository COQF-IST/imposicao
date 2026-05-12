const imposicaoDate = [2026, 4, 15]; // year, month - 1, day
const sheetID = "1FC6e6SEMQ_bKqu7GogIkrqq0JEk6mWE0F8wipIAiPzo"; // GOOGLE SHEETS ID
const sheetsURL = `https://docs.google.com/spreadsheets/d/${sheetID}/gviz/tq?tqx=out:csv`;

function getImposicaoCurrentTime() {
    const date = new Date();
    date.setFullYear(imposicaoDate[0]);
    date.setMonth(imposicaoDate[1]);
    date.setDate(imposicaoDate[2]);
    return date;
}

document.addEventListener('DOMContentLoaded', () => {
    let lastRetrievedData = null;
    let lastEdit = 0;
    let seeAll = false;

    const nomeElement = document.getElementById('nome');
    const cursoElement = document.getElementById('curso');
    const listaProximosElement = document.getElementById('lista-proximos');
    const seeAllElement = document.getElementById('see-all');
    const lastUpdatedElement = document.getElementById('lastUpdated');
    const tamaraElement = document.getElementById('tamara-main');

    updateInterval();
    setInterval(updateInterval, 30000)

    async function updateInterval(all = false) {
        try {
            console.log("Updating...");
            const cacheBuster = `&t=${Date.now()}`;
            const finalURL = sheetsURL + cacheBuster;
            const response = await fetch(finalURL, {
                cache: "no-store",
                headers: {
                    'Cache-Control': 'no-cache',
                    'Pragma': 'no-cache'
                }
            });
            if(!response.ok) {
                console.error(error);
                return;
            }

            const text = await response.text();
            const results = Papa.parse(text, {
                header: true,
                dynamicTyping: true
            });

            updateDisplay(results.data);
        } catch (error) {
            console.error(error);
        }
    }

    function updateDisplay(data, force = false) {
        console.log("WOWWWW 0");
        if(!data) return;
        console.log("WOWWWW 1");
        if(data[0]["Last Edit"] <= lastEdit && !force) return;
        lastEdit = data[0]["Last Edit"];

        console.log(JSON.stringify(data));
        console.log("WOWWWW 2");
        let lateMs = 0;
        let foundCurrent = false;
        let i_proximo = 0;
        let htmlProximos = ``;

        console.log("WOWWWW 3");
        for(const key of data) {
            console.log("WOWWWW 4");
            if(key["Atual"] === false) {
                nomeElement.innerText = key["Nome"];
                cursoElement.innerText = key["Curso"];
                foundCurrent = true;
                console.log("WOWWWW 5");
                continue;
            }
            console.log("WOWWWW 6");

            if(foundCurrent) {
                console.log("WOWWWW 7");
                const horas = key["Hora"].split(":");
                const date = getImposicaoCurrentTime();
                date.setHours(horas[0], horas[1]);

                if(!htmlProximos) {
                    const diffMs = Date.now() - date.getTime();
                    if(diffMs > 2 * 60 * 1000) lateMs = diffMs;
                }

                if(lateMs > 0) {
                    const lateHora = new Date(date.getTime() + lateMs).toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' });

                    htmlProximos += `
                        <div class="proximo-item">
                            <span class="proximo-hora proximo-hora-late-old">${key["Hora"]}</span>
                            <span class="proximo-hora proximo-hora-late">${lateHora}</span>
                            <span class="proximo-nome">${key["Nome"]} (${key["Curso"] ? key["Curso"] : "IST"})</span>
                        </div>
                    `;
                } else {
                    htmlProximos += `
                        <div class="proximo-item">
                            <span class="proximo-hora">${key["Hora"]}</span>
                            <span class="proximo-nome">${key["Nome"]} (${key["Curso"] ? key["Curso"] : "IST"})</span>
                        </div>
                    `;
                }

                i_proximo++;
                console.log("WOWWWW 8");
                if(i_proximo > 4 && !seeAll) break;
                console.log("WOWWWW 9");
            }
        }
        console.log("WOWWWW 10");

        listaProximosElement.innerHTML = htmlProximos;
        lastUpdatedElement.innerText = new Date().toLocaleTimeString('pt-PT');
        lastRetrievedData = data;
        console.log("WOWWWW 11");

        loadTamara();
    }

    seeAllElement.addEventListener('click', () => {
        seeAll = !seeAll;
        updateDisplay(lastRetrievedData, true);
        seeAllElement.innerText = seeAll ? "Mostrar apenas 5 Horários" : "Ver todos os Horários";
    })

    tamaraElement.addEventListener('click', () => {
        const duration = 5000; // 5 seconds
        const end = Date.now() + duration;

        const rainInterval = setInterval(() => {
            if (Date.now() > end) {
                clearInterval(rainInterval);
                return;
            }

            createFallingTamara();
        }, 50);

        loadTamara();
    });
})

/* TAMARAAAAAAS */

function loadTamara() {
    const tamara = document.getElementById('tamara-main');
    const card = document.querySelector('.card');
    const rect = card.getBoundingClientRect();

    const imgSize = 60; // Your image width
    const winW = window.innerWidth;
    const winH = window.innerHeight;

    let x, y;
    let isInsideCard = true;

    while (isInsideCard) {
        x = Math.random() * (winW - 20) - 20;
        y = Math.random() * (winH - 20) - 20;

        const hitHorizontal = x > (rect.left - imgSize) && x < rect.right;
        const hitVertical = y > (rect.top - imgSize) && y < rect.bottom;

        if (!(hitHorizontal && hitVertical)) {
            isInsideCard = false;
        }
    }

    tamara.style.left = `${x}px`;
    tamara.style.top = `${y}px`;
    tamara.style.transform = `rotate(${Math.floor(Math.random() * 360)}deg)`;
    tamara.style.display = 'block';
}

function createFallingTamara() {
    const t = document.createElement('img');
    t.src = '/img/tamara.png';
    t.classList.add('falling-tamara');

    t.style.left = Math.random() * 100 + 'vw';

    const size = Math.random() * 60 + 20;
    t.style.width = size + 'px';

    const speed = Math.random() * 2 + 2;
    t.style.animationDuration = speed + 's';

    t.style.opacity = Math.max(Math.random() + 0.3, 1);

    document.body.appendChild(t);

    setTimeout(() => {
        t.remove();
    }, speed * 1000);
}