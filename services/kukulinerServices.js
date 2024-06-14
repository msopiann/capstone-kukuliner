const db = require("./databaseConnection");
const axios = require("axios");

async function getDistanceFromAPI(userLat, userLng, placeLat, placeLng) {
  const apiKey = process.env.GMAPS_API;
  const baseUrl = "https://maps.googleapis.com/maps/api/distancematrix/json?";
  const origin = `${userLat},${userLng}`;
  const destination = `${placeLat},${placeLng}`;
  const travelMode = "driving"; // Replace with desired travel mode

  const url = `${baseUrl}origins=${origin}&destinations=${destination}&travelMode=${travelMode}&key=${apiKey}`;

  console.log("Request URL:", url);

  console.log("User Location:", userLat, userLng);
  console.log("Place Location:", placeLat, placeLng); // Added log for place data

  try {
    const response = await axios.get(url);
    console.log(response.data); // Log API response data

    if (
      !response.data.destination_addresses.length ||
      !response.data.origin_addresses.length
    ) {
      console.error(
        "Missing origin or destination in API response:",
        response.data
      );
      // Handle missing address error (e.g., return default distance or throw a new error)
      return 0; // Or set a default value
    }

    // Check if elements exist and distance property is defined
    const distanceElement = response.data.rows[0].elements[0];
    if (
      !distanceElement ||
      !distanceElement.distance ||
      !distanceElement.distance.value
    ) {
      console.error(
        "Missing distance information in API response:",
        response.data
      );
      // Handle missing distance error (e.g., return default distance, retry the request, or throw a new error)
      return 0; // Or set a default value
    }

    const distance = distanceElement.distance.value;
    return distance;
  } catch (error) {
    console.error("Error fetching distance from API:", error);
    throw new Error(error);
  }
}

async function getUserRecommendation(userLatitude, userLongitude) {
  const rows = await db.query(`
    SELECT * FROM listKuliner;
  `);

  const recommendations = [];

  for (const place of rows) {
    if (!place.lat || !place.lon) {
      console.error(`Invalid coordinates for place ID: ${place.id}`);
      continue;
    }

    const distance = await getDistanceFromAPI(
      userLatitude,
      userLongitude,
      place.lat,
      place.lon
    );
    // Jarak maksimal 20 KM
    if (distance <= 20000) {
      recommendations.push({ ...place, distance });
    }
  }

  recommendations.sort((a, b) => a.distance - b.distance);
  return recommendations.slice(0, 10);
}

async function getAllData() {
  const rows = await db.query("SELECT * FROM listKuliner");
  return rows;
}

async function getSingleData(id) {
  const row = await db.query(`SELECT * FROM listKuliner WHERE id = ?`, [id]);

  // If data is empty, return an error or handle it as per your requirement
  if (!row) {
    throw new Error("Culinary not found");
  }

  return row;
}

async function getDataByName(name) {
  const rows = await db.query(`SELECT * FROM listKuliner WHERE nama LIKE ?`, [
    `%${name}%`,
  ]);

  // If data is empty, return an error or handle it as per your requirement
  if (!rows.length) {
    throw new Error("Culinary not found");
  }

  return rows;
}

// async function create(table) {
//   const result = await db.query(
//     `INSERT INTO listKuliner
//       (name, alamat, lat, lon)
//       VALUES
//       ('${table.name}', '${table.alamat}', ${table.lat}, ${table.lon})`
//   );

//   let message = "Error in creating culinary";

//   if (result.affectedRows) {
//     message = "Culinary created successfully";
//   }

//   return { message };
// }

// async function update(id, culinary) {
//   const result = await db.query(
//     `UPDATE listKuliner
//     SET name="${culinary.name}", alamat="${culinary.alamat}",
//     lat=${culinary.lat}, lon=${culinary.lon}
//     WHERE id=${id}`
//   );

//   let message = "Error in updating culinary";

//   if (result.affectedRows) {
//     message = "Culinary updated successfully";
//   }

//   return { message };
// }

// async function remove(id) {
//   const result = await db.query(`DELETE FROM listKuliner WHERE id=${id}`);

//   let message = "Error in deleting culinary";

//   if (result.affectedRows) {
//     message = "Culinary deleted successfully";
//   }

//   return { message };
// }

module.exports = {
  getUserRecommendation,
  getAllData,
  getSingleData,
  getDataByName,
  //   create,
  //   update,
  //   remove,
};
