import { useState, useEffect } from 'react';
import apiClient from '../../api/axios';
import toast from 'react-hot-toast';
import Button from '../ui/Button';

export default function TemplateForm({ template, onSuccess, onCancel }) {
    const [formData, setFormData] = useState({
        name: '',
        type: 'email',
        subject: '',
        content: ''
    });
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (template) {
            setFormData({
                name: template.name,
                type: template.type,
                subject: template.subject || '',
                content: template.content
            });
        } else {
            setFormData({ name: '', type: 'email', subject: '', content: '' });
        }
    }, [template]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            if (template) {
                await apiClient.put(`/templates/${template._id}`, formData);
                toast.success('Template updated successfully!');
            } else {
                await apiClient.post('/templates', formData);
                toast.success('Template created successfully!');
            }
            onSuccess();
        } catch (error) {
            toast.error(error.response?.data?.message || 'An error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <input name="name" value={formData.name} onChange={handleChange} placeholder="Template Name" required className="w-full rounded-md border-gray-300" />
            <select name="type" value={formData.type} onChange={handleChange} className="w-full rounded-md border-gray-300">
                <option value="email">Email</option>
                <option value="sms">SMS</option>
            </select>
            {formData.type === 'email' && (
                <input name="subject" value={formData.subject} onChange={handleChange} placeholder="Subject" className="w-full rounded-md border-gray-300" />
            )}
            <textarea name="content" value={formData.content} onChange={handleChange} placeholder="Content (use {variable} for placeholders)" required rows="6" className="w-full rounded-md border-gray-300" />

            <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
                <Button type="submit" disabled={isLoading}>
                    {isLoading ? 'Saving...' : (template ? 'Update Template' : 'Create Template')}
                </Button>
            </div>
        </form>
    );
}