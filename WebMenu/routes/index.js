import { Router } from "express";
import axios from "axios";
const router = Router();

/* GET home page. */
router.get("/", async (req, res, next) => {
  const { data } = await axios
    .get(process.env.BACKEND_URL + "/menu")
    .catch((err) => {
      console.log(err);

      return { data: { data: [] } };
    });

  res.render("index", {
    title: "Menu",
    items: data.data,
  });
});

export default router;
