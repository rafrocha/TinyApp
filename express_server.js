var express = require("express");
var app = express();
var PORT = 8080; // default port 8080
var cookieParser = require('cookie-parser')
app.set("view engine", "ejs")

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

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

function generateRandomString() {
  var text = "";
  var possible = "abcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 6; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}

var tagline = "codes";

app.get("/", (req, res) => {
  //add if is logged in, or not (redirect to /login)
  res.redirect("/urls");
});

app.get("/urls", (req, res) => {
  let templateVars = { urls: urlDatabase, tagline: tagline, username: req.cookies["username"] };
  res.render("urls_index", templateVars);
});

app.get("/register", (req, res) => {
  let templateVars = { urls: urlDatabase, tagline: tagline, username: req.cookies["username"] };
  res.render("urls_register", templateVars);
});

app.get("/urls/new", (req, res) => {
  let templateVars = { username: req.cookies["username"] };
  res.render("urls_new", templateVars);
});


app.get("/urls/:incorrectURL/error", (req, res) => {
  let templateVars = { errorURL: req.params.incorrectURL, username: req.cookies["username"], };
  res.render("urls_errorpage", templateVars);
});

app.post("/urls", (req, res) => {
  const newShortURL = generateRandomString();
  let longURL = req.body.longURL;
  if (!longURL.includes("www")) {
    res.redirect(`/urls/${longURL}/error`);
  } else {
    if (!longURL.startsWith("http")) {
      longURL = "http://" + longURL;
    }
    urlDatabase[newShortURL] = longURL;
    res.redirect(`/urls/${newShortURL}`);
  }
});

app.post("/urls/:id/delete", (req, res) => {
  delete urlDatabase[req.params.id];
  res.redirect("/urls");
});

app.post("/login", (req, res) => {
  res.cookie("username", req.body.username);
  res.redirect("/urls");
});

app.post("/logout", (req, res) => {
  res.clearCookie("username");
  res.redirect("/urls");
});

app.post("/register", (req, res) => {
  let newUserId = generateRandomString();
  let temObject = {};
  if (req.body.email === "" || req.body.password === "") {
    res.status(400).send("Please insert a valid username/password.");
  }
  for (let keys in users) {
    if (keys.email === req.body.email) {
      res.status(400).send("Please insert a valid username/password.");
    }
  }
  temObject.id = newUserId;
  temObject.email = req.body.email;
  temObject.password = req.body.password;
  users[newUserId] = temObject;
  res.cookie("user_id", newUserId);
  console.log(users);
  res.redirect("/urls");
});

app.get("/urls/:id", (req, res) => {
  let templateVars = { shortURL: req.params.id, urls: urlDatabase, username: req.cookies["username"] };
  res.render("urls_show", templateVars);
});

app.post("/urls/:id", (req, res) => {
  let newLongURL = req.body.newLongURL;
  if (!newLongURL.includes("www")) {
    res.redirect(`/urls/${newLongURL}/error`);
  } else {
    if (!newLongURL.startsWith("http")) {
      newLongURL = "http://" + newLongURL;
    }
    urlDatabase[req.params.id] = newLongURL;
    res.redirect("/urls");
  }
});

app.get("/urls/:id/edit", (req, res) => {
  let short = req.params.id;
  res.redirect(`/urls/${short}`);
});

app.get("/u/:shortURL", (req, res) => {
  let longURL = urlDatabase[req.params.shortURL];
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
  console.log(`Example app listening on port ${PORT}!`);
});