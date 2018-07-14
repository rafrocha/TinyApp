# TinyApp Project

TinyApp is a full stack web application built with Node and Express

## Final Product

### Initial page

!["Screenshot: First Page"](https://github.com/rafrocha/TinyApp/blob/master/docs/First_page.png?raw=true)


### Registration page

!["Screenshot: Register Page"](https://github.com/rafrocha/TinyApp/blob/master/docs/Register_page.png?raw=true)


### Login page

!["Screenshot: Login Page"](https://github.com/rafrocha/TinyApp/blob/master/docs/Login_page.png?raw=true)


### Single URL page. Owner access only. Owner can copy to clipboard and share short link or edit the URL.

!["Screenshot: Single URL page (Owner only)"](https://github.com/rafrocha/TinyApp/blob/master/docs/Single%20URL_page.png?raw=true)


### List of shortened URLs. User's main page.

!["Screenshot: Main URLs List Page"](https://github.com/rafrocha/TinyApp/blob/master/docs/MainURLList.png?raw=true)


### Create a new shortURL

!["Screenshot: New URL Page"](https://github.com/rafrocha/TinyApp/blob/master/docs/New%20URL_page.png?raw=true)


## Dependencies

- Node.js
- Express
- EJS
- bcrypt
- body-parser
- cookie-session

## Getting Started

- Install all dependencies (using the `npm install` command).
- Run the development web server using the `node express_server.js` command.
- The app uses Bootstrap v4.1.2 CDN for buttons, tables and other formating.

## Functionalities

The App shortens URLs and stores them per user. Owners can access/edit/delete shortURLs their own links. Non-owner users can also access the /u/shortURL version. Owners can copy to clipboard and share short URLs with other users.