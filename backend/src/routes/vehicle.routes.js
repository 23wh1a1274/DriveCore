const express = require("express");
const prisma = require("../config/prisma");
const authenticateToken = require("../middleware/auth.middleware");
const requireAdmin = require("../middleware/admin.middleware");

const router = express.Router();


// ==========================================
// ADD VEHICLE
// ==========================================

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


// ==========================================
// GET ALL VEHICLES
// ==========================================

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


// ==========================================
// SEARCH VEHICLES
// IMPORTANT: Keep this BEFORE /:id
// ==========================================

router.get("/search", authenticateToken, async (req, res) => {
  try {

    const {
      make,
      model,
      category,
      minPrice,
      maxPrice,
    } = req.query;

    const where = {};

    if (make) {
      where.make = {
        contains: make,
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


// ==========================================
// GET SINGLE VEHICLE
// ==========================================

router.get("/:id", authenticateToken, async (req, res) => {
  try {

    const vehicleId = Number(req.params.id);

    if (isNaN(vehicleId)) {
      return res.status(400).json({
        message: "Invalid vehicle ID",
      });
    }

    const vehicle = await prisma.vehicle.findUnique({
      where: {
        id: vehicleId,
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


// ==========================================
// UPDATE VEHICLE
// ==========================================

router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const vehicleId = Number(req.params.id);

    console.log("Updating vehicle ID:", vehicleId);
    console.log("Request body:", req.body);
    console.log("User:", req.user);

    if (isNaN(vehicleId)) {
      return res.status(400).json({
        message: "Invalid vehicle ID",
      });
    }

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
      error: error.message,
    });
  }
});


// ==========================================
// PURCHASE VEHICLE
// ==========================================

router.post("/:id/purchase", authenticateToken, async (req, res) => {
  try {

    const vehicleId = Number(req.params.id);

    const vehicle = await prisma.vehicle.findUnique({
      where: {
        id: vehicleId,
      },
    });

    if (!vehicle) {
      return res.status(404).json({
        message: "Vehicle not found",
      });
    }

    if (vehicle.quantity <= 0) {
      return res.status(400).json({
        message: "Vehicle is out of stock",
      });
    }

    const updatedVehicle = await prisma.vehicle.update({
      where: {
        id: vehicleId,
      },

      data: {
        quantity: {
          decrement: 1,
        },
      },
    });

    return res.status(200).json({
      message: "Vehicle purchased successfully",
      vehicle: updatedVehicle,
    });

  } catch (error) {

    console.error("Vehicle purchase error:", error);

    return res.status(500).json({
      message: "Failed to purchase vehicle",
    });
  }
});


// ==========================================
// RESTOCK VEHICLE - ADMIN ONLY
// ==========================================

router.post(
  "/:id/restock",
  authenticateToken,
  requireAdmin,

  async (req, res) => {
    try {

      const vehicleId = Number(req.params.id);
      const { quantity } = req.body;

      const vehicle = await prisma.vehicle.findUnique({
        where: {
          id: vehicleId,
        },
      });

      if (!vehicle) {
        return res.status(404).json({
          message: "Vehicle not found",
        });
      }

      const updatedVehicle = await prisma.vehicle.update({
        where: {
          id: vehicleId,
        },

        data: {
          quantity: {
            increment: Number(quantity),
          },
        },
      });

      return res.status(200).json({
        message: "Vehicle restocked successfully",
        vehicle: updatedVehicle,
      });

    } catch (error) {

      console.error("Vehicle restock error:", error);

      return res.status(500).json({
        message: "Failed to restock vehicle",
      });
    }
  }
);


// ==========================================
// DELETE VEHICLE - ADMIN ONLY
// ==========================================

router.delete(
  "/:id",
  authenticateToken,
  requireAdmin,

  async (req, res) => {
    try {

      const vehicleId = Number(req.params.id);

      const vehicle = await prisma.vehicle.findUnique({
        where: {
          id: vehicleId,
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
  }
);


module.exports = router;