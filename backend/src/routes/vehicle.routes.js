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

router.post("/:id/services", authenticateToken, async (req, res) => {
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

    const {
      serviceType,
      description,
      serviceDate,
      nextServiceDate,
      cost,
    } = req.body;

const serviceRecord = await prisma.serviceRecord.create({
  data: {
    serviceType,
    description,
    serviceDate: new Date(serviceDate),
    nextServiceDate: nextServiceDate
      ? new Date(nextServiceDate)
      : null,
    cost: Number(cost),
    vehicleId,
  },
});

    return res.status(201).json({
      message: "Service record added successfully",
      serviceRecord,
    });
  } catch (error) {
    console.error("Service record creation error:", error);

    return res.status(500).json({
      message: "Failed to add service record",
    });
  }
});

router.get("/:id/services", authenticateToken, async (req, res) => {
  try {
    const vehicleId = Number(req.params.id);

    // Check whether the vehicle belongs to the logged-in user
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

    const serviceRecords = await prisma.serviceRecord.findMany({
      where: {
        vehicleId,
      },
      orderBy: {
        serviceDate: "desc",
      },
    });

    return res.status(200).json({
      serviceRecords,
    });
  } catch (error) {
    console.error("Fetch service history error:", error);

    return res.status(500).json({
      message: "Failed to fetch service history",
    });
  }
});

router.put("/:id", authenticateToken, async (req, res) => {
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

    const {
      brand,
      model,
      year,
      mileage,
      fuelType,
    } = req.body;

    const updatedVehicle = await prisma.vehicle.update({
      where: {
        id: vehicleId,
      },
      data: {
        brand,
        model,
        year: Number(year),
        mileage: Number(mileage),
        fuelType,
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