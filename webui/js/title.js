//This makes the title super cool

let iterations = 0
let cursorIterations = 0

let canAnimateCursor = true
let canSetText = true
let isTabVisible = true

let messages = ["RePCc", "Erm...", "Remote", "PC", "joink", ":3", "a", "bored", "wsp", "aaaaaaaa", "o", "SMRNW", "pawsome", "BASED", "haiiiiii", "DUDE", "AYE"]
let currentmsg = "RePCc"

const title = document.getElementById("title")

document.addEventListener("visibilitychange", function() {
    isTabVisible = !document.hidden
    if (!isTabVisible) {
        canAnimateCursor = false
    }
})

async function animateCursor(text) {
    if (canAnimateCursor && isTabVisible) {
        if (cursorIterations === 0 || cursorIterations%2 === 0) {
            title.innerHTML = text + "_|"
        } else {
            title.innerHTML = text + " |"
        }

        cursorIterations++
    }
}

async function setText() {
    if (!isTabVisible) {return}
    canAnimateCursor = false

    var text = (iterations === 0) ? "Hello!!" : messages[Math.floor(Math.random() * messages.length)]
    async function animateNewText(text) {
        const oldtext = currentmsg.split("")
        const oldleng = oldtext.length
        const newtext = text.split("")

        currentmsg = text
        
        let newfull = ""

        for (var i = 0; i <= oldleng; i++){
            const randomDelay = Math.random() * 100 + 100
            const oldjoin = oldtext.join(',').replaceAll(",", "")

            await new Promise(resolve => setTimeout(resolve, randomDelay))

            oldtext.pop()
            title.innerText = oldjoin + "_|"
        }

        await new Promise(resolve => setTimeout(resolve, 800))

        for (let letter of newtext) {
            const randomDelay = Math.random() * 100 + 100

            await new Promise(resolve => setTimeout(resolve, randomDelay))

            newfull += letter

            title.innerText = newfull + "_|"
        }

        await new Promise(resolve => setTimeout(resolve, 100))
        title.innerText = text + " |"
        
    }

    await animateNewText(text)

    iterations++
    canAnimateCursor = true
}

(async () => {
    await setText()
})()

setInterval(() => animateCursor(currentmsg), 1000)
setInterval(() => setText(), 12000);