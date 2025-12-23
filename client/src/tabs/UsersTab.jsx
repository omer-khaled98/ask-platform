import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Box,
  Grid,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Switch,
  IconButton,
  Modal,
  CircularProgress,
  Alert,
} from "@mui/material";

import { Edit, Delete } from "@mui/icons-material";
import { motion } from "framer-motion";
import { api } from "../lib/api";

export default function UsersTab() {
  const [users, setUsers] = useState([]);

  // SUCCESS & ERROR MESSAGES
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // Loading indicators
  const [loadingCreate, setLoadingCreate] = useState(false);
  const [loadingUpdate, setLoadingUpdate] = useState(false);

  // Create form
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "staff",
  });

  // Edit Modal
  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    _id: "",
    name: "",
    email: "",
    role: "",
  });

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    const data = await api("auth/users", { auth: true });
    setUsers(data);
  }

  // =====================
  // CREATE USER
  // =====================
  async function createUser(e) {
    e.preventDefault();

    if (!form.name || !form.email || !form.password) {
      return setError("⚠️ جميع الحقول مطلوبة!");
    }

    setLoadingCreate(true);
    setError("");
    setSuccess("");

    try {
      await api("auth/users", {
        method: "POST",
        data: form,
        auth: true,
      });

      setSuccess("✔ تم إنشاء المستخدم بنجاح");
      setForm({ name: "", email: "", password: "", role: "staff" });
      loadUsers();

      setTimeout(() => setSuccess(""), 2000);
    } catch (e) {
      setError(e.message);
    }

    setLoadingCreate(false);
  }

  // =====================
  // TOGGLE USER
  // =====================
  async function toggleUser(id) {
    await api(`auth/users/${id}/toggle`, { method: "PATCH", auth: true });
    loadUsers();
  }

  // =====================
  // DELETE USER
  // =====================
  async function deleteUser(id) {
    if (!confirm("هل أنت متأكد من حذف هذا المستخدم؟")) return;
    await api(`auth/users/${id}`, { method: "DELETE", auth: true });
    loadUsers();
  }

  // =====================
  // UPDATE USER
  // =====================
  async function updateUser() {
    if (!editForm.name || !editForm.email) {
      return setError("⚠️ جميع الحقول مطلوبة!");
    }

    setLoadingUpdate(true);
    setError("");
    setSuccess("");

    try {
      await api(`auth/users/${editForm._id}`, {
        method: "PATCH",
        data: editForm,
        auth: true,
      });

      setSuccess("✔ تم تعديل المستخدم");
      setEditOpen(false);
      loadUsers();

      setTimeout(() => setSuccess(""), 2000);
    } catch (e) {
      setError(e.message);
    }

    setLoadingUpdate(false);
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
        👥 إدارة المستخدمين
      </Typography>

      {/* Success / Error Alerts */}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Grid container spacing={3}>
        {/* ===== CREATE USER FORM ===== */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                إضافة مستخدم جديد
              </Typography>

              <Box component="form" onSubmit={createUser} sx={{ display: "grid", gap: 2 }}>
                <TextField
                  label="الاسم"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
                <TextField
                  label="البريد الإلكتروني"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
                <TextField
                  label="كلمة المرور"
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />

                <Button
                  type="submit"
                  variant="contained"
                  disabled={loadingCreate}
                  sx={{ bgcolor: "#0f766e" }}
                >
                  {loadingCreate ? <CircularProgress size={22} sx={{ color: "#fff" }} /> : "إضافة"}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* ===== USERS TABLE ===== */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                جميع المستخدمين
              </Typography>

              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>الاسم</TableCell>
                    <TableCell>البريد</TableCell>
                    <TableCell>الدور</TableCell>
                    <TableCell>نشط؟</TableCell>
                    <TableCell>إجراءات</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {users.map((u) => (
                    <TableRow key={u._id} hover>
                      <TableCell>{u.name}</TableCell>
                      <TableCell>{u.email}</TableCell>
                      <TableCell>{u.role}</TableCell>

                      <TableCell>
                        <Switch
                          checked={u.active}
                          onChange={() => toggleUser(u._id)}
                        />
                      </TableCell>

                      <TableCell>
                        <IconButton
                          color="primary"
                          onClick={() => {
                            setEditForm(u);
                            setEditOpen(true);
                          }}
                        >
                          <Edit />
                        </IconButton>

                        <IconButton color="error" onClick={() => deleteUser(u._id)}>
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* ===== EDIT MODAL ===== */}
      <Modal open={editOpen} onClose={() => setEditOpen(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 420,
            bgcolor: "white",
            p: 3,
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" sx={{ mb: 2 }}>
            تعديل المستخدم
          </Typography>

          <TextField
            fullWidth
            label="الاسم"
            sx={{ mb: 2 }}
            value={editForm.name}
            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
          />

          <TextField
            fullWidth
            label="البريد"
            sx={{ mb: 2 }}
            value={editForm.email}
            onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
          />

          <Button
            variant="contained"
            fullWidth
            disabled={loadingUpdate}
            onClick={updateUser}
            sx={{ bgcolor: "#0f766e" }}
          >
            {loadingUpdate ? <CircularProgress size={22} sx={{ color: "#fff" }} /> : "حفظ التعديلات"}
          </Button>
        </Box>
      </Modal>
    </motion.div>
  );
}
