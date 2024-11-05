// URL에서 쿼리 파라미터 읽기
function getFancamIdFromURL() {
    const pathParts = window.location.pathname.split('/');
    return pathParts[pathParts.length - 1];
}

// ID 값을 추출
const id = getFancamIdFromURL()

console.log(id);
const fetchUrl = `http://localhost:8080/search/tag/${id}`

let currentPage = 1;
let itemsPerPage = 4;
let totalPages = 1;
let fancamArray = [];

async function getArticle(fetchUrl) {

    let title = document.getElementById('title')
    title.innerHTML = '';
    let h3 = document.createElement('h3');
    h3.className="card-header";
    const decodedTagName = decodeURIComponent(id);
    h3.textContent='태그 '+'\''+decodedTagName+'\'의 검색결과';
    title.appendChild(h3);

    try {
        let response = await fetch(fetchUrl);
        if (response.ok) {
            console.log('connected');
            let text = await response.text();
            fancamArray = JSON.parse(text);
            console.log(fancamArray); // 데이터를 확인하기 위한 콘솔 로그

            totalPages = Math.ceil(fancamArray.length / itemsPerPage);
            displayPage(currentPage);

        } else {
            console.log('Error: ', response.statusText);
        }
    } catch (err) {
        console.log('Error: ', err);
    }
}

function displayPage(page) {
    let list = document.getElementById('list');
    list.innerHTML = ''; // 기존 콘텐츠를 비우기

    let startIndex = (page - 1) * itemsPerPage;
    let endIndex = Math.min(startIndex + itemsPerPage, fancamArray.length);

    for (let i = startIndex; i < endIndex; i++) {
        let fancam = fancamArray[i];
        let container = document.createElement('div');
        container.className = 'custom-container'; // 클래스 이름 변경

        container.style.display = 'grid';
        container.style.gridTemplateColumns = 'repeat(2, 1fr)';
        container.style.gap = '10px';
        container.style.placeItems = 'center';

        container.appendChild(createCardElement(fancam));
        if (fancamArray[i + 1]) {
            container.appendChild(createCardElement(fancamArray[i + 1]));
            i+=1;
        }

        list.appendChild(container);
    }

    updatePagination();
}

function createCardElement(fancam) {
    // Create the main card container
    let card = document.createElement('a');
    card.href = `../fancam/${fancam.fancam.fancamidx}`;
    card.className = 'card text-white bg-primary mb-3';
    card.style.maxWidth = '100%';
    card.style.textDecoration = 'none'; // 링크 아래줄 제거
    // Create the card header
    let cardHeader = document.createElement('div');
    cardHeader.className = 'card-header';
    cardHeader.textContent = fancam.fancam.date;
    card.appendChild(cardHeader);

    // Create the card body
    let cardBody = document.createElement('div');
    cardBody.className = 'card-body';

    // Create the img element for the YouTube thumbnail
    let youtubeVideoId = fancam.fancam.fancam_url;
    let img = document.createElement('img');
    img.setAttribute("width", "100%");
    img.setAttribute("height", "auto");
    img.setAttribute("src", `https://img.youtube.com/vi/${youtubeVideoId}/maxresdefault.jpg`);
    img.setAttribute("alt", "YouTube Thumbnail");

    cardBody.appendChild(img);


    // Create the card text
    let paragraph = document.createElement('p');
    paragraph.className = 'card-text';
    paragraph.style.marginTop = '10px';
    paragraph.style.display = 'flex';
    paragraph.style.flexWrap = 'nowrap'; // 태그들이 한 줄로 표시되도록 설정
    paragraph.style.overflowX = 'auto'; // 넘치면 좌우로 스크롤 가능하게 설정
    paragraph.style.whiteSpace = 'nowrap'; // 줄바꿈을 하지 않도록 설정

// tags 배열을 순회하면서 각 태그를 paragraph에 추가
    fancam.tags.forEach(tag => {
        let tagElement = document.createElement('span'); // 각 태그를 담을 span 요소 생성
        tagElement.className = 'badge bg-secondary me-1'; // Bootstrap 배지 스타일 사용 예시
        tagElement.textContent = tag.tagNames; // 태그의 텍스트 내용 설정
        paragraph.appendChild(tagElement); // paragraph에 tag 요소 추가
    });

    cardBody.appendChild(paragraph);
    // Append card body to the main card container
    card.appendChild(cardBody);

    return card;
}

function updatePagination() {
    let pagination = document.querySelector('.pagination');
    pagination.innerHTML = '';

    // Previous page button
    let prevItem = document.createElement('li');
    prevItem.className = `page-item ${currentPage === 1 ? 'disabled' : ''}`;
    prevItem.innerHTML = `<a class="page-link" href="#">&laquo;</a>`;
    prevItem.onclick = () => {
        if (currentPage > 1) {
            currentPage--;
            displayPage(currentPage);
        }
    };
    pagination.appendChild(prevItem);

    // Page number buttons
    for (let i = 1; i <= totalPages; i++) {
        let pageItem = document.createElement('li');
        pageItem.className = `page-item ${currentPage === i ? 'active' : ''}`;
        pageItem.innerHTML = `<a class="page-link" href="#">${i}</a>`;
        pageItem.onclick = () => {
            currentPage = i;
            displayPage(currentPage);
        };
        pagination.appendChild(pageItem);
    }

    // Next page button
    let nextItem = document.createElement('li');
    nextItem.className = `page-item ${currentPage === totalPages ? 'disabled' : ''}`;
    nextItem.innerHTML = `<a class="page-link" href="#">&raquo;</a>`;
    nextItem.onclick = () => {
        if (currentPage < totalPages) {
            currentPage++;
            displayPage(currentPage);
        }
    };
    pagination.appendChild(nextItem);
}

getArticle(fetchUrl);
