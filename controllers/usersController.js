const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const usersStorage = require("../storages/usersStorage");

const validateUser = [
  body("firstName").trim().isAlpha().withMessage("First name must only contain letters")
    .isLength({ min: 1, max: 10 }).withMessage("First name must be between 1 and 10 characters"),
  body("lastName").trim().isAlpha().withMessage("Last name must only contain letters")
    .isLength({ min: 1, max: 10 }).withMessage("Last name must be between 1 and 10 characters"),
  body("email").trim().isEmail().withMessage("Must be a valid email address"),
  body("age").optional().isInt({ min: 18, max: 120 }).withMessage("Age must be between 18 and 120"),
  body("bio").optional().isLength({ max: 200 }).withMessage("Bio must not exceed 200 characters"),
];

exports.usersCreateGet = asyncHandler(async (req, res) => {
  res.render("users", {
    title: "User List",
    users: usersStorage.getUsers(),
  });
});

exports.usersCreatePost = [
  validateUser,
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("users", {
        title: "User List",
        errors: errors.array(),
        users: usersStorage.getUsers(),
      });
    }
    const { firstName, lastName, email, age, bio } = req.body;
    usersStorage.addUser({firstName, lastName, email, age, bio});
    res.redirect("/");
  })
];

exports.usersUpdateGet = asyncHandler(async (req, res) => {
  const user = usersStorage.getUser(req.params.id);
  if (!user) {
    return res.status(404).send('User not found');
  }
  res.render("update", { title: "Update User", user, errors: [] });
});

exports.usersUpdatePost = [
  validateUser,
  asyncHandler(async (req, res) => {
    const user = usersStorage.getUser(req.params.id);
    if (!user) {
      return res.status(404).send('User not found');
    }
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("update", {
        title: "Update User",
        errors: errors.array(),
        user: { ...user, ...req.body },
      });
    }
    
    const { firstName, lastName, email, age, bio } = req.body;
    usersStorage.updateUser(req.params.id, {firstName, lastName, email, age, bio});
    res.redirect("/");
  })
];

exports.usersDeletePost = asyncHandler(async (req, res) => {
  const user = usersStorage.getUser(req.params.id);
  if (!user) {
    return res.status(404).send('User not found');
  }
  usersStorage.deleteUser(req.params.id);
  res.redirect("/");
});

exports.usersSearchGet = asyncHandler(async (req, res) => {
  res.render("search", { title: "Search Users", users: [] });
});

exports.usersSearchPost = asyncHandler(async (req, res) => {
  const { query } = req.body;
  const users = usersStorage.searchUsers(query);
  res.render("search", { title: "Search Results", users, query });
});