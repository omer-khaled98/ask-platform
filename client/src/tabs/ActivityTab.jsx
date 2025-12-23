import React, { useEffect, useState } from "react";
import { api } from "../lib/api";
import {
  Card,
  CardContent,
  Typography,
  Table,
  TableRow,
  TableCell,
  TableHead,
  TableBody,
  Grid,
} from "@mui/material";

import { motion } from "framer-motion";

// Chart.js
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function ActivityTab() {
  const [top, setTop] = useState([]);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const data = await api("inquiries/reports/top-handlers", { auth: true });
    setTop(data);
  }

  const labels = top.map((x) => x.name);
  const counts = top.map((x) => x.replies);

  const chartData = {
    labels,
    datasets: [
      {
        label: "عدد الردود",
        data: counts,
        backgroundColor: "#0d9488",
      },
    ],
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
        📈 نشاط الموظفين
      </Typography>

      <Grid container spacing={3}>
        {/* ======== الرسم البياني ======== */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                مخطط نشاط الموظفين
              </Typography>

              {top.length > 0 ? (
                <Bar data={chartData} />
              ) : (
                <Typography color="text.secondary">
                  لا توجد بيانات لعرضها حالياً
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* ======== الجدول ======== */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                أفضل الموظفين
              </Typography>

              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>الاسم</TableCell>
                    <TableCell>البريد</TableCell>
                    <TableCell>عدد الردود</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {top.map((p) => (
                    <TableRow key={p._id}>
                      <TableCell>{p.name}</TableCell>
                      <TableCell>{p.email}</TableCell>
                      <TableCell>{p.replies}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </motion.div>
  );
}
