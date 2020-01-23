const HOST_URL = "http://localhost:3000"

//Load Chain:
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById('show-apts').onclick = e => clickShowApts(e)
    document.getElementById('new-apt').onclick = e => clickNewApt(e)
    document.querySelectorAll('[id^="tab-"]').forEach(tab => tab.onclick = e => clickTab(e.target.id.slice(-1)))
    
    getApartments().then(apartments => apartments.forEach(makeAptCard))
    // document.querySelectorAll('[data-apt-id]').forEach(card => {
    //     card.onclick = () => clickAptCard(card)
    // })
});


// Fetches:
const getApartments = () => fetch(HOST_URL + "/apartments").then(r => r.json())
const getApartment = id => fetch(HOST_URL + `/apartments/${id}`).then(r => r.json())

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
    
    // console.log(clickedCard.dataset.aptId)
    displayApt(clickedCard.dataset.aptId)
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

const displayApt = id => {
    getApartment(id).then(apt => {
        let div = document.createElement('div'),
        img = document.createElement('img'),
        h3 = document.createElement('h3'),
        p = document.createElement('p')

        div.className = "apt-info"
        div.dataset.aptId = apt.id
        img.className = "apt-img"
        img.src = apt.image_url
        h3.innerText = apt.name
        p.innerText = apt.address
        div.appendChild(img)
        div.appendChild(h3)
        div.appendChild(p)

        document.getElementById("pane-1").replaceWith(div)
        div.id = "pane-1"

        apt.rooms.forEach(room => {
            room.comments.forEach(comment => {
                let row = document.createElement("tr");
                let cell1 = document.createElement("td");
                let cell2 = document.createElement("td");
                let cell3 = document.createElement("td");
                cell1.innerText = room.unit;
                cell2.innerText = comment.date;
                cell3.innerText = comment.content;
            
                row.appendChild(cell1)
                row.appendChild(cell2)
                row.appendChild(cell3)
                document.getElementById("comments-table").appendChild(row)
            })
            room.issues.forEach(issue => {
                let row = document.createElement("tr");
                let cell1 = document.createElement("td");
                let cell2 = document.createElement("td");
                let cell3 = document.createElement("td");
                let cell4 = document.createElement("td");
                cell1.innerText = room.unit;
                cell2.innerText = issue.date;
                cell3.innerText = issue.status;
                cell4.innerText = issue.description;
            
                row.appendChild(cell1)
                row.appendChild(cell2)
                row.appendChild(cell3)
                row.appendChild(cell4)
                document.getElementById("issues-table").appendChild(row)
            })
        })
    })
}

