import { useState, useEffect } from 'react';
import apiClient from '../api/axios';
import toast from 'react-hot-toast';
import TemplateForm from '../components/templates/TemplateForm';   // Corrected path
import TemplatesTable from '../components/templates/TemplateTable'; // Corrected path
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
import { HiPlus } from 'react-icons/hi';

export default function TemplatesPage() { // Corrected component name to plural
    const [templates, setTemplates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState(null);

    const fetchTemplates = async () => {
        try {
            setLoading(true);
            const response = await apiClient.get('/templates');
            setTemplates(response.data.templates);
        } catch (error) {
            toast.error('Failed to fetch templates.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTemplates();
    }, []);

    const handleCreate = () => {
        setSelectedTemplate(null);
        setIsModalOpen(true);
    };

    const handleEdit = (template) => {
        setSelectedTemplate(template);
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this template?')) {
            try {
                await apiClient.delete(`/templates/${id}`);
                toast.success('Template deleted successfully.');
                fetchTemplates();
            } catch (error) {
                toast.error('Failed to delete template.');
            }
        }
    };

    const handleFormSuccess = () => {
        setIsModalOpen(false);
        fetchTemplates();
    };

    return (
        <div>
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold text-gray-900">Templates</h1>
                <Button onClick={handleCreate} icon={<HiPlus className="h-5 w-5" />}>
                    New Template
                </Button>
            </div>

            {loading ? (
                <div className="mt-8 flex justify-center"><Spinner /></div>
            ) : (
                <div className="mt-6">
                    <TemplatesTable
                        templates={templates}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />
                </div>
            )}

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={selectedTemplate ? 'Edit Template' : 'Create New Template'}
            >
                <TemplateForm
                    template={selectedTemplate}
                    onSuccess={handleFormSuccess}
                    onCancel={() => setIsModalOpen(false)}
                />
            </Modal>
        </div>
    );
}