async function getTerms() {
    fetch("http://localhost:3000/api/dictionary", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        mode: "cors",
    })
        .then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                console.log("Request failed with status: " + response.status);
            }
        })
        .then((terms) => {
            console.log(terms.data);
            displayTerms(terms.data);
        })
        .catch((error) => {
            console.log("Error: ", error);
        });
}

function displayTerms(terms) {
    const listContainer = document.getElementById("term-list");

    listContainer.innerHTML = "";

    terms.forEach((term) => {
        const listItem = document.createElement("li");
        listItem.textContent = `${term.term}`;
        listContainer.appendChild(listItem);
    });
}
