
const express = require("express");
const cors = require("cors");
const path = require("path");
const multer = require("multer");
const fs = require("fs");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// ========================================
// 1. MIDDLEWARE
// ========================================

app.use(cors());
app.use(express.json({ limit: "2mb" }));

// Project folders
const projectFolder = path.join(__dirname, "..");
const videosFolder = path.join(projectFolder, "videos");

// Create videos folder automatically
if (!fs.existsSync(videosFolder)) {
    fs.mkdirSync(videosFolder, { recursive: true });
}

// Serve frontend and uploaded videos
app.use(express.static(projectFolder));

// ========================================
// 2. FAL.AI CONFIGURATION
// ========================================

const MODEL_ID = "fal-ai/wan-25-preview/text-to-video";

const generations = new Map();

async function getFal() {
    if (!process.env.FAL_KEY) {
        throw new Error(
            "FAL_KEY is missing. Please check your .env file."
        );
    }

    const { fal } = await import("@fal-ai/client");

    fal.config({
        credentials: process.env.FAL_KEY
    });

    return fal;
}

// ========================================
// 3. HOME / API TEST
// ========================================

app.get("/api", (req, res) => {
    res.json({
        success: true,
        message: "MotionAI Backend is running!",
        features: [
            "AI Video Generation",
            "Video Upload",
            "Video History"
        ]
    });
});

// ========================================
// 4. START AI VIDEO GENERATION
// ========================================

app.post("/api/generate", async (req, res) => {
    try {
        const {
            prompt,
            style,
            duration,
            aspectRatio
        } = req.body;

        // Validate prompt
        if (
            !prompt ||
            typeof prompt !== "string" ||
            !prompt.trim()
        ) {
            return res.status(400).json({
                success: false,
                message: "Please enter a valid video prompt."
            });
        }

        if (prompt.trim().length > 1000) {
            return res.status(400).json({
                success: false,
                message: "Prompt cannot exceed 1000 characters."
            });
        }

        const fal = await getFal();

        // Available styles
        const styleDescriptions = {
            cinematic:
                "Cinematic film look, dramatic lighting, professional camera movement.",

            realistic:
                "Photorealistic visuals, natural lighting, realistic motion.",

            anime:
                "Japanese anime art style, expressive animation, vibrant colors.",

            "3d-animation":
                "High-quality 3D animated film style, detailed 3D characters.",

            fantasy:
                "Magical fantasy world, atmospheric lighting, imaginative visuals."
        };

        const selectedStyle =
            styleDescriptions[style] ||
            styleDescriptions.cinematic;

        const selectedDuration =
            Number(duration) === 10 ? 10 : 5;

        const selectedRatio =
            ["16:9", "9:16", "1:1"].includes(aspectRatio)
                ? aspectRatio
                : "16:9";

        // Submit request to fal.ai
        const request = await fal.queue.submit(MODEL_ID, {
            input: {
                prompt:
                    `${prompt.trim()}. Visual style: ${selectedStyle}`,

                duration: String(selectedDuration),

                aspect_ratio: selectedRatio,

                resolution: "720p",

                enable_prompt_expansion: true
            }
        });

        // Create local generation ID
        const generationId =
            Date.now().toString() +
            Math.random().toString(36).substring(2, 8);

        const generation = {
            id: generationId,
            prompt: prompt.trim(),
            style: style || "cinematic",
            duration: selectedDuration,
            aspectRatio: selectedRatio,

            requestId: request.request_id,

            status: "queued",
            progress: 5,

            videoUrl: null,
            error: null,

            createdAt: new Date().toISOString()
        };

        generations.set(generationId, generation);

        res.status(202).json({
            success: true,
            message: "AI video generation submitted!",
            generationId,
            status: "queued"
        });

    } catch (error) {
        console.error(
            "Generation submission error:",
            error
        );

        const errorMessage =
            error.body?.detail ||
            error.message ||
            "Unable to start AI generation.";

        const isBalanceError =
            error.status === 403 &&
            /balance|locked|credits/i.test(errorMessage);

        res.status(isBalanceError ? 402 : 500).json({
            success: false,
            code: isBalanceError
                ? "INSUFFICIENT_CREDITS"
                : "GENERATION_ERROR",

            message: isBalanceError
                ? "Your fal.ai API balance is exhausted. Use the free sandbox and upload your MP4 video into MotionAI."
                : errorMessage
        });
    }
});

