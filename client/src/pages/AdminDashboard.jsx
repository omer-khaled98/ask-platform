import React, { useEffect, useState } from "react";
import { api } from "../lib/api";

// Layout & Tabs
import AppLayout from "../layout/AppLayout";
import DashboardTab from "../tabs/DashboardTab";
import UsersTab from "../tabs/UsersTab";
import InquiriesTab from "../tabs/InquiriesTab";
import ActivityTab from "../tabs/ActivityTab";

export default function AdminDashboard() {
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
    const data = await api("inquiries?status=released", { auth: true });
    setInquiries(data.items);
  }

  async function loadUsers() {
    const data = await api("auth/users", { auth: true });
    setUsers(data);
  }

  return (
    <AppLayout activeTab={activeTab} onChangeTab={setActiveTab}>
      
      {/* Dashboard */}
      {activeTab === 0 && (
        <DashboardTab reports={reports} />
      )}

      {/* Users */}
      {activeTab === 1 && (
        <UsersTab users={users} reload={loadUsers} />
      )}

      {/* Inquiries */}
      {activeTab === 2 && (
        <InquiriesTab inquiries={inquiries} reload={loadInquiries} />
      )}

      {/* Activity */}
      {activeTab === 3 && (
        <ActivityTab handlers={handlers} />
      )}

    </AppLayout>
  );
}
