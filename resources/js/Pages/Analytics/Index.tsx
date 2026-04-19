import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Index({ auth, role, publicStats, roleData }: any) {
    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">System Analytics</h2>}
        >
            <Head title="Analytics" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-6">
                    
                    {/* SECTION 1: PUBLIC KNOWLEDGE (Visible to All) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border-l-4 border-green-500">
                            <p className="text-sm text-gray-500 dark:text-gray-400 font-bold uppercase">Total Faults Resolved (Community)</p>
                            <h3 className="text-3xl font-black text-gray-900 dark:text-white">{publicStats.total_resolved}</h3>
                        </div>
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border-l-4 border-yellow-500">
                            <p className="text-sm text-gray-500 dark:text-gray-400 font-bold uppercase">Active Issues Under Repair</p>
                            <h3 className="text-3xl font-black text-gray-900 dark:text-white">{publicStats.total_active}</h3>
                        </div>
                    </div>

                    <hr className="border-gray-300 dark:border-gray-700" />

                    {/* SECTION 2: ROLE-SPECIFIC DASHBOARD */}
                    {role === 'supervisor' && (
                        <div className="space-y-6">
                            <h3 className="text-lg font-bold dark:text-white">Supervisor's Birds-Eye View</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {roleData.by_status.map((item: any) => (
                                    <div key={item.status} className="bg-gray-50 dark:bg-gray-900 p-4 rounded border dark:border-gray-700">
                                        <span className="capitalize text-gray-500">{item.status}</span>
                                        <p className="text-2xl font-bold dark:text-white">{item.count}</p>
                                    </div>
                                ))}
                            </div>
                            {/* Detailed Table for Supervisor */}
                            <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-gray-100 dark:bg-gray-700">
                                        <tr>
                                            <th className="p-4">Reporter</th>
                                            <th className="p-4">Asset</th>
                                            <th className="p-4">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {roleData.recent_activity.map((f: any) => (
                                            <tr key={f.id} className="border-t dark:border-gray-700">
                                                <td className="p-4 dark:text-gray-300">{f.user.name}</td>
                                                <td className="p-4 dark:text-gray-300">{f.asset?.asset_code || f.equipment_id}</td>
                                                <td className="p-4"><span className="px-2 py-1 rounded bg-green-100 text-green-800 text-xs uppercase">{f.status}</span></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                    
                    {role === 'engineer' && (
                        <div className="space-y-6">
                            <h3 className="text-lg font-bold dark:text-white text-[#00853f]">Engineer Technical Console</h3>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div className="bg-white dark:bg-gray-800 p-4 rounded shadow border-t-4 border-blue-500">
                                    <p className="text-xs text-gray-500 uppercase">My Active Tasks</p>
                                    <p className="text-2xl font-bold dark:text-white">{roleData.my_tasks}</p>
                                </div>
                                <div className="bg-white dark:bg-gray-800 p-4 rounded shadow border-t-4 border-red-500">
                                    <p className="text-xs text-gray-500 uppercase">System Criticals</p>
                                    <p className="text-2xl font-bold text-red-600">{roleData.critical_alerts}</p>
                                </div>
                                <div className="bg-white dark:bg-gray-800 p-4 rounded shadow border-t-4 border-green-500">
                                    <p className="text-xs text-gray-500 uppercase">My Lifetime Repairs</p>
                                    <p className="text-2xl font-bold dark:text-white">{roleData.completed_by_me}</p>
                                </div>
                                <div className="bg-white dark:bg-gray-800 p-4 rounded shadow border-t-4 border-orange-500">
                                    <p className="text-xs text-gray-500 uppercase">Total Unassigned</p>
                                    <p className="text-2xl font-bold dark:text-white">{roleData.system_open_faults}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {role === 'reporter' && (
                        <div className="space-y-6">
                            <h3 className="text-lg font-bold dark:text-white">My Reporting Impact</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-[#00853f] p-6 rounded-lg text-white">
                                    <p className="text-xs uppercase opacity-80">Faults I've Reported</p>
                                    <p className="text-4xl font-bold">{roleData.my_logs}</p>
                                </div>
                                <div className="bg-blue-600 p-6 rounded-lg text-white">
                                    <p className="text-xs uppercase opacity-80">My Reported Faults Fixed</p>
                                    <p className="text-4xl font-bold">{roleData.my_fixed}</p>
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </AuthenticatedLayout>
    );
}