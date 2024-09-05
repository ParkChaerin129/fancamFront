// 헤더를 모든 페이지에 동적으로 로드
function loadHeader() {
    fetch('/header')  // header.html 파일 경로
        .then(response => response.text())
        .then(data => {
            // 헤더를 현재 페이지의 특정 요소에 삽입
            document.querySelector('header').innerHTML = data;

            // 헤더가 로드된 후에 검색 기능을 설정
            setupSearchFunctionality();
        })
        .catch(error => {
            console.error('Error loading header:', error);
        });
}

// 검색 기능을 설정하는 함수
function setupSearchFunctionality() {
    document.getElementById('searchForm').addEventListener('submit', function(event) {
        event.preventDefault();  // 폼의 기본 제출 동작을 막음

        let query = document.getElementById('searchInput').value.trim();
        if (query) {
            // 검색어를 검색 결과 페이지로 넘김
            window.location.href = `http://localhost:3000/search?q=${encodeURIComponent(query)}`;
        }
    });
}

// 페이지가 로드되면 헤더를 동적으로 로드
document.addEventListener('DOMContentLoaded', loadHeader);