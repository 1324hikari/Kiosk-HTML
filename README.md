# Kiosk-HTML

A web-based kiosk management system designed for administering menu items, managing live orders, and viewing sales history. Built with a Node.js backend, MySQL database, and JavaScript frontend.

## 🚀 Features

* **Live Order Management:** Real-time monitoring of pending orders with "Finish" and "Cancel" actions.
* **Inventory Control:** Add new items with image selection and delete existing items.
* **Sales History:** View completed/canceled orders and total revenue.
* **Database Purge:** Authorized purging of order history with log file generation.

## 🛠️ Requirements & Dependencies

### Backend
* **Node.js** (v16+)
* **npm**
* **MySQL Server**
* **Nginx**

### Node.js Packages
* `express`
* `mysql2`
* `cors`

## ⚙️ Setup Instructions

### System Update & Installation
```bash
sudo apt update
```
```bash
sudo apt install nodejs npm mysql-server nginx -y
```
### Database Setup
NOTE: Be sure to be inside of the Kiosk folder before running these commands
```bash
sudo mysql
```
```sql
CREATE DATABASE bytes_and_brews;
CREATE USER 'kiosk_user'@'localhost' IDENTIFIED BY 'coffee123';
GRANT ALL PRIVILEGES ON bytes_and_brews.* TO 'kiosk_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```
```bash
sudo mysql -u kiosk_user -p bytes_and_brews < schema.sql
```

## Running the Kiosk
Go to the Kiosk folder and run the following command:
```bash
node server.js
```
Then go to the Admin Panel to setup the inventory and product list.
To go to the Admin Panel, just type [IP_ADDRESS]/admin.html

### 📦 File Structure

* **`admin.html`**: Main frontend interface.
* **`index.html`**: Main Kiosk interface.
* **`orders.html`**: Shows list of orders.
* **`kitchen.html`**: Gives another device access to finish or cancel orders
* **`server.js`**: Node.js API backend.
* **`schema.sql`**: Database table structures.
* **`/images`**: Folder containing menu item images.
* **`/logs`**: Folder for generated purge logs.

## Contributing

Please leave a **Star ⭐** and open an issue if you encounter any problems.


**This schizophrenic project is made with love ♥️ somewhere in the Philippines 🇵🇭**

<a rel="license" href="https://www.gnu.org/licenses/gpl-3.0.html"><img alt="GPLv3 License" src="https://www.gnu.org/graphics/gplv3-127x51.png" width="100em" height=auto/></a><br/>
**Kiosk-HTML** is licensed under the <a rel="license" href="https://www.gnu.org/licenses/gpl-3.0.html">GNU GPLv3 License</a>.
