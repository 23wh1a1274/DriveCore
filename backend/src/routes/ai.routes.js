const express = require("express");
const { Mistral } = require("@mistralai/mistralai");

const prisma = require("../config/prisma");
const authenticateToken = require("../middleware/auth.middleware");

const router = express.Router();

const mistral = new Mistral({
  apiKey: process.env.MISTRAL_API_KEY,
});

router.post("/chat", authenticateToken, async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        message: "Message is required",
      });
    }

    // Get current inventory
    const vehicles = await prisma.vehicle.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    const inventoryData = vehicles.map((vehicle) => ({
      id: vehicle.id,
      make: vehicle.make,
      model: vehicle.model,
      category: vehicle.category,
      price: vehicle.price,
      quantity: vehicle.quantity,
    }));

    const systemPrompt = `
You are DriveCore AI, an intelligent assistant for a car dealership inventory management system.

Your job is to answer questions about the dealership's vehicle inventory.

You have access to the following current inventory:

${JSON.stringify(inventoryData, null, 2)}



Rules:
- Answer only using the provided inventory data when the user asks about vehicles or inventory.
- Do not invent vehicles, prices, quantities, or other inventory information.
- Be concise and professional.
- If the requested information is not available, clearly say so.
- You can analyze stock levels, prices, categories, makes, models, and quantities.
- Do not claim to perform actions such as deleting, purchasing, or modifying vehicles.
`;

    const response = await mistral.chat.complete({
      model: "mistral-small-latest",
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: message,
        },
      ],
      temperature: 0.3,
    });

    const reply = response.choices[0]?.message?.content;

    return res.status(200).json({
      reply: reply || "Sorry, I could not generate a response.",
    });
  } catch (error) {
    console.error("AI chat error:", error);

    return res.status(500).json({
      message: "Failed to process AI request",
    });
  }
});

module.exports = router;