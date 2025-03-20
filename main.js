
let themes = JSON.parse(localStorage.getItem("themes")) || [];
let validatedQuestions = JSON.parse(localStorage.getItem("validated")) || {};
let currentTheme = null;

function closeNavbar() {
    let navbarToggler = document.querySelector('.navbar-toggler');
    let navbarCollapse = document.querySelector('.navbar-collapse');

    if (navbarToggler && navbarCollapse.classList.contains('show')) {
        navbarToggler.click();
    }
}
function addTheme() {
    closeNavbar()
    const name = document.getElementById("themeName").value;
    const count = parseInt(document.getElementById("questionCount").value);
    if (name && count > 0) {
        themes.push({id: themes.length + 1, name, questionCount: count});
        localStorage.setItem("themes", JSON.stringify(themes));
        document.getElementById("themeName").value = ''
        document.getElementById("questionCount").value = ''
        modifyConfig();
    }
}

function clearStorage() {
    closeNavbar()
    if (window.confirm("Êtes vous sur ?")) {
        localStorage.clear();
        location.reload();
    }
}

function modifyConfig() {
    closeNavbar()
    show('setup')
    document.getElementById("themeList").innerHTML = '<h1 style="margin-top: 20px;">Thèmes existants</h1>' + themes.map(t => `<li class='list-group-item'>${t.name} - ${t.questionCount} questions</li>`).join('');
}

function showThemes() {
    closeNavbar()
    if (themes.length === 0) {
        show('empty')
    } else {
        show('main')
        const container = document.getElementById("themeButtons");
        container.innerHTML = themes.map(t => {
            const used = validatedQuestions[t.id] || [];
            const available = Array.from({ length: t.questionCount }, (_, i) => i + 1).filter(q => !used.includes(q));
            let done = (100 - (available.length * 100 / t.questionCount)).toFixed(2);

            return `
            <a class='btn btn-secondary d-block mb-2' onclick='startRandom(${t.id})'>
                ${t.name} <br/>
                ${t.questionCount - available.length} / ${t.questionCount} question(s)
                <div class="progress mt-2" style="height: 10px;">
                    <div class="progress-bar progress-bar-striped bg-success" role="progressbar" style="width: ${done}%" aria-valuenow="${done}" aria-valuemin="0" aria-valuemax="100"></div>
                </div>
            </a>`;
        }).join('');
    }
}

function startRandom(themeId) {
    closeNavbar()
    currentTheme = themes.find(t => t.id === themeId);
    const used = validatedQuestions[currentTheme.id] || [];
    const available = Array.from({length: currentTheme.questionCount}, (_, i) => i + 1).filter(q => !used.includes(q));
    let done = (100 - (available.length * 100 / currentTheme.questionCount)).toFixed(2)
    document.getElementById("selectedTheme").innerText = currentTheme.name
    document.getElementById("selectedPercent").innerHTML = `
            <p class="text-center">${currentTheme.questionCount - available.length} / ${currentTheme.questionCount}</p>
            <div class="progress mt-2" style="height: 10px;">
                <div class="progress-bar progress-bar-striped bg-success" role="progressbar" style="width: ${done}%" aria-valuenow="${done}" aria-valuemin="0" aria-valuemax="100"></div>
            </div>`
    document.getElementById("main").classList.add("hidden");
    document.getElementById("questionDisplay").classList.remove("hidden");
    newRandom();
}

function newRandom() {
    closeNavbar()
    const used = validatedQuestions[currentTheme.id] || [];
    const available = Array.from({length: currentTheme.questionCount}, (_, i) => i + 1).filter(q => !used.includes(q));
    let done = (100 - (available.length * 100 / currentTheme.questionCount)).toFixed(2)
    document.getElementById("selectedTheme").innerText = currentTheme.name
    document.getElementById("selectedPercent").innerHTML = `
            <p class="text-center">${currentTheme.questionCount - available.length} / ${currentTheme.questionCount}</p>
            <div class="progress mt-2" style="height: 10px;">
                <div class="progress-bar progress-bar-striped bg-success" role="progressbar" style="width: ${done}%" aria-valuenow="${done}" aria-valuemin="0" aria-valuemax="100"></div>
            </div>`
    if (available.length !== 0) {
        animateRandom(available);
    } else {
        animateRandom(null);
    }
}

function animateRandom(available) {
    if (null === available) {
        document.getElementById("randomNumber").innerText = '🎉';
    } else {
        let count = 10;
        const interval = setInterval(() => {
            document.getElementById("randomNumber").innerText = available[Math.floor(Math.random() * available.length)];
            if (--count === 0) clearInterval(interval);
        }, 100);
    }
}

function validateQuestion() {
    const questionNumber = parseInt(document.getElementById("randomNumber").innerText);
    if (!validatedQuestions[currentTheme.id]) {
        validatedQuestions[currentTheme.id] = [];
    }
    validatedQuestions[currentTheme.id].push(questionNumber);
    localStorage.setItem("validated", JSON.stringify(validatedQuestions));
    newRandom();
}

function show(id) {
    document.getElementById("questionDisplay").classList.add("hidden");
    document.getElementById("empty").classList.add("hidden");
    document.getElementById("main").classList.add("hidden");
    document.getElementById("setup").classList.add("hidden");
    document.getElementById(id).classList.remove("hidden");
}

showThemes();