const sessionKey = localStorage.getItem("sessionKey");
// 태그 추가 및 제거 로직
document.getElementById('inputTag').addEventListener('keyup', function (event) {
    if (event.key === 'Enter') {
        let input = document.getElementById('inputTag');
        let tagText = input.value.trim();

        if (tagText) {
            // 태그 생성
            let tag = document.createElement('span');
            tag.className = 'tag badge bg-secondary';
            tag.innerText = tagText;

            // 태그 삭제 버튼 추가
            let removeButton = document.createElement('button');
            removeButton.innerHTML = '&times;';
            removeButton.className = 'btn-close ms-2';
            removeButton.style.fontSize = '12px';
            removeButton.style.marginLeft = '10px';
            removeButton.addEventListener('click', function () {
                tag.remove();
            });
            tag.appendChild(removeButton);

            // 태그를 컨테이너에 추가
            document.getElementById('tag-container').appendChild(tag);

            // 입력 필드 초기화
            input.value = '';
        }
    }
});

function formatDateToYYYYMMDD(dateString) {
    let dateParts = dateString.split('/');
    if (dateParts.length === 3) {
        // [day, month, year]를 [year, month, day]로 재배치
        let month = dateParts[0];
        let day = dateParts[1];
        let year = dateParts[2];
        return `${year}-${month}-${day}`;
    }
    return dateString;  // 날짜 형식이 잘못된 경우 원본 그대로 반환
}
// 등록하기 버튼 클릭 시 POST 요청 전송
document.getElementById('submitBtn').addEventListener('click', function() {
    // 입력된 값을 가져옴
    let name = document.getElementById('inputName').value.trim();
    let date = document.getElementById('datetimepicker1Input').value.trim();
    let member = document.getElementById('inputMember').value.trim();
    let url = document.getElementById('inputUrl').value.trim();

    let formattedDate = formatDateToYYYYMMDD(date);

    // 태그 값들을 배열로 변환
    let tagElements = document.querySelectorAll('#tag-container .tag');
    let tagNames = [];
    tagElements.forEach(function(tag) {
        tagNames.push(tag.textContent.replace('×', '').trim());
    });

    // JSON 데이터 생성
    let data = {
        "name": name,
        "date": formattedDate,
        "member": member,
        "url": url,
        "tagNames": tagNames
    };

    // POST 요청 전송
    fetch('http://localhost:8080/admin/fancam', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sessionKey}`
        },
        body: JSON.stringify(data)
    })
        .then(response => {
            if (response.ok) {
                alert('직캠이 성공적으로 등록되었습니다!');
                location.reload();}
                // 필요시 입력 필드를 초기화하는 로직 추가 가능
            else {
                alert('직캠 등록에 실패했습니다.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('서버와의 통신 중 오류가 발생했습니다.');
        });
});