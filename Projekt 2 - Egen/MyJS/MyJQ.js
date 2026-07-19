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
                            <p class="mb-2><a href="#" id="klick-bg" class="link-primary">Klick byter bakgrundsfärg</a></p>
                            <button class="btn btn-dark border" id="btn-alert">Testa</button>
                        </div>
                    </div>
                </div>

                <div class="col-md-6 col-xl-4">
                    <div class="card bg-secondary bg-opacity-10 border-secondary h-100 text-white">
                        <div class="card-body">
                            <h6 class="text-uppercase text-secondary small">Svep över texten</h6>
                            <p class="mb-2 id="hover-text" style="cursor:pointer;">Hover ändrar färg</p>
                            <button class="btn btn-dark border" id="btn-hover-demo">Testa</button>    
                        </div>
                    </div>
                </div>

                <div class="col-md-6 col-xl-4">
                    <div class="card bg-secondary bg-opacity-10 border-secondary h-100 text-white">
                        <div class="card-body">
                            <h6 class="text-uppercase text-secondary small">Sidinformation</h6>
                            <p class="mb-1>Title: <span id=page-title"></span></p>
                            <p class="mb-0>Webbläsare: <span id=browser-info"></span></p>
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
            $("klick-bg").on("click", function(e){
                e.preventDefault(); // preventDefault är en standardfunktion som stoppar "normal beteendett" när vi klickar på en länk med "#". Dvs vi säger åt hemsida att "hoppa inte till toppen av hemsidan när vi klickar på den här knappen"
                
            });
        }



















        }

    }    






});