const sessionKey = localStorage.getItem("sessionKey");

function folderList(){
    document.addEventListener('DOMContentLoaded', function() {
        fetch('http://localhost:8080/user/folder', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sessionKey}`
            }
        })
            .then(response => response.json())
            .then(data => {
                addFoldersToList(data);
            })
            .catch(error => {
                console.error('Error fetching folders:', error);
            });
    });

    function addFoldersToList(folders) {
        const ulElement = document.getElementById('folder-list');

        // 기본 폴더 항목 추가
        const defaultLiElement = document.createElement('li');
        defaultLiElement.className = 'list-group-item d-flex justify-content-between align-items-center';
        defaultLiElement.textContent = '\'좋아요\'한 직캠';
        defaultLiElement.dataset.folderIdx = '0';
        ulElement.appendChild(defaultLiElement);

        // 클릭 이벤트 추가
        defaultLiElement.addEventListener('click', function() {
            const folderIdx = this.dataset.folderIdx;
            let title = document.getElementById('title')
            title.innerHTML = '';
            let h3 = document.createElement('h3');
            h3.className="card-header";
            h3.textContent=defaultLiElement.textContent;
            title.appendChild(h3);
            getArticle(folderIdx); // 폴더 ID로 팬캠 목록 불러오기
        });

        // 서버에서 가져온 폴더 목록 추가
        folders.forEach(folder => {
            const liElement = document.createElement('li');
            liElement.className = 'list-group-item d-flex justify-content-between align-items-center';
            liElement.textContent = folder.folderName;
            liElement.dataset.folderIdx = folder.folderIdx;

            // 클릭 이벤트 추가
            liElement.addEventListener('click', function() {
                const folderIdx = this.dataset.folderIdx;
                let title = document.getElementById('title')
                title.innerHTML = '';
                let h3 = document.createElement('h3');
                h3.className="card-header";
                h3.textContent=liElement.textContent;
                title.appendChild(h3);
                getArticle(folderIdx); // 폴더 ID로 팬캠 목록 불러오기
            });

            ulElement.appendChild(liElement);
        });
    }
}

console.log('ok');

let currentPage = 1;
let itemsPerPage = 4;
let totalPages = 1;
let fancamArray = [];

async function getArticle(folderIdx) {

    if(folderIdx===0){
        let title = document.getElementById('title')
        title.innerHTML = '';
        let h3 = document.createElement('h3');
        h3.className="card-header";
        h3.textContent="\'좋아요\'한 직캠";
        title.appendChild(h3);
    }
    try {
        let response = await fetch(`http://localhost:8080/user/my/folder/${folderIdx}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sessionKey}`
            }
        });
        if (response.ok) {
            console.log('connected');
            let text = await response.text();
            fancamArray = JSON.parse(text);
            console.log(fancamArray); // 데이터를 확인하기 위한 콘솔 로그


            totalPages = Math.ceil(fancamArray.length / itemsPerPage);
            displayPage(folderIdx,currentPage);

        } else {
            console.log('Error: ', response.statusText);
        }
    } catch (err) {
        console.log('Error: ', err);
    }
}

function displayPage(folderIdx,page) {
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

        container.appendChild(createCardElement(folderIdx,fancam));
        if (fancamArray[i + 1]) {
            container.appendChild(createCardElement(folderIdx,fancamArray[i + 1]));
            i+=1;
        }

        list.appendChild(container);
    }

    updatePagination();
}

