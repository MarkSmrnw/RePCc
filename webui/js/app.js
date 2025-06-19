document.addEventListener('DOMContentLoaded', function() {
    const powerButton = document.getElementById('powerbutton')
    const confirmShutdownButton = document.getElementById("BUTTON_CONFIRMSHUTDOWN")
    
    if (powerButton) {
        powerButton.addEventListener('touchstart', function(e) {
            e.preventDefault()
            this.classList.add('active-touch')
        });
        
        powerButton.addEventListener('touchend', function(e) {
            e.preventDefault()
            this.classList.remove('active-touch')
        });
        
        powerButton.addEventListener('touchcancel', function(e) {
            this.classList.remove('active-touch')
        });
        
        powerButton.addEventListener('mousedown', function(e) {
            this.classList.add('active-touch')
        });
        
        powerButton.addEventListener('mouseup', function(e) {
            this.classList.remove('active-touch')
        });
        
        powerButton.addEventListener('mouseleave', function(e) {
            this.classList.remove('active-touch')
        });
    }

})