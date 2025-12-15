import React, { useState, useEffect } from "react";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiX,
  FiAlertTriangle,
} from "react-icons/fi";
import "./Service.css";
import GetAllServices from "../../API/Services/GetAllServices";
import AddServices from "../../API/Services/AddServices";
import EditService from "../../API/Services/EditService";
import DeleteService from "../../API/Services/DeleteService";
const Service = () => {
  const [services, setServices] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState(null);
  const [editingService, setEditingService] = useState(null);
  const [descriptionInput, setDescriptionInput] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: [],
    images: [],
    imagePreviews: [],
  });

  // Open modal for adding new service
  const openAddModal = () => {
    setEditingService(null);
    setDescriptionInput("");
    setFormData({
      name: "",
      price: "",
      description: [],
      images: [],
      imagePreviews: [],
    });
    setIsModalOpen(true);
  };
  useEffect(() => {
    getAllServices();
  }, []);
  const [allServices, setAllServices] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const getAllServices = () => {
    GetAllServices(setAllServices, setError, setLoading);
  };
  const handleAddService = () => {
    if (
      !formData.name ||
      !formData.price ||
      formData.description.length === 0
    ) {
      alert(
        "Please fill in all required fields and add at least one description"
      );
      return;
    }

    const data = new FormData();
    data.append("name", formData.name);
    data.append("price", formData.price);

    // Append description array - each item individually
    formData.description.forEach((desc) => {
      data.append("description", desc);
    });

    // Append images array - each file individually
    formData.images.forEach((image) => {
      data.append("images", image);
    });

    AddServices(data, setError, setLoading, setIsModalOpen, getAllServices);
  };
  const handleUpdateService = () => {
    if (
      !formData.name ||
      !formData.price ||
      formData.description.length === 0
    ) {
      alert(
        "Please fill in all required fields and add at least one description"
      );
      return;
    }
    const data = new FormData();
    data.append("name", formData.name);
    data.append("price", formData.price);
    // Append description array - each item individually
    formData.description.forEach((desc) => {
      data.append("description", desc);
    });

    // Append images array - each file individually
    formData.images.forEach((image) => {
      data.append("images", image);
    });
    EditService(
      data,
      setError,
      setLoading,
      setIsModalOpen,
      getAllServices,
      editingService._id
    );
  };

  const handleDeleteService = () => {
    DeleteService(
      setError,
      setLoading,
      setIsDeleteModalOpen,
      getAllServices,
      serviceToDelete._id
    );
  };

  // Open modal for editing service
  const openEditModal = (service) => {
    setEditingService(service); // This stores the entire service object including _id
    setDescriptionInput("");

    // Map images from API structure (array of objects with url) to preview URLs
    const imagePreviews =
      service.images && service.images.length > 0
        ? service.images.map((img) => img.url || img)
        : [];

    setFormData({
      name: service.name || "",
      price: service.price || "",
      description: service.description ? [...service.description] : [],
      images: [], // New images to be uploaded
      imagePreviews: imagePreviews, // Existing images from API
    });
    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingService(null);
    setDescriptionInput("");
    setFormData({
      name: "",
      price: "",
      description: [],
      images: [],
      imagePreviews: [],
    });
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Add description item to array
  const handleAddDescription = () => {
    if (descriptionInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        description: [...prev.description, descriptionInput.trim()],
      }));
      setDescriptionInput("");
    }
  };

  // Remove description item from array
  const handleRemoveDescription = (index) => {
    setFormData((prev) => ({
      ...prev,
      description: prev.description.filter((_, i) => i !== index),
    }));
  };

  // Handle image upload (multiple)
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const newPreviews = [];
      let loadedCount = 0;

      files.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          newPreviews.push(reader.result);
          loadedCount++;

          // When all files are loaded, update state
          if (loadedCount === files.length) {
            setFormData((prev) => ({
              ...prev,
              images: [...prev.images, ...files],
              imagePreviews: [...prev.imagePreviews, ...newPreviews],
            }));
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  // Remove image
  const handleRemoveImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
      imagePreviews: prev.imagePreviews.filter((_, i) => i !== index),
    }));
  };
  // Open delete confirmation modal
  const openDeleteModal = (service) => {
    setServiceToDelete(service);
    setIsDeleteModalOpen(true);
  };

  // Close delete modal
  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setServiceToDelete(null);
  };

  // Format price
  const formatPrice = (price) => {
    return `$${parseFloat(price).toFixed(2)}`;
  };

  return (
    <div className="services-container">
      <div className="services-header">
        <h1 className="services-title">Service Management</h1>
        <button className="add-service-btn" onClick={openAddModal}>
          <FiPlus className="btn-icon" />
          Add New Service
        </button>
      </div>

      {/* Services Grid */}
      {allServices.length === 0 ? (
        <div className="empty-state">
          <p>No services yet. Click "Add New Service" to get started!</p>
        </div>
      ) : (
        <div className="services-grid">
          {allServices.map((service) => (
            <div key={service._id} className="service-card">
              <div className="service-image-container">
                {service.images && service.images.length > 0 ? (
                  <img
                    src={service.images[0].url}
                    alt={service.name}
                    className="service-image"
                  />
                ) : (
                  <div className="service-image-placeholder">No Image</div>
                )}
                {service.images && service.images.length > 1 && (
                  <div className="image-count-badge">
                    +{service.images.length - 1}
                  </div>
                )}
                <div className="service-actions">
                  <button
                    className="action-btn edit-btn"
                    onClick={() => openEditModal(service)}
                    aria-label="Edit service"
                  >
                    <FiEdit2 />
                  </button>
                  <button
                    className="action-btn delete-btn"
                    onClick={() => openDeleteModal(service)}
                    aria-label="Delete service"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
              <div className="service-content">
                <div className="service-header-info">
                  <h3 className="service-name">{service.name}</h3>
                  <p className="service-price">{formatPrice(service.price)}</p>
                </div>
                <div className="service-description-list">
                  {service.description.map((desc, index) => (
                    <div key={index} className="description-item">
                      <span className="description-bullet">•</span>
                      <span>{desc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal/Popup */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h2>{editingService ? "Edit Service" : "Add New Service"}</h2>
                {editingService && (
                  <p
                    style={{
                      fontSize: "0.85rem",
                      color: "#666",
                      marginTop: "4px",
                    }}
                  >
                    ID: {editingService._id}
                  </p>
                )}
              </div>
              <button className="close-btn" onClick={closeModal}>
                <FiX />
              </button>
            </div>

            <div className="modal-body">
              <div className="form-group">
                <label htmlFor="name">Service Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter service name"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="price">Price *</label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="Enter price"
                  className="form-input"
                  min="0"
                  step="0.01"
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Description *</label>
                <div className="description-input-container">
                  <input
                    type="text"
                    id="description"
                    value={descriptionInput}
                    onChange={(e) => setDescriptionInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddDescription();
                      }
                    }}
                    placeholder="Enter description item and press Enter or click Add"
                    className="form-input"
                  />
                  <button
                    type="button"
                    className="add-description-btn"
                    onClick={handleAddDescription}
                  >
                    <FiPlus />
                    Add
                  </button>
                </div>
                {formData.description.length > 0 && (
                  <div className="description-list">
                    {formData.description.map((desc, index) => (
                      <div key={index} className="description-tag">
                        <span>{desc}</span>
                        <button
                          type="button"
                          className="remove-description-btn"
                          onClick={() => handleRemoveDescription(index)}
                          aria-label="Remove description"
                        >
                          <FiX />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="images">Images</label>
                <input
                  type="file"
                  id="images"
                  name="images"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="form-file-input"
                  multiple
                />
                {formData.imagePreviews.length > 0 && (
                  <div className="images-preview">
                    {formData.imagePreviews.map((preview, index) => (
                      <div key={index} className="image-preview-item">
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          className="preview-image"
                        />
                        <button
                          type="button"
                          className="remove-image-btn"
                          onClick={() => handleRemoveImage(index)}
                          aria-label="Remove image"
                        >
                          <FiX />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="modal-footer">
              <button className="cancel-btn" onClick={closeModal}>
                Cancel
              </button>
              <button
                className="submit-btn"
                disabled={loading}
                onClick={
                  editingService ? handleUpdateService : handleAddService
                }
              >
                {loading
                  ? "Loading..."
                  : editingService
                  ? "Update Service"
                  : "Add Service"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && serviceToDelete && (
        <div className="modal-overlay" onClick={closeDeleteModal}>
          <div
            className="delete-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="delete-modal-icon">
              <FiAlertTriangle />
            </div>
            <div className="delete-modal-header">
              <h2>Delete Service</h2>
            </div>
            <div className="delete-modal-body">
              <p>
                Are you sure you want to delete{" "}
                <strong>"{serviceToDelete.name}"</strong>?
              </p>
              <p className="delete-warning-text">
                This action cannot be undone.
              </p>
            </div>
            <div className="delete-modal-footer">
              <button className="cancel-delete-btn" onClick={closeDeleteModal}>
                Cancel
              </button>
              <button
                className="confirm-delete-btn"
                onClick={handleDeleteService}
                disabled={loading}
              >
                {loading ? "Loading..." : "Delete Service"}
                <FiTrash2 />
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Service;
