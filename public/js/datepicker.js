new tempusDominus.TempusDominus(document.getElementById('datetimepicker4'), {

    display: {
        components: {
            useTwentyfourHour: false, // 24시간제를 사용하지 않음
            hours: false, // 시간 선택 비활성화
            minutes: false, // 분 선택 비활성화
            seconds: false, // 초 선택 비활성화
            calendar: true, // 달력 활성화
            date: true, // 날짜 활성화
            month: true, // 월 활성화
            year: true, // 연도 활성화
            decades: true // 10년 단위 선택 활성화
        },
        icons: {
            type: 'icons',
            time: 'fa fa-solid fa-clock',
            date: 'fa fa-solid fa-calendar',
            up: 'fa fa-solid fa-arrow-up',
            down: 'fa fa-solid fa-arrow-down',
            previous: 'fa fa-solid fa-chevron-left',
            next: 'fa fa-solid fa-chevron-right',
            today: 'fa fa-solid fa-calendar-check',
            clear: 'fa fa-solid fa-trash',
            close: 'fas fa-solid fa-xmark'
        },
    },
    localization: {
        hourCycle: 'h12',
        locale: 'en'
    },
    restrictions: {

    }
});