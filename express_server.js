const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const cookieSession = require('cookie-session')
const bcrypt = require('bcrypt');
const methodOverride = require('method-override')
app.use(methodOverride("_method"));
app.set("view engine", "ejs")

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieSession({
  keys: ['secret']
}))

//Url Object database.
const urlDatabase = {
  "b2xVn2": {
    longURL: "http://www.lighthouselabs.ca",
    userID: "userRandomID",
    count: 0
  },
  "9sm5xK": {
    longURL: "http://www.google.com",
    userID: "user2RandomID",
    count: 0
  }
};
// Users object database.
const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
}

// Random shortURL and UserID generator.
function generateRandomString() {
  let text = "";
  let possible = "abcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < 6; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  return text;
}

// Filters URLDatabase into new object containing only User_id-specific URLs. (Created by him).
// function getUrlsForUser(id) {
//   let newUrlDatabase = {};
//   let temObject = {};
//   for (let [shortUrl, obj] of Object.entries(urlDatabase)) {
//     if (obj.userID === id) {
//       temObject.longURL = obj.longURL;
//       temObject.userID = obj.userID;
//       temObject.count = obj.count;
//       newUrlDatabase[shortUrl] = temObject;
//     }
//   }
//   return newUrlDatabase;
// }

function getUrlsForUser(id) {
  let newUrlDatabase = {};
  for (let shortURL in urlDatabase) {
    let short = urlDatabase[shortURL];
    if (short.userID === id) {
      newUrlDatabase[shortURL] = {
        longURL: short.longURL,
        userID: short.userID,
        count: short.count
      }
    }
  }
  return newUrlDatabase;
}

// Redirects / to /urls.
app.get("/", (req, res) => {
  res.redirect("/urls");
});

// Main webserver page.
app.get("/urls", (req, res) => {
  let urlsForUser = getUrlsForUser(req.session.user_id);
  console.log(urlsForUser);
  let templateVars = { urls: urlsForUser, user: users[req.session.user_id], user_id: req.session.user_id };
  res.render("urls_index", templateVars);
});

//POST to creat a new short URL from urls/new form.
app.post("/urls", (req, res) => {
  const newShortURL = generateRandomString();
  let longURL = req.body.longURL;
  let temObject = {};
  if (!longURL.includes("www")) {
    res.redirect(`/urls/${longURL}/error`);
  } else {
    if (!longURL.startsWith("http")) {
      longURL = "http://" + longURL;
    }
    temObject.longURL = longURL;
    temObject.userID = req.session.user_id;
    temObject.count = 0;
    urlDatabase[newShortURL] = temObject;
    console.log(urlDatabase);
    res.redirect(`/urls/${newShortURL}`);
  }
});

//Page to creat new short URL.
app.get("/urls/new", (req, res) => {
  let user_id = req.session.user_id;
  if (!user_id) {
    res.redirect("/login");
  } else {
    let templateVars = { user: users[req.session.user_id], user_id: req.session.user_id };
    res.render("urls_new", templateVars);
  }
});

//GETs specific short URL page. Only owner(creator) of shortURL can access it. User can edit longURL from here.
app.get("/urls/:id", (req, res) => {
  let short = req.params.id;
  if (urlDatabase[short].userID !== req.session.user_id) {
    res.send("Unable to access URL.")
  } else {
    let templateVars = { shortURL: req.params.id, urls: urlDatabase, user: users[req.session.user_id], user_id: req.session.user_id };
    res.render("urls_show", templateVars);
  }
});

//GET from EDIT button on /urls (index ejs) page. Only Owner (creator) of shortURL can edit it.
app.get("/urls/:id/edit", (req, res) => {
  let short = req.params.id;
  if (urlDatabase[short].userID === req.session.user_id) {
    res.redirect(`/urls/${short}`);
  } else {
    res.redirect("/urls");
  }
});

//Register page. Accessable from register link.
app.get("/register", (req, res) => {
  let templateVars = { urls: urlDatabase, user: users[req.session.user_id], user_id: req.session.user_id };
  res.render("urls_register", templateVars);
});

//Login page. Accessable from login link.
app.get("/login", (req, res) => {
  let templateVars = { urls: urlDatabase, user: users[req.session.user_id], user_id: req.session.user_id };
  res.render("urls_login", templateVars);
});

//Calls the URL error page if /urls/:id short URL doesnt exist.
app.get("/urls/:incorrectURL/error", (req, res) => {
  let templateVars = { errorURL: req.params.incorrectURL, user: users[req.session.user_id], user_id: req.session.user_id };
  res.render("urls_errorpage", templateVars);
});


//POST call from submit button on /show page. Edits longURL.
app.put("/urls/:id", (req, res) => {
  let newLongURL = req.body.newLongURL;
  if (!newLongURL.includes("www")) {
    res.redirect(`/urls/${newLongURL}/error`);
  } else {
    if (!newLongURL.startsWith("http")) {
      newLongURL = "http://" + newLongURL;
    }
    urlDatabase[req.params.id].longURL = newLongURL;
    res.redirect("/urls");
  }
});

// Deletes short URL created. POST from DELETE button on /urls.
app.delete("/urls/:id", (req, res) => {
  let short = req.params.id;
  if (urlDatabase[short].userID === req.session.user_id) {
    delete urlDatabase[req.params.id];
    res.redirect("/urls");
  }
  res.redirect("/urls");
});

//Logs user in if Email and Password exist and match. POST from /login page.
app.post("/login", (req, res) => {
  let emailExists = false;
  let email = req.body.email;
  let password = req.body.password;
  let validEmailID = "";
  for (var keys in users) {
    if (users[keys].email === email) {
      emailExists = true;
      validEmailID = keys;
    }
  }
  if (emailExists === false) {
    res.status(403).send("Invalid credentials.");
  }
  if (!bcrypt.compareSync(password, users[validEmailID].password)) {
    res.status(403).send("Invalid credentials.");
  }
  req.session.user_id = validEmailID;
  res.redirect("/");
});

//Logs user out. POST from _header. All pages should have it. Except register and login.
app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/urls");
});

//Registers user based on POST from form in /register. Tests if email already exists or inputs are empty strings.
//Adds new user to Users object.
app.post("/register", (req, res) => {
  let newUserId = generateRandomString();
  let temObject = {};
  if (req.body.email === "" || req.body.password === "") {
    res.status(400).send("Please insert a valid username/password.");
  }
  for (var keys in users) {
    if (users[keys].email === req.body.email) {
      res.status(400).send("Please insert a valid username/password.");
    }
  }
  temObject.id = newUserId;
  temObject.email = req.body.email;
  let nonHashedPW = req.body.password;
  temObject.password = bcrypt.hashSync(nonHashedPW, 10);
  users[newUserId] = temObject;
  req.session.user_id = newUserId;
  res.redirect("/urls");
});


//Takes anyone to the longURL when browser calls /u/shorturl. LongURL also accessible through /show (individual shorturl)page.
app.get("/u/:shortURL", (req, res) => {
  let longURL = urlDatabase[req.params.shortURL].longURL;
  urlDatabase[req.params.shortURL].count++;
  if (longURL) {
    res.redirect(longURL);
  } else {
    res.status(404).send(`"${req.params.shortURL}" is not a valid shortened URL.`);
  }
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.listen(PORT, () => {
  console.log(`Tiny App listening on port ${PORT}!`);
});