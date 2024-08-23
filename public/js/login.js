document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const messageDiv = document.getElementById('message');

    loginForm.addEventListener('submit', async function(event) {
        event.preventDefault(); // 폼 제출 기본 동작을 막음

        // 입력된 이메일과 비밀번호를 가져옴
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        // 간단한 유효성 검사
        if (email === '' || password === '') {
            messageDiv.innerHTML = '<div class="alert alert-danger">Please fill in all fields.</div>';
            return;
        }

        try {
            // 로그인 요청을 서버로 보냄
            const response = await fetch('http://localhost:8080/user/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email: email, pwd: password })
            });

            if (response.ok) {
                const sessionKey = await response.text(); // 서버에서 반환된 세션 키를 받음

                // 세션 키를 로컬 스토리지에 저장
                localStorage.setItem('sessionKey', sessionKey);

                // 로그인 성공 메시지 표시
                messageDiv.innerHTML = `<div class="alert alert-success">Login successful!</div>`;

                // 로그인 후 다른 페이지로 리디렉션
                window.location.href = '/'; // 리디렉션할 페이지

            } else {
                const errorData = await response.json();
                messageDiv.innerHTML = `<div class="alert alert-danger">${errorData.message || 'Login failed.'}</div>`;
            }
        } catch (error) {
            console.error('Error during login:', error);
            messageDiv.innerHTML = '<div class="alert alert-danger">An error occurred. Please try again.</div>';
        }
    });
});
