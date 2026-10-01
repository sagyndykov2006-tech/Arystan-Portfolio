const book = document.querySelector(".book");

const sheets = Array.from(
    document.querySelectorAll(".sheet")
);

const nextButton =
    document.getElementById("next");

const prevButton =
    document.getElementById("prev");

const currentPage =
    document.getElementById("currentPage");

const totalPages =
    document.getElementById("totalPages");


/*
    currentSheet показывает,
    сколько физических листов уже перелистнуто.

    0 = обложка
    1 = второй разворот
    2 = третий разворот
    ...
*/

let currentSheet = 0;

let isAnimating = false;


/* =====================================================
   НАСТРОЙКА КНИГИ
   ===================================================== */

function setupBook() {

    sheets.forEach((sheet, index) => {

        /*
            Все листы изначально лежат справа.

            Самый верхний — первый лист.
            Следующий находится под ним.
        */

        sheet.style.transform =
            "rotateY(0deg)";

        sheet.classList.remove("turned");
        sheet.classList.remove("turning");

        /*
            Чем раньше лист,
            тем выше его z-index.
        */

        sheet.style.zIndex =
            sheets.length - index + 10;
    });

    updateInterface();
}


/* =====================================================
   ОБНОВЛЕНИЕ ИНТЕРФЕЙСА
   ===================================================== */

function updateInterface() {

    currentPage.textContent =
        currentSheet + 1;

    totalPages.textContent =
        sheets.length;

    prevButton.disabled =
        currentSheet === 0;

    nextButton.disabled =
        currentSheet === sheets.length - 1;
}


/* =====================================================
   ВПЕРЁД
   ===================================================== */

function nextPage() {

    if (isAnimating) {
        return;
    }

    if (currentSheet >= sheets.length - 1) {
        return;
    }

    isAnimating = true;


    /*
        Берём именно тот лист,
        который сейчас находится перед нами.
    */

    const sheet =
        sheets[currentSheet];


    /*
        Очень важно:

        следующий лист уже находится ПОД текущим.

        Поэтому новая страница не появляется
        после анимации — она уже физически
        находится под листом.
    */

    sheet.style.zIndex =
        sheets.length + 100;


    /*
        Добавляем класс анимации.
    */

    sheet.classList.add("turning");


    /*
        Запускаем реальный физический поворот.
    */

    requestAnimationFrame(() => {

        sheet.style.transform =
            "rotateY(-180deg)";

    });


    /*
        После завершения поворота
        лист остаётся перевёрнутым.
    */

    setTimeout(() => {

        sheet.classList.remove("turning");

        sheet.classList.add("turned");


        /*
            Теперь этот лист должен находиться
            ЗА всеми ещё не перевёрнутыми листами.
        */

        sheet.style.zIndex =
            currentSheet;


        currentSheet++;


        /*
            Никакого повторного изменения transform
            здесь нет.

            Лист уже находится в положении
            rotateY(-180deg).
        */

        updateInterface();

        isAnimating = false;

    }, 1150);
}


/* =====================================================
   НАЗАД
   ===================================================== */

function previousPage() {

    if (isAnimating) {
        return;
    }

    if (currentSheet <= 0) {
        return;
    }

    isAnimating = true;


    /*
        Берём предыдущий лист.
    */

    const sheet =
        sheets[currentSheet - 1];


    /*
        Поднимаем его наверх,
        чтобы он физически вернулся
        поверх остальных листов.
    */

    sheet.style.zIndex =
        sheets.length + 100;

    sheet.classList.add("turning");


    /*
        Лист уже перевёрнут.
        Теперь физически возвращаем его
        обратно.
    */

    requestAnimationFrame(() => {

        sheet.style.transform =
            "rotateY(0deg)";

    });


    setTimeout(() => {

        sheet.classList.remove("turning");
        sheet.classList.remove("turned");


        currentSheet--;


        /*
            Возвращаем нормальный порядок.
        */

        sheet.style.zIndex =
            sheets.length -
            (currentSheet) +
            10;


        updateInterface();

        isAnimating = false;

    }, 1150);
}


/* =====================================================
   КНОПКА ВПРАВО
   ===================================================== */

nextButton.addEventListener(
    "click",
    function(event) {

        event.stopPropagation();

        nextPage();

    }
);


/* =====================================================
   КНОПКА ВЛЕВО
   ===================================================== */

prevButton.addEventListener(
    "click",
    function(event) {

        event.stopPropagation();

        previousPage();

    }
);


/* =====================================================
   КЛАВИАТУРА
   ===================================================== */

document.addEventListener(
    "keydown",
    function(event) {

        if (
            event.key === "ArrowRight"
        ) {
            nextPage();
        }


        if (
            event.key === "ArrowLeft"
        ) {
            previousPage();
        }

    }
);


/* =====================================================
   КЛИК ПО КНИГЕ
   ===================================================== */

book.addEventListener(
    "click",
    function(event) {

        /*
            Если нажали на кнопки,
            книга не перелистывается дополнительно.
        */

        if (
            event.target.closest(".controls")
        ) {
            return;
        }


        const rect =
            book.getBoundingClientRect();


        const x =
            event.clientX - rect.left;


        /*
            Левая половина книги — назад.
            Правая половина — вперёд.
        */

        if (
            x < rect.width / 2
        ) {

            previousPage();

        } else {

            nextPage();

        }

    }
);


/* =====================================================
   ЗАПУСК
   ===================================================== */

setupBook();
// Кнопка возврата на страницу "Мазмұны"
const homeButton = document.createElement("button");

homeButton.className = "home-button";
homeButton.innerHTML = "☰ Мазмұны";

document.body.appendChild(homeButton);

homeButton.addEventListener("click", function(event) {
    event.stopPropagation();

    if (isAnimating) {
        return;
    }

    // Сначала возвращаем все страницы
    sheets.forEach((sheet, index) => {
        sheet.classList.remove("turned");
        sheet.classList.remove("turning");

        sheet.style.transform = "rotateY(0deg)";
        sheet.style.zIndex =
            sheets.length - index + 10;
    });

    // Переходим сразу на страницу "Мазмұны"
    currentSheet = 1;

    // Первый лист должен быть перевёрнут,
    // чтобы была видна его обратная сторона "Мазмұны"
    const firstSheet = sheets[0];

    firstSheet.classList.add("turned");
    firstSheet.style.transform = "rotateY(-180deg)";
    firstSheet.style.zIndex = "1";

    updateInterface();
});