const express = require("express");
const router = express.Router();
const Culinary = require("../services/kukulinerServices");

router.get("/", async function (req, res, next) {
  try {
    const data = await Culinary.getMultiple(req.query);
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

router.post("/recommendations", async (req, res) => {
  const { latitude, longitude } = req.body;

  if (!latitude || !longitude) {
    return res
      .status(400)
      .json({ error: "Latitude and Longitude are required" });
  }

  try {
    const recommendations = await Culinary.getUserRecommendation(
      latitude,
      longitude
    );
    const formattedResponse = {
      listKuliner: recommendations.map((place) => ({
        id: place.id.toString(),
        nama: place.nama,
        alamat: place.alamat,
        lat: place.lat,
        lon: place.lon,
        distance: place.distance,
      })),
    };

    res.json(formattedResponse);
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/:id", async function (req, res, next) {
  try {
    const id = req.params.id;
    const data = await Culinary.getSingle(id);

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

router.post("/", async function (req, res, next) {
  try {
    res.json(await Culinary.create(req.body));
  } catch (err) {
    console.error(`Error while creating culinary`, err.message);
    next(err);
  }
});

router.put("/:id", async function (req, res, next) {
  try {
    res.json(await Culinary.update(req.params.id, req.body));
  } catch (err) {
    console.error(`Error while updating culinary`, err.message);
    next(err);
  }
});

router.delete("/:id", async function (req, res, next) {
  try {
    res.json(await Culinary.remove(req.params.id));
  } catch (err) {
    console.error(`Error while deleting culinary`, err.message);
    next(err);
  }
});

module.exports = router;
