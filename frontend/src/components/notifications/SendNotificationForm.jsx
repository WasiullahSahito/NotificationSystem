import { useState, useEffect } from 'react';
import apiClient from '../../api/axios';
import toast from 'react-hot-toast';
import Button from '../ui/Button';

export default function SendNotificationForm() {
    const [type, setType] = useState('email');
    const [templates, setTemplates] = useState([]);
    const [selectedTemplate, setSelectedTemplate] = useState('');
    const [formData, setFormData] = useState({
        to: '',
        subject: '',
        body: '',
        message: '',
    });
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchTemplates = async () => {
            if (type) {
                try {
                    const response = await apiClient.get(`/templates?type=${type}`);
                    setTemplates(response.data.templates);
                } catch (error) {
                    console.error("Failed to fetch templates");
                }
            }
        };
        fetchTemplates();
        setSelectedTemplate('');
    }, [type]);

    const handleTemplateChange = (e) => {
        const templateName = e.target.value;
        setSelectedTemplate(templateName);
        const template = templates.find(t => t.name === templateName);
        if (template) {
            setFormData(prev => ({
                ...prev,
                subject: template.subject || '',
                body: template.content || '',
                message: template.content || '',
            }));
        } else {
            setFormData(prev => ({ ...prev, subject: '', body: '', message: '' }));
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const endpoint = type === 'email' ? '/notifications/email' : '/notifications/sms';
        const payload = {
            to: formData.to.split(',').map(item => item.trim()),
            ...(type === 'email' ? { subject: formData.subject, body: formData.body } : { message: formData.message }),
            ...(selectedTemplate && { templateName: selectedTemplate }),
            // Note: For simplicity, we are not handling dynamic template variables in this form
        };

        try {
            const response = await apiClient.post(endpoint, payload);
            toast.success(response.data.message);
            setFormData({ to: '', subject: '', body: '', message: '' });
            setSelectedTemplate('');
        } catch (error) {
            toast.error(error.response?.data?.message || `Failed to send ${type}.`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="rounded-lg bg-white p-6 shadow-md">
            <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Type</label>
                        <select value={type} onChange={(e) => setType(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
                            <option value="email">Email</option>
                            <option value="sms">SMS</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Template (Optional)</label>
                        <select value={selectedTemplate} onChange={handleTemplateChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
                            <option value="">-- No Template --</option>
                            {templates.map(t => <option key={t._id} value={t.name}>{t.name}</option>)}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Recipients (comma-separated)</label>
                        <input name="to" value={formData.to} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                    </div>

                    {type === 'email' && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Subject</label>
                            <input name="subject" value={formData.subject} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" disabled={!!selectedTemplate} />
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700">{type === 'email' ? 'Body' : 'Message'}</label>
                        <textarea
                            name={type === 'email' ? 'body' : 'message'}
                            value={type === 'email' ? formData.body : formData.message}
                            onChange={handleChange}
                            rows="5"
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                            disabled={!!selectedTemplate}
                        />
                    </div>
                </div>
                <div className="mt-6">
                    <Button type="submit" disabled={isLoading}>
                        {isLoading ? 'Sending...' : 'Send Notification'}
                    </Button>
                </div>
            </form>
        </div>
    );
}