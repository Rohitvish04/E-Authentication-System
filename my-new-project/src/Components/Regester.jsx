import React, { useState } from "react";
import {
  TextField,
  Container,
  Box,
  Button,
  Typography,
  Divider,
} from "@mui/material";
import { Link } from "react-router-dom";
import axios from "axios";

function Regester() {
  const [email, setEmail] = useState("");
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [error, setError] = useState("");
  const [isRegistered, setIsRegistered] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3000/register", {
        email,
      });
      setQrCodeUrl(response.data.qrCodeUrl);
      setIsRegistered(true);
      setError("");
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed");
      setIsRegistered(false);
    }
  };

  return (
    <Container
      maxWidth="lg"
      sx={{
        border: ".5rem solid #1976d2",
        width: { xs: "400px", sm: "450px", md: "500px" },
        padding: "1rem",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: "20px",
        gap: "1rem",
      }}
    >
      <Box
        border={"4px solid #1976d2"}
        borderRadius={"10px"}
        padding={".2rem 1rem"}
      >
        <Typography variant="h5" textAlign={"center"} color="initial">
          Register
        </Typography>
      </Box>
      <Divider orientation="horizontal" variant="middle" flexItem />
      <Box
        component="form"
        onSubmit={handleRegister}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: ".5rem",
          width: "100%",
        }}
      >
        <TextField
          fullWidth
          label="Email"
          type="email"
          variant="filled"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Button type="submit" variant="outlined" color="primary">
          Register
        </Button>
      </Box>
      
      {error && (
        <Typography color="error" textAlign="center">
          {error}
        </Typography>
      )}
      
      {isRegistered && qrCodeUrl && (
        <Box
          component={"img"}
          sx={{ aspectRatio: "1", height: "200px" }}
          src={qrCodeUrl}
          alt="QR Code"
        />
      )}

      <Divider orientation="horizontal" variant="middle" flexItem />
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: ".5rem",
        }}
      >
        <Link to={"/"}>
          Already have an account? Login
        </Link>
      </Box>
    </Container>
  );
}

export default Regester;