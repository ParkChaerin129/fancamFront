// 헤더를 모든 페이지에 동적으로 로드
function loadHeader() {
    fetch('/header')  // header.html 파일 경로
        .then(response => response.text())
        .then(data => {
            document.querySelector('header').innerHTML = data;

            // 현재 페이지 URL에 맞는 링크에 active 클래스 추가
            highlightCurrentLink();

            // 로그인 상태에 따라 UI를 업데이트
            updateLoginState();

            // 헤더가 로드된 후에 검색 기능을 설정
            setupSearchFunctionality();
        })
        .catch(error => {
            console.error('Error loading header:', error);
        });
}

// 현재 페이지 링크 강조 표시
function highlightCurrentLink() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('#navLinks .nav-link');

    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
        }
    });
}

// 로그인 상태에 따른 UI 업데이트 (로그인/로그아웃 버튼, 폴더 비활성화)
function updateLoginState() {
    // 서버에서 로그인 상태를 확인하는 API 호출
    const sessionKey = localStorage.getItem('sessionKey');

    if (sessionKey) {
        // 로그인 상태: 로그인 버튼을 로그아웃으로 변경
        document.getElementById('loginLink').textContent = 'Logout';
        document.getElementById('loginLink').href = '#';
        document.getElementById('loginLink').addEventListener('click', function(event) {
            event.preventDefault();  // 링크의 기본 동작 방지

            // LocalStorage에서 JWT 삭제 (로그아웃 처리)
            localStorage.removeItem('sessionKey');
            alert('You have been logged out.');

            // 로그아웃 후 로그인 페이지로 이동
            window.location.href = '/login';
        });

        // 폴더 링크를 활성화 상태로 유지
        document.getElementById('folderLink').classList.remove('disabled');
        document.getElementById('folderLink').style.pointerEvents = 'auto';



        checkAdminAuthority();
    } else {
        // 로그아웃 상태: 폴더 링크 비활성화
        document.getElementById('folderLink').classList.add('disabled');
        document.getElementById('folderLink').style.pointerEvents = 'none';

        document.getElementById('addFancamLink').classList.add('disabled');
        document.getElementById('addFancamLink').style.pointerEvents = 'none';
        //document.getElementById('addFancamLink').style.display = 'none';
    }
}

document.addEventListener('DOMContentLoaded', loadHeader);

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

function checkAdminAuthority() {
    fetch('http://localhost:8080/user/auth', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('sessionKey')}`
        }
    })
        .then(response => response.json())
        .then(data => {
            if (data === true) {
                // ADMIN 권한이 있을 때 직캠 추가하기 메뉴 보이기
                document.getElementById('addFancamLink').classList.remove('disabled');
                document.getElementById('addFancamLink').style.pointerEvents = 'auto';
            } else {
                // 권한이 없으면 직캠 추가하기 메뉴 숨기기
                document.getElementById('addFancamLink').classList.add('disabled');
                document.getElementById('addFancamLink').style.pointerEvents = 'none';
            }
        })
        .catch(error => {
            console.error('Error checking admin authority:', error);
            // 에러 발생 시 직캠 추가하기 메뉴 숨기기
            document.getElementById('addFancamLink').classList.add('disabled');
            document.getElementById('addFancamLink').style.pointerEvents = 'none';
        });
}

// 페이지가 로드되면 헤더를 동적으로 로드
document.addEventListener('DOMContentLoaded', loadHeader);