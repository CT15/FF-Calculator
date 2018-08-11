const electron = require('electron');
const { ipcRenderer } = electron;

const form = document.querySelector('form');
form.addEventListener('submit', submitForm);

function submitForm(e) {
    e.preventDefault();
    const name = document.querySelector('#name').value;
    const deposit = document.querySelector('#deposit').value;
    ipcRenderer.send('deposit:add', name, deposit);
}