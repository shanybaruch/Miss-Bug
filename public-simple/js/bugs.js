'use strict'

function getBugs() {
    fetch('/api/bug')
        .then(res => res.json())
        .then(bugs => {
            const elBugList = document.querySelector('pre')
            elBugList.innerText = JSON.stringify(bugs, null, 4)
        })
}
