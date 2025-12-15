import React, { useState, useEffect } from "react";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiX,
  FiAlertTriangle,
} from "react-icons/fi";
import "./Blogs.css";
import GetAllBlogs from "../../API/Blog/GetAllBlogs";
import AddBlog from "../../API/Blog/AddBlog";
import EditBlog from "../../API/Blog/EditBlog";
import DeleteBlog from "../../API/Blog/DeleteBlog";
const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState(null);
  const [editingBlog, setEditingBlog] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: null,
    imagePreview: null,
  });
  const [allBlogs, setAllBlogs] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getAllBlogs();
  }, []);
  const getAllBlogs = () => {
    GetAllBlogs(setAllBlogs, setError, setLoading);
  };
  const handleAddBlog = () => {
    if (!formData.name || !formData.description) {
      alert("Please fill in all fields");
      return;
    }
    const data = new FormData();
    data.append("title", formData.name);
    data.append("description", formData.description);
    data.append("image", formData.image);
    AddBlog(data, setError, setLoading, setIsModalOpen, getAllBlogs);
  };

  const handleUpdateBlog = () => {
    if (!formData.name || !formData.description) {
      alert("Please fill in all fields");
      return;
    }
    const data = new FormData();
    data.append("title", formData.name);
    data.append("description", formData.description);
    data.append("image", formData.image);
    EditBlog(
      data,
      setError,
      setLoading,
      setIsModalOpen,
      getAllBlogs,
      editingBlog._id
    );
  };

  const handleDeleteBlog = () => {
    DeleteBlog(
      setError,
      setLoading,
      setIsDeleteModalOpen,
      getAllBlogs,
      blogToDelete._id
    );
  };

  // Open modal for adding new blog
  const openAddModal = () => {
    setEditingBlog(null);
    setFormData({
      name: "",
      description: "",
      date: "",
      image: null,
      imagePreview: null,
    });
    setIsModalOpen(true);
  };

  // Open modal for editing blog
  const openEditModal = (blog) => {
    setEditingBlog(blog); // This stores the entire blog object including _id
    setFormData({
      name: blog.title || "",
      description: blog.description || "",
      image: null,
      imagePreview: blog.image && blog.image[0] ? blog.image[0].url : null,
    });
    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingBlog(null);
    setFormData({
      name: "",
      description: "",
      image: null,
      imagePreview: null,
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

  // Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          image: file,
          imagePreview: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Open delete confirmation modal
  const openDeleteModal = (blog) => {
    setBlogToDelete(blog);
    setIsDeleteModalOpen(true);
  };

  // Close delete modal
  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setBlogToDelete(null);
  };
  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="blogs-container">
      <div className="blogs-header">
        <h1 className="blogs-title">Blog Management</h1>
        <button className="add-blog-btn" onClick={openAddModal}>
          <FiPlus className="btn-icon" />
          Add New Blog
        </button>
      </div>

      {/* Blogs Grid */}
      {allBlogs.length === 0 ? (
        <div className="empty-state">
          <p>No blogs yet. Click "Add New Blog" to get started!</p>
        </div>
      ) : (
        <div className="blogs-grid">
          {allBlogs.map((blog) => (
            <div key={blog._id} className="blog-card">
              <div className="blog-image-container">
                <img
                  src={blog.image[0].url || "/placeholder-image.jpg"}
                  alt={blog.title}
                  className="blog-image"
                />
                <div className="blog-actions">
                  <button
                    className="action-btn edit-btn"
                    onClick={() => openEditModal(blog)}
                    aria-label="Edit blog"
                  >
                    <FiEdit2 />
                  </button>
                  <button
                    className="action-btn delete-btn"
                    onClick={() => openDeleteModal(blog)}
                    aria-label="Delete blog"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
              <div className="blog-content">
                <h3 className="blog-name">{blog.title}</h3>
                <p className="blog-description">{blog.description}</p>
                <p className="blog-date">{formatDate(blog.createdAt)}</p>
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
                <h2>{editingBlog ? "Edit Blog" : "Add New Blog"}</h2>
                {editingBlog && (
                  <p
                    style={{
                      fontSize: "0.85rem",
                      color: "#666",
                      marginTop: "4px",
                    }}
                  >
                    ID: {editingBlog._id}
                  </p>
                )}
              </div>
              <button className="close-btn" onClick={closeModal}>
                <FiX />
              </button>
            </div>

            <div className="modal-body">
              <div className="form-group">
                <label htmlFor="name">Blog Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter blog name"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Description *</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter blog description"
                  className="form-textarea"
                  rows="4"
                />
              </div>

              <div className="form-group">
                <label htmlFor="image">Image</label>
                <input
                  type="file"
                  id="image"
                  name="image"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="form-file-input"
                />
                {formData.imagePreview && (
                  <div className="image-preview">
                    <img
                      src={formData.imagePreview}
                      alt="Preview"
                      className="preview-image"
                    />
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
                onClick={editingBlog ? handleUpdateBlog : handleAddBlog}
              >
                {loading
                  ? "Loading..."
                  : editingBlog
                  ? "Update Blog"
                  : "Add Blog"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && blogToDelete && (
        <div className="modal-overlay" onClick={closeDeleteModal}>
          <div
            className="delete-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="delete-modal-icon">
              <FiAlertTriangle />
            </div>
            <div className="delete-modal-header">
              <h2>Delete Blog</h2>
            </div>
            <div className="delete-modal-body">
              <p>
                Are you sure you want to delete{" "}
                <strong>"{blogToDelete.title || blogToDelete.name}"</strong>?
              </p>
              <p className="delete-warning-text">
                This action cannot be undone.
              </p>
            </div>
            <div className="delete-modal-footer">
              <button className="cancel-delete-btn" onClick={closeDeleteModal}>
                Cancel
              </button>
              <button className="confirm-delete-btn" onClick={handleDeleteBlog}>
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

export default Blogs;
