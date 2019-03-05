const express = require('express');
const router = express.Router();

router.get("/", (req, res) => {

  if(!req.session.user) {
    res.redirect("/");
    return
  }

  if(req.session.user.role === "parent") {
    res.render("parentProfile.hbs", {user: req.session.user});
  }
  else {
    res.render("sitterProfile.hbs", {user: req.session.user});
  }

});


module.exports = router;