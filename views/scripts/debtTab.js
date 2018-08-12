const debtsList = document.getElementById('debtlist');

loadDebtsList();

function loadDebtsList() {
    studentsDb.find({}, (err, docs) => {
        if (err) {
            dialog.showErrorBox("Unable to show data.", "Unable to find students data.");
            return;
        }

        docs.sort((a, b) => {
            if (a.name < b.name) return -1;
            if (a.name > b.name) return 1;
            return 0;
        });

        docs.forEach((student) => {
            if (student.debt > 0) createDebtRow(student.name, student.debt);
        });
    });
}

function reloadDebtsList() {
    debtsList.innerHTML = "";
    studentsDb.loadDatabase((err) => {
        if (err) {
            dialog.showErrorBox("Unable to load new data.", "Unable to display new debts data.");
            return;
        }

        loadDebtsList();
    });
}

function createDebtRow(studentName, debt) {
    const li = document.createElement("li");
    li.className = "collection-item";

    let row = document.createElement("div");
    row.className = "row valign-wrapper";

    let col1 = document.createElement("div");
    col1.className = "col s5";
    col1.appendChild(document.createTextNode(studentName));

    let col2 = document.createElement("div");
    col2.className = "col s3";
    col2.appendChild(document.createTextNode("$" + debt));

    let col3 = document.createElement("div");
    col3.className = "col s2";
    const payButton = document.createElement("button");
    payButton.innerHTML = "Pay";
    payButton.onclick = function() { createPayWindow(studentName); };
    col3.appendChild(payButton);

    let col4 = document.createElement("div");
    col4.className = "col s2";
    const paidButton = document.createElement("button");
    paidButton.innerHTML = "Paid";
    paidButton.className = "red lighten-1"
    paidButton.onclick = function() { payDebtInFull(studentName); };
    col4.appendChild(paidButton);

    [payButton, paidButton].forEach((button) => {
        button.classList.add("btn");
    });

    [col1, col2, col3, col4].forEach((element) => {
        row.appendChild(element);
    });

    li.appendChild(row);

    debtsList.appendChild(li);
}

function createPayWindow(name) {
    if (moreThanOneSecondaryWindows()) { return; } // in depositTab.js

    payWindow = new BrowserWindow({
        width: 350,
        height: 215,
        resizable: false,
        title: 'Pay Debt'
    });
    // Load html into window
    payWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'payWindow.html'),
        protocol: 'file'
    }));

    ipcRenderer.send('debt:pay', name);

    // Garbage collection handle
    payWindow.on('close', () => {
        payWindow = null;
    });

}

function payDebtInFull(name) {
    dialog.showMessageBox(
        remote.getCurrentWindow(), {
            type: "question",
            buttons: ["Yes", "Cancel"],
            title: "Paid debt in full",
            message: "Are you sure " + name + " has paid debt in full?"
        },
        (response) => {
            // Yes
            if (response === 0) {
                studentsDb.update({ name: name }, { $set: { debt: 0 } });
                reloadDebtsList();
            }
        }
    );
}