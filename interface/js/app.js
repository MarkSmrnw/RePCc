const ADDACTIONBUTTON = document.getElementById("addActionButton")
const ADDACTIONCONFIRM = document.getElementById("confirmAddAction")

const ACTIONSETMOUSEBUTTON = document.getElementById("ACTION_MOUSE")
const ACTIONREMOVEBUTTON = document.getElementById("removeActionButton")

let INTERACTCOOLDOWN = false
let CURSORPOS_X = null
let CURSORPOS_Y = null

document.addEventListener("DOMContentLoaded", function() {
    
    // Events

    function AddAction(title) {
        if (INTERACTCOOLDOWN) {return}
        const actionWrapper = document.getElementById("actionWrapper")
        const actionChildren = actionWrapper.children[0].children

        let parent = null

        for (let i = 0; i < actionChildren.length; i++) {
            if (actionChildren[i].children.length < 2) {parent = actionChildren[i]}
        }

        if (parent) {
            parent.innerHTML = parent.innerHTML + `
    <button class="actionButton" id=`+title+` onclick="actionPress(this)">
        `+title+`
    </button>
            `
        }
        else {
            actionWrapper.children[0].innerHTML = actionWrapper.children[0].innerHTML + `
    <div class="d-flex actionButtonWrapper" style="margin-bottom: 5%;">
        <button class="actionButton" id=`+title+` onclick="actionPress(this)">
            `+title+`
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
        let response = await fetch("http://"+hostIp()+":8080/mouse/getpos")
        if (response.ok) {
            let data = await response.json()

            CURSORPOS_X = data['position'][0]
            CURSORPOS_Y = data['position'][1]

            ACTIONSETMOUSEBUTTON.style = "background-color: green;"
            document.getElementById("showmousecoordinates").innerText = CURSORPOS_X + " " + CURSORPOS_Y
        }
    }

    async function PostAction() {
        const NAMEINPUT = document.getElementById("ACTION_TITLE")

        if (CURSORPOS_X && CURSORPOS_Y) {
            
            response = await fetch("http://"+hostIp()+":8080/actions/postnew", {
                method:'POST',
                headers:{'Content-Type':'application/json'},
                body:JSON.stringify({
                    "name":NAMEINPUT.value,
                    "pos":{
                        "x":CURSORPOS_X,
                        "y":CURSORPOS_Y
                    }
                })
            })

            if (response.ok) {
                AddAction(NAMEINPUT.value)
            }
            

        } else {
            if (IP) {STATUS_GLOBAL.innerText = "CURSOR POS HAS NOT BEEN SET!"}
            else {STATUS_GLOBAL.innerText = "YOU HAVE TO SET YOUR IP!"} 
        }
    }

    async function LoadActions() {
        console.log("LOAD")

        const response = await fetch("http://"+hostIp()+":8080/actions/getall")
        if (response.ok) {
            const data = await response.json()

            if (data) for (var key in data) AddAction(data[key])
        }
    }

    ADDACTIONCONFIRM.addEventListener("touchend", function(ev) {
        ev.preventDefault()
        PostAction()
    })
    ADDACTIONCONFIRM.addEventListener("click", function() {
        PostAction()
    })

    ACTIONSETMOUSEBUTTON.addEventListener("touchend", function(ev) {
        ev.preventDefault()
        SetCurrentCursorPos()
    })

    ACTIONSETMOUSEBUTTON.addEventListener("click", function() {
        SetCurrentCursorPos()
    })

    // HERE IS THE REMOVE MODE PLEASE DONT OVERSEE IT AGAIN

    function removeStyles(apply=true) {

        if (apply) {
            const DEL_BUTTON = document.getElementById("removeActionButton")

            DEL_BUTTON.style = "border red 1px 1px 1px 1px"
        }

    }

    ACTIONREMOVEBUTTON.addEventListener("touched", function(ev){
        ev.preventDefault()
        if (REMOVE_MODE == false) {REMOVE_MODE = true}
        else {REMOVE_MODE = false}
    })

    ACTIONREMOVEBUTTON.addEventListener("click", function() {
        if (REMOVE_MODE == false) {REMOVE_MODE = true}
        else {REMOVE_MODE = false}
    })

    LoadActions()

})