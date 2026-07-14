$(document).ready(function () {

    let questions = [];
    let order = [];
    let current = 0;
    let score = 0;
    let answered = false;
    let catStats = {};

    // ---- Hämta frågorna via AJAX ----
    $.ajax({
        url: "data/questions.json",
        method: "GET",
        dataType: "json",
        success: function (data) {
            questions = data;
            buildTopicChips();
            $("#start-btn-spinner").addClass("d-none");
            $("#start-btn-label").text("Kör igång »");
            $("#start-btn").prop("disabled", false);
        },
        error: function (jqXHR, status, err) {
            $("#load-error")
                .removeClass("d-none")
                .text("Kunde inte ladda frågorna (data/questions.json). Kör sidan via en lokal server, inte direkt som fil. Fel: " + status);
        }
    });

    function buildTopicChips() {
        const cats = [...new Set(questions.map(q => q.cat))];
        const $wrap = $("#topic-chips").empty();
        cats.forEach(c => {
            $("<span>")
                .addClass("badge text-bg-secondary")
                .text(c)
                .appendTo($wrap);
        });
    }

    // Fisher-Yates
    function shuffle(arr) {
        const a = arr.slice();
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    }

    $("#start-btn").on("click", startQuiz);
    $("#next-btn").on("click", nextQuestion);
    $("#retry-btn").on("click", function () {
        $("#result-screen").addClass("d-none");
        $("#start-screen").removeClass("d-none");
    });

    function startQuiz() {
        order = shuffle(questions.map((_, i) => i));
        current = 0;
        score = 0;
        catStats = {};
        [...new Set(questions.map(q => q.cat))].forEach(c => catStats[c] = { correct: 0, total: 0 });

        $("#start-screen").addClass("d-none");
        $("#result-screen").addClass("d-none");
        $("#quiz-screen").removeClass("d-none");
        renderQuestion();
    }

    function renderQuestion() {
        answered = false;
        const idx = order[current];
        const q = questions[idx];

        $("#progress-label").text(`Fråga ${current + 1}/${order.length}`);
        $("#score-label").text(`${score} rätt`);
        $("#progress-fill").css("width", (current / order.length) * 100 + "%");
        $("#cat-tag").text(q.cat);
        $("#question-text").html(q.q);

        const $opts = $("#options-list").empty();
        const letters = ["A", "B", "C", "D"];

        // slumpa alternativens ordning men kom ihåg vilket som är rätt
        const optOrder = shuffle(q.opts.map((_, i) => i));
        const correctShuffledPos = optOrder.indexOf(q.correct);

        optOrder.forEach((origIdx, pos) => {
            const $btn = $("<button>", { type: "button", class: "list-group-item list-group-item-action d-flex gap-2" })
                .append($("<span>", { class: "letter" }).text(letters[pos]))
                .append($("<span>", { class: "opt-text" }).html(q.opts[origIdx]))
                .on("click", function () {
                    selectAnswer(pos, correctShuffledPos, $btn, q.fb);
                });
            $opts.append($btn);
        });

        $("#feedback").addClass("d-none").removeClass("alert-success alert-danger");
        $("#next-btn").addClass("d-none");
    }

    function selectAnswer(chosenPos, correctPos, $btnEl, fbText) {
        if (answered) return;
        answered = true;

        const idx = order[current];
        const cat = questions[idx].cat;
        catStats[cat].total++;

        const $allOpts = $("#options-list .list-group-item");
        $allOpts.addClass("is-disabled");
        $allOpts.eq(correctPos).addClass("list-group-item-success is-correct");

        const $fb = $("#feedback").removeClass("d-none");

        if (chosenPos === correctPos) {
            score++;
            catStats[cat].correct++;
            $fb.addClass("alert alert-success").html("<strong>Rätt!</strong> " + fbText);
        } else {
            $btnEl.addClass("list-group-item-danger");
            $fb.addClass("alert alert-danger").html("<strong>Fel.</strong> " + fbText);
        }

        $("#score-label").text(`${score} rätt`);
        $("#next-btn").removeClass("d-none")
            .text(current === order.length - 1 ? "Se resultat »" : "Nästa »");
    }

    function nextQuestion() {
        current++;
        if (current >= order.length) {
            showResult();
        } else {
            renderQuestion();
        }
    }

    function gradeFor(pct) {
        if (pct >= 90) return { letter: "A", desc: "Mycket god förståelse. Du hanterar kursens innehåll analytiskt och självständigt." };
        if (pct >= 80) return { letter: "B", desc: "Stark förståelse med god analytisk förmåga - nästan i toppskiktet." };
        if (pct >= 70) return { letter: "C", desc: "God förståelse. Du har tydliga resonemang och bra grepp om materialet." };
        if (pct >= 60) return { letter: "D", desc: "Godkänd nivå med viss självständighet - några luckor kvar att täppa till." };
        if (pct >= 50) return { letter: "E", desc: "Grundläggande förståelse. Repetera gärna de kategorier du missade nedan." };
        return { letter: "F", desc: "Under godkäntgränsen - dags att gå igenom kursmaterialet igen innan slutprovet!" };
    }

    function showResult() {
        $("#quiz-screen").addClass("d-none");
        $("#result-screen").removeClass("d-none");

        const pct = Math.round((score / order.length) * 100);
        const g = gradeFor(pct);

        $("#grade-letter").text(g.letter);
        $("#score-line").text(`${score}/${order.length} rätt - ${pct}%`);
        $("#grade-desc").text(g.desc);

        const $breakdown = $("#cat-breakdown").empty();
        Object.keys(catStats).forEach(c => {
            const s = catStats[c];
            if (s.total === 0) return;
            const catPct = Math.round((s.correct / s.total) * 100);

            const $row = $("<div>", { class: "cat-row mb-2" });
            $("<div>", { class: "d-flex justify-content-between mb-1" })
                .append($("<span>").text(c))
                .append($("<span>").text(`${s.correct}/${s.total}`))
                .appendTo($row);
            $("<div>", { class: "progress", style: "height: 5px;" })
                .append($("<div>", { class: "progress-bar bg-info", style: `width:${catPct}%` }))
                .appendTo($row);

            $breakdown.append($row);
        });
    }

});
