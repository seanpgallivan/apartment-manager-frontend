const HOST_URL = "http://localhost:3000"

//Load Chain:
document.addEventListener("DOMContentLoaded", () => {
    window.onclick = e => clickWindow(e);
    // document.getElementById('new-apt').onclick = e => clickNewApt(e)
    document.querySelectorAll('[id^="tab-"]').forEach(tab => tab.onclick = e => clickTab(e.target.id.slice(-1)))
    // for testing modal:
    document.getElementById('splash').onclick = () => clickEditRoom()
    getApartments().then(apartments => {
        console.log(apartments)
        apartments.forEach(makeAptCard)
    })
});


// Fetches:
const getApartments = () => fetch(HOST_URL + "/apartments").then(r => r.json())
const getApartment = id => fetch(HOST_URL + `/apartments/${id}`).then(r => r.json())


// Events:
const clickWindow = e => e.target == document.getElementById('modal-window') ? closeModal() : null;
const clickShowApts = id => {
    document.querySelector('.sidebar').scrollTop = 0
    document.querySelectorAll('[id^="rooms-"]').forEach(card => card.style.display = "none")
    document.getElementById(`apt-${id}`).onclick = () => clickAptCard(id)
    document.querySelectorAll('[id^="apt-"]').forEach(card => card.style.display = "block")
    // document.getElementById('new-apt').style.display = "block"
    document.getElementById('content').style.display = "none"
    document.getElementById('splash').style.display = "block"
}
// const clickNewApt = e => {
//     console.log("new stuff")
// }
const clickAptCard = id => {
    document.querySelector('.sidebar').scrollTop = 0
    // document.getElementById('new-apt').style.display = "none"
    document.querySelectorAll('[id^="apt-"]').forEach(card => card.style.display = "none")
    document.getElementById(`apt-${id}`).style.display = "block"
    document.getElementById(`apt-${id}`).onclick = () => clickShowApts(id)
    document.getElementById(`rooms-${id}`).style.display = "block"
    clickTab(1)
    // Apartment View goes here!
    document.getElementById('splash').style.display = "none"
    document.getElementById('content').style.display = "block"
}
const clickRoom = id => {
    clickTab(1)
    // Room View goes here!
}
const clickTab = n => {
    document.querySelectorAll('[id^="tab-"]').forEach(tab => tab.className = "content-tab")
    document.getElementById(`tab-${n}`).className = "content-tab-active"
    document.querySelectorAll('[id^="pane-"]').forEach(pane => pane.style.display = "none")
    document.getElementById(`pane-${n}`).style.display = "block"
}
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