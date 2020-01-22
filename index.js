const HOST_URL = "http://localhost:3000"

//Load Chain:
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById('show-apts').onclick = e => clickShowApts(e)
    document.getElementById('new-apt').onclick = e => clickNewApt(e)
    document.querySelectorAll('[id^="tab-"]').forEach(tab => tab.onclick = e => clickTab(e.target.id.slice(-1)))
    getApartments().then(apartments => apartments.forEach(makeAptCard))
});


// Fetches:
const getApartments = () => fetch(HOST_URL + "/apartments").then(r => r.json())


// Events:
const clickShowApts = e => {
    document.getElementById('show-apts').style.display = "none"
    document.querySelectorAll('[data-apt-id]').forEach(card => card.style.display = "block")
    document.getElementById('new-apt').style.display = "block"
    document.getElementById('content').style.display = "none"
    document.getElementById('splash').style.display = "block"
}
const clickNewApt = e => {
    console.log("new stuff")
}
const clickAptCard = clickedCard => {
    document.getElementById('new-apt').style.display = "none"
    document.querySelectorAll('[data-apt-id]').forEach(card => card.style.display = "none")
    document.getElementById('show-apts').style.display = "block"
    clickedCard.style.display = "block"
    document.getElementById('splash').style.display = "none"
    document.getElementById('content').style.display = "block"
    clickTab(1)
}
const clickTab = (n) => {
    document.querySelectorAll('[id^="tab-"]').forEach(tab => tab.className = "content-tab")
    document.getElementById(`tab-${n}`).className = "content-tab-active"
    document.querySelectorAll('[id^="pane-"]').forEach(pane => pane.style.display = "none")
    document.getElementById(`pane-${n}`).style.display = "block"
}



// Helpers:
const makeAptCard = apt => {
    let div = document.createElement('div'),
        img = document.createElement('img'),
        h3 = document.createElement('h3'),
        p = document.createElement('p')
    div.className = "apt-card"
    div.dataset.aptId = apt.id
    img.className = "card-img"
    img.src = apt.image_url
    h3.innerText = apt.name
    p.innerText = apt.address
    div.appendChild(img)
    div.appendChild(h3)
    div.appendChild(p)
    div.onclick = () => clickAptCard(div)
    document.getElementById('apt-card-wrapper').appendChild(div)
}