function getCookieValue(name) {
        const cookies = document.cookie.split(';');
        for (let cookie of cookies) {
            const [cookieName, cookieValue] = cookie.trim().split('=');
            if (cookieName === name) {
                const value = cookieValue || '';
                const decoded = decodeURIComponent(value);
                return decoded.replace(/=+$/, '');
            }
        }
        return null;
    }

document.addEventListener("DOMContentLoaded", function() {

    const STATUS_DIV = document.getElementById("status")

    const HOSTIP_CONFIRM = document.getElementById("settings_ipset")
    const HOSTIP_TEXTINPUT = document.getElementById("settings_ipinput")
    
    // VALUES

    function setStatus(text) {
        STATUS_DIV.innerText = text
        STATUS_GLOBAL.innerText = text
    }

    function checkIP(IP) {

        let legal = true
        splitIP = IP.split(".")
        
        if (splitIP.length === 4) {
            for (i in splitIP) { if (splitIP[i] > 255) {
                legal = false
            }}
        } else { legal = false }

        return legal
    }

    function setIP(){
        if (checkIP(HOSTIP_TEXTINPUT.value)) {
            setStatus("IP OK!")
            document.cookie = "ip=" + encodeURIComponent(HOSTIP_TEXTINPUT.value) + "; path=/; SameSite=Lax"
            console.log(document.cookie)
        } else {setStatus("IP ILLEGAL!")}
    }

    HOSTIP_CONFIRM.addEventListener("touchend", function(event) {
        event.preventDefault()
        setIP()
    })
    HOSTIP_CONFIRM.addEventListener("click", function() {
        setIP()
    })

    const ip = getCookieValue('ip');
    if (ip) {
        HOSTIP_TEXTINPUT.value = ip;
    }
})