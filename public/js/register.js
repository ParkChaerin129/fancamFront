document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.getElementById('registerForm');
    const messageDiv = document.getElementById('message');

    registerForm.addEventListener('submit', async function(event) {
        event.preventDefault();

        // 입력된 정보를 가져옴
        const nickname = document.getElementById('nickname').value;
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        let grade = document.getElementById('grade').value;

        // 유효성 검사: 필수 필드 확인
        if (!nickname || !name || !email || !password || !confirmPassword) {
            messageDiv.innerHTML = '<div class="alert alert-danger">모든 필드를 입력해주세요.</div>';
            return;
        }

        // 유효성 검사: 이메일 형식 확인
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            messageDiv.innerHTML = '<div class="alert alert-danger">유효한 이메일 주소를 입력해주세요.</div>';
            return;
        }

        // 유효성 검사: 비밀번호 일치 확인
        if (password !== confirmPassword) {
            messageDiv.innerHTML = '<div class="alert alert-danger">비밀번호가 일치하지 않습니다.</div>';
            return;
        }

        // 기본값 설정: grade가 비어 있으면 기본값 'user'로 설정
        if (!grade) {
            grade = 'user';
        }

        try {
            // 회원가입 요청을 서버로 보냄
            const response = await fetch('http://localhost:8080/user/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ nickname, name, email, pwd: password, grade })
            });

            if (response.ok) {
                messageDiv.innerHTML = `<div class="alert alert-success">회원가입이 성공적으로 완료되었습니다!</div>`;
                // 회원가입 후 로그인 페이지로 리디렉션
                window.location.href = '/login';
            } else {
                const errorData = await response.json();
                messageDiv.innerHTML = `<div class="alert alert-danger">${errorData.message || '회원가입에 실패했습니다.'}</div>`;
            }
        } catch (error) {
            console.error('Error during registration:', error);
            messageDiv.innerHTML = '<div class="alert alert-danger">오류가 발생했습니다. 다시 시도해주세요.</div>';
        }
    });
});