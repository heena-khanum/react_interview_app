import React, { useState, useEffect } from "react";
import { LuPlus } from "react-icons/lu";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import SummaryCard from "../../components/Cards/SummaryCard";
import CreateSessionForm from "./CreateSessionForm";
import Modal from "../../components/Modal";
import DeleteAlertContent from "../../components/DeleteAlertContent";

const CARD_BG = [
  { id: 1, bgcolor: "linear-gradient(135deg, #e6f8f3 0%, #f7fcfa 100%)" },
  { id: 2, bgcolor: "linear-gradient(135deg, #fef9e7 0%, #fffdf4 100%)" },
  { id: 3, bgcolor: "linear-gradient(135deg, #eaf7ff 0%, #f3fbff 100%)" },
];

const Dashboard = () => {
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [openDeleteAlert, setOpenDeleteAlert] = useState({ open: false, data: null });

  useEffect(() => {
    const storedSessions = JSON.parse(localStorage.getItem("sessions") || "[]");
    setSessions(storedSessions);
  }, []);

  const saveSessions = (newSessions) => {
    setSessions(newSessions);
    localStorage.setItem("sessions", JSON.stringify(newSessions));
  };

  const deleteSession = (sessionData) => {
    const updated = sessions.filter((s) => s.id !== sessionData.id);
    saveSessions(updated);
    setOpenDeleteAlert({ open: false, data: null });
  };

  const navigateToSession = (session) => {
    window.location.href = `/interview-prep/${session.id}`;
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto pt-4 pb-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-7 pt-1 pb-6 px-4 md:px-0">
          {sessions.map((session, index) => (
            <SummaryCard
              key={session.id}
              colors={CARD_BG[index % CARD_BG.length]}
              role={session.role}
              topicsToFocus={session.topicsToFocus}
              experience={session.experience}
              questions={session.questions.length}
              description={session.description}
              lastUpdated={new Date(session.id).toLocaleDateString()}
              onSelect={() => navigateToSession(session)}
              onDelete={() => setOpenDeleteAlert({ open: true, data: session })}
            />
          ))}
        </div>

        <button
          className="h-12 md:h-12 flex items-center justify-center gap-3 bg-linear-to-r from-[#FF9324] to-[#e99a4b] text-sm font-semibold text-white px-7 py-2.5 rounded-full hover:bg-black hover:text-white transition-colors cursor-pointer hover:shadow-2xl hover:shadow-orange-300 fixed bottom-10 md:bottom-20 right-10 md:right-20"
          onClick={() => setOpenCreateModal(true)}
        >
          <LuPlus className="text-2xl text-white" /> Add New
        </button>
      </div>

      <Modal isOpen={openCreateModal} onClose={() => setOpenCreateModal(false)} hideHeader>
        <CreateSessionForm />
      </Modal>

      <Modal
        isOpen={openDeleteAlert.open}
        onClose={() => setOpenDeleteAlert({ open: false, data: null })}
        title="Delete Alert"
      >
        <DeleteAlertContent
          content="Are you sure you want to delete this session detail?"
          onDelete={() => deleteSession(openDeleteAlert.data)}
        />
      </Modal>
    </DashboardLayout>
  );
};

export default Dashboard;
