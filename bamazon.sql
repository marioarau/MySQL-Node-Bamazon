drop table products;
CREATE TABLE products(
  id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(100) NOT NULL,
  department_name VARCHAR(45) NOT NULL,
  price decimal(10,2) default 0.00,
  stock_qty INT default 0,
  PRIMARY KEY (id)
);

insert into products (product_name, department_name, price, stock_qty) values ('Auto Floor Mats', 'Auto Parts', '60.00', 100);
insert into products (product_name, department_name, price, stock_qty) values ('Windshield Sun Shade', 'Auto Parts', '20.00', 120);
insert into products (product_name, department_name, price, stock_qty) values ('Auto Towels', 'Auto Parts', '2.00', 300);
insert into products (product_name, department_name, price, stock_qty) values ('Bridgestone Tire 14R78 ', 'Auto Parts', '65.00', 30);
insert into products (product_name, department_name, price, stock_qty) values ('Pirelli Tire 14R78', 'Auto Parts', '90.00', 30);

insert into products (product_name, department_name, price, stock_qty) values ('Ear Buds', 'Electronics', '22.00', 100);
insert into products (product_name, department_name, price, stock_qty) values ('Battery Pack USB charger', 'Electronics', '21.00', 100);

insert into products (product_name, department_name, price, stock_qty) values ('Towel White', 'Home Goods', '22.00', 100);
insert into products (product_name, department_name, price, stock_qty) values ('Dish Towel White', 'Home Goods', '12.00', 100);
insert into products (product_name, department_name, price, stock_qty) values ('Toaster', 'Home Goods', '22.00', 100);
