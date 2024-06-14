const express = require("express");
const router = express.Router();
const Culinary = require("../services/kukulinerServices");

router.get("/", async function (req, res, next) {
  try {
    const data = await Culinary.getAllData(req.query);
    const formattedResponse = {
      listKuliner: data.map((place) => ({
        id: place.id.toString(),
        nama: place.nama,
        alamat: place.alamat,
        lat: place.lat,
        lon: place.lon,
      })),
    };

    res.json(formattedResponse);
  } catch (err) {
    console.error(`Error while getting culinary `, err.message);
    next(err);
  }
});

router.get("/:id", async function (req, res, next) {
  try {
    const id = req.params.id;
    const data = await Culinary.getSingleData(id);

    const formattedResponse = {
      listKuliner: data.map((place) => ({
        id: place.id.toString(),
        nama: place.nama,
        alamat: place.alamat,
        lat: place.lat,
        lon: place.lon,
      })),
    };

    res.json(formattedResponse);
  } catch (err) {
    console.error(`Error while getting culinary `, err.message);
    next(err);
  }
});

router.get("/search/:name", async function (req, res, next) {
  try {
    const name = req.params.name;
    const data = await Culinary.getDataByName(name);

    const formattedResponse = {
      listKuliner: data.map((place) => ({
        id: place.id.toString(),
        nama: place.nama,
        alamat: place.alamat,
        lat: place.lat,
        lon: place.lon,
      })),
    };

    res.json(formattedResponse);
  } catch (err) {
    console.error(`Error while searching culinary `, err.message);
    next(err);
  }
});

// Get data by user latitude and longitude from query parameters
router.get("/recommendations", async (req, res) => {
  const lat = parseFloat(req.query.lat);
  const lon = parseFloat(req.query.lon);

  if (!lat || !lon || isNaN(lat) || isNaN(lon)) {
    return res.status(400).json({ error: "Invalid user location data" });
  }

  try {
    const data = await Culinary.getUserRecommendation(lat, lon);

    const formattedResponse = {
      listKuliner: data.map((place) => ({
        id: place.id.toString(),
        nama: place.nama,
        alamat: place.alamat,
        lat: place.lat,
        lon: place.lon,
      })),
    };

    res.json(formattedResponse);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// router.post("/", async function (req, res, next) {
//   try {
//     res.json(await Culinary.create(req.body));
//   } catch (err) {
//     console.error(`Error while creating culinary`, err.message);
//     next(err);
//   }
// });

// router.put("/:id", async function (req, res, next) {
//   try {
//     res.json(await Culinary.update(req.params.id, req.body));
//   } catch (err) {
//     console.error(`Error while updating culinary`, err.message);
//     next(err);
//   }
// });

// router.delete("/:id", async function (req, res, next) {
//   try {
//     res.json(await Culinary.remove(req.params.id));
//   } catch (err) {
//     console.error(`Error while deleting culinary`, err.message);
//     next(err);
//   }
// });

module.exports = router;
