document.addEventListener("DOMContentLoaded", function () {
    // Fetch tag list when the accordion is clicked
    document.getElementById("headingOne").addEventListener("click", function () {
        // Check if data is already loaded to prevent multiple requests
        const tagListContainer = document.querySelector("#collapseOne .accordion-body ul.list-group");
        if (tagListContainer.children.length === 0) {
            fetchTags();
        }
    });

    function fetchTags() {
        fetch("http://localhost:8080/search/tag/all")
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to fetch tag data");
                }
                return response.json();
            })
            .then((tags) => {
                renderTags(tags);
            })
            .catch((error) => {
                console.error("Error fetching tags:", error);
            });
    }

    function renderTags(tags) {
        const tagListContainer = document.querySelector("#collapseOne .accordion-body ul.list-group");

        // Clear previous content
        tagListContainer.innerHTML = "";

        tagListContainer.style.display = "flex";
        tagListContainer.style.flexWrap = "wrap";
        tagListContainer.style.maxHeight = "300px"; // 최대 높이 설정
        tagListContainer.style.overflowY = "auto"; // 스크롤 설정

        tags.forEach((tag) => {


            const listItem = document.createElement("div");

            listItem.className = "list-group-item d-flex justify-content-between align-items-center";
            listItem.style.flex = "1 0 30%"; // 한 줄에 세 개씩 배치
            listItem.style.margin = "5px"; // 간격 설정
            listItem.textContent = tag.tagName;


            listItem.addEventListener("click", () => {
                const encodedTagName = encodeURIComponent(tag.tagName);
                window.location.href = `/search/tag/${encodedTagName}`;
            });


            tagListContainer.appendChild(listItem);
        });
    }
});