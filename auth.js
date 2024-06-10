const express = require("express");
const con = require("./connection");
const app = express();
const path = require("path");
const session = require("express-session");
const router = express.Router();

//authentication login register
router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "./index.html"));
});

router.post("/register", (req, res) => {
  var name = req.body.name;
  var email = req.body.email;
  var password = req.body.password;
  var mobno = req.body.mobno;
  console.log("hello");
  console.log(req.body);

  con.connect((err) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error connecting to the database");
      return;
    }

    var sql =
      "INSERT INTO users(name, email, password, mobno) VALUES (?, ?, ?, ?)";
    var values = [name, email, password, mobno];

    con.query(sql, values, (err, result) => {
      if (err) {
        console.error(err);
        if (err.code === "ER_DUP_ENTRY") {
          const popupScript = `
          <script>
              alert('Email already exists. Please enter another email.');
              window.location.href = '/signup_page.html'; // Redirect to the home page or another page as needed
          </script>
      `;
          res.status(400).send(popupScript);
        } else {
          res.status(500).send("Error occurred while registering");
        }
        return;
      }
      //after successfull registration
      const popupScript = `
    <script>
      alert('Yaay! registered!!!!');
      window.location.href = '/userLogin.html'; // Redirect to the home page or another page as needed
    </script>
  `;
      res.send(popupScript);

      res.sendFile(path.join(__dirname, "veiws", "index.html"));
      // console.log("successsfulyyy !!!!!!!!!!!!!!!1");
    });
  });
});

router.post("/login", (req, res) => {
  var email = req.body.email;
  var password = req.body.password;

  console.log(req.body.email);

  con.connect((err) => {
    if (err) {
      throw err;
    }

    var sql = "SELECT * FROM users WHERE email = ? AND password = ?";
    con.query(sql, [email, password], (err, result) => {
      if (err) {
        throw err;
      }

      if (result.length > 0) {
        req.session.user = {
          name: result[0].name,
          email: result[0].email,
        };
        // req.session.formSubmitted = true;
        res.sendFile(path.join(__dirname, "veiws", "cityInfo.html"));
        console.log("login successfull !!!!!!");
        // res.sendFile(path.join(__dirname, "project/veiws/index.html"));
      } else {
        res.send("wrong credentials");
      }
    });
  });
});

router.post("/Adminlogin", (req, res) => {
  var email = req.body.email;
  var password = req.body.password;

  console.log(req.body.email);

  con.connect((err) => {
    if (err) {
      throw err;
    }

    var sql = "SELECT * FROM admins WHERE email = ? AND password = ?";
    con.query(sql, [email, password], (err, result) => {
      if (err) {
        throw err;
      }

      if (result.length > 0) {
        req.session.user = {
          name: result[0].name,
          email: result[0].email,
        };
        // req.session.formSubmitted = true;
        res.sendFile(path.join(__dirname, "veiws", "adminHome.html"));
        console.log("login successfull !!!!!!");
        // res.sendFile(path.join(__dirname, "project/veiws/index.html"));
      } else {
        res.send("wrong credentials");
      }
    });
  });
});

router.get("/logout", (req, res) => {
  // Clear the session and log out the user
  req.session.destroy((err) => {
    if (err) {
      console.error("Error logging out:", err);
    }
    // Redirect the user to the home page
    res.redirect("./index.html");
  });
});

router.post("/contactUs", (req, res) => {
  const { name, email, message } = req.body;

  // Insert form data into the MySQL table
  const sql =
    "INSERT INTO contact_form (name, email, message) VALUES (?, ?, ?)";
  con.query(sql, [name, email, message], (err, result) => {
    if (err) {
      console.error("Error inserting data into MySQL: ", err);
      res.status(500).send("Internal Server Error");
      return;
    }

    console.log("Form data inserted into MySQL:", result);
    // res.send('Form submitted successfully!');
    const popupScript = `
    <script>
      alert('Form submitted successfully!');
      window.location.href = '/contactUS.html'; // Redirect to the home page or another page as needed
    </script>
  `;
    res.send(popupScript);
  });
});

module.exports = router;
