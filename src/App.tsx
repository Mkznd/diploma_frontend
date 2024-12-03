import { FormEvent, useState } from "react";
import { Button, TextField, Typography, Box, Container, Paper } from "@mui/material";

export default function App() {
    const [url, setUrl] = useState<string>("");
    const [length, setLength] = useState("");
    const [topic, setTopic] = useState("");

    function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (!topic || !length) {
            alert("Please fill out both fields!");
            return;
        }

        console.log("fetching video");
        fetch(`http://localhost:8000/?topic=${topic}&length=${length}`, {
            method: "GET",
            headers: {
                Accept: "video/mp4",
            },
        })
            .then(async (res) => URL.createObjectURL(await res.blob()))
            .then((url) => {
                console.log(url);
                setUrl(url);
            });
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
                        onChange={(e) => setLength(e.target.value)}
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
