function editPriceInput() {
    let priceInputs = document.getElementsByClassName("priceinput");
    for(let i = 0; i < priceInputs.length; i++) {
        priceInputs[i].disabled = false;
    }
    
    document.getElementById("editpricebtn").disabled = true;
    document.getElementById('editpricedonebtn').disabled = false;
}

function doneEdittingPrice() {
    if(!validatePrice()) { return; }

    document.getElementById("editpricebtn").disabled = false;
    document.getElementById('editpricedonebtn').disabled = true;
    
    let priceInputs = document.getElementsByClassName("priceinput");
    for(let i = 0; i < priceInputs.length; i++) {
        priceInputs[i].disabled = true;
    }
}

function validatePrice() {
    let priceInputs = document.getElementsByClassName("priceinput");
    for(let i = 0; i < priceInputs.length; i++) {
        if(priceInputs[i].value < 0) { return false; }
    }

    return true;
}