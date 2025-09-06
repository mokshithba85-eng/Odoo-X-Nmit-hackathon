const express = require("express");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const Product = require("../models/Product");
const router = express.Router();

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Helper function to search products
async function searchProducts(query) {
  try {
    const products = await Product.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { category: { $regex: query, $options: 'i' } }
      ],
      isActive: true
    }).limit(5);
    return products;
  } catch (error) {
    console.error("Product search error:", error);
    return [];
  }
}

// Chatbot endpoint
router.post("/chat", async (req, res) => {
  try {
    const { message, conversationHistory = [] } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: "Gemini API key not configured" });
    }

    // Search for relevant products
    const relevantProducts = await searchProducts(message);
    
    // Get the generative model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Create context for the chatbot about ECOFINDS
    let systemPrompt = `You are an AI assistant for ECOFINDS, an eco-friendly marketplace for buying and selling sustainable products. 

Your role is to help users with:
- Finding eco-friendly products
- Understanding sustainability practices
- Providing product recommendations
- Answering questions about environmental impact
- Helping with buying/selling on the platform
- General eco-friendly lifestyle advice

Keep responses helpful, friendly, and focused on sustainability. If users ask about non-eco-related topics, gently guide them back to eco-friendly alternatives or explain how their question relates to sustainability.

Current conversation history: ${conversationHistory.map(msg => `${msg.role}: ${msg.content}`).join('\n')}

User's current message: ${message}`;

    // Add product information if relevant products are found
    if (relevantProducts.length > 0) {
      systemPrompt += `\n\nRELEVANT PRODUCTS FOUND IN OUR DATABASE:
${relevantProducts.map(p => `- ${p.title} (${p.category}) - ₹${p.price} - ${p.description}`).join('\n')}

Please suggest these specific products to the user and mention their prices. If the user seems interested in a product, encourage them to click "View Details" to see more information.`;
    } else {
      systemPrompt += `\n\nNo specific products found matching the user's query. If they're looking for something specific, let them know you'll notify them when similar products become available, and suggest they check our general categories or use the search function.`;
    }

    // Generate response
    const result = await model.generateContent(systemPrompt);
    const response = await result.response;
    const aiMessage = response.text();

    // Return the response with product suggestions
    res.json({
      success: true,
      message: aiMessage,
      products: relevantProducts,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error("Chatbot error:", error);
    res.status(500).json({ 
      error: "Failed to process message",
      details: error.message 
    });
  }
});

// Health check endpoint
router.get("/health", (req, res) => {
  res.json({ 
    status: "ok", 
    service: "chatbot",
    geminiConfigured: !!process.env.GEMINI_API_KEY
  });
});

module.exports = router;
