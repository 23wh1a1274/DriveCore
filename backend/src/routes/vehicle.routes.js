const express = require("express");
const prisma = require("../config/prisma");
const authenticateToken = require("../middleware/auth.middleware");

const router = express.Router();

router.post("/", authenticateToken, async (req, res) => {
  try {
    const { brand, model, year, mileage, fuelType } = req.body;

    const vehicle = await prisma.vehicle.create({
      data: {
        brand,
        model,
        year: Number(year),
        mileage: Number(mileage),
        fuelType,
        userId: req.user.id,
      },
    });

    return res.status(201).json({
      message: "Vehicle added successfully",
      vehicle,
    });
  } catch (error) {
    console.error("Vehicle creation error:", error);

    return res.status(500).json({
      message: "Failed to add vehicle",
    });
  }
});

router.get("/", authenticateToken, async (req, res) => {
  try {
    const vehicles = await prisma.vehicle.findMany({
      where: {
        userId: req.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      vehicles,
    });
  } catch (error) {
    console.error("Fetch vehicles error:", error);

    return res.status(500).json({
      message: "Failed to fetch vehicles",
    });
  }
});

module.exports = router;