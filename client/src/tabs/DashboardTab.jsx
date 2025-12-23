import React, { useEffect, useState } from "react";
import { api } from "../lib/api";
import "../lib/chart";

import {
  Card,
  CardContent,
  Typography,
  Box,
  Grid,
  Paper,
} from "@mui/material";

import { Bar } from "react-chartjs-2";
import { motion } from "framer-motion";

// Helper
function fmtStatus(s) {
  if (s === "new") return "جديدة";
  if (s === "replied") return "تم الرد";
  if (s === "released") return "مُفرج عنها";
  return s;
}

export default function DashboardTab() {
  const [reports, setReports] = useState({
    countsByStatus: [],
    perDay: [],
  });

  useEffect(() => {
    loadReports();
  }, []);

  async function loadReports() {
    const data = await api("inquiries/reports/summary", { auth: true });
    setReports(data);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Typography variant="h5" sx={{ mb: 3, fontWeight: "bold" }}>
        📊 إحصائيات النظام
      </Typography>

      <Grid container spacing={3}>
        {/* ===== STATUS CHART ===== */}
        <Grid item xs={12} md={6}>
          <Card
            component={motion.div}
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            sx={{ borderRadius: "14px" }}
          >
            <CardContent>
              <Typography variant="h6" textAlign="center" sx={{ mb: 2 }}>
                عدد الاستفسارات حسب الحالة
              </Typography>

              <Box sx={{ height: 320 }}>
                <Bar
                  data={{
                    labels: reports.countsByStatus.map((s) =>
                      fmtStatus(s._id)
                    ),
                    datasets: [
                      {
                        label: "عدد الاستفسارات",
                        data: reports.countsByStatus.map((s) => s.count),
                        backgroundColor: ["#0ea5e9", "#10b981", "#f43f5e"],
                        borderRadius: 6,
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                  }}
                  redraw
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* ===== DAILY CHART ===== */}
        <Grid item xs={12} md={6}>
          <Card
            component={motion.div}
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            sx={{ borderRadius: "14px" }}
          >
            <CardContent>
              <Typography variant="h6" textAlign="center" sx={{ mb: 2 }}>
                عدد الاستفسارات اليومية
              </Typography>

              <Box sx={{ height: 320 }}>
                <Bar
                  data={{
                    labels: reports.perDay.map((x) => x._id),
                    datasets: [
                      {
                        label: "عدد الاستفسارات",
                        data: reports.perDay.map((x) => x.count),
                        backgroundColor: "#0ea5e9",
                        borderRadius: 6,
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                  }}
                  redraw
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </motion.div>
  );
}
