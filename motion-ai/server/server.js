
const express = require("express");
const cors = require("cors");
const path = require("path");
const multer = require("multer");
const fs = require("fs");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "..")));

const MODEL_ID = "fal-ai/wan-25-preview/text-to-video";
const generations = new Map();

// Connect to fal.ai using the private server-side API key.
async function getFal() {
  if (!process.env.FAL_KEY) {
    throw new Error("FAL_KEY is missing. Check your .env file.");
  }

  const { fal } = await import("@fal-ai/client");
  fal.config({ credentials: process.env.FAL_KEY });
  return fal;
}

app.get("/api", (req, res) => {
  res.json({
    success: true,
    message: "MotionAI real AI backend is running!"
  });
});

// Start a real AI video generation request.
app.post("/api/generate", async (req, res) => {
  try {
    const { prompt, style, duration, aspectRatio } = req.body;

    if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid video prompt."
      });
    }

    const fal = await getFal();

    const styleDescriptions = {
      cinematic: "Cinematic film look, dramatic lighting, professional camera movement.",
      realistic: "Photorealistic visuals, natural lighting, realistic motion.",
      anime: "Japanese anime art style, expressive animation, vibrant colors.",
      "3d-animation": "High-quality 3D animated film style, detailed 3D characters.",
      fantasy: "Magical fantasy world, atmospheric lighting, imaginative visuals."
    };

    const selectedStyle = styleDescriptions[style] || styleDescriptions.cinematic;

    const request = await fal.queue.submit(MODEL_ID, {
      input: {
        prompt: `${prompt.trim()}. Visual style: ${selectedStyle}`,
        duration: String(Number(duration) === 10 ? 10 : 5),
        aspect_ratio: ["16:9", "9:16", "1:1"].includes(aspectRatio)
          ? aspectRatio
          : "16:9",
        resolution: "720p",
        enable_prompt_expansion: true
      }
    });

    const generationId = Date.now().toString() +
      Math.random().toString(36).substring(2, 8);

    generations.set(generationId, {
      id: generationId,
      prompt: prompt.trim(),
      style: style || "cinematic",
      duration: Number(duration) === 10 ? 10 : 5,
      aspectRatio: aspectRatio || "16:9",
      requestId: request.request_id,
      status: "queued",
      progress: 5,
      videoUrl: null,
      error: null,
      createdAt: new Date()
    });

    res.status(202).json({
      success: true,
      message: "Your AI video generation has been submitted!",
      generationId,
      status: "queued"
    });

  } catch (error) {
    console.error("Generation submission error:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Unable to submit video generation."
    });
  }
});

// Check the real generation status.
app.get("/api/generate/:id", async (req, res) => {
  try {
    const generation = generations.get(req.params.id);

    if (!generation) {
      return res.status(404).json({
        success: false,
        message: "Generation not found."
      });
    }

    // Don't request the result again after it has been received.
    if (generation.status === "completed" || generation.status === "failed") {
      return res.json({ success: true, generation });
    }

    const fal = await getFal();

    const statusResult = await fal.queue.status(MODEL_ID, {
      requestId: generation.requestId,
      logs: false
    });

    if (statusResult.status === "IN_QUEUE") {
      generation.status = "queued";
      generation.progress = 10;
    } else if (statusResult.status === "IN_PROGRESS") {
      generation.status = "processing";
      generation.progress = 50;
    } else if (statusResult.status === "COMPLETED") {
      const result = await fal.queue.result(MODEL_ID, {
        requestId: generation.requestId
      });

      const videoUrl = result.data?.video?.url;

      if (!videoUrl) {
        throw new Error("The AI service completed but did not return a video URL.");
      }

      generation.status = "completed";
      generation.progress = 100;
      generation.videoUrl = videoUrl;
      generation.seed = result.data.seed;
      generation.actualPrompt = result.data.actual_prompt || generation.prompt;
    }

    res.json({
      success: true,
      generation
    });

  } catch (error) {
    console.error("Generation status error:", error);

    const generation = generations.get(req.params.id);

    if (generation) {
      generation.status = "failed";
      generation.error = error.message;
    }

    res.status(500).json({
      success: false,
      message: error.message || "Unable to check generation status."
    });
  }
});
// Create videos folder if it does not exist
const videosFolder = path.join(__dirname, "..", "videos");

if (!fs.existsSync(videosFolder)) {
    fs.mkdirSync(videosFolder, { recursive: true });
}

// Configure video uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, videosFolder);
    },

    filename: (req, file, cb) => {
        const filename =
            Date.now() + "-" +
            file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_");

        cb(null, filename);
    }
});

const upload = multer({
    storage,
    limits: {
        fileSize: 100 * 1024 * 1024
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype !== "video/mp4") {
            return cb(new Error("Only MP4 videos are allowed."));
        }

        cb(null, true);
    }
});
// Upload a video generated through the free sandbox
app.post("/api/videos/upload", (req, res) => {
    upload.single("video")(req, res, (error) => {
        if (error) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Please select an MP4 video."
            });
        }

        res.status(201).json({
            success: true,
            message: "Video uploaded successfully!",
            video: {
                filename: req.file.filename,
                originalName: req.file.originalname,
                url: `/videos/${req.file.filename}`,
                size: req.file.size
            }
        });
    });
});

// List uploaded videos
app.get("/api/videos", (req, res) => {
    try {
        const files = fs.readdirSync(videosFolder)
            .filter(file => file.toLowerCase().endsWith(".mp4"))
            .map(file => ({
                filename: file,
                url: `/videos/${file}`
            }));

        res.json({
            success: true,
            videos: files
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Unable to load videos."
        });
    }
});

app.listen(PORT, () => {
  console.log("--------------------------------");
  console.log("MotionAI Real AI Backend Started!");
  console.log(`Server: http://localhost:${PORT}`);
  console.log(`Video storage: ${videosFolder}`);
  console.log("--------------------------------");
});
