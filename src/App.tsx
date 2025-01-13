import { FormEvent, useState } from "react";
import { Button, TextField, Typography, Box, Container, Paper, LinearProgress } from "@mui/material";

export default function App() {
    const [url, setUrl] = useState<string>("");
    const [length, setLength] = useState(0);
    const [topic, setTopic] = useState("");
    const [progress, setProgress] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (!topic || !length) {
            alert("Please fill out both fields!");
            return;
        }

        console.log("fetching video");
        setIsLoading(true);
        setProgress(0);

        // Start simulating progress
        simulateProgress();

        fetch(`${import.meta.env.VITE_BACKEND_URL}/?topic=${topic}&length=${length}`, {
            method: "GET",
            headers: {
                Accept: "video/mp4",
            },
        })
            .then(async (res) => URL.createObjectURL(await res.blob()))
            .then((url) => {
                console.log(url);
                setUrl(url);
                setProgress(100); // Complete progress
                setIsLoading(false);
            });
    }

    // Simulates the progress bar advancing over time
    function simulateProgress() {
        let currentProgress = 0;

        const interval = setInterval(() => {
            if (currentProgress >= 99) {
                clearInterval(interval); // Stop at 99% if video is still loading
                return;
            }
            currentProgress += Math.random() * 1.5 / (length);
            setProgress(Math.min(currentProgress, 99)); // Prevent exceeding 99%
        }, 500);

        // Clear interval when the video is received or on unmount
        return () => clearInterval(interval);
    }

    return (
        <Container
            maxWidth="sm"
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100vh",
            }}
        >
            <Paper elevation={3} style={{ padding: "20px", width: "100%" }}>
                <Typography variant="h4" component="h1" gutterBottom align="center">
                    Video Player
                </Typography>
                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 2,
                    }}
                >
                    <TextField
                        id="topic"
                        label="Topic"
                        variant="outlined"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        required
                        fullWidth
                    />
                    <TextField
                        id="length"
                        label="Approximate Length (in minutes)"
                        variant="outlined"
                        type="number"
                        value={length}
                        onChange={(e) => setLength(parseFloat(e.target.value))}
                        required
                        inputProps={{ min: 1 }}
                        fullWidth
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{
                            backgroundColor: "black",
                            "&:hover": {
                                backgroundColor: "#333",
                            },
                        }}
                    >
                        Generate Video
                    </Button>
                </Box>
            </Paper>
            {isLoading && (
                <Box mt={4} width="100%">
                    <Typography variant="body1" align="center">
                        Fetching your video...
                    </Typography>
                    <LinearProgress
                        variant="determinate"
                        value={progress}
                        sx={{
                            height: 10,
                            borderRadius: 5,
                            mt: 2,
                            backgroundColor: "#e0e0e0", // Background (track) color
                            "& .MuiLinearProgress-bar": {
                                backgroundColor: "black", // Bar color
                            },
                        }}
                    />
                    {progress === 99 && (
                        <Typography variant="caption" display="block" align="center" mt={1}>
                            Almost there, processing might take a bit longer...
                        </Typography>
                    )}
                </Box>
            )}
            {url && (
                <Box mt={4} style={{ width: "100%", textAlign: "center" }}>
                    <video
                        src={url}
                        autoPlay
                        controls
                        preload="auto"
                        style={{
                            width: "100%",
                            maxHeight: "400px",
                            borderRadius: "10px",
                            boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                        }}
                        onError={(e) => console.error("Video error:", e)}
                    ></video>
                </Box>
            )}
        </Container>
    );
}
