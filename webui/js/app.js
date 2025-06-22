const ADDACTIONBUTTON = document.getElementById("addActionButton")
const ADDACTIONCONFIRM = document.getElementById("confirmAddAction")

const ACTIONSETMOUSEBUTTON = document.getElementById("ACTION_MOUSE")

let INTERACTCOOLDOWN = false
let CURSORPOS_X = null
let CURSORPOS_Y = null

function getCookieValue(name) {
    const cookies = document.cookie.split(';')
    for (let cookie of cookies) {
        const [cookieName, cookieValue] = cookie.trim().split('=')
        if (cookieName === name) {
            const value = cookieValue || ''
            const decoded = decodeURIComponent(value)
            return decoded.replace(/=+$/, '')
        }
    }
    return null
}


document.addEventListener("DOMContentLoaded", function() {
    
    // Events

    function AddAction() {
        if (INTERACTCOOLDOWN) {return}
        const actionWrapper = document.getElementById("actionWrapper")
        const actionChildren = actionWrapper.children[0].children

        let parent = null

        for (let i = 0; i < actionChildren.length; i++) {
            if (actionChildren[i].children.length < 2) {parent = actionChildren[i]}
        }

        if (parent) {
            parent.innerHTML = parent.innerHTML + `
    <button class="actionButton" onclick="presstest()">
        ACTION TITLE
    </button>
            `
        }
        else {
            actionWrapper.children[0].innerHTML = actionWrapper.children[0].innerHTML + `
    <div class="d-flex actionButtonWrapper" style="margin-bottom: 5%;">
        <button class="actionButton" onclick="presstest()">
            ACTION TITLE
        </button>
    </div>
            `
        }

        const ADDACTIONMODAL = bootstrap.Modal.getInstance(document.getElementById("addActionModal"))
        if (ADDACTIONMODAL) {
            ADDACTIONMODAL.hide()
            INTERACTCOOLDOWN = true; setTimeout(() => {INTERACTCOOLDOWN = false}, 200);
        }
    }

    async function SetCurrentCursorPos() {
        const IP = getCookieValue("ip")
        if (IP) {
            let response = await fetch("http://"+IP+":8080/mouse/getpos")
            if (response.ok) {
                let data = await response.json()

                CURSORPOS_X = data['position'][0]
                CURSORPOS_Y = data['position'][1]

                console.log(CURSORPOS_X, CURSORPOS_Y)
            }
        }
    }

    async function PostAction() {
        const NAMEINPUT = document.getElementById("ACTION_TITLE")

        // CONTINUE HERE!!!!!!!!!!!!!!!!!!!
        // SO I KNOW WHERE I LEFT OFF :D
    }

    ADDACTIONCONFIRM.addEventListener("touchend", function(ev) {
        ev.preventDefault()
        AddAction()
    })
    ADDACTIONCONFIRM.addEventListener("click", function() {
        AddAction()
    })

    ACTIONSETMOUSEBUTTON.addEventListener("touchend", function(ev) {
        ev.preventDefault()
        SetCurrentCursorPos()
    })

    ACTIONSETMOUSEBUTTON.addEventListener("click", function() {
        SetCurrentCursorPos()
    })

    ADDACTIONBUTTON.addEventListener("touchend", function(ev) {
        ev.preventDefault()

    })

    ADDACTIONBUTTON.addEventListener("click", function() {

    })
})