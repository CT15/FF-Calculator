let studentName;

ipcRenderer.on('debt:pay', (event, name) => {
    studentName = name;
    document.getElementById('name').innerHTML = name;
});

ipcRenderer.send('payWindow-ready');

const form = document.querySelector('form');
form.addEventListener('submit', submitForm);

function submitForm(e) {
    e.preventDefault();

    const amountPaid = document.getElementById('amount').value;

    studentsDb.update({ name: studentName }, { $inc: { debt: -amountPaid } });

    studentsDb.findOne({ name: studentName }, (err, doc) => {
        if (err) {
            dialog.showErrorMessage("Student not found", "Unable to find " + studentName + " in the database.");
            return;
        }

        const debt = doc.debt;

        if (debt < 0) {
            const newDeposit = doc.deposit - debt;

            studentsDb.update({ name: studentName }, { $set: { deposit: newDeposit, debt: 0 } });
            dialog.showMessageBox(
                remote.getCurrentWindow(), {
                    type: "info",
                    title: "Deposit",
                    message: "$" + newDeposit + " has been added to " + studentName + "'s deposit."
                });
        }

        ipcRenderer.send('data:update', 'pay');
    });
}