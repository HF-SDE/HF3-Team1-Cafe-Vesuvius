import { Router } from "express";
import axios from "axios";
const router = Router();

/* GET home page. */
router.get("/menu", async (req, res, next) => {
  const { category } = req.query; // Extract category from query string

  const { data } = await axios
    .get(process.env.BACKEND_URL + "/menu")
    .catch((err) => {
      console.log(err);
      return { data: { data: [] } };
    });

  let items = data.data;

  // Extract unique categories from items
  const categories = Array.from(
    new Set(items.flatMap((item) => item.category))
  );

  // Filter items by category if category query parameter is present
  if (category) {
    items = items.filter((item) => item.category.includes(category));
  }

  res.render("menu", {
    title: "Menu",
    items,
    categories, // Pass categories for dynamic filtering
    category, // Pass the selected category for active class
  });
});

/* GET . */
router.get("/", async (req, res, next) => {

  res.render("index", {
    title: "Home",
  });
});

export default router;
