import React from "react";
import {
  Container,
  Box,
  Typography,
  Divider,
  Link,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

function Success() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Add logout logic if needed
    navigate("/");
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
          Welcome
        </Typography>
      </Box>
      <Divider orientation="horizontal" variant="middle" flexItem />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: ".5rem",
        }}
      >
        <Typography variant="h5" color="initial">
          You have logged in successfully
        </Typography>
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
        <Button variant="contained" color="primary" onClick={handleLogout}>
          Logout
        </Button>
      </Box>
    </Container>
  );
}

export default Success;