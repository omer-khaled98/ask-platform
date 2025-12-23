import React, { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText
} from "@mui/material";

import {
  Dashboard,
  People,
  SupportAgent,
  Timeline,
  Logout
} from "@mui/icons-material";

import { motion } from "framer-motion";
import { api } from "../lib/api";

import DashboardTab from "../tabs/DashboardTab";
import UsersTab from "../tabs/UsersTab";
import InquiriesTab from "../tabs/InquiriesTab";
import ActivityTab from "../tabs/ActivityTab";

const drawerWidth = 240;

export default function AppLayout() {
  const [activeTab, setActiveTab] = useState(0);

  const [reports, setReports] = useState({ countsByStatus: [], perDay: [] });
  const [handlers, setHandlers] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    loadReports();
    loadHandlers();
    loadInquiries();
    loadUsers();
  }, []);

  async function loadReports() {
    const data = await api("inquiries/reports/summary", { auth: true });
    setReports(data);
  }

  async function loadHandlers() {
    const data = await api("inquiries/reports/top-handlers", { auth: true });
    setHandlers(data);
  }

  async function loadInquiries() {
    const data = await api("inquiries", { auth: true });
    setInquiries(data.items || []);
  }

  async function loadUsers() {
    const data = await api("auth/users", { auth: true });
    setUsers(data);
  }

  function logout() {
    localStorage.clear();
    window.location.href = "/admin/login";
  }

  const tabs = [
    { id: 0, label: "Dashboard", icon: <Dashboard /> },
    { id: 1, label: "Users", icon: <People /> },
    { id: 2, label: "Inquiries", icon: <SupportAgent /> },
    { id: 3, label: "Activity", icon: <Timeline /> }
  ];

  return (
    <Box sx={{ display: "flex", direction: "rtl" }}>

      {/* NAVBAR */}
      <AppBar
        position="fixed"
        sx={{
          width: `calc(100% - ${drawerWidth}px)`,
          ml: `${drawerWidth}px`,
          background: "linear-gradient(135deg, #0f766e, #6ee7b7)",
          boxShadow: 3
        }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h6" fontWeight="bold">
            لوحة التحكم
          </Typography>

          <ListItemButton
            onClick={logout}
            sx={{
              color: "#fff",
              borderRadius: "12px",
              px: 2,
              "&:hover": { background: "rgba(255,255,255,0.2)" }
            }}
          >
            <Logout sx={{ mr: 1 }} />
            تسجيل خروج
          </ListItemButton>
        </Toolbar>
      </AppBar>

      {/* SIDEBAR */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            background: "#0d9488",
            color: "white",
            boxSizing: "border-box"
          }
        }}
      >
        <Toolbar />
        <List>
          {tabs.map((tab) => (
            <motion.div
              key={tab.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25 }}
            >
              <ListItem disablePadding>
                <ListItemButton
                  onClick={() => setActiveTab(tab.id)}
                  sx={{
                    background:
                      activeTab === tab.id ? "rgba(255,255,255,0.25)" : "",
                    borderRadius: "12px",
                    mx: 1,
                    my: 1,
                    "&:hover": { background: "rgba(255,255,255,0.15)" }
                  }}
                >
                  <ListItemIcon sx={{ color: "#fff" }}>
                    {tab.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={tab.label}
                    primaryTypographyProps={{
                      fontWeight: activeTab === tab.id ? "bold" : "normal"
                    }}
                  />
                </ListItemButton>
              </ListItem>
            </motion.div>
          ))}
        </List>
      </Drawer>

      {/* CONTENT */}
      <Box
        component={motion.div}
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        sx={{
          flexGrow: 1,
          bgcolor: "#f0fdfa",
          p: 4,
          mt: 8,
          minHeight: "100vh",

          /* 🔥 أهم نقطة لحل مشكلتك */
          pl: `${drawerWidth}px`,  // ← ده اللي بيحل موضوع السايد بار 100%
          display: "flex",
          justifyContent: "center"
        }}
      >
        <Box sx={{ width: "100%", maxWidth: "1100px" }}>
          {activeTab === 0 && <DashboardTab reports={reports} />}
          {activeTab === 1 && <UsersTab users={users} reload={loadUsers} />}
          {activeTab === 2 && (
            <InquiriesTab inquiries={inquiries} reload={loadInquiries} />
          )}
          {activeTab === 3 && <ActivityTab handlers={handlers} />}
        </Box>
      </Box>
    </Box>
  );
}
