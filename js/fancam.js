let fetchUrl = 'http://localhost:8080/search/${fancamIdx}'

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

    // Card image
    const img = document.createElement('img');
    img.src = fancam.fancam.fancam_url;
    img.alt = 'YouTube Thumbnail';
    img.style.width = '100%';
    img.style.height = '100%';
    card.appendChild(img);

    // Card body (Description)
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
    likeInput.checked = true;
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
    addButton.textContent = '나의 폴더 추가';

    buttonWrapper.appendChild(addButton);
    addItem.appendChild(buttonWrapper);

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
    offcanvasTitle.textContent = 'Offcanvas';

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
    offcanvasBody.innerHTML = `
        <div>
            Some text as placeholder. In real life you can have the elements you have chosen. Like, text, images, lists, etc.
        </div>
        <div class="dropdown mt-3">
            <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
                Dropdown button
            </button>
            <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                <li><a class="dropdown-item" href="#">Action</a></li>
                <li><a class="dropdown-item" href="#">Another action</a></li>
                <li><a class="dropdown-item" href="#">Something else here</a></li>
            </ul>
        </div>
    `;

    offcanvas.appendChild(offcanvasBody);
    addItem.appendChild(offcanvas);

    listGroup.appendChild(addItem);
    card.appendChild(listGroup);

    // Card footer
    const footer = document.createElement('div');
    footer.className = 'card-footer text-muted';
    footer.textContent = footerText;
    card.appendChild(footer);

    return card;

    // Append the card to the document body or another container
    //document.body.appendChild(card); // 예를 들어 body에 추가, 다른 요소에 append할 수 있음
}

getArticle(fetchUrl);