function createCardElement(folderIdx,fancam) {
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
    paragraph.style.marginBottom='5px';

    // tags 배열을 순회하면서 각 태그를 paragraph에 추가
    fancam.tags.forEach(tag => {
        let tagElement = document.createElement('span'); // 각 태그를 담을 span 요소 생성
        tagElement.className = 'badge bg-secondary me-1'; // Bootstrap 배지 스타일 사용 예시
        tagElement.textContent = tag.tagNames; // 태그의 텍스트 내용 설정
        paragraph.appendChild(tagElement); // paragraph에 tag 요소 추가
    });

    cardBody.appendChild(paragraph);

    let deleteButton = document.createElement('button');
    deleteButton.className = 'btn btn-info'; // Bootstrap 스타일의 삭제 버튼
    deleteButton.textContent = '폴더에서 삭제';
    deleteButton.style.width = '100%';
    deleteButton.style.marginTop='3px';

    deleteButton.style.padding = '4px 8px'; // 버튼의 패딩을 줄여서 크기 축소
    deleteButton.style.fontSize = '0.875rem'; // 버튼 텍스트 크기를 줄임
    deleteButton.style.lineHeight = '1';


    // 삭제 버튼 클릭 이벤트
    deleteButton.addEventListener('click', function(event) {
        event.preventDefault();  // a 태그의 기본 동작 방지
        showConfirmationModal(function() {
            deleteFancamFromFolder(folderIdx,fancam.fancam.fancamidx);
        });
    });
    cardBody.appendChild(deleteButton);
    // Append card body to the main card container
    card.appendChild(cardBody);



    // Append the delete button to the card


    return card;
}

async function deleteFancamFromFolder(folderIdx,fancamIdx) {
    try {
        let response = await fetch(`http://localhost:8080/user/my/folder/${folderIdx}/${fancamIdx}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sessionKey}`
            }
        });

        if (response.ok) {
            console.log('Fancam deleted successfully');
            // 팬캠 삭제 후 화면 갱신
            fancamArray = fancamArray.filter(fancam => fancam.fancam.fancamidx !== fancamIdx);
            displayPage(folderIdx,currentPage);
        } else {
            console.log('Error deleting fancam: ', response.statusText);
        }
    } catch (err) {
        console.log('Error: ', err);
    }
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
            displayPage(folderIdx,currentPage);
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
            displayPage(folderIdx,currentPage);
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
            displayPage(folderIdx,currentPage);
        }
    };
    pagination.appendChild(nextItem);
}
function showConfirmationModal(onConfirm) {
    // 모달 요소 생성
    const modal = document.createElement('div');
    modal.className = 'modal fade';
    modal.tabIndex = '-1';
    modal.setAttribute('role', 'dialog');

    const modalDialog = document.createElement('div');
    modalDialog.className = 'modal-dialog';
    modalDialog.setAttribute('role', 'document');

    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';

    const modalHeader = document.createElement('div');
    modalHeader.className = 'modal-header';

    const modalTitle = document.createElement('h5');
    modalTitle.className = 'modal-title';
    modalTitle.textContent = '확인';

    const closeButton = document.createElement('button');
    closeButton.type = 'button';
    closeButton.className = 'btn-close';
    closeButton.setAttribute('data-bs-dismiss', 'modal');
    closeButton.setAttribute('aria-label', 'Close');

    modalHeader.appendChild(modalTitle);
    modalHeader.appendChild(closeButton);

    const modalBody = document.createElement('div');
    modalBody.className = 'modal-body';
    modalBody.textContent = `폴더에 팬캠을 삭제하시겠습니까?`;

    const modalFooter = document.createElement('div');
    modalFooter.className = 'modal-footer';

    const confirmButton = document.createElement('button');
    confirmButton.type = 'button';
    confirmButton.className = 'btn btn-primary';
    confirmButton.textContent = '삭제';
    confirmButton.addEventListener('click', function() {
        onConfirm();
        const modalElement = bootstrap.Modal.getInstance(modal);
        modalElement.hide();
    });

    const cancelButton = document.createElement('button');
    cancelButton.type = 'button';
    cancelButton.className = 'btn btn-secondary';
    cancelButton.setAttribute('data-bs-dismiss', 'modal');
    cancelButton.textContent = '취소';

    modalFooter.appendChild(cancelButton);
    modalFooter.appendChild(confirmButton);

    modalContent.appendChild(modalHeader);
    modalContent.appendChild(modalBody);
    modalContent.appendChild(modalFooter);

    modalDialog.appendChild(modalContent);
    modal.appendChild(modalDialog);

    document.body.appendChild(modal);

    // 모달 표시
    const bootstrapModal = new bootstrap.Modal(modal);
    bootstrapModal.show();

    // 모달이 닫히면 DOM에서 제거
    modal.addEventListener('hidden.bs.modal', function() {
        modal.remove();
    });
}
// 기본 폴더 (좋아요 한 직캠)으로 시작
getArticle(0);
folderList();