module.exports = function Cart(oldCart) {
    this.items = oldCart.items || {};
    this.totalQty = oldCart.totalQty || 0;
    this.totalPrice =oldCart.totalPrice || 0;
    this.add = function (item, id) {
        var storedItem = this.items[id];
        if (!storedItem) {
            storedItem = this.items[id] = { item: item, qty: 0, price: 0 };
        }
        storedItem.qty++;
        storedItem.price = storedItem.item.basePrice * storedItem.qty;
        this.totalQty++;
        this.totalPrice += storedItem.item.basePrice;
    }
    this.addMultiple = function (item, id, qty) {
        var storedItem = this.items[id];
        if (!storedItem) {
            storedItem = this.items[id] = { item: item, qty: 0, price: 0 };
        }
        storedItem.qty += qty;
        storedItem.price = storedItem.item.basePrice * storedItem.qty;
        this.totalQty += qty;
        this.totalPrice += storedItem.item.basePrice * qty;
    }
    this.increaseByOne = function (id) {
        this.items[id].qty++;
        this.items[id].price += this.items[id].item.basePrice;
        this.totalQty++;
        this.totalPrice += this.items[id].item.basePrice;
    }
    this.decreaseByOne = function (id) {
        this.items[id].qty--;
        this.items[id].price -= this.items[id].item.basePrice;
        this.totalQty--;
        this.totalPrice -= this.items[id].item.basePrice;
    }
    this.removeItem = function (id) {
        console.log(this.items);
        this.totalQty -= this.items[id].qty;
        this.totalPrice -= this.items[id].price;
        delete this.items[id];
    }
    this.generateArray = function () {
        var arr = [];
        for (var id in this.items) { arr.push(this.items[id]); }
        return arr;
    };
};