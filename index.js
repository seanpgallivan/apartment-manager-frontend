const HOST_URL = "http://localhost:3000"

//Load Chain:
document.addEventListener("DOMContentLoaded", () => {
    window.onclick = e => clickWindow(e);
    document.querySelectorAll('[id^="tab-"]').forEach(tab => tab.onclick = e => clickTab(e.target.id.slice(-1)))
    let f1 = document.getElementById('form-comment'),
        f2 = document.getElementById('form-issue')
    document.getElementById('modal-comment-confirm').onclick = () => 
        clickConfirmComment({id: f1.commentId.value, room_id: f1.roomId.value, date: f1.date.value, content: f1.content.value}) 
    document.getElementById('modal-issue-confirm').onclick = () => 
        clickConfirmIssue({id: f2.issueId.value, room_id: f2.roomId.value, date: f2.date.value, description: f2.description.value, status: f2.status.value})
    document.getElementById('modal-comment-delete').onclick = () => clickCommentDelete(f1.commentId.value)
    document.querySelectorAll('.cancel').forEach(cancel => cancel.onclick = () => closeModal())
    getApartments().then(apartments => apartments.forEach(makeAptCard))
});


// Fetches:
const getApartments = () => fetch(HOST_URL + "/apartments").then(r => r.json())
const getApartment = id => fetch(HOST_URL + `/apartments/${id}`).then(r => r.json())
const getRoom = id => fetch(HOST_URL + `/rooms/${id}`).then(r => r.json())
const patchRoom = room => fetch(HOST_URL + `/rooms/${room.id}`, {
    method: "PATCH",
    headers: {"Content-Type": "application/json", "Accept": "application/json"},
    body: JSON.stringify(room)
    }).then(r => r.json())
const postComment = comment => fetch(HOST_URL + `/comments`, {
    method: "POST",
    headers: {"Content-Type": "application/json", "Accept": "application/json"},
    body: JSON.stringify(comment)
    }).then(r => r.json())
const patchComment = comment => fetch(HOST_URL + `/comments/${comment.id}`, {
    method: "PATCH",
    headers: {"Content-Type": "application/json", "Accept": "application/json"},
    body: JSON.stringify(comment)
    }).then(r => r.json())
const deleteComment = id => fetch(HOST_URL + `/comments/${id}`, {
    method: "DELETE",
    headers: {"Content-Type": "application/json", "Accept": "application/json"}
    }).then(r => r.json())
const postIssue = issue => fetch(HOST_URL + `/issues`, {
    method: "POST",
    headers: {"Content-Type": "application/json", "Accept": "application/json"},
    body: JSON.stringify(issue)
    }).then(r => r.json())
