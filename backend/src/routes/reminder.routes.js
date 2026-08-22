const express = require("express");
const prisma = require("../config/prisma");
const authenticateToken = require("../middleware/auth.middleware");

const router = express.Router();

router.get("/", authenticateToken, async (req, res) => {
  try {
    const reminders = await prisma.serviceRecord.findMany({
      where: {
        nextServiceDate: {
          not: null,
        },
        vehicle: {
          userId: req.user.id,
        },
      },
      include: {
        vehicle: true,
      },
      orderBy: {
        nextServiceDate: "asc",
      },
    });

    return res.status(200).json({
      reminders,
    });
  } catch (error) {
    console.error("Fetch reminders error:", error);

    return res.status(500).json({
      message: "Failed to fetch reminders",
    });
  }
});

module.exports = router;