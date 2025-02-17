document.getElementById('start-button').addEventListener('click', function() {
    var startMenu = document.getElementById('start-menu-content');
    if (startMenu.style.display === 'block') {
        startMenu.style.display = 'none';
    } else {
        startMenu.style.display = 'block';
    }
});

document.getElementById('shutdown-button').addEventListener('click', function() {
    alert('Компьютер будет выключен');
    // Здесь можно добавить логику для выключения
});

function updateTime() {
    var now = new Date();
    var hours = now.getHours();
    var minutes = now.getMinutes();
    var timeString = hours + ':' + (minutes < 10 ? '0' + minutes : minutes);
    document.getElementById('time').textContent = timeString;
}

setInterval(updateTime, 1000);
updateTime();

document.getElementById('volume-slider').addEventListener('input', function() {
    var volume = this.value;
    // Здесь можно добавить логику для изменения громкости
});