var express = require("express");
var app = express();
var PORT = 8080; // default port 8080
var cookieParser = require('cookie-parser')
app.set("view engine", "ejs")

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

var urlDatabase = {
  "b2xVn2": {
    longURL: "http://www.lighthouselabs.ca",
    userID: "userRandomID"
  },
  "9sm5xK": {
    longURL: "http://www.google.com",
    userID: "user2RandomID"
  }
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

function getUrlsForUser (id){
  let newUrlDatabase = {};
  let temObject = {};
  for(let [shortUrl, obj] of Object.entries(urlDatabase)){
    if(obj.userID === id){
      temObject.longURL = obj.longURL;
      temObject.userID = obj.userID;
      newUrlDatabase[shortUrl] = temObject;
    }
  }
  return newUrlDatabase;
}


app.get("/", (req, res) => {
  //add if is logged in, or not (redirect to /login)
  res.redirect("/urls");
});

app.get("/urls", (req, res) => {
  let urlsForUser = getUrlsForUser(req.cookies.user_id);
  let templateVars = { urls: urlsForUser, user: users[req.cookies.user_id], user_id: req.cookies.user_id };
  res.render("urls_index", templateVars);
});

app.get("/register", (req, res) => {
  let templateVars = { urls: urlDatabase, user: users[req.cookies.user_id], user_id: req.cookies.user_id };
  res.render("urls_register", templateVars);
});

app.get("/login", (req, res) => {
  let templateVars = { urls: urlDatabase, user: users[req.cookies.user_id], user_id: req.cookies.user_id };
  res.render("urls_login", templateVars);
});

app.get("/urls/new", (req, res) => {
  let user_id = req.cookies.user_id;
  if (!user_id) {
    res.redirect("/login");
  } else {
    let templateVars = { user: users[req.cookies.user_id], user_id: req.cookies.user_id };
    res.render("urls_new", templateVars);
  }
});


app.get("/urls/:incorrectURL/error", (req, res) => {
  let templateVars = { errorURL: req.params.incorrectURL, user: users[req.cookies.user_id], user_id: req.cookies.user_id };
  res.render("urls_errorpage", templateVars);
});

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
    temObject.userID = req.cookies.user_id;
    urlDatabase[newShortURL] = temObject;
    res.redirect(`/urls/${newShortURL}`);
  }
});

app.post("/urls/:id/delete", (req, res) => {
  let short = req.params.id;
  if (urlDatabase[short].userID === req.cookies.user_id) {
    delete urlDatabase[req.params.id];
    res.redirect("/urls");
  }
  res.redirect("/urls");
});

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
  if (users[validEmailID].password !== password) {
    res.status(403).send("Invalid credentials.");
  }
  res.cookie("user_id", validEmailID);
  res.redirect("/");
});

app.post("/logout", (req, res) => {
  res.clearCookie("user_id");
  res.redirect("/urls");
});

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
  temObject.password = req.body.password;
  users[newUserId] = temObject;
  res.cookie("user_id", newUserId);
  console.log(users);
  res.redirect("/urls");
});

app.get("/urls/:id", (req, res) => {
  let short = req.params.id;
  if (urlDatabase[short].userID !== req.cookies.user_id) {
    res.send("Unable to access URL.")
  } else {
    let templateVars = { shortURL: req.params.id, urls: urlDatabase, user: users[req.cookies.user_id], user_id: req.cookies.user_id };
    res.render("urls_show", templateVars);
  }
});

app.post("/urls/:id", (req, res) => {
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

app.get("/urls/:id/edit", (req, res) => {
  let short = req.params.id;
  if (urlDatabase[short].userID === req.cookies.user_id) {
    res.redirect(`/urls/${short}`);
  } else {
    res.redirect("/urls");
  }
});

app.get("/u/:shortURL", (req, res) => {
  let longURL = urlDatabase[req.params.shortURL].longURL;
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