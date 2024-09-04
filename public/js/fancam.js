// URL에서 ID 값을 추출하는 함수
function getFancamIdFromURL() {
    const pathParts = window.location.pathname.split('/');
    return pathParts[pathParts.length - 1];
}

// ID 값을 추출
const id = Number(getFancamIdFromURL());

console.log(id);
const fetchUrl = `http://localhost:8080/search/${id}`


async function getArticle(fetchUrl){
    try{
        let response = await fetch(fetchUrl);
        if(response.ok){
            console.log('connected');
            let text=await response.text();
            fancam = JSON.parse(text);
            console.log(fancam);

            let fancamContents = document.getElementById('fancamContents');
            fancamContents.innerHTML='';

            let container = createCard(fancam);

            fancamContents.appendChild(container);

        }else{
            console.log('Error: ', response.statusText);
        }

    }catch(err){
        console.log('Error: ',err);
    }


}

function createCard(fancam) {
    // Card container
    const card = document.createElement('div');
    card.className = 'card mb-3';
    card.style.marginTop = '10px';



    // Card header (Date)
    const header = document.createElement('h3');
    header.className = 'card-header';
    header.textContent = fancam.fancam.date;
    card.appendChild(header);

    const iframeWrapper = document.createElement('div');
    iframeWrapper.style.position = 'relative';
    iframeWrapper.style.width = '100%';
    iframeWrapper.style.paddingTop = '56.25%'; // 16:9 비율 유지

    const iframe = document.createElement('iframe');
    iframe.src = `https://www.youtube.com/embed/${fancam.fancam.fancam_url}?controls=0`; // fancam.fancam.fancam_url에 비디오 ID가 들어있다고 가정
    iframe.title = "YouTube video player";
    iframe.style.position = 'absolute';
    iframe.style.top = '0';
    iframe.style.left = '0';
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.border = '0';
    iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
    iframe.referrerPolicy = "strict-origin-when-cross-origin";
    iframe.allowFullscreen = true;

    iframeWrapper.appendChild(iframe);
    card.appendChild(iframeWrapper);


    const body = document.createElement('div');
    body.className = 'card-body';

    const text = document.createElement('p');
    text.className = 'card-text';
    text.textContent = fancam.fancam.name;
    body.appendChild(text);
    card.appendChild(body);

    // Tags
    const tagsContainer = document.createElement('div');
    tagsContainer.className = 'card-body';

    const tagsText = document.createElement('p');
    tagsText.className = 'card-text';
    tagsText.style.display = 'flex';
    tagsText.style.flexWrap = 'nowrap';
    tagsText.style.overflowX = 'auto';
    tagsText.style.whiteSpace = 'nowrap';

    let tags = fancam.tags;

    tags.forEach(tag => {
        const tagSpan = document.createElement('span');
        tagSpan.className = 'badge bg-secondary me-1';
        tagSpan.textContent = tag.tagNames;
        tagsText.appendChild(tagSpan);
    });

    tagsContainer.appendChild(tagsText);
    card.appendChild(tagsContainer);

    // List group
    const listGroup = document.createElement('ul');
    listGroup.className = 'list-group list-group-flush';

    // Like button
    const likeItem = document.createElement('li');
    likeItem.className = 'list-group-item';

    const likeWrapper = document.createElement('div');
    likeWrapper.className = 'btn-group-wrapper';
    likeWrapper.style.display = 'flex';
    likeWrapper.style.justifyContent = 'center';

    const likeGroup = document.createElement('div');
    likeGroup.className = 'btn-group';
    likeGroup.role = 'group';
    likeGroup.setAttribute('aria-label', 'Basic checkbox toggle button group');

    const likeInput = document.createElement('input');
    likeInput.type = 'checkbox';
    likeInput.className = 'btn-check';
    likeInput.id = 'btncheck1';
    isLiked().then(result=>{
        likeInput.checked = !!result;
    })

    likeInput.autocomplete = 'off';

    const likeLabel = document.createElement('label');
    likeLabel.className = 'btn btn-secondary';
    likeLabel.setAttribute('for', 'btncheck1');
    likeLabel.style.width = '300px';
    likeLabel.textContent = `좋아요 ${fancam.likes.likeCount}개`;

    likeGroup.appendChild(likeInput);
    likeGroup.appendChild(likeLabel);
    likeWrapper.appendChild(likeGroup);
    likeItem.appendChild(likeWrapper);
    listGroup.appendChild(likeItem);

    // 체크박스 클릭 이벤트 핸들러 설정
    likeInput.addEventListener('change', () => {
        handleLikeCheckboxChange(likeInput, likeLabel);
    });

    // Add to folder button with offcanvas
    const addItem = document.createElement('li');
    addItem.className = 'list-group-item';

    const buttonWrapper = document.createElement('div');
    buttonWrapper.style.display = 'flex';
    buttonWrapper.style.justifyContent = 'center';

    const addButton = document.createElement('button');
    addButton.className = 'btn btn-primary';
    addButton.type = 'button';
    addButton.style.width = '300px';
    addButton.setAttribute('data-bs-toggle', 'offcanvas');
    addButton.setAttribute('data-bs-target', '#offcanvasExample');
    addButton.setAttribute('aria-controls', 'offcanvasExample');
    addButton.textContent = '나의 폴더에 추가';

    addButton.addEventListener('click', () => {
        const sessionKey = localStorage.getItem("sessionKey");
        if (sessionKey === null) {
            alert('로그인이 필요합니다. 로그인 후 다시 시도해주세요.');
            return; // 세션 키가 없으면 오프캔버스가 열리지 않도록 중단
        }
    });

    buttonWrapper.appendChild(addButton);
    addItem.appendChild(buttonWrapper);

    addItem.appendChild(folderCard());

    listGroup.appendChild(addItem);
    card.appendChild(listGroup);

    // Card footer
    const footer = document.createElement('div');
    footer.className = 'card-footer text-muted';
    footer.textContent = "2 days ago";
    card.appendChild(footer);

    return card;

    // Append the card to the document body or another container
    //document.body.appendChild(card); // 예를 들어 body에 추가, 다른 요소에 append할 수 있음
}

function folderCard() {
    const sessionKey = localStorage.getItem("sessionKey");

    const offcanvas = document.createElement('div');
    offcanvas.className = 'offcanvas offcanvas-start';
    offcanvas.tabIndex = '-1';
    offcanvas.id = 'offcanvasExample';
    offcanvas.setAttribute('aria-labelledby', 'offcanvasExampleLabel');

    const offcanvasHeader = document.createElement('div');
    offcanvasHeader.className = 'offcanvas-header';

    const offcanvasTitle = document.createElement('h5');
    offcanvasTitle.className = 'offcanvas-title';
    offcanvasTitle.id = 'offcanvasExampleLabel';
    offcanvasTitle.textContent = '나의 폴더에 추가';

    const closeButton = document.createElement('button');
    closeButton.type = 'button';
    closeButton.className = 'btn-close text-reset';
    closeButton.setAttribute('data-bs-dismiss', 'offcanvas');
    closeButton.setAttribute('aria-label', 'Close');

    offcanvasHeader.appendChild(offcanvasTitle);
    offcanvasHeader.appendChild(closeButton);
    offcanvas.appendChild(offcanvasHeader);

    const offcanvasBody = document.createElement('div');
    offcanvasBody.className = 'offcanvas-body';

    const container = document.createElement('div');
    container.className = 'input-group mb-3';

    // 입력 필드 생성
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'form-control';
    input.placeholder = "폴더 이름 입력";
    input.setAttribute('aria-label', "Recipient's username");
    input.setAttribute('aria-describedby', 'button-addon2');

    // 버튼 생성
    const button = document.createElement('button');
    button.className = 'btn btn-primary';
    button.type = 'button';
    button.id = 'button-addon2';
    button.textContent = '추가';

    // 폴더 목록을 가져와 새로고침하는 함수
    function refreshFolderList() {
        fetch('http://localhost:8080/user/folder', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sessionKey}`
            }
        })
            .then(response => response.json())
            .then(data => {
                // 폴더 목록을 초기화
                folderList.innerHTML = '';

                // 서버로부터 받은 폴더 목록(data)을 반복적으로 <li> 요소로 생성하여 추가
                data.forEach(folder => {
                    const newFolder = document.createElement('li');
                    newFolder.className = 'list-group-item d-flex justify-content-between align-items-center';
                    newFolder.textContent = folder.folderName; // 폴더 이름 설정

                    newFolder.dataset.folderIdx = folder.folderIdx;

                    // 새 배지 <span> 요소 생성 (폴더의 항목 수는 0으로 초기화)
                    //const badge = document.createElement('span');
                    //badge.className = 'badge bg-primary rounded-pill';
                    //badge.textContent = '0'; // 폴더 항목 수 (초기값 0)

                    // <li>에 <span> 추가
                    //newFolder.appendChild(badge);
                    folderList.appendChild(newFolder);

                    newFolder.addEventListener('click', function() {
                        const folderIdx = newFolder.dataset.folderIdx;
                        showConfirmationModal(folder.folderName, function() {
                            addFancamToFolder(folderIdx, id);
                        });
                    });
                });
            })
            .catch(error => {
                console.error('폴더 목록을 가져오는 중 에러가 발생했습니다:', error);
            });
    }

    // 폴더 추가 버튼 클릭 이벤트
    button.addEventListener('click', function() {
        const folderName = input.value; // 입력된 폴더 이름 가져오기

        if (folderName) {
            // 서버에 POST 요청 보내기
            fetch('http://localhost:8080/user/folder', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${sessionKey}`
                },
                body: JSON.stringify({ folderName: folderName })
            })
                .then(response => {
                    if (response.ok) {
                        console.log('폴더가 성공적으로 추가되었습니다.');
                        // 폴더가 추가되면 목록 새로고침
                        refreshFolderList();
                    } else {
                        console.error('폴더 추가에 실패했습니다.');
                    }
                })
                .catch(error => {
                    console.error('에러 발생:', error);
                });
        } else {
            alert('폴더 이름을 입력하세요.');
        }
    });

    // 입력 필드와 버튼을 컨테이너에 추가
    container.appendChild(input);
    container.appendChild(button);
    offcanvasBody.appendChild(container);

    const folderList = document.createElement('ul');
    folderList.className = "list-group";

    // 페이지 로드 시 폴더 목록을 가져옴
    refreshFolderList();

    offcanvasBody.appendChild(folderList);
    offcanvas.appendChild(offcanvasBody);
    return offcanvas;
}

function addFancamToFolder(folderIdx, fancamIdx) {
    fetch(`http://localhost:8080/user/folder/${fancamIdx}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'//,
            //'Authorization': `Bearer ${sessionKey}`
        },
        body: JSON.stringify({ folderIdx: folderIdx })
    })
        .then(response => {
            if (response.ok) {
                alert('팬캠이 폴더에 성공적으로 추가되었습니다.');
            } else {
                alert('팬캠을 폴더에 추가하는데 실패했습니다.');
            }
        })
        .catch(error => {
            console.error('팬캠 추가 중 에러가 발생했습니다:', error);
        });
}

function handleLikeCheckboxChange(likeInput, likeLabel) {
    let likeCount = parseInt(likeLabel.textContent.replace('좋아요 ', '').replace('개', ''), 10);

    const sessionKey=localStorage.getItem("sessionKey");

    if(sessionKey==null){
        alert('로그인이 필요합니다. 로그인 후 다시 시도해주세요.');
        likeInput.checked = !likeInput.checked; // 체크 상태를 원래대로 돌림
        return;
    }

    if (likeInput.checked) {
        likeCount++;
    } else {
        likeCount--;
    }

    likeLabel.textContent = `좋아요 ${likeCount}개`;

    // 추가적인 로직 (서버에 좋아요 수를 업데이트하는 등)을 여기에 추가
    updateLikeStatusOnServer(likeInput.checked, sessionKey);
}

function updateLikeStatusOnServer(isLiked, sessionKey) {
    const url = `http://localhost:8080/user/like/${id}`;
    const method = isLiked ? 'POST' : 'PATCH';  // 좋아요 추가는 POST, 좋아요 취소는 PATCH로 가정

    fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sessionKey}`  // 세션 키를 Authorization 헤더에 포함
        },
        body: JSON.stringify({ like: isLiked })
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('서버 요청 실패');
            }
            return response.text();
        })
        .then(data => {
            console.log('서버 응답:', data);
            // 서버 응답에 따른 추가적인 로직을 여기에 작성
        })
        .catch(error => {
            console.error('좋아요 상태 업데이트 중 오류 발생:', error);
        });
}

function isLiked() {
    const sessionKey = localStorage.getItem("sessionKey");

    if (sessionKey === null) {
        return Promise.resolve(false);
    }

    const url = `http://localhost:8080/user/like/${id}`;

    return fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sessionKey}`  // 세션 키를 Authorization 헤더에 포함
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('서버 요청 실패');
            }
            return response.text();
        })
        .then(result => {
            console.log(typeof result);
            console.log('서버 응답 텍스트:', result);

            if (result === "false") {
                return false;
            } else if (result === "true") {
                return true;
            } else {
                throw new Error('예상치 못한 서버 응답');
            }
        })
        .catch(error => {
            console.error('좋아요 상태 확인 중 오류 발생:', error);
            return false; // 오류가 발생하면 기본적으로 false를 반환
        });
}
function showConfirmationModal(folderName, onConfirm) {
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
    modalBody.textContent = `'${folderName}' 폴더에 팬캠을 추가하시겠습니까?`;

    const modalFooter = document.createElement('div');
    modalFooter.className = 'modal-footer';

    const confirmButton = document.createElement('button');
    confirmButton.type = 'button';
    confirmButton.className = 'btn btn-primary';
    confirmButton.textContent = '추가';
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

// 폴더 클릭 이벤트에서 사용 예시

getArticle(fetchUrl);