const patchIssue = issue => fetch(HOST_URL + `/issues/${issue.id}`, {
    method: "PATCH",
    headers: {"Content-Type": "application/json", "Accept": "application/json"},
    body: JSON.stringify(issue)
    }).then(r => r.json())


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
    if (document.querySelector('.room-active')) document.querySelector('.room-active').className = "room"
    displayApt(id)
    clickTab(1)
    document.getElementById('splash').style.display = "none"
    document.getElementById('content').style.display = "block"
}
const clickRoom = (id, div) => {
    if (document.querySelector('.room-active')) document.querySelector('.room-active').className = "room"
    div.className = "room-active"
    displayRoom(id)
    clickTab(1)  
}
const clickTab = n => {
    document.querySelector('.content-tab-active').className = "content-tab"
    document.getElementById(`tab-${n}`).className = "content-tab-active"
    document.querySelectorAll('[id^="pane-"]').forEach(pane => pane.style.display = "none")
    document.getElementById(`pane-${n}`).style.display = "block"
}
// // // // // // // // // // // // //
const clickEditRoom = () => {
    document.getElementById('modal-room').style.display = "block"
    document.getElementById('modal-window').style.display = "block"
}
const clickIssue = (room, issue=null) => {
    let form = document.getElementById('form-issue')
    if (issue) {
        document.querySelector('#modal-issue .modal-header').innerText = "Edit Room Issue:"
        form.date.value = issue.date
        form.status.value = issue.status
        form.description.value = issue.description
        form.issueId.value = issue.id
    } else {
        document.querySelector('#modal-issue .modal-header').innerText = "New Room Issue:"
        form.date.value = new Date().toISOString().slice(0, 10)
    }
    form.room.value = room.unit
    form.roomId.value = room.id
    document.getElementById('modal-issue').style.display = "block"
    document.getElementById('modal-window').style.display = "block"
}
const clickConfirmIssue = issue => {
    issue.id ? patchIssue(issue).then(displayIssue) : postIssue(issue).then(displayIssue)
    closeModal()
}
const clickComment = (room, comment=null) => {
    let form = document.getElementById('form-comment')
    if (comment) {
        document.querySelector('#modal-comment .modal-header').innerText = "Edit Room Comment:"
        document.getElementById('modal-comment-delete').style.display = "inline-block"
        form.date.value = comment.date
        form.content.value = comment.content
        form.commentId.value = comment.id
    } else {
        document.querySelector('#modal-comment .modal-header').innerText = "New Room Comment:"
        document.getElementById('modal-comment-delete').style.display = "none"
        form.date.value = new Date().toISOString().slice(0, 10)
    }
    form.room.value = room.unit
    form.tenant.value = room.tenant
    form.roomId.value = room.id
    document.getElementById('modal-comment').style.display = "block"
    document.getElementById('modal-window').style.display = "block"
}
const clickConfirmComment = comment => {
    comment.id ? patchComment(comment).then(displayComment) : postComment(comment).then(displayComment)
    closeModal()
}
const clickCommentDelete = id => {
    deleteComment(id).then(() => {
        document.getElementById(`comment-${id}`).remove()
        closeModal()
    })
}


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
    floors = apt.rooms.reduce((m, room) => !m.includes(room.floor) ? m.concat(room.floor) : m, []).sort().forEach(floor => {
        let floorDiv = document.createElement('div'),
            p = document.createElement('p')
        p.innerText = `Floor ${floor}:`
        floorDiv.className = "floor"
        floorDiv.id = `floor-${floor}-apt-${apt.id}`
        floorDiv.appendChild(p)
        div.appendChild(floorDiv)
    })
    document.getElementById('card-wrapper').appendChild(div)
    apt.rooms.sort((a, b) => (a.unit > b.unit) ? 1 : -1).forEach(room => {
        let roomDiv = document.createElement('div')
        roomDiv.id = `room-${room.id}-apt-${apt.id}`
        roomDiv.className = "room"
        roomDiv.innerText = `Unit ${room.unit}`
        roomDiv.onclick = () => clickRoom(room.id, roomDiv)
        document.getElementById(`floor-${room.floor}-apt-${apt.id}`).appendChild(roomDiv)
    })
}
const closeModal = () => {
    document.getElementById('modal-window').style.display = 'none';
    document.querySelectorAll('.modal').forEach(el => el.style.display = 'none');
    document.querySelectorAll('.modal form').forEach(form => form.reset());
};
const displayApt = id => getApartment(id).then(apt => {
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
    clearTables()
    apt.rooms.sort((a, b) => (a.unit > b.unit) ? 1 : -1).forEach(fillTables)
})
const displayRoom = id => getRoom(id).then(room => {
    let div = document.createElement("div"),
        h1 = document.createElement("h1"),
        p1 = document.createElement("p"),
        p3 = document.createElement("p"),
        p4 = document.createElement("p")
    div.className = "room-info"
    div.dataset.roomId = room.id
    h1.textContent = `Unit ${room.unit}`
    p1.textContent = `Floor: ${room.floor}`
    p3.textContent = `Tenant: ${room.tenant}`
    p4.textContent = `Rent: $${room.rent}`
    div.appendChild(h1)
    div.appendChild(p1)
    div.appendChild(p3)
    div.appendChild(p4)
    document.getElementById("pane-1").replaceWith(div) 
    div.id = "pane-1"
    clearTables()
    fillTables(room)
})
const displayComment = comment => {
    let roomId = (comment.room_id ? comment.room_id : comment.room.id),
        row = document.createElement("tr"),
        cell1 = document.createElement("td"),
        cell2 = document.createElement("td"),
        cell3 = document.createElement("td")
    cell1.className = "td-small"
    cell2.className = "td-small"
    cell2.innerText = comment.date;
    cell3.innerText = comment.content;
    row.id = `comment-${comment.id}`
    row.appendChild(cell1)
    row.appendChild(cell2)
    row.appendChild(cell3)
    let oldRow = document.getElementById(`comment-${comment.id}`)
    oldRow ? oldRow.replaceWith(row) : document.getElementById("comments-table").appendChild(row)
    getRoom(roomId).then(room => {
        cell1.innerText = room.unit
        row.onclick = () => clickComment(room, comment)
    })
}
const displayIssue = issue => {
    let id = (issue.room_id ? issue.room_id : issue.room.id),
        row = document.createElement("tr"),
        cell1 = document.createElement("td"),
        cell2 = document.createElement("td"),
        cell3 = document.createElement("td"),
        cell4 = document.createElement("td")
    cell1.className = "td-small"
    cell2.className = "td-small"
    cell2.innerText = issue.date;
    cell3.className = "td-small"
    cell3.innerText = issue.status;
    cell4.innerText = issue.description;
    row.id = `issue-${id}`
    row.appendChild(cell1)
    row.appendChild(cell2)
    row.appendChild(cell3)
    row.appendChild(cell4)
    let oldRow = document.getElementById(`issue-${id}`)
    oldRow ? oldRow.replaceWith(row) : document.getElementById("issues-table").appendChild(row)
    getRoom(id).then(room => {
        cell1.innerText = room.unit;
        row.onclick = () => clickIssue(room, issue)
    })
}
const clearTables = () => {
    let commentsRows = document.getElementById("comments-table").children
    while(commentsRows[1]) commentsRows[1].remove()
    let issuesRows = document.getElementById("issues-table").children
    while(issuesRows[1]) issuesRows[1].remove()
}
const fillTables = room => {
    room.comments.forEach(displayComment)
    room.issues.forEach(displayIssue)
}