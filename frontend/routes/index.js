import { Router } from "express";
import axios from "axios";
const router = Router();

/* GET home page. */
router.get("/menu", async (req, res, next) => {
  const { category } = req.query; // Extract category from query string

  const { data } = await axios
    .get(process.env.BACKEND_URL + "/menu")
    .catch((err) => {
      console.error(err);
      return { data: { data: [] } };
    });

  let items = data.data;

  // Extract unique categories from items
  const categories = Array.from(
    new Set(items.flatMap((item) => item.category))
  );

  // Filter items by category if category query parameter is present
  // if (category) {
  //   items = items.filter((item) => item.category.includes(category));
  // }

  res.render("site/menu", {
    title: "Menu",
    items,
    categories, // Pass categories for dynamic filtering
    category, // Pass the selected category for active class
  });
});

/* GET . */
router.get("/", async (req, res, next) => {
  res.render("site/index", {
    title: "Home",
  });
});

/* GET . */
router.get("/reservation", async (req, res, next) => {
  const date = new Date();

  const day =
    date.getDay().toString().length === 2 ? date.getDay() : "0" + date.getDay();
  const maxDate = new Date(date.getFullYear() + 1, date.getMonth(), day, 23, 45)
    .toISOString()
    .slice(0, 16);

  res.render("site/reservation", {
    title: "Reservation",
    toDay: new Date().toISOString().slice(0, 16),
    maxDate,
    minDate: new Date().toISOString().slice(0, 16),
    name: "",
    email: "",
    phone: "",
    persons: "",
    noDate: false,
    error: false,
    errorMessage: "",
  });
});

router.post("/reservation", async (req, res, next) => {
  const { name, email, phone, date: reservationDate, persons } = req.body;

  const date = new Date();

  const day =
    date.getDay().toString().length === 2 ? date.getDay() : "0" + date.getDay();
  const maxDate = new Date(date.getFullYear() + 1, date.getMonth(), day, 23, 45)
    .toISOString()
    .slice(0, 16);

  const reservation = {
    name,
    email,
    phone,
    reservationTime: reservationDate,
    amount: persons,
  };

  try {
    const apiResponse = await axios.post(
      process.env.BACKEND_URL + "/reservation",
      reservation
    );
    if (apiResponse.status === 201) {
      res.render("site/reservation-confirmed", {
        title: "Reservation confirmed",
        date: reservationDate,
        name,
        email,
        phone,
        persons,
      });
    }
  } catch (error) {
    const minDate = new Date(
      new Date(reservationDate).setHours(date.getHours() + 3)
    )
      .toISOString()
      .slice(0, 16);
    const errorMessage = error.response.data.message ?? "An error occurred";

    if (error.status === 409) {
      res.render("site/reservation", {
        title: "Reservation",
        toDay: reservationDate,
        maxDate,
        minDate,
        name,
        email,
        phone,
        persons,
        noDate: true,
        error: true,
        errorMessage,
      });
    } else {
      res.render("site/reservation", {
        title: "Reservation",
        toDay: reservationDate,
        maxDate,
        minDate,
        name,
        email,
        phone,
        persons,
        noDate: false,
        error: true,
        errorMessage,
      });
    }
  }
});

export default router;
