# TinyApp Project

TinyApp is a full stack web application built with Node and Express

## Final Product

!["Screenshot: First Page"](https://github.com/rafrocha/TinyApp/blob/master/docs/urls_edit.png?raw=true)


!["Screenshot: Register Page"](https://github.com/rafrocha/TinyApp/blob/master/docs/urls_edit.png?raw=true)


!["Screenshot: Login Page"](https://github.com/rafrocha/TinyApp/blob/master/docs/urls_login.png?raw=true)


!["Screenshot: Single URL page (Owner only)"](https://github.com/rafrocha/TinyApp/blob/master/docs/urls_edit.png?raw=true)


!["Screenshot: Main URLs List Page"](https://github.com/rafrocha/TinyApp/blob/master/docs/urls_edit.png?raw=true)


!["Screenshot: New URL Page"](https://github.com/rafrocha/TinyApp/blob/master/docs/urls_main.png?raw=true)


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