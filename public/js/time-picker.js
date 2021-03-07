const startPicker = flatpickr('#timeFrameStart', {
    enableTime: true,
    noCalendar: true,
    dateFormat: "H:i",
    defaultDate: document.querySelector('#timeFrameStart').value,
    time_24hr: true,
    onClose: function (selectedDates, dateStr, instance) {
        endPicker.set('minDate', dateStr);
    },
});
const endPicker = flatpickr('#timeFrameEnd', {
    enableTime: true,
    noCalendar: true,
    dateFormat: "H:i",
    defaultDate: document.querySelector('#timeFrameEnd').value,
    time_24hr: true,
    onClose: function (selectedDates, dateStr, instance) {
        startPicker.set('maxDate', dateStr);
    },
});