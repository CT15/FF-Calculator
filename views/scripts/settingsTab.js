loadPrices();

function loadPrices() {
    pricesDb.find({}, (err, docs) => {
        if (err) {
            dialog.showErrorBox("Load error", "Meal prices are not loaded successfully.");
            return;
        }

        docs.forEach((meal) => {
            document.getElementById(meal.meal).defaultValue = meal.price;
        });
    });
}

function editPriceInput() {
    let priceInputs = document.getElementsByClassName("priceinput");
    for (let i = 0; i < priceInputs.length; i++) {
        priceInputs[i].disabled = false;
    }

    document.getElementById("editpricebtn").disabled = true;
    document.getElementById('editpricedonebtn').disabled = false;
}

function doneEdittingPrice() {
    if (!validatePrice()) {
        dialog.showErrorBox("Invalid price", "Price must not be negative.");
        return;
    }

    document.getElementById("editpricebtn").disabled = false;
    document.getElementById('editpricedonebtn').disabled = true;

    let priceInputs = document.getElementsByClassName("priceinput");
    for (let i = 0; i < priceInputs.length; i++) {
        priceInputs[i].disabled = true;
    }

    pricesDb.remove({}, { multi: true });

    const breakfastPrice = Number(document.getElementById("breakfast").value.replace(/^0+/, '')).toFixed(2);
    const lunchPrice = Number(document.getElementById("lunch").value.replace(/^0+/, '')).toFixed(2);
    const dinnerPrice = Number(document.getElementById("dinner").value.replace(/^0+/, '')).toFixed(2)

    let breakfast = {
        meal: "breakfast",
        price: breakfastPrice
    }

    let lunch = {
        meal: "lunch",
        price: lunchPrice
    }

    let dinner = {
        meal: "dinner",
        price: dinnerPrice
    }

    pricesDb.insert([breakfast, lunch, dinner]);

    document.getElementById("breakfast").value = breakfastPrice;
    document.getElementById("lunch").value = lunchPrice;
    document.getElementById("dinner").value = dinnerPrice;

}

function validatePrice() {
    let priceInputs = document.getElementsByClassName("priceinput");
    for (let i = 0; i < priceInputs.length; i++) {
        if (priceInputs[i].value < 0) { return false; }
    }

    return true;
}