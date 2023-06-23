async function getAuthors() {
    localStorage.setItem(
        "accessToken",
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0OTE0Y2VkNWYyMDUwNGU0NzBlZmRmZiIsImlzX2V4cGVydCI6ZmFsc2UsImF1dGhvclJvbGVzIjpbIlJFQUQiLCJXUklURSJdLCJpYXQiOjE2ODc1NTI3NTgsImV4cCI6MTY4NzU1MzY1OH0.Du18sgU2KXLV2Zsri8lNjyvkA1mgLsXL9Dvrev_54K0"
    );

    const accessToken = localStorage.getItem("accessToken");
    console.log(accessToken);

    fetch("http://localhost:3000/api/author", {
        method: "GET",
        headers: {
            Authorization: `Bearer ${accessToken}`,
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
        .then((author) => {
            console.log(author.data);
            displayAuthors(author.data);
        })
        .catch((error) => {
            console.log("Error: ", error);
        });
}

function displayAuthors(authors) {
    const listContainer = document.getElementById("author-list");

    listContainer.innerHTML = "";

    authors.forEach((author) => {
        const listItem = document.createElement("li");
        listItem.textContent = `${author.author_first_name} ${author.author_last_name} \
        - ${author.author_email}`;
        listContainer.appendChild(listItem);
    });
}
