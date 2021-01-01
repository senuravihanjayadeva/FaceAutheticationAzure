const router = require("express").Router();
let User = require("../model/User"); //model we created

//Handle incoming HTTP GET requests under /user url
router.route("/").get((req, res) => {
  //(find)mongoose method that get the list of all  the users from themongodb atlas databse
  User.find()
    .then((users) => res.json(users))
    .catch((err) => res.status(400).json("Error: " + err));
});

//Handle incoming HTTP GET requests under /user url
router.route("/:userid").get((req, res) => {
  //(find)mongoose method that get the list of all  the users from themongodb atlas databse
  User.findOne({ userId: req.params.userid })
    .then((user) => res.json(user))
    .catch((err) => res.status(400).json("Error: " + err));
});

//Handle incoming HTTP POST requests
router.route("/add").post((req, res) => {
  const userId = req.body.userId;
  const userName = req.body.userName;

  const newUser = new User({ userId, userName });

  //Save the data into the mongo database
  newUser
    .save()
    .then(() => res.json("User added!"))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/delete/:userid").delete((req, res) => {
  User.findOneAndDelete({ userId: req.params.userid })
    .then(() => res.json("User deleted."))
    .catch((err) => res.status(400).json("Error: " + err));
});

module.exports = router;
