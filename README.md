# Font Group System

## Overview

The Font Group System is a single-page application built with React and Core PHP. It allows users to upload TTF fonts, view and manage uploaded fonts, create and view font groups, and more. The project uses Material UI and Bootstrap for styling, and it leverages an online MySQL database.

## Features

- **Font Upload**: Upload TTF font files directly to the database.
- **Font List**: View a list of uploaded fonts with previews and delete options.
- **Create Font Group**: Create groups to categorize fonts.
- **View Font Group**: View details of font groups and associated fonts.

## Prerequisites

- **Node.js**: v20.x+ (Ensure you have Node.js installed. [Download Node.js](https://nodejs.org/))
- **PHP**: Core PHP for backend operations.
- **MySQL**: Online MySQL instance (see [Database Configuration](#database-configuration)).

## Database Configuration

Update the `database.php` file in the `php-backend` directory with the following MySQL URI:

```php
$uri = 'text from mail, please contact for details';

```
## Clone Repo
```
git clone <repository-url>
cd <repository-directory>
```

## Installation
```
npm install
cd php-backend
composer install
```
## Run Project
- Go to Project root directory then run following command
```
npm start
php -S localhost:8000 -t php-backend
```
