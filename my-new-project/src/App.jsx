import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import LoginPage from "../../my-new-project/src/Components/LoginPage";
import { Box } from "@mui/material";
import axios from "axios";
import Regester from "../../my-new-project/src/Components/Regester";
import Success from "../../my-new-project/src/Components/Success";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  let handleclik = async () => {
    let x = axios
      .get("http://localhost:3000/")
      .then((e) => {
        console.log(e.data);
        setdata(e.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  return (
    <>
      <BrowserRouter>
        <AppBar position="fixed" color="primary">
          <Typography variant="h6" textAlign={"center"} p={".5rem"}>
            E-Authentication System
          </Typography>
        </AppBar>
        <Box
          component="main"
          sx={{
            // pt: '64px', // Default Material-UI AppBar height (adjust if needed)
            height: "80vh",
            display: "flex",
            flexDirection: "column",
            placeContent: "center",
          }}
        >
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="regester" element={<Regester />} />
            <Route path="success" element={<Success />} />
          </Routes>
        </Box>
      </BrowserRouter>
    </>
  );
}

export default App;
