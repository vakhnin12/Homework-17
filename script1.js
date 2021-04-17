function createButton(text, classes) {
    const button = document.createElement("button");

    button.type = "button";
    button.className = classes;
    button.innerText = text;

    return button;
};

function loadData(url, onLoad, onError) {
    const buttonPrev = document.querySelector(".prev");
    const buttonNext = document.querySelector(".next");

    buttonPrev.disabled = true;
    buttonPrev.innerText = "Loading"
    buttonPrev.classList.add("disabled")
    buttonNext.disabled = true;
    buttonNext.innerText = "Loading"
    buttonNext.classList.add("disabled")

    const xhr = new XMLHttpRequest();
    xhr.responseType = "json";
    xhr.open("GET", url);

    xhr.onload = function () {



        if (xhr.status !== 200) {
            if (typeof onError === "function") {
                onError(new Error(`Something went wrong! Status: ${xhr.status}`));
            }
            return;
        }
        onLoad(xhr.response);
    }

    xhr.onerror = function () {
        if (typeof onError === "function") {
            onError(new Error("Something went wrong..."));
        }
    }
    xhr.send()
}

function renderPosts(data) {
    const container = document.createElement("div")
    const list = document.createElement("ul");
    list.className = "list"

    for (const index in data.results) {
        const li = document.createElement("li");
        li.innerText = data.results[index].name;
        list.appendChild(li)
    }
    container.appendChild(list);

    document.body.appendChild(container);
}

const addButtonNext = createButton("Next Page", "next");
const addButtonPrev = createButton("Prev Page", "prev");
const buttonsContainer = document.createElement("div");
buttonsContainer.appendChild(addButtonPrev);
buttonsContainer.appendChild(addButtonNext);
document.body.appendChild(buttonsContainer);

let page = 1;

addButtonNext.addEventListener("click", () => {
    page++;
    changeCharacters();
});

addButtonPrev.addEventListener("click", () => {
    page--;
    changeCharacters();
});

function loadCharacters() {
    const link = `https://rickandmortyapi.com/api/character/?page=${page}`;
    loadData(link, data => renderPosts(data));
    loadData(link, data => activateButton(data))
}

function changeCharacters() {
    const link = `https://rickandmortyapi.com/api/character/?page=${page}`;
    loadData(link, data => changePosts(data));
    loadData(link, data => activateButton(data))
}

function activateButton(data) {
    const buttonNext = document.querySelector(".next");
    const buttonPrev = document.querySelector(".prev");

    buttonPrev.disabled = false;
    buttonPrev.innerText = "Prev Page"
    buttonPrev.classList.remove("disabled")
    buttonNext.disabled = false;
    buttonNext.innerText = "Next Page"
    buttonNext.classList.remove("disabled")

    if (data.info.next !== null && data.info.prev !== null) {
        buttonNext.disabled = false;
        buttonNext.classList.remove("disabled");
        buttonPrev.disabled = false;
        buttonPrev.classList.remove("disabled")
    } else if (data.info.next === null) {
        buttonNext.disabled = true;
        buttonNext.classList.add("disabled")
    } else if (data.info.prev === null) {
        buttonPrev.disabled = true;
        buttonPrev.classList.add("disabled")
    }
}

function changePosts(data) {
    const list = document.querySelector(".list");
    if (list.hasChildNodes()) {
        const children = list.childNodes;

        for (i = 0; i < children.length; i++) {
            children[i].innerText = data.results[i].name;
            if (children.length > data.results.length) {
                for (j = 0; j < children.length - data.results.length; j++)
                    list.removeChild(children[j + data.results.length])
            } else if (children.length < data.results.length) {
                for (j = 0; j < data.results.length - children.length; j++) {
                    const li = document.createElement("li");
                    list.appendChild(li)
                }
            }
        }
    }
}

loadCharacters();