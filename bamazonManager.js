var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require('cli-table2');

// create the connection information for the sql database
var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "texcoco",
    database: "bamazon"
});

function menu() {

    console.log("\nBamazon Manager Program\n");
    console.log("1. View Products for Sale");
    console.log("2. View Low Inventory Products");
    console.log("3. Add Inventory to a Product");
    console.log("4. Add a New Product");
    console.log("5. Exit the Program\n");
    inquirer.prompt([
        {
            name: "option",
            message: "Enter an a number:"
        }
    ]).then(function (answers) {
        var option = answers.option;
        //console.log("option: " + option);
        switch (option) {
            case "1":
                viewProducts();
                break;
            case "2":
                viewLowInventoryProducts();
                break;
            case "3":
                addInventoryToAProduct();
                break;
            case "4":
                addNewProduct();
                break;
            case "5":
                connection.end();
                console.log("Good bye");
                return;
            default:
            // code block
        }
    });
}

function viewLowInventoryProducts() {

    // instantiate
    var table = new Table({
        head: ['ID', 'Product Name', 'Department Name', 'Price', 'Stock'],
        colWidths: [5, 35, 17, 8, 8],
        style: ['padding-right', 'padding-left', 'padding-left', 'padding-right', 'padding-right']
    });

    connection.query("SELECT * FROM products where stock_qty < 50", function (err, res) {
        if (err) throw err;
        //console.log("id| Product Name     | Dep. Name | Price | Quantity in Stock");
        //console.log("-----------------------------------");
        for (var i = 0; i < res.length; i++) {
            //console.log(res[i].id + " | " + res[i].product_name + " | " + res[i].department_name + " | " + res[i].price + " | " + res[i].stock_qty);
            // table is an Array, so you can `push`, `unshift`, `splice` and friends
            table.push(
                [res[i].id, res[i].product_name, res[i].department_name, "$" + res[i].price, res[i].stock_qty]
            );

        }
        console.log("\nProducts with Low Inventory less than 50 units.")
        console.log(table.toString());
        menu();
    });
}

function viewProducts() {

    // instantiate
    var table = new Table({
        head: ['ID', 'Product Name', 'Department Name', 'Price', 'Stock'],
        colWidths: [5, 35, 17, 8, 8],
        style: ['padding-right', 'padding-left', 'padding-left', 'padding-right', 'padding-right']
    });

    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        //console.log("id| Product Name     | Dep. Name | Price | Quantity in Stock");
        //console.log("-----------------------------------");
        for (var i = 0; i < res.length; i++) {
            //console.log(res[i].id + " | " + res[i].product_name + " | " + res[i].department_name + " | " + res[i].price + " | " + res[i].stock_qty);
            // table is an Array, so you can `push`, `unshift`, `splice` and friends
            table.push(
                [res[i].id, res[i].product_name, res[i].department_name, "$" + res[i].price.toFixed(2), res[i].stock_qty]
            );

        }
        console.log(table.toString());
        menu();
    });
}

function addInventoryToAProduct() {
    inquirer.prompt([
        {
            name: "productID",
            message: "What is the ID of the product you wish to add inventory to?"
        },
        {
            name: "unitsOfProduct",
            message: "How many units of this product would you like to add?"
        }
    ]).then(function (answers) {
        var productID = answers.productID;
        var unitsOfProduct = answers.unitsOfProduct;
        getQuantitybyID(productID, unitsOfProduct);
    });
}

function updateInventory(productID, newStockQty, currentQuantity) {
    //console.log("updateInventory: productID: " + productID);
    //console.log("newStockQty: " + newStockQty);
    //console.log("currentQuantity: " + currentQuantity);
    StockQty = parseInt(currentQuantity)  + parseInt(newStockQty); // get current stock and add the new stock to the number
    //console.log("newStockQty: " + newStockQty);
    var query = connection.query(
        "update products set ? WHERE ?",
        [
            {
                stock_qty: StockQty
            },
            {
                id: productID
            }
        ],
        function (err, res) {
            if (err) throw err;
            console.log("\nInventory was successfully added for the product with id:"+productID+"\n");
            viewProducts();
        });
}

function getQuantitybyID(productID, unitsOfProduct) {
    //console.log("getQuantitybyID: id: "+productID)
    //console.log("unitsOfProduct: "+unitsOfProduct)
    var query = connection.query(
        "select * from products WHERE ?",
        [
            {
                id: productID
            }
        ],
        function (err, res) {
            if (err) throw err;
            //console.log(res);
            //console.log("length: "+res.length);
            if (res.length == 1) {
                currentQuantity = res[0].stock_qty;
                //console.log("current quantity: "+currentQuantity);
                //console.log("unitsOfProduct: "+unitsOfProduct)
                updateInventory(productID, unitsOfProduct,currentQuantity);
                return;
            }
            else {
                console.log("We have no product with the ID entered.");
                return false;
            }
        });
}


function addNewProduct() {
    inquirer.prompt([
        {
            name: "product_name",
            message: "Enter the Product Name:"
        },
        {
            name: "department_name",
            message: "Enter the Department Name:"
        },
        {
            name: "price",
            message: "Enter the Price for the Product:"
        },
        {
            name: "stock_qty",
            message: "How many units of this product in Inventory:"
        }
    ]).then(function (answers) {
        var price = answers.price;
        var stock_qty = answers.stock_qty;
        var query = connection.query(
            "INSERT INTO products SET ? ",
            {
                product_name: answers.product_name,
                department_name: answers.department_name,
                price: answers.price,
                stock_qty: answers.stock_qty
              },
              function (err, res) {
                if (err) throw err;
                console.log("\nInventory was successfully added for the product with "+answers.product_name+"\n");
                menu();
            });
        });
}


// connect to the mysql server and sql database
connection.connect(function (err) {
    if (err) throw err;
    // run the start function after the connection is made to prompt the user
});

menu();

//connection.end();
