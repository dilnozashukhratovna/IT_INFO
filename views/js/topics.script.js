async function getTopics() {
    fetch("http://localhost:3000/api/topic", {
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
        .then((topics) => {
            console.log(topics.data);
            displayTopics(topics.data);
        })
        .catch((error) => {
            console.log("Error: ", error);
        });
}

function displayTopics(topics) {
    const listContainer = document.getElementById("topic-list");

    listContainer.innerHTML = "";

    topics.forEach((topic) => {
        const listItem = document.createElement("li");
        listItem.textContent = `${topic.topic_title} -> ${topic.topic_text}`;
        listContainer.appendChild(listItem);
    });
}
