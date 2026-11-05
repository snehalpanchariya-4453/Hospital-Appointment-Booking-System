import React, { useState, useEffect } from 'react';
import { departmentService } from '../../services/api';
import {
  Building2,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  AlertCircle,
  Heart,
  Brain,
  Baby,
  Bone,
  Stethoscope,
  Activity,
  Sparkles,
} from 'lucide-react';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Modal from '../../components/common/Modal';

const iconList = ['Heart', 'Brain', 'Baby', 'Bone', 'Stethoscope', 'Activity', 'Sparkles'];

const AdminDepartments = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: 'Activity',
    status: 'active',
  });
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successAlert, setSuccessAlert] = useState('');

  const fetchDepartments = async () => {
    try {
      const res = await departmentService.getDepartments();
      if (res.data?.success) {
        setDepartments(res.data.data);
      }
    } catch (err) {
      console.error('Error loading departments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const getDeptIcon = (iconName) => {
    switch (iconName) {
      case 'Heart':
        return <Heart className="w-5 h-5 text-brand-500" />;
      case 'Brain':
        return <Brain className="w-5 h-5 text-brand-500" />;
      case 'Baby':
        return <Baby className="w-5 h-5 text-brand-500" />;
      case 'Bone':
        return <Bone className="w-5 h-5 text-brand-500" />;
      case 'Stethoscope':
        return <Stethoscope className="w-5 h-5 text-brand-500" />;
      case 'Sparkles':
        return <Sparkles className="w-5 h-5 text-brand-500" />;
      default:
        return <Activity className="w-5 h-5 text-brand-500" />;
    }
  };

  const handleOpenAdd = () => {
    setIsEditing(false);
    setCurrentId(null);
    setFormData({ name: '', description: '', icon: 'Activity', status: 'active' });
    setErrorMsg('');
    setModalOpen(true);
  };

  const handleOpenEdit = (dept) => {
    setIsEditing(true);
    setCurrentId(dept._id);
    setFormData({
      name: dept.name,
      description: dept.description,
      icon: dept.icon || 'Activity',
      status: dept.status || 'active',
    });
    setErrorMsg('');
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSubmitting(true);

    try {
      if (isEditing) {
        await departmentService.updateDepartment(currentId, formData);
        setSuccessAlert('Department updated successfully.');
      } else {
        await departmentService.createDepartment(formData);
        setSuccessAlert('New department created successfully.');
      }
      setModalOpen(false);
      setTimeout(() => setSuccessAlert(''), 4000);
      fetchDepartments();
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (dept) => {
    if (dept.doctorCount > 0) {
      alert(`Cannot delete ${dept.name}: ${dept.doctorCount} doctors are assigned to this department.`);
      return;
    }

    if (!window.confirm(`Are you sure you want to delete ${dept.name}?`)) {
      return;
    }

    try {
      const res = await departmentService.deleteDepartment(dept._id);
      if (res.data?.success) {
        setSuccessAlert(`${dept.name} was removed.`);
        setTimeout(() => setSuccessAlert(''), 4000);
        fetchDepartments();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete department');
    }
  };

  if (loading) {
    return (
      <div className="py-20">
        <LoadingSpinner message="Loading departments..." />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-purple-600 bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
            Hospital Infrastructure
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 mt-2">
            Hospital Departments ({departments.length})
          </h1>
          <p className="text-xs text-slate-500">
            Configure clinical units, descriptions, and assign medical faculties.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="gradient-pink-btn px-5 py-3 rounded-2xl font-bold text-xs sm:text-sm shadow-soft-pink flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Department</span>
        </button>
      </div>

      {successAlert && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-semibold flex items-center shadow-xs">
          <CheckCircle2 className="w-5 h-5 mr-2 text-emerald-600 flex-shrink-0" />
          <span>{successAlert}</span>
        </div>
      )}

      {/* Grid of Departments */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {departments.map((dept) => (
          <div
            key={dept._id}
            className="bg-white p-6 rounded-3xl border border-brand-100 shadow-soft-pink flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-brand-50 border border-brand-100 flex items-center justify-center">
                  {getDeptIcon(dept.icon)}
                </div>
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => handleOpenEdit(dept)}
                    className="p-1.5 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
                    title="Edit Department"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(dept)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Delete Department"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <h3 className="text-lg font-bold text-slate-900 mt-4">{dept.name}</h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed line-clamp-3">
                {dept.description}
              </p>
            </div>

            <div className="mt-5 pt-4 border-t border-brand-50 flex items-center justify-between text-xs">
              <span className="font-bold text-brand-600 bg-brand-50 px-2.5 py-1 rounded-lg">
                {dept.doctorCount || 0} Assigned Doctors
              </span>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                  dept.status === 'active'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                {dept.status}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={isEditing ? 'Edit Department' : 'Create Hospital Department'}
        maxWidth="max-w-md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-600 text-xs rounded-xl flex items-center">
              <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
              Department Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Oncology & Cancer Care"
              className="w-full px-3 py-2 rounded-xl border border-brand-200 text-xs bg-brand-50/20"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
              Select Icon
            </label>
            <div className="grid grid-cols-4 gap-2">
              {iconList.map((ic) => (
                <button
                  key={ic}
                  type="button"
                  onClick={() => setFormData({ ...formData, icon: ic })}
                  className={`p-2 rounded-xl border text-xs flex flex-col items-center space-y-1 ${
                    formData.icon === ic
                      ? 'border-brand-500 bg-brand-50 text-brand-600 font-bold'
                      : 'border-slate-200 text-slate-500'
                  }`}
                >
                  {getDeptIcon(ic)}
                  <span className="text-[10px]">{ic}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
              Department Description *
            </label>
            <textarea
              rows="3"
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Summary of medical services, diagnostic equipment, and treatment focus..."
              className="w-full px-3 py-2 rounded-xl border border-brand-200 text-xs bg-brand-50/20"
            ></textarea>
          </div>

          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-brand-100">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 text-xs font-bold text-slate-600 bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="gradient-pink-btn px-6 py-2 text-xs font-bold rounded-xl shadow-soft-pink"
            >
              {submitting ? 'Saving...' : isEditing ? 'Update Department' : 'Create Department'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminDepartments;
