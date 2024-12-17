# Café Vesuvius Project

Welcome to the Café Vesuvius project! This repository contains everything you need to get the backend, website, and app server running for the project. Follow the steps below to get started.

---

## Prerequisites

Before you begin, ensure you have the following installed:

1. **Node.js** (Latest version) - [Download here](https://nodejs.org)
2. **Docker** - [Download here](https://www.docker.com/products/docker-desktop)
3. **Ngrok** - [Create an account here](https://ngrok.com/)

---

## Setup Instructions

### 1. Clone the Repository

Pull the latest version of this repository to your local machine:

```bash
git clone <repository-url>
cd <repository-folder>
```

### 2. Create and fill out the .env files

Please create and fill out all the .env files in the project. Both for the frontend and backend. Theire is an example file for every file that needs to be created just replace example with dev in the .env file nam.

### 3. Install the packages

Install the latest version of the requiered packages:

```bash
npm install
```

### 4. Build the docker images

Compile the project to a docker image to run in a container:

```bash
npm run build:dev
```

### 5. Start the containers

Start the containers with the images form the last step:

```bash
npm run dev
```

If it gives an replication error please wait a bit before running the command again this should resolve the problem

### 6. Inizialise data

Inserts the data from the seed file into the database:

```bash
npm run seed
```

## App guide

The first page you are greeted with when opening the app is the login page. Please use the credentials provided to you by your system administrator.
<br/>
<img src="/image/Login.png" alt="This is the login screen" title="This is the login screen" height="400px" />
<img src="/image/LoginDark.png" alt="This is the login dark screen" title="This is the login dark screen" height="400px" />

If you cannot login please contact the administrator to resolve the problem.

To navigate between the different pages in the app, use the nav bar at the bottom of the screen. Down here there will be up to 4 icons depending on the access permissions that the administrator gave you.
<br/>
<img src="/image/Navbar.png" alt="This is the navbar" title="This is the navbar" width="420px" />

### Available Main Pages:

1. **Profile**
2. **Management**
3. **Reservation**
4. **Order**

### Profile Page:

After you have logged in to the app, you will see the profile page. From here, it is possible to see who is logged in to the system, and it also provides a way to log out and to access the form to change your password (this is recommended if it is your first time logging in with the password from your administrator).
<br/>
<img src="/image/Pages/Profile/Profile.png" alt="This is the profile screen" title="This is the profile screen" height="400px" />
<img src="/image/Pages/Profile/ProfileDark.png" alt="This is the profile dark screen" title="This is the profile dark screen" height="400px" />

#### Change Password Form

Here you can change the password for your account. Simply enter the old password and the new one you would like. It will ask you to confirm the new password. If you press **Change**, your password has then been changed. In case of any error, please follow the on-screen instructions.
<br/>
<img src="/image/Pages/Profile/ProfileChangePassword.png" alt="This is the change password form" title="This is the change password form" height="400px" />

### Management Page:

The Management page allows you to manage users, menus, stats, and storage. Depending on your permissions, you may have access to different sections of this page.
<br/>
<img src="/image/Pages/Management/Management.png" alt="This is the management screen" title="This is the management screen" height="400px" />

#### Users Page

In the **Users** page, you can view and manage all the users of the system. You can add new users, edit existing users, or deactivate users.

**IMPORTANT**: To set the password for a user, whether creating or editing, use the **Set Password** button. A form will pop up where you can set the password.
<br/>
<img src="/image/Pages/Management/Users/Users.png" alt="This is the users screen" title="This is the users screen" height="400px" />
<img src="/image/Pages/Management/Users/UsersSetPasswordForm.png" alt="This is the users set password form" title="This is the users set password form" height="400px" />

##### Create User

To create a new user press the plus icon at the bottom, fill out the form with the required details. After submitting the form, the new user will be created and added to the system.
<br/>
<img src="/image/Pages/Management/Users/UsersCreate.png" alt="This is the users create screen" title="This is the users create screen" height="400px" />

##### Edit User

On the **Edit User** page, you can modify the details of an existing user. Simply search for the user you want to edit and press on it, update the required fields, and save the changes.
<br/>
<img src="/image/Pages/Management/Users/UsersEdit.png" alt="This is the users edit screen" title="This is the users edit screen" height="400px" />

#### Menu Page

The **Menu** page allows you to manage the items available in the café's menu. You can add new menu items, update existing ones, or remove items.
<br/>
<img src="/image/Pages/Management/Menu/Menu.png" alt="This is the menu screen" title="This is the menu screen" height="400px" />

##### Create Menu

To add a new menu item press the plus icon, fill in the necessary details, such as item name, price, category and the indigents that is needed for that menu. After submitting, the new menu item will be added to the system.
<br/>
<img src="/image/Pages/Management/Menu/MenuCreateIngredients.png" alt="This is the menu create ingredient screen" title="This is the menu create ingredient screen" height="400px" />
<img src="/image/Pages/Management/Menu/MenuCreateCategories.png" alt="This is the menu create category screen" title="This is the menu create category screen" height="400px" />

##### Edit Menu

On the **Edit Menu** page, you can update existing menu items. Search for the item you want to edit, modify the details, and save the changes.
<br/>
<img src="/image/Pages/Management/Menu/MenuEditIngredients.png" alt="This is the menu edit ingredient screen" title="This is the menu edit ingredient screen" height="400px" />
<img src="/image/Pages/Management/Menu/MenuEditCategories.png" alt="This is the menu edit category screen" title="This is the menu edit category screen" height="400px" />

##### Delete Menu

On the **Edit Menu** page, you can delete the menu. Search for the item you want to delete, and press the trashcan icon in the top right.
<br/>
<img src="/image/Pages/Management/Menu/MenuDelete.png" alt="This is the menu delete screen" title="This is the menu delete screen" height="400px" />

#### Stats Page

The **Stats** page displays important statistics related to the café’s performance. Here, you can view metrics such as sales, orders, and other key performance indicators (KPIs).
<br/>
<img src="/image/Pages/Management/Statistics/Statistics1.png" alt="This is the statistics 1 screen" title="This is the statistics 1 screen" height="400px" />
<img src="/image/Pages/Management/Statistics/Statistics2.png" alt="This is the statistics 2 screen" title="This is the statistics 2 screen" height="400px" />
<img src="/image/Pages/Management/Statistics/Statistics3.png" alt="This is the statistics 3 screen" title="This is the statistics 3 screen" height="400px" />
<img src="/image/Pages/Management/Statistics/Statistics4.png" alt="This is the statistics 4 screen" title="This is the statistics 4 screen" height="400px" />
<img src="/image/Pages/Management/Statistics/Statistics5.png" alt="This is the statistics 5 screen" title="This is the statistics 5 screen" height="400px" />

#### Storage Page

The **Storage** page allows you to manage the stock items and monitor inventory levels. You can add new stock items or, or delete users edit existing ones to keep track of the café's inventory.
<br/>
<img src="/image/Pages/Management/Storage/Storage.png" alt="This is the storage screen" title="This is the storage screen" height="400px" />
<img src="/image/Pages/Management/Storage/StorageSave1.png" alt="This is the storage save 1 screen" title="This is the storage save 1 screen" height="400px" />
<img src="/image/Pages/Management/Storage/StorageSave2.png" alt="This is the storage save 2 screen" title="This is the storage save 2 screen" height="400px" />

##### Create Stock Item

To create a new stock item press the plus icon, enter the required details such as item name, unit, and quantity. Submit the form to add the new item to the inventory.
<br/>
<img src="/image/Pages/Management/Storage/StorageCreate.png" alt="This is the storage create screen" title="This is the storage create screen" height="400px" />
<img src="/image/Pages/Management/Storage/StorageCreateData.png" alt="This is the storage create data screen" title="This is the storage create data screen" height="400px" />

##### Edit Stock Item

On the **Edit Stock Item**, you can modify the details of an existing stock item. Search for the item you want to update and swipe from right to left on it and press the edit icon, make the necessary changes, and save the updated information.
<br/>
<img src="/image/Pages/Management/Storage/StorageEdit.png" alt="This is the storage edit screen" title="This is the storage edit screen" height="400px" />
<img src="/image/Pages/Management/Storage/StorageEditForm.png" alt="This is the storage edit form" title="This is the storage edit form" height="400px" />

##### Delete Stock Item

To delete a stock item swipe from left to right on it and then press the delete icon and confirm your action
<br/>
<img src="/image/Pages/Management/Storage/StorageDelete.png" alt="This is the storage delete edit screen" title="This is the storage delete screen" height="400px" />
<img src="/image/Pages/Management/Storage/StorageDeleteConfirm.png" alt="This is the storage delete confirm" title="This is the storage delete confirm" height="400px" />

### Reservation Page:

The **Reservation Page** allows users to make and manage reservations. You can view available time slots, reserve a table, and modify or cancel existing reservations.

### Order Page:

The **Order Page** enables you to place and manage orders. You can view current orders, track their status, and update them as needed. This page is typically used by staff to handle customer orders efficiently.
