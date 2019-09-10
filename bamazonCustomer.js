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

function listAllProducts() {

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
    buyProduct();
  });
}

function buyProduct() {
  inquirer.prompt([
    {
      name: "productID",
      message: "What is the ID of the product you wish to purchase?"
    },
    {
      name: "unitsOfProduct",
      message: "How many units of this product would you like?"
    }
  ]).then(function (answers) {
    var productID = answers.productID;
    var unitsOfProduct = answers.unitsOfProduct;
    checkProductAvailability(productID, unitsOfProduct);
  });
}

function checkProductAvailability(productID, unitsOfProduct) {
  console.log("Checking Product Availability...\n");
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
        id = res[0].id;
        product_name = res[0].product_name;
        department_name = res[0].department_name;
        price = res[0].price;
        quantity = res[0].stock_qty;
        if (unitsOfProduct < quantity) {
          console.log("We have the product and the desired quantity. Processing your order.");
          processOrder(res, unitsOfProduct);
        }
        else {
          console.log("\nWe have the product. However we have an insufficient quantity.\n");
          listAllProducts();
        }
      }
      else {
        console.log("\nWe have no product with the ID entered.\n");
        listAllProducts();
      }
    });
}

function processOrder(res, unitsOfProduct) {

  id = res[0].id;
  product_name = res[0].product_name;
  console.log("\nProduct: " + product_name);
  department_name = res[0].department_name;
  console.log("Department: " + department_name);
  price = res[0].price;
  console.log("Price: $" + price.toFixed(2));
  quantity = res[0].stock_qty;
  console.log("Quantity Purchased: " + unitsOfProduct);
  total = price * unitsOfProduct;
  console.log("Total Price: $" + total);
  var newStockQty = quantity - unitsOfProduct;
  updateInventory(id, newStockQty);

}

function updateInventory(productID, newStockQty) {
  console.log("Updating the inventory after the sale...\n");
  var query = connection.query(
    "update products set ? WHERE ?",
    [
      {
        stock_qty: newStockQty
      },
      {
        id: productID
      }
    ],
    function (err, res) {
      if (err) throw err;
      listAllProducts();
    });
}

// connect to the mysql server and sql database
connection.connect(function (err) {
  if (err) throw err;
  // run the start function after the connection is made to prompt the user
});

listAllProducts();

//connection.end();
