const ADDACTIONBUTTON = document.getElementById("addActionButton")
const ADDACTIONCONFIRM = document.getElementById("confirmAddAction")

let INTERACTCOOLDOWN = false

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

    ADDACTIONCONFIRM.addEventListener("touchend", function(ev) {
        ev.preventDefault()
        AddAction()
    })
    ADDACTIONCONFIRM.addEventListener("click", function() {
        AddAction()
    })
})