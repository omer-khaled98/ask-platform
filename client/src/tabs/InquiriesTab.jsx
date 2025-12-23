import React from "react";
import { api, fileUrl } from "../lib/api";
import {
  Card,
  CardContent,
  Typography,
  Chip,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Box,
  Button
} from "@mui/material";

import { motion } from "framer-motion";

function fmtStatus(s) {
  if (s === "new") return "جديدة";
  if (s === "replied") return "تم الرد";
  if (s === "released") return "مُفرج عنها";
  return s || "-";
}

export default function InquiriesTab({ inquiries = [], reload }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <Box sx={{ mb: 3, display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h5" fontWeight="bold">
          📥 جميع الاستفسارات
        </Typography>

        <Button
          variant="contained"
          sx={{ bgcolor: "#0f766e" }}
          onClick={reload}
        >
          تحديث
        </Button>
      </Box>

      <Card
        component={motion.div}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <CardContent>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>التاريخ</TableCell>
                <TableCell>الهاتف</TableCell>
                <TableCell>الرسالة</TableCell>
                <TableCell>نص الرد</TableCell>
                <TableCell>الحالة</TableCell>
                <TableCell>إثبات الرد</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {inquiries.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    لا توجد بيانات
                  </TableCell>
                </TableRow>
              )}

              {inquiries.map((q) => (
                <TableRow key={q._id}>
                  <TableCell>
                    {new Date(q.createdAt).toLocaleString("ar-EG")}
                  </TableCell>

                  <TableCell>{q.phone}</TableCell>

                  <TableCell sx={{ maxWidth: 250 }}>
                    {q.message}
                  </TableCell>

                  <TableCell sx={{ maxWidth: 250 }}>
                    {q.replyText ? q.replyText : "—"}
                  </TableCell>

                  <TableCell>
                    <Chip
                      label={fmtStatus(q.status)}
                      color={
                        q.status === "new"
                          ? "info"
                          : q.status === "replied"
                          ? "success"
                          : "warning"
                      }
                    />
                  </TableCell>

                  <TableCell>
                    {q.replyScreenshotUrl ? (
                      <a
                        href={fileUrl(q.replyScreenshotUrl)}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <img
                          src={fileUrl(q.replyScreenshotUrl)}
                          className="w-16 h-16 object-cover rounded cursor-pointer"
                        />
                      </a>
                    ) : (
                      "—"
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </motion.div>
  );
}
