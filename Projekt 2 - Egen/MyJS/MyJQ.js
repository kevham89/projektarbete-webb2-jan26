$(function (){
    // Vi börjar med att skapa våran navigeringsmeny!
    // Skapar en en variabel med "const" som ej går att skriva över. Variabeln innehåller en lista "[]".
    const nav = [
        // I listan så skapar ett objekt.
        {
            group: "Person A",
            items: [
                { id: "dom-events", icon: "bi-hand-index-thumb", title: "DOM och events"},
                { id: "alt-text", icon: "bi-image", title: "Alt-text och bilder"},
                { id: "datum-tid", icon: "bi-clock", title: "Datum och tid"}
            ]
        },
        // Här kommer nästa objekt!
        {
            group: "Person B",
            items: [
                { id: "checknumber", icon: "bi-code-slash", title: "checkNumber"},
                { id: "multiplikation", icon: "bi-grid-3x3", title: "Multiplikationstabell"}
            ]
        },
        // Sista objektet för våran navigeringsmeny.
        {
            group: "Gemensamt",
            items: [
                {id: "todo", icon: "bi-list-check", title: "Todo-lista (jQuery)"}
            ]
        }
        // Stänger "nav".
    ];

    // Vi skapar nu innehållet till alla våra övningar!
    // Ny variabel med "const" som innehåller ett objekt! "{}".
    const sections = {
        "dom-events": {
            title: "DOM och events",
            subtitle: "Klick, hover, och elementinformation",
            // Vi skapar en metod som heter "render", "=>" berättar för JavaScript att det här är en funktion ("metod" eftersom att den tillhör ett objekt). "``" används för att kunna skriva koden över flera rader.
            // "Secondary" i bootstrap ger ett grått tema. "#" i våra länkar betyder att vi länkar till en plats på hemsidan och inte till en ny fil. (I det här fallet så hoppar vi högst upp på hemsidan)
            render: () => `
                <div class="col-md-6 col-xl-4">
                    <div class="card bg-secondary bg-opacity-10 border-secondary h-100 text-white">
                        <div class="card-body">
                            <h6 class="text-uppercase text-secondary small">Klicka på texten</h6>
                            <p class="mb-2"><a href="#" id="klick-bg" class="link-primary">Klick byter bakgrundsfärg</a></p>
                            <button class="btn btn-dark border" id="btn-alert">Testa</button>
                        </div>
                    </div>
                </div>

                <div class="col-md-6 col-xl-4">
                    <div class="card bg-secondary bg-opacity-10 border-secondary h-100 text-white">
                        <div class="card-body">
                            <h6 class="text-uppercase text-secondary small">Svep över texten</h6>
                            <p class="mb-2" id="hover-text" style="cursor:pointer;">Hover ändrar färg</p>
                            <button class="btn btn-dark border" id="btn-hover-demo">Testa</button>    
                        </div>
                    </div>
                </div>

                <div class="col-md-6 col-xl-4">
                    <div class="card bg-secondary bg-opacity-10 border-secondary h-100 text-white">
                        <div class="card-body">
                            <h6 class="text-uppercase text-secondary small">Sidinformation</h6>
                            <p class="mb-1">Title: <span id="page-title"></span></p>
                            <p class="mb-0">Webbläsare: <span id="browser-info"></span></p>
                        </div>
                    </div>
                </div>

                <div class="col-md-6 col-xl-4">
                    <div class="card bg-secondary bg-opacity-10 border-secondary h-100 text-white">
                        <div class="card-body d-flex justify-content-between align-items-center">
                        <span><i class="bi bi-text-paragraph me-2"></i>Antal paragrafer på sidan</span>
                        <span class="fs-4 fw-bold" id="p-count"></span>
                        </div>
                    </div>
                </div>
            `,
            // Här kommer våran nästa metod som vi kallar för "init" som innehåller funktionaliteten för våra övningar.
            init: () => {
                // Övning 1 - Alert vid klick.
                $("#btn-alert").on("click", function (){
                    alert("Hej");
                });

                //Övning 2 - Byter bakgrundsfärg vid klick
                $("#klick-bg").on("click", function(e){
                    e.preventDefault(); // preventDefault är en standardfunktion som stoppar "normal beteendett" när vi klickar på en länk med "#". Dvs vi säger åt hemsida att "hoppa inte till toppen av hemsidan när vi klickar på den här knappen"
                    // skapar en variabel med "const" som innehåller en lista med färger.
                    const colors = ["#812529", "#1b1a8a", "#1b4a2f"];
                    // Math.random skapar ett tal mellan 0-1, vi multiplecerar det med antalet färger (4) vilket gör att vi får ett decimaltal mellan 0 - <4, sedan avrundar vi ner det till närmaste heltal så att resultatet blir 0,1,2, eller 3. 
                    const random = colors[Math.floor(Math.random() * colors.length)];
                    // Vi hämtar våran färg från "random" och skriver in den i våran CSS.
                    $("#cards-area").css("background-color", random);
                });

                // Övning 3 & 4: Byter textfärg när vid hover och återgår vid mouseleave.
                $("#hover-text").on("mouseenter", function(){
                    $(this).css("color", "#0d6efd");
                }).on("mouseleave", function(){
                    $(this).css("color", "");
                });
                $("#btn-hover-demo").on("click", function(){
                    alert("Sväv med musen äver texten för att se effekten!")
                });

                // Övning 5: Visa titel + Webbläsarinfo
                $("#page-title").text(document.title); // Standardfunktion som hämtar titel från html och skriver in den i #page-titel.
                $("#browser-info").text(navigator.appName + " " + navigator.appVersion.split(" ")[0]); // appName hämtar namnet på webbläsaren, appVersion hämtar versionen. "split" delar upp texten vid varje mellanslag. [0] Hämtar bara första ordet/siffran.
                
                /* 
                Medans man kan tro att navigator.appName ska skriva ut vilken webbläsare det är så kommer den att ljuga och skriva ut Netscape 5.0 istället.
                Det är en gammal fossil från 90-talets webbläsarkrig och fortsätts att användas idag för bakotkompatibilitet. 
                Om man vill på riktigt hämta information om webbläsaren så behöver man istället använda navigator.userAgent.
                */

                // Övning 6: Räkna antal <p> element på sidan.
                $("#p-count").text(document.getElementsByTagName("p").length);
            }
        },

        "alt-text":{
            title: "Alt-text och bilder",
            subtitle: "Visar alt-attribut för alla bilder på sidan",
            // skapar metoden render för att sriva ut mallen och skapa en tom punktlista med Id "alt-list"
            render: () => `
                <div class="col-12">
                    <div class="card bg-secondary bg-opacity-10 border-secondary text-white">
                        <div class="card-body">
                            <ul id="alt-list" class="mb-0"></ul>
                        </div>
                    </div>
                </div>
            `,
            // Skapar funktionaliteten för att hitta och lista alla alt-texter
            init: () => {
                // Sparar våran "alt-list" i en variabel för att underlätta att arbeta med den.
                const $list = $("#alt-list");
                // Vi använder jQuery för att leta upp varje "img" och köra en funktion för varje träff.
                $("img").each(function (i){
                    // Vi använder "i" för att skapa en räknare som vi lägger till namet för varje bild ex. bild1 bild2 bild3. 
                    // Vi berättar för metoden att hämta in "alt" atributen och utifall denna är tom så lägger vi dit "Saknar alt-text" istället.
                    $list.append(`<li>Bild ${i + 1}: ${$(this).attr("alt") || "(saknar alt-text)"}</li>`);
                });
                // Här skapar vi en säkerhetskoll utifall det inte skulle finnas några bilder på sidan.
                if ($("img").length === 0 ) {
                    $list.append("<li>Inga bilder hittades på sidan. </li>")
                }
            }

        },

        "datum-tid": {
            title: "Datum och tid",
            subtitle: "Aktuellt datum och tid just nu",
            // Vi fortsätter på samma sätt här, först skapar vi en metod som heter render och sedan skapar vi init.
            render: () => `
                <div class="col-12 cold-md-6">
                    <div class="card bg-secondary bg-opacity-10 border-secondary text-white">
                        <div class="card-body">
                            <p class="fs-4 mb-0" id="now"></p>
                        </div>
                    </div>
                </div>
            `,
            init: () => {
                // new Date kollar på datorns klocka, toLocaleString berättar att vi vill skriva ut den enligt den svenska standarden sen skriver vi ut den informationen i "#now"
                $("#now").text(new Date().toLocaleString("sv-SE"));
            }
        },

        "checknumber": {
            title: "checkNumber",
            subtitle: "Kontrollera om ett tal är positivt, negativt, eller noll",
            // Skapar metoden som skriver ut elementen.
            render: () => `
                <div class="col-12 col-md-6">
                    <div class="card bg-secondary bg-opacity-10 border-secondary text-white">
                        <div class="card-body">
                            <input type="number" id="check-input" class="form-control mb-2" placeholder="Ange ett tal">
                            <button class="btn btn-dark border" id="check-btn">Kontrollera</button>
                            <p class="mt-3 mb-0" id="check-result"></p>
                        </div>
                    </div>
                </div>
            `,
            // Skapar metoden för logiken.
            init: () => {
                // Vi lyssnar efter click på #check-btn
                $("#check-btn").on("click", function () {
                    // Hämtar in värdet från #check-input som en sträng, "Number" konverterar strängen till ett riktigt tal.
                    const num = Number($("#check-input").val());
                    // Skapar en variabel med "let" så att värdet kan ändras.
                    let result;
                    // logiken för att kolla om talet är över, under, eller är 0.
                    if (num > 0) {
                        result = "Talet är positivt";
                    } 
                    else if (num < 0) {
                        result = "Talet är negativt";
                    }
                    else {
                        result = "Talet är noll";
                    }
                    // Skriver resultatet i #check-result
                    $("#check-result").text(result);
                });
            }
        },

        "multiplikation": {
            title: "Multiplikationstabell",
            subtitle: "Visar multiplikationstabellen för valt tal.",
            // Skapar metoden som skriver ut elementen.
            render: () => `
                <div class="col-12 cold-md-6">
                    <div class="card bg-secondary bg-opacity-10 border-secondary text white">
                        <div class="card-body">
                            <input type="number" id="mult-input" class="form-control mb-2" placeholder="Ange ett tal">
                            <button class="btn btn-dark border" id="mult-btn">Visa tabell</button>
                            <ul class="mt-3 mb-0 themed-text" id="mult-result"></ul>
                        </div>
                    </div>
                </div>
            `,
            // Skapar logiken
            init: () => {
                // lyssnar efter click
                $("#mult-btn").on("click", function() {
                // Hämtar in input och konverterar till ett tal som sparas i variabeln num.
                const num = Number($("#mult-input").val());
                // Tömmer #mult-result.
                const $result = $("#mult-result").empty();
                // Skapar en loop där "i" startar på 1 och plussar värdet med 1 varje loop så länge "i" är lika med eller mindre än 10. 
                for (let i = 1; i <= 10; i++) {
                    // bygger listan, (input) x (loop) = (input * loop)
                    $result.append(`<li>${num} x ${i} = ${num * i}</li>`);
                    }
                });
            }   
        },

        "todo": {
            title: "Todo-lista (jQuery)",
            subtitle: "Lägg till, ta bort, och markera uppgifter som klara",
            render: () => `
                <div class="col-12 col-md-6">
                    <div class="card bg-secondary bg-opacity-10 border-secondary text-white">
                        <div class="card-body">
                            <div class="input-group mb-3">
                                <input type="text" id="todo-input" class="form-control" placeholder="Ny Uppgift...">
                                <button class="btn btn-dark border" id="todo-add">Lägg till</button>
                            </div>
                            <ul class="list-group" id="todo-list"></ul>
                        </div>
                    </div>
                </div>  
            `,
            init: () => {
                $("#todo-add").on("click", function () {
                    const val = $("#todo-input").val().trim();
                    if (val === "") return;
                    $("#todo-list").append(`
                        <li class="list-group-item bg-transparent text-white d-flex justify-content-between align-items-center">
                            <span class="todo-text">${val}</span>
                            <button class="btn btn-sm btn-outline-danger todo-remove">x</button>
                            </li>
                        `);
                    $("#todo-input").val("");
                });
                $("#todo-list").on("click", ".todo-text", function () {
                    $(this).toggleClass("text-decoration-line-through text-secondary");
                }).on("click", ".todo-remove", function () {
                    $(this).closest("li").remove();
                });
            }
        }
    }; // Stänger variabeln "sections".

    let navHtml = `
        <div class="d-flex align-items-center gap-2 px-3 pt-3 pb-2 text-white">
            <i class="bi bi-code-slash fs-4"></i>
            <span class="fw-bold fs-5">Projekt Webb2</span>
        </div>
    `;
    nav.forEach(function (group){
        navHtml += `<h6 class="text-uppercase text-secondary small px-3 mt-3">${group.group}</h6>`;
        navHtml += `<div class="list-group list-group-flush">`;
        group.items.forEach(function (item){
            navHtml += `
                <a href="#" class="list-group-item list-group-item-action bg-transparent text-white nav-link-item" data-section="${item.id}">
                    <i class="bi ${item.icon} me-2"></i>${item.title}
                </a>
            `;
        });
        navHtml += `</div>`
    });
    $("#list-container").html(navHtml);

    function showSection(id) {
        const section = sections[id];
        if (!section) return;
        $("#section-title").text(section.title);
        $("#section-subtitle").text(section.subtitle);
        $("#cards-area").css("background-color", "").html(section.render());
        section.init();

        $(".nav-link-item").removeClass("active");
        $(".nav-link-item[data-section='" + id + "']").addClass("active");
    }

    $(document).on("click", ".nav-link-item", function (e) {
        e.preventDefault();
        showSection($(this).data("section"));
    });

    $(document).on("click", "#theme-toggle", function () {
        $("body").toggleClass("light-theme");
    });
    showSection("dom-events");
}); // Stänger hela "function" som vi började filen med. 