import { HiPencil, HiTrash } from 'react-icons/hi';

export default function TemplatesTable({ templates, onEdit, onDelete }) {
    if (templates.length === 0) {
        return <p className="text-center text-gray-500 mt-4">No templates created yet.</p>;
    }

    return (
        <div className="overflow-x-auto rounded-lg bg-white shadow">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Type</th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Subject</th>
                        <th className="px-6 py-3 text-right text-xs font-medium uppercase text-gray-500">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {templates.map(template => (
                        <tr key={template._id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{template.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{template.type}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 truncate max-w-xs">{template.subject || 'N/A'}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button onClick={() => onEdit(template)} className="text-indigo-600 hover:text-indigo-900"><HiPencil className="h-5 w-5" /></button>
                                <button onClick={() => onDelete(template._id)} className="ml-4 text-red-600 hover:text-red-900"><HiTrash className="h-5 w-5" /></button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}