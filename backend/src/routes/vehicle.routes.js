const express = require("express");
const prisma = require("../config/prisma");
const authenticateToken = require("../middleware/auth.middleware");

const router = express.Router();

router.post("/", authenticateToken, async (req, res) => {
  try {
    const {
      make,
      model,
      category,
      price,
      quantity,
    } = req.body;

    const vehicle = await prisma.vehicle.create({
      data: {
        make,
        model,
        category,
        price: Number(price),
        quantity: Number(quantity),
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

router.get("/search", authenticateToken, async (req, res) => {
  try {
    const { make, model, category, minPrice, maxPrice } = req.query;

    const where = {};

    if (make) {
      where.make = {
        equals: make,
        mode: "insensitive",
      };
    }

    if (model) {
      where.model = {
        contains: model,
        mode: "insensitive",
      };
    }

    if (category) {
      where.category = {
        equals: category,
        mode: "insensitive",
      };
    }

    if (minPrice || maxPrice) {
      where.price = {};

      if (minPrice) {
        where.price.gte = Number(minPrice);
      }

      if (maxPrice) {
        where.price.lte = Number(maxPrice);
      }
    }

    const vehicles = await prisma.vehicle.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      vehicles,
    });
  } catch (error) {
    console.error("Vehicle search error:", error);

    return res.status(500).json({
      message: "Failed to search vehicles",
    });
  }
});

router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const vehicleId = Number(req.params.id);

    const vehicle = await prisma.vehicle.findFirst({
      where: {
        id: vehicleId,
        userId: req.user.id,
      },
    });

    if (!vehicle) {
      return res.status(404).json({
        message: "Vehicle not found",
      });
    }

    return res.status(200).json({
      vehicle,
    });
  } catch (error) {
    console.error("Fetch vehicle error:", error);

    return res.status(500).json({
      message: "Failed to fetch vehicle",
    });
  }
});

router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const vehicleId = Number(req.params.id);

    const vehicle = await prisma.vehicle.findFirst({
      where: {
        id: vehicleId,
        userId: req.user.id,
      },
    });

    if (!vehicle) {
      return res.status(404).json({
        message: "Vehicle not found",
      });
    }

    const {
      make,
      model,
      category,
      price,
      quantity,
    } = req.body;

    const updatedVehicle = await prisma.vehicle.update({
      where: {
        id: vehicleId,
      },
      data: {
        make,
        model,
        category,
        price: Number(price),
        quantity: Number(quantity),
      },
    });

    return res.status(200).json({
      message: "Vehicle updated successfully",
      vehicle: updatedVehicle,
    });
  } catch (error) {
    console.error("Vehicle update error:", error);

    return res.status(500).json({
      message: "Failed to update vehicle",
    });
  }
});

router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const vehicleId = Number(req.params.id);

    // Check that the vehicle belongs to the logged-in user
    const vehicle = await prisma.vehicle.findFirst({
      where: {
        id: vehicleId,
        userId: req.user.id,
      },
    });

    if (!vehicle) {
      return res.status(404).json({
        message: "Vehicle not found",
      });
    }

    await prisma.vehicle.delete({
      where: {
        id: vehicleId,
      },
    });

    return res.status(200).json({
      message: "Vehicle deleted successfully",
    });
  } catch (error) {
    console.error("Vehicle deletion error:", error);

    return res.status(500).json({
      message: "Failed to delete vehicle",
    });
  }
});


module.exports = router;