// ========================================
// 5. CHECK AI VIDEO GENERATION STATUS
// ========================================

app.get("/api/generate/:id", async (req, res) => {
    const generation = generations.get(req.params.id);

    if (!generation) {
        return res.status(404).json({
            success: false,
            message: "Generation not found."
        });
    }

    if (
        generation.status === "completed" ||
        generation.status === "failed"
    ) {
        return res.json({
            success: true,
            generation
        });
    }

    try {
        const fal = await getFal();

        const statusResult = await fal.queue.status(
            MODEL_ID,
            {
                requestId: generation.requestId,
                logs: false
            }
        );

        if (statusResult.status === "IN_QUEUE") {
            generation.status = "queued";
            generation.progress = 10;
        }

        else if (statusResult.status === "IN_PROGRESS") {
            generation.status = "processing";
            generation.progress = 50;
        }

        else if (statusResult.status === "COMPLETED") {
            const result = await fal.queue.result(
                MODEL_ID,
                {
                    requestId: generation.requestId
                }
            );

            const videoUrl = result.data?.video?.url;

            if (!videoUrl) {
                throw new Error(
                    "AI completed but no video URL was returned."
                );
            }

            generation.status = "completed";
            generation.progress = 100;
            generation.videoUrl = videoUrl;
            generation.seed = result.data.seed;

            generation.actualPrompt =
                result.data.actual_prompt ||
                generation.prompt;
        }

        return res.json({
            success: true,
            generation
        });

    } catch (error) {
        console.error(
            "Generation status error:",
            error
        );

        // Keep generation active on temporary network errors.
        return res.status(503).json({
            success: false,
            message:
                "Unable to check generation status. Please retry.",
            retryable: true
        });
    }
});

// ========================================
// 6. MULTER VIDEO UPLOAD CONFIGURATION
// ========================================

const storage = multer.diskStorage({

    destination: (req, file, cb) => {
        cb(null, videosFolder);
    },

    filename: (req, file, cb) => {
        const safeName =
            file.originalname.replace(
                /[^a-zA-Z0-9._-]/g,
                "_"
            );

        cb(
            null,
            `${Date.now()}-${safeName}`
        );
    }
});

const upload = multer({

    storage,

    limits: {
        fileSize: 100 * 1024 * 1024
    },

    fileFilter: (req, file, cb) => {

        const extension =
            path.extname(file.originalname).toLowerCase();

        const isMp4 =
            extension === ".mp4" &&
            (
                file.mimetype === "video/mp4" ||
                file.mimetype === "application/octet-stream"
            );

        if (!isMp4) {
            return cb(
                new Error("Only MP4 video files are allowed.")
            );
        }

        cb(null, true);
    }
});

// ========================================
// 7. UPLOAD FREE SANDBOX VIDEO
// ========================================

app.post("/api/videos/upload", (req, res) => {

    upload.single("video")(req, res, (error) => {

        if (error) {
            const message =
                error.code === "LIMIT_FILE_SIZE"
                    ? "Video must be smaller than 100 MB."
                    : error.message;

            return res.status(400).json({
                success: false,
                message
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

                size: req.file.size,

                uploadedAt: new Date().toISOString()
            }
        });
    });
});

// ========================================
// 8. GET ALL UPLOADED VIDEOS
// ========================================

app.get("/api/videos", (req, res) => {

    try {

        const files = fs.readdirSync(videosFolder);

        const videos = files

            .filter(file =>
                file.toLowerCase().endsWith(".mp4")
            )

            .map(file => {

                const filePath =
                    path.join(videosFolder, file);

                const stats =
                    fs.statSync(filePath);

                return {
                    filename: file,

                    url: `/videos/${encodeURIComponent(file)}`,

                    size: stats.size,

                    uploadedAt: stats.birthtime.toISOString()
                };
            })

            .sort((a, b) =>
                new Date(b.uploadedAt) -
                new Date(a.uploadedAt)
            );

        res.json({
            success: true,
            total: videos.length,
            videos
        });

    } catch (error) {

        console.error("Video history error:", error);

        res.status(500).json({
            success: false,
            message: "Unable to load video history."
        });
    }
});

// ========================================
// 9. DELETE UPLOADED VIDEO
// ========================================

app.delete("/api/videos/:filename", (req, res) => {

    const filename = path.basename(req.params.filename);

    if (!filename.toLowerCase().endsWith(".mp4")) {
        return res.status(400).json({
            success: false,
            message: "Invalid video filename."
        });
    }

    const filePath = path.join(videosFolder, filename);

    if (!fs.existsSync(filePath)) {
        return res.status(404).json({
            success: false,
            message: "Video not found."
        });
    }

    try {

        fs.unlinkSync(filePath);

        res.json({
            success: true,
            message: "Video deleted successfully."
        });

    } catch (error) {

        console.error("Video delete error:", error);

        res.status(500).json({
            success: false,
            message: "Unable to delete video."
        });
    }
});

// ========================================
// 10. GLOBAL ERROR HANDLER
// ========================================

app.use((error, req, res, next) => {

    console.error("Server error:", error);

    res.status(500).json({
        success: false,
        message: "Internal server error."
    });
});

// ========================================
// 11. START SERVER
// ========================================

app.listen(PORT, () => {

    console.log("--------------------------------");
    console.log("MotionAI Backend Started!");
    console.log(`Server: http://localhost:${PORT}`);
    console.log(`Frontend: http://localhost:${PORT}`);
    console.log(`Video storage: ${videosFolder}`);
    console.log("--------------------------------");

});

// ========================================
// FREE AI VIDEO IMPORT
// ========================================

const freeImportContainer = document.createElement("section");

freeImportContainer.style.cssText = `
    margin: 25px 0;
    padding: 22px;
    background: #171725;
    border: 1px solid #34344a;
    border-radius: 14px;
    color: white;
`;

freeImportContainer.innerHTML = `
    <h3>Free AI Video Generator</h3>

    <p>
        Generate a video using the free fal.ai sandbox,
        download the MP4, and import it into MotionAI.
    </p>

    <button id="open-free-generator">
        Open Free AI Generator
    </button>

    <div style="margin-top: 18px;">
        <label for="free-video-upload">
            Import your generated MP4 video
        </label>

        <br><br>

        <input
            type="file"
            id="free-video-upload"
            accept=".mp4,video/mp4"
        >

        <button id="upload-free-video">
            Upload Video
        </button>
    </div>

    <p id="free-upload-status"></p>
`;

const previewSection =
    document.querySelector("#video-player")?.parentElement ||
    document.querySelector("#generator-form");

if (previewSection) {
    previewSection.appendChild(freeImportContainer);
}

// Open fal.ai free sandbox
document
    .getElementById("open-free-generator")
    .addEventListener("click", () => {

        window.open(
            "https://fal.ai/wan-video-free",
            "_blank",
            "noopener,noreferrer"
        );
    });

// Upload downloaded MP4
document
    .getElementById("upload-free-video")
    .addEventListener("click", async () => {

        const fileInput =
            document.getElementById("free-video-upload");

        const status =
            document.getElementById("free-upload-status");

        const file = fileInput.files[0];

        if (!file) {
            status.textContent = "Please select an MP4 video.";
            return;
        }

        if (!file.name.toLowerCase().endsWith(".mp4")) {
            status.textContent = "Only MP4 files are supported.";
            return;
        }

        if (file.size > 100 * 1024 * 1024) {
            status.textContent = "Maximum video size is 100 MB.";
            return;
        }

        const formData = new FormData();

        formData.append("video", file);

        status.textContent = "Uploading video...";

        try {
            const response = await fetch(
                `${API_URL}/videos/upload`,
                {
                    method: "POST",
                    body: formData
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Video upload failed."
                );
            }

            const videoUrl =
                data.video.url.startsWith("http")
                    ? data.video.url
                    : `${window.location.origin}${data.video.url}`;

            status.textContent = "Video uploaded successfully!";

            // Display uploaded video in existing preview
            displayGeneratedVideo(videoUrl, file.name);

            fileInput.value = "";

        } catch (error) {
            console.error("Video upload error:", error);

            status.textContent = error.message;
        }
    });
