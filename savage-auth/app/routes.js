module.exports = function (app, passport, db) {
const ObjectId = require('mongodb').ObjectID   // this gives you the objct id froms 
  // normal routes ===============================================================

  // show the home page (will also have our login links)
  app.get("/", function (req, res) {
    res.render("index.ejs");
  });

  // PROFILE SECTION =========================
  app.get("/profile", isLoggedIn, function (req, res) {
    db.collection("userhabits")
      .find()
      .toArray((err, result) => {
        if (err) return console.log(err);
        res.render("profile.ejs", {
          user: req.user,
          messages: result,
          
        });
      });
  });

  
app.post('/goals', (req, res) => {        //post is the first thing that happen when you send somthing from the form to the server  I ADDED THIS JUST NOW
  db.collection('userhabits').save({goals: req.body.goal, day: req.body.day, completed: false}, (err, result) => {
    if (err) return console.log(err)
    console.log('saved to database')
    res.redirect('/profile')
  })
})

app.put('/goals', (req, res) => {
  db.collection('userhabits')
  .findOneAndUpdate({ _id: ObjectId(req.body.id)},
    [
      { $set: { completed: { $not: "$completed" } } }
    ]
  , {
    sort: {_id: -1},
    upsert: true
  }, (err, result) => {
    if (err) return res.send(err)
    res.send(result)
  })
})


app.delete('/goals', (req, res) => {
  db.collection('userhabits').findOneAndDelete({_id: ObjectId(req.body.id)}, (err, result) => {
    console.log(result)
    if (err) return res.send(500, err)
      res.redirect('/profile')
    // res.send('Message deleted!')
  })
  
console.log(req.body)
})


 

  // LOGOUT ==============================
  app.get("/logout", function (req, res) {
    req.logout(() => {
      console.log("User has logged out!");
    });
    res.redirect("/");
  });





  // =============================================================================
  // AUTHENTICATE (FIRST LOGIN) ==================================================
  // =============================================================================

  // locally --------------------------------
  // LOGIN ===============================
  // show the login form
  app.get("/login", function (req, res) {
    res.render("login.ejs", { message: req.flash("loginMessage") });
  });

  // process the login form
  app.post(
    "/login",
    passport.authenticate("local-login", {
      successRedirect: "/profile", // redirect to the secure profile section
      failureRedirect: "/login", // redirect back to the signup page if there is an error
      failureFlash: true, // allow flash messages
    })
  );

  app.post("/goals", isLoggedIn, (req, res) => {
    const { user } = req;
    const goals = {};

    // Collect goals from the form for each day
    [
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
      "sunday",
    ].forEach((day) => {
      if (req.body[`${day}-goal`]) {
        goals[day] = req.body[`${day}-goal`];
      }
    });

    db.collection("userhabits").updateOne(
      { _id: user._id },
      { $set: { goals } },
      { upsert: true },
      (err) => {
        if (err) return console.error(err);
        res.redirect("/profile");
      }
    );
  });


  // SIGNUP =================================
  // show the signup form
  app.get("/signup", function (req, res) {
    res.render("signup.ejs", { message: req.flash("signupMessage") });
  });

  // process the signup form
  app.post(
    "/signup",
    passport.authenticate("local-signup", {
      successRedirect: "/profile", // redirect to the secure profile section
      failureRedirect: "/signup", // redirect back to the signup page if there is an error
      failureFlash: true, // allow flash messages
    })
  );

  // =============================================================================
  // UNLINK ACCOUNTS =============================================================
  // =============================================================================
  // used to unlink accounts. for social accounts, just remove the token
  // for local account, remove email and password
  // user account will stay active in case they want to reconnect in the future

  // local -----------------------------------
  app.get("/unlink/local", isLoggedIn, function (req, res) {
    var user = req.user;
    user.local.email = undefined;
    user.local.password = undefined;
    user.save(function (err) {
      res.redirect("/profile");
    });
  });
};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();

  res.redirect("/");
}
