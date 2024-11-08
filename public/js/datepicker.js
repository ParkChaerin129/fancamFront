async function fetchAvailableDates() {
    const response = await fetch('http://localhost:8080/search/all');
    const data = await response.json();

    // 날짜만 추출하여 'YYYY-MM-DD' 형식으로 배열에 저장
    const availableDates = Object.freeze(data.map(item => {
        const date = new Date(item.fancam.date); // Date 객체로 변환
        return date.toISOString().split('T')[0]; // 'YYYY-MM-DD' 형식으로 변환
    }));

    console.log("Initial Available Dates:", availableDates);

    // Datepicker 초기화
    const datepicker = new tempusDominus.TempusDominus(document.getElementById('datetimepicker4'), {
        display: {
            theme: 'light', // bootstrap을 사용하지 않는 경우 light 테마
            components: {
                useTwentyfourHour: false,
                hours: false,
                minutes: false,
                seconds: false,
                calendar: true,
                date: true,
                month: true,
                year: true,
                decades: true
            },
            icons: {
                time: 'fa fa-solid fa-clock',
                date: 'fa fa-solid fa-calendar',
                up: 'fa fa-solid fa-arrow-up',
                down: 'fa fa-solid fa-arrow-down',
                previous: 'fa fa-solid fa-chevron-left',
                next: 'fa fa-solid fa-chevron-right',
                today: 'fa fa-solid fa-calendar-check',
                clear: 'fa fa-solid fa-trash',
                close: 'fas fa-solid fa-xmark'
            }
        },
        localization: {
            hourCycle: 'h12',
            locale: 'en'
        },
        restrictions: {
            enabledDates: Array.from(availableDates) // 불변 배열로 설정
        }
    });

    // 특정 날짜 클릭 시 관련 페이지로 이동하는 함수
    function handleDateClick(event) {
        const selectedDate = event.date; // 선택된 날짜 가져오기
        const formattedDate = selectedDate.toISOString().split('T')[0]; // 날짜 형식을 "YYYY-MM-DD"로 변환

        console.log("Available Dates at Click:", Array.from(availableDates));
        console.log("Selected Date:", formattedDate);

        if (Array.from(availableDates).includes(formattedDate)) {
            // 원하는 URL에 날짜를 포함하여 페이지 이동
            window.location.href = `/search/date/${formattedDate}`;
        } else {
            alert("해당 날짜에는 페이지가 없습니다.");
        }
    }

    // 날짜 선택기에서 날짜 클릭 이벤트를 감지하여 페이지 이동 연결
    datepicker.subscribe(tempusDominus.Namespace.events.change, handleDateClick);
}

// 함수 호출하여 날짜 가져오기 및 Datepicker 설정
fetchAvailableDates();