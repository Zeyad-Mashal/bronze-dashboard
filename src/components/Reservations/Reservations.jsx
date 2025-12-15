import React, { useState, useEffect } from "react";
import {
  FiTrash2,
  FiX,
  FiAlertTriangle,
  FiUser,
  FiPhone,
  FiMail,
  FiMapPin,
  FiPackage,
} from "react-icons/fi";
import "./Reservations.css";
import GetAllReservations from "../../API/Reservations/GetAllReservations";
import GetReservation from "../../API/Reservations/GetReservation";
import DeleteReservation from "../../API/Reservations/DeleteReservation";

const Reservations = () => {
  const [allReservations, setAllReservations] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [reservationToDelete, setReservationToDelete] = useState(null);

  useEffect(() => {
    getAllReservations();
  }, []);

  const getAllReservations = () => {
    GetAllReservations(setAllReservations, setError, setLoading);
  };

  // Open detail modal
  const openDetailModal = async (reservation) => {
    setSelectedReservation(null);
    setIsDetailModalOpen(true);
    setLoading(true);
    await GetReservation(
      reservation._id,
      setSelectedReservation,
      setError,
      setLoading
    );
  };

  // Close detail modal
  const closeDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedReservation(null);
  };

  // Open delete confirmation modal
  const openDeleteModal = (reservation) => {
    setReservationToDelete(reservation);
    setIsDeleteModalOpen(true);
  };

  // Close delete modal
  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setReservationToDelete(null);
  };

  // Delete reservation
  const handleDeleteReservation = () => {
    if (reservationToDelete) {
      DeleteReservation(
        reservationToDelete._id,
        setError,
        setLoading,
        setIsDeleteModalOpen,
        getAllReservations
      );
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="reservations-container">
      <div className="reservations-header">
        <h1 className="reservations-title">الحجوزات</h1>
        <p className="reservations-subtitle">
          إجمالي الحجوزات: {allReservations.length}
        </p>
      </div>

      {/* Reservations Grid */}
      {loading && allReservations.length === 0 ? (
        <div className="empty-state">
          <p>جاري التحميل...</p>
        </div>
      ) : allReservations.length === 0 ? (
        <div className="empty-state">
          <p>لا توجد حجوزات حتى الآن</p>
        </div>
      ) : (
        <div className="reservations-grid">
          {allReservations.map((reservation) => (
            <div
              key={reservation._id}
              className="reservation-card"
              onClick={() => openDetailModal(reservation)}
            >
              <div className="reservation-card-header">
                <div className="reservation-name-section">
                  <FiUser className="reservation-icon" />
                  <h3 className="reservation-name">{reservation.name}</h3>
                </div>
                <button
                  className="delete-reservation-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    openDeleteModal(reservation);
                  }}
                  aria-label="Delete reservation"
                >
                  <FiTrash2 />
                </button>
              </div>

              <div className="reservation-info">
                <div className="reservation-info-item">
                  <FiPhone className="info-icon" />
                  <span>{reservation.phone}</span>
                </div>
                <div className="reservation-info-item">
                  <FiMail className="info-icon" />
                  <span>{reservation.email}</span>
                </div>
                {reservation.service && (
                  <div className="reservation-info-item">
                    <FiPackage className="info-icon" />
                    <span className="service-name">
                      {reservation.service.name || "Service"}
                    </span>
                  </div>
                )}
              </div>

              <div className="reservation-footer">
                <span className="reservation-date">
                  {formatDate(reservation.createdAt)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      {isDetailModalOpen && (
        <div className="modal-overlay" onClick={closeDetailModal}>
          <div
            className="modal-content detail-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h2>تفاصيل الحجز</h2>
              <button className="close-btn" onClick={closeDetailModal}>
                <FiX />
              </button>
            </div>

            <div className="modal-body">
              {loading ? (
                <div className="loading-state">
                  <p>جاري التحميل...</p>
                </div>
              ) : selectedReservation ? (
                <div className="reservation-details">
                  <div className="detail-section">
                    <div className="detail-item">
                      <FiUser className="detail-icon" />
                      <div className="detail-content">
                        <label>الاسم</label>
                        <p>{selectedReservation.name}</p>
                      </div>
                    </div>

                    <div className="detail-item">
                      <FiPhone className="detail-icon" />
                      <div className="detail-content">
                        <label>رقم الهاتف</label>
                        <p>{selectedReservation.phone}</p>
                      </div>
                    </div>

                    <div className="detail-item">
                      <FiMail className="detail-icon" />
                      <div className="detail-content">
                        <label>البريد الإلكتروني</label>
                        <p>{selectedReservation.email}</p>
                      </div>
                    </div>

                    <div className="detail-item">
                      <FiMapPin className="detail-icon" />
                      <div className="detail-content">
                        <label>العنوان</label>
                        <p>{selectedReservation.address || "غير محدد"}</p>
                      </div>
                    </div>

                    {selectedReservation.service && (
                      <div className="detail-item">
                        <FiPackage className="detail-icon" />
                        <div className="detail-content">
                          <label>الخدمة</label>
                          <div className="service-detail">
                            <p className="service-detail-name">
                              {selectedReservation.service.name}
                            </p>
                            <p className="service-detail-price">
                              ${parseFloat(selectedReservation.service.price).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="detail-item">
                      <div className="detail-content">
                        <label>تاريخ الحجز</label>
                        <p>{formatDate(selectedReservation.createdAt)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="error-state">
                  <p>فشل تحميل التفاصيل</p>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button className="cancel-btn" onClick={closeDetailModal}>
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && reservationToDelete && (
        <div className="modal-overlay" onClick={closeDeleteModal}>
          <div
            className="delete-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="delete-modal-icon">
              <FiAlertTriangle />
            </div>
            <div className="delete-modal-header">
              <h2>حذف الحجز</h2>
            </div>
            <div className="delete-modal-body">
              <p>
                هل أنت متأكد من حذف حجز{" "}
                <strong>"{reservationToDelete.name}"</strong>?
              </p>
              <p className="delete-warning-text">
                لا يمكن التراجع عن هذا الإجراء.
              </p>
            </div>
            <div className="delete-modal-footer">
              <button
                className="cancel-delete-btn"
                onClick={closeDeleteModal}
              >
                إلغاء
              </button>
              <button
                className="confirm-delete-btn"
                onClick={handleDeleteReservation}
                disabled={loading}
              >
                {loading ? "جاري الحذف..." : (
                  <>
                    <FiTrash2 />
                    حذف
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reservations;

