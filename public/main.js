const socket = io();

let username = document.getElementById("username");
let selected = document.getElementById("selected");
let users = document.getElementById("users");
users.addEventListener("click", (ev) => {
  for (let i = 0; i < users.childElementCount; ++i) {
    users.children[i].classList.remove("active");
  }
  let ele = ev.target;
  ele.classList.add("active");
  selected.innerHTML = ele.innerHTML;
  selected.id = ele.id;
  selected.style.borderBottom = "1px solid black";
  document.getElementById("rightMenu").style.visibility = "visible";
});

let inputForm = document.getElementById("inputform");
let btnSend = document.getElementById("send"),
  txtMsg = document.getElementById("message"),
  chatBox = document.getElementById("chatbox");

txtMsg.addEventListener("keypress", (evt) => {
  if (evt.which === 13) {
    evt.preventDefault();
    return btnSend.click();
  }
});

btnSend.addEventListener("click", (evt) => {
  evt.preventDefault();
  let previousMsg = chatBox.innerHTML;
  let curMsg = txtMsg.value;
  if (!curMsg) return false;
  let curP = `<div style="border-bottom: 1px solid #f3ecec"><p style="font-size: 15px; margin: 0px;">${curMsg}</p>`;
  curP += `<p class="row" style="font-size: 11px; margin: 0px; padding: 0px;"><span class="col-6" style="text-align: start;">${
    username.innerHTML
  }</span><span class="col-6" style="text-align: end;">${new Date().toLocaleTimeString(
    [],
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }
  )}</span></p></div>`;
  chatBox.innerHTML = curP + previousMsg;
  txtMsg.value = "";
  socket.emit("sendMsg", { id: selected.id, curMsg });
  return false;
});

socket.on("sendMsg", (data) => {
  let previousMsg = chatBox.innerHTML;
  let curP = `<div style="border-bottom: 1px solid #f3ecec"><p style="font-size: 15px; margin: 0px;">${data.curMsg}</p>`;
  curP += `<p class="row" style="font-size: 11px; margin: 0px; padding: 0px;"><span class="col-6" style="text-align: start;">${
    data.username
  }</span><span class="col-6" style="text-align: end;">${new Date().toLocaleTimeString(
    [],
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }
  )}</span></p></div>`;
  chatBox.innerHTML = curP + previousMsg;
});

socket.on("connect", () => {
  username.innerHTML = name;
  socket.emit("newUser", name);
});

socket.on("newUser", (users) => {
  let usersList = document.getElementById("users");
  usersList.innerHTML = "";
  users.forEach((user) => {
    if (user) {
      if (user.name !== username.innerHTML) {
        let listItem = document.createElement("li");
        listItem.classList.add("list-group-item", "list-group-item-action");
        listItem.innerHTML = user.name;
        listItem.id = user.id;
        usersList.appendChild(listItem);
      }
    }
  });
});