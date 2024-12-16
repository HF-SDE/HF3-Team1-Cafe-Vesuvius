# Café Vesuvius Project

Welcome to the Café Vesuvius project! This repository contains everything you need to get the backend, website, and app server running for the project. Follow the steps below to get started.

---

## Prerequisites

Before you begin, ensure you have the following installed:  
1. **Node.js** (Latest version) - [Download here](https://nodejs.org)  
2. **Docker** - [Download here](https://www.docker.com/products/docker-desktop)
2. **Ngrok** - [Create an account here](https://ngrok.com/)

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
