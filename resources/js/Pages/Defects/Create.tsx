import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        equipment_id: '',
        station_name: '',
        type: 'transformer',
        priority: 'medium',
        description: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('defects.store'));
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">Report New Electrical Fault</h2>}
        >
            <Head title="Report Fault" />

            <div className="py-12">
                <div className="mx-auto max-w-3xl sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 p-8 shadow sm:rounded-lg border dark:border-gray-700">
                        <form onSubmit={submit} className="space-y-6">
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block font-medium text-sm text-gray-700 dark:text-gray-300">Equipment ID</label>
                                    <input 
                                        type="text" 
                                        className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 rounded-md shadow-sm focus:border-[#00853f] focus:ring-[#00853f]"
                                        value={data.equipment_id}
                                        onChange={e => setData('equipment_id', e.target.value)}
                                        placeholder="e.g. TX-45-CENTRAL"
                                    />
                                    {errors.equipment_id && <div className="text-red-500 text-xs mt-1">{errors.equipment_id}</div>}
                                </div>

                                <div>
                                    <label className="block font-medium text-sm text-gray-700 dark:text-gray-300">Station Name</label>
                                    <input 
                                        type="text" 
                                        className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 rounded-md shadow-sm focus:border-[#00853f] focus:ring-[#00853f]"
                                        value={data.station_name}
                                        onChange={e => setData('station_name', e.target.value)}
                                    />
                                    {errors.station_name && <div className="text-red-500 text-xs mt-1">{errors.station_name}</div>}
                                </div>
                            </div>

                            <div>
                                <label className="block font-medium text-sm text-gray-700 dark:text-gray-300">Fault Type</label>
                                <select 
                                    className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 rounded-md shadow-sm"
                                    value={data.type}
                                    onChange={e => setData('type', e.target.value as any)}
                                >
                                    <option value="transformer">Transformer</option>
                                    <option value="line">Line Fault</option>
                                    <option value="breaker">Breaker Trip</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>

                            <div>
                                <label className="block font-medium text-sm text-gray-700 dark:text-gray-300">Description</label>
                                <textarea 
                                    rows={4}
                                    className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 rounded-md shadow-sm"
                                    value={data.description}
                                    onChange={e => setData('description', e.target.value)}
                                ></textarea>
                                {errors.description && <div className="text-red-500 text-xs mt-1">{errors.description}</div>}
                            </div>

                            <div>
                                <label className="block font-medium text-sm text-gray-700 dark:text-gray-300">
                                    Priority Level
                                </label>
                                <select
                                    value={data.priority}
                                    onChange={(e) => setData('priority', e.target.value)}
                                    className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 rounded-md shadow-sm"
                                    required
                                >
                                    <option value="low">Low - Routine Maintenance</option>
                                    <option value="medium">Medium - Operational Issue</option>
                                    <option value="high">High - Urgent Repair</option>
                                    <option value="critical">Critical - Immediate Danger / Outage</option>
                                </select>
                            </div>

                            <div className="flex items-center justify-end">
                                <button 
                                    type="submit" 
                                    disabled={processing}
                                    className="bg-[#00853f] text-white px-6 py-2 rounded-md font-bold hover:bg-[#006430] transition disabled:opacity-50"
                                >
                                    Submit Report
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}