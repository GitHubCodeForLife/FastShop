
function filter() {
    //Reset Display products
    let listProducts = $('#list-products').children();
    listProducts.map(i => listProducts[i].style.display = "");
    const priceValue = parseInt($('#filter-price').val());
    const viewValue = parseInt($('#filter-view').val());
    const nameValue = parseInt($('#filter-name').val());
    console.log(priceValue + " " + viewValue + " " + nameValue);
    //Filter by Price
    if (priceValue != 0) {
        filterByPrice(listProducts, priceValue);
    }
    //Filter by Name
    if (nameValue != 0) {
        filterByName(listProducts, nameValue);
    }
    //Filter by View
    if (viewValue != 0) {
        filterByView(listProducts, viewValue);
    }
}

function filterByPrice(listProducts, value) {
    //value: 1 -> <25 
    //value: 2 -> 25 -> 45
    //value: 3 -> >45
    if (value == 1) {
        listProducts.map(i => {
            let htmlPrice = listProducts[i].getElementsByClassName('product-price')[0].innerHTML;
            const price = parseInt(htmlPrice.replace('$', ''));
            if (price > 25) {
                listProducts[i].style.display = "none";
            }
        });
    } else if (value == 2) {
        listProducts.map(i => {
            let htmlPrice = listProducts[i].getElementsByClassName('product-price')[0].innerHTML;
            const price = parseInt(htmlPrice.replace('$', ''));
            if (price > 45 || price < 25) {
                listProducts[i].style.display = "none";
            }
        });
    } else {
        listProducts.map(i => {
            let htmlPrice = listProducts[i].getElementsByClassName('product-price')[0].innerHTML;
            const price = parseInt(htmlPrice.replace('$', ''));
            if (price < 45) {
                listProducts[i].style.display = "none";
            }
        });
    }
}
function filterByName(listProducts, value) {
    if (value == 1) {
        //A -> Z
        listProducts.sort((a, b) => {
            const nameA = a.getElementsByClassName('product-title')[0].innerHTML[0];
            const nameB = b.getElementsByClassName('product-title')[0].innerHTML[0];
            console.log(nameA, nameB);
            if (nameA < nameB) { return -1; }
            if (nameA > nameB) { return 1; }
            return 0;
        });
    } else {
        //Z - > A
        listProducts.sort((a, b) => {
            const nameA = a.getElementsByClassName('product-title')[0].innerHTML[0];
            const nameB = b.getElementsByClassName('product-title')[0].innerHTML[0];
            console.log(nameA, nameB);
            if (nameA < nameB) { return 1; }
            if (nameA > nameB) { return -1; }
            return 0;
        });
    }
    $('#list-products').html('');
    $('#list-products').append(listProducts);
}
function filterByView(listProducts, value) {
    //value: 1 -> <400
    //value: 2 -> 400 --> 800
    //value: 3 -> >800
    if (value == 1) {
        listProducts.map(i => {
            const view = parseInt(listProducts[i].getElementsByClassName('product-view')[0].innerHTML);
            if (view > 400) {
                listProducts[i].style.display = "none";
            }
        });
    } else if (value == 2) {
        listProducts.map(i => {
            const view = parseInt(listProducts[i].getElementsByClassName('product-view')[0].innerHTML);
            if (view < 400 || view > 800) {
                listProducts[i].style.display = "none";
            }
        });
    } else {
        listProducts.map(i => {
            const view = parseInt(listProducts[i].getElementsByClassName('product-view')[0].innerHTML);
            if (view < 800) {
                listProducts[i].style.display = "none";
            }
        });
    }

}




$('body').click(function (event) {
    if (event.target != $('#form-search')) {
        $('#search').html('');
    }
});