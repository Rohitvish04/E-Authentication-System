import React, { useState } from "react";
import {
  TextField,
  Container,
  Box,
  Button,
  Typography,
  Divider,
  CircularProgress,
  Alert,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSendOtp = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.post(
        "http://localhost:3000/send-otp",
        { email },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setMessage(response.data.message || "OTP sent to your email");
      setOtpSent(true);
    } catch (err) {
      const errorMessage =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Failed to send OTP";
      setError(errorMessage);
      console.error("OTP send error:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp || otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }

    setLoading(true);
    setError("");
    try {
      console.log("Attempting to verify OTP:", otp); // Debug log
      
      const response = await axios.post(
        "http://localhost:3000/verify",
        {
          email,
          token: otp.toString() // Ensure string format
        },
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      );

      console.log("Verification response:", response.data); // Debug log
      
      setMessage("Authentication successful");
      setTimeout(() => navigate("/success"), 1000);
    } catch (err) {
      console.error("Full verification error:", err); // Debug log
      
      let errorMessage = "Verification failed";
      if (err.response?.data?.error === "Invalid OTP") {
        errorMessage = "The OTP you entered is invalid or expired";
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
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
          Login
        </Typography>
      </Box>
      <Divider orientation="horizontal" variant="middle" flexItem />

      {/* Email Input */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
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
          disabled={loading || otpSent}
        />
        <Button
          variant="outlined"
          color="primary"
          onClick={handleSendOtp}
          disabled={loading || !email || otpSent}
        >
          {loading && !otpSent ? (
            <CircularProgress size={24} />
          ) : (
            "Send OTP"
          )}
        </Button>
      </Box>

      {/* OTP Input (only shown after OTP is sent) */}
      {otpSent && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: ".5rem",
            width: "100%",
          }}
        >
          <TextField
            fullWidth
            label="Enter OTP"
            type="text"
            inputMode="numeric"
            variant="filled"
            value={otp}
            onChange={(e) => {
              // Only allow numbers and limit to 6 digits
              const value = e.target.value.replace(/\D/g, "").slice(0, 6);
              setOtp(value);
            }}
            disabled={loading}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleVerifyOtp}
            disabled={loading || otp.length !== 6}
          >
            {loading ? <CircularProgress size={24} /> : "Verify OTP"}
          </Button>
        </Box>
      )}

      {/* Status messages */}
      <Box sx={{ width: "100%" }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        {message && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {message}
          </Alert>
        )}
      </Box>

      <Divider orientation="horizontal" variant="middle" flexItem />
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: ".5rem",
        }}
      >
        <Link to={"/regester"}>Don't have an account? Register</Link>
      </Box>
    </Container>
  );
}

export default LoginPage;