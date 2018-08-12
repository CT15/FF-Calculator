const pricesDb = new DataSource({ filename: "storage/prices.db", autoload: true });
const studentsDb = new DataSource({ filename: "storage/students.db", autoload: true });

let bPrice, lPrice, dPrice, studentName;

ipcRenderer.on('deposit:fine', (event, name) => {
    studentName = name;
    document.getElementById('name').innerHTML = name;
});

ipcRenderer.send('fineWindow-ready');

pricesDb.find({}, (err, docs) => {

    if (docs.length < 3) {
        dialog.showMessageBox(
            remote.getCurrentWindow(), {
                type: "warning",
                title: "Prices are not set",
                message: "You need to set meal prices first."
            });

        document.querySelector("button").disabled = true;
    }
    docs.forEach((meal) => {
        switch (meal.meal) {
            case "breakfast":
                bPrice = meal.price;
                break;
            case "lunch":
                lPrice = meal.price;
                break;
            case "dinner":
                dPrice = meal.price;
                break;
        }
        const priceLabel = " ($" + meal.price + ")";
        document.getElementById(meal.meal).innerHTML += priceLabel;
    });
});

const form = document.querySelector('form');
form.addEventListener('submit', submitForm);

function submitForm(e) {
    e.preventDefault();

    const bCount = document.getElementById("bCount").value;
    const lCount = document.getElementById("lCount").value;
    const dCount = document.getElementById("dCount").value;

    const totalFine = (bCount * bPrice) + (lCount * lPrice) + (dCount * dPrice);
    console.log(totalFine);

    studentsDb.update({ name: studentName }, { $inc: { deposit: -totalFine } });

    studentsDb.findOne({ name: studentName }, (err, doc) => {
        if (err) {
            dialog.showErrorMessage("Student not found", "Unable to find " + studentName + " in the database.");
        }

        const deposit = doc.deposit;

        if (deposit < 0) {
            studentsDb.update({ name: studentName }, { $set: { deposit: 0 }, $inc: { debt: deposit } });
            dialog.showMessageBox(
                remote.getCurrentWindow(), {
                    type: "info",
                    title: "Debt",
                    message: studentName + " needs to pay " + -doc.debt + " in cash."
                });
        }

        ipcRenderer.send('deposit:update', 'fine');
    });
}