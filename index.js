const HOST_URL = "http://localhost:3000"

//Load Chain:
document.addEventListener("DOMContentLoaded", () => {
    window.onclick = e => clickWindow(e);
    // document.getElementById('new-apt').onclick = e => clickNewApt(e)
    document.querySelectorAll('[id^="tab-"]').forEach(tab => tab.onclick = e => clickTab(e.target.id.slice(-1)))
    // for testing modal:
    document.getElementById('splash').onclick = () => clickEditRoom()
    getApartments().then(apartments => apartments.forEach(makeAptCard))
});


// Fetches:
const getApartments = () => fetch(HOST_URL + "/apartments").then(r => r.json())
const getApartment = id => fetch(HOST_URL + `/apartments/${id}`).then(r => r.json())
const getRoom = id => fetch(HOST_URL + `/rooms/${id}`).then(res => res.json())


// Events:
const clickWindow = e => e.target == document.getElementById('modal-window') ? closeModal() : null;
const clickShowApts = id => {
    document.querySelector('.sidebar').scrollTop = 0
    document.querySelectorAll('[id^="rooms-"]').forEach(card => card.style.display = "none")
    document.getElementById(`apt-${id}`).onclick = () => clickAptCard(id)
    document.querySelectorAll('[id^="apt-"]').forEach(card => card.style.display = "block")
    document.getElementById('content').style.display = "none"
    document.getElementById('splash').style.display = "block"
}
const clickAptCard = id => {
    document.querySelector('.sidebar').scrollTop = 0
    document.querySelectorAll('[id^="apt-"]').forEach(card => card.style.display = "none")
    document.getElementById(`apt-${id}`).style.display = "block"
    document.getElementById(`apt-${id}`).onclick = () => clickShowApts(id)
    document.getElementById(`rooms-${id}`).style.display = "block"
    displayApt(id)
    clickTab(1)
    document.getElementById('splash').style.display = "none"
    document.getElementById('content').style.display = "block"
}
// Room View goes here!
const clickRoom = id => { 
    getRoom(id).then(room => {
        // console.log(room)
        let div = document.createElement("div")
        let p = document.createElement("p")
        let p1 = document.createElement("p")
        let p2 = document.createElement("p")
        let p3 = document.createElement("p")
        let p4 = document.createElement("p")

        div.className = "room-info"
        div.dataset.roomId = room.id
        p.className = "unit-number"
        p.textContent = `${room.unit}`
        p1.textContent = `Floor: ${room.floor}`
        p2.textContent = "Unit:"
        p3.textContent = `Tenant: ${room.tenant}`
        p4.textContent = `Rent: $${room.rent}`


        div.appendChild(p1)
        div.appendChild(p2)
        div.appendChild(p)
        div.appendChild(p3)
        div.appendChild(p4)

        document.getElementById("pane-1").replaceWith(div) 
        div.id = "pane-1"


        let commentsTbl = document.getElementById("comments-table")
        while(commentsTbl.children.length > 1) {
            commentsTbl.children[1].remove()
        }
        room.comments.forEach(comment => {
            let row = document.createElement("tr");
            let cell3 = document.createElement("td");
            let cell1 = document.createElement("td");
            let cell2 = document.createElement("td");
            
            cell3.innerText = room.unit;
            cell1.innerText = comment.date;
            cell2.innerText = comment.content;
        
            row.appendChild(cell3);
            row.appendChild(cell1);
            row.appendChild(cell2);
            commentsTbl.appendChild(row)

        })
        let issuesTbl = document.getElementById("issues-table");
        while(issuesTbl.children.length > 1){
            issuesTbl.children[1].remove();
        }
        room.issues.forEach(issue => {
            let row = document.createElement("tr");
            let cell4 = document.createElement("td");
            let cell1 = document.createElement("td");
            let cell2 = document.createElement("td");
            let cell3 = document.createElement("td");

            cell4.innerText = room.unit;
            cell1.innerText = issue.date;
            cell2.innerText = issue.status;
            cell3.innerText = issue.description;

            row.appendChild(cell4);
            row.appendChild(cell1);
            row.appendChild(cell2);
            row.appendChild(cell3);
            issuesTbl.appendChild(row);
        })
    })
    clickTab(1)  
}


const clickTab = n => {
    document.querySelectorAll('[id^="tab-"]').forEach(tab => tab.className = "content-tab")
    document.getElementById(`tab-${n}`).className = "content-tab-active"
    document.querySelectorAll('[id^="pane-"]').forEach(pane => pane.style.display = "none")
    document.getElementById(`pane-${n}`).style.display = "block"
}
// // // // // // // // // // // // //
const clickEditRoom = () => {
    document.getElementById('edit-room').style.display = "block"
    document.getElementById('modal-window').style.display = "block"
}
const closeModal = () => {
    document.getElementById('modal-window').style.display = 'none';
    document.querySelectorAll('.modal').forEach(el => el.style.display = 'none');
    document.querySelectorAll('.modal form').forEach(form => form.reset());
};


// Helpers:
const makeAptCard = apt => {
    let div = document.createElement('div'),
        img = document.createElement('img'),
        h3 = document.createElement('h3'),
        p = document.createElement('p')
    div.className = "apt-card"
    div.id = `apt-${apt.id}`
    img.className = "card-img"
    img.src = apt.image_url
    h3.innerText = apt.name
    p.innerText = apt.address
    div.appendChild(img)
    div.appendChild(h3)
    div.appendChild(p)
    div.onclick = () => clickAptCard(div.id.split('-')[1])
    document.getElementById('card-wrapper').appendChild(div)
    makeRoomsCard(apt)
}
const makeRoomsCard = apt => {
    let div = document.createElement('div')
    div.className = "rooms-card"
    div.id = `rooms-${apt.id}`
    let floors = apt.rooms.reduce((m, room) => {
        if (!m.includes(room.floor)) {
            m.push(room.floor)
        }
        return m
    }, []).sort()
    floors.forEach(floor => {
        let floorDiv = document.createElement('div'),
            p = document.createElement('p')
        p.innerText = `Floor ${floor}:`
        floorDiv.className = "floor"
        floorDiv.id = `floor-${floor}-apt-${apt.id}`
        floorDiv.appendChild(p)
        div.appendChild(floorDiv)
    })
    document.getElementById('card-wrapper').appendChild(div)
    apt.rooms.forEach(room => {
        let roomDiv = document.createElement('div')
        roomDiv.id = `room-${room.id}-apt-${apt.id}`
        roomDiv.className = "room"
        roomDiv.innerText = `Unit ${room.unit}`
        roomDiv.onclick = () => clickRoom(room.id)
        document.getElementById(`floor-${room.floor}-apt-${apt.id}`).appendChild(roomDiv)
    })
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


        let commentsTbl = document.getElementById("comments-table")
        while(commentsTbl.children.length > 1) {
            commentsTbl.children[1].remove()
        }
        let issuesTbl = document.getElementById("issues-table");
        while(issuesTbl.children.length > 1){
            issuesTbl.children[1].remove()
        }
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