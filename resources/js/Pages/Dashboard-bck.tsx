import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Dashboard({ auth, defects, engineers }: any) {
    const { flash } = usePage().props as any;
    const role = auth.user.role;
    const [selectedDefect, setSelectedDefect] = useState<any>(null);

    const handleAssign = (defectId: number, engineerId: string) => {
        if(!engineerId) return;
        router.patch(route('defects.assign', defectId), {
            assigned_to: engineerId,
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    ESCOM Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 relative">
                    
                    {/* STEP 5: FLOATING NOTIFICATION TOAST */}
                    {flash?.message && (
                        <div className="fixed top-24 right-8 z-[100] animate-bounce-in max-w-md rounded-lg border-l-4 border-[#00853f] bg-white p-4 shadow-2xl dark:bg-gray-800">
                            <div className="flex items-center gap-3">
                                <div className="rounded-full bg-green-100 p-2 text-[#00853f] dark:bg-green-900/30">
                                    🔔
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">System Alert</p>
                                    <p className="text-sm font-bold text-gray-900 dark:text-gray-100">{flash.message}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800 border border-transparent dark:border-gray-700">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            
                            {/* WELCOME SECTION */}
                            <div className="mb-8 border-b pb-4 dark:border-gray-700">
                                <h3 className="text-2xl font-bold text-[#00853f] dark:text-[#4ade80]">
                                    Welcome back, {auth.user.name}
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    System Role: <span className="uppercase font-mono font-bold">{role}</span>
                                </p>
                            </div>

                            {/* REPORTER VIEW */}
                            {role === 'reporter' && (
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <h4 className="text-lg font-semibold">Your Recent Fault Reports</h4>
                                        <Link 
                                            href={route('defects.create')} 
                                            className="rounded-md bg-[#00853f] px-4 py-2 text-sm font-bold text-white transition hover:bg-[#006430]"
                                        >
                                            + NEW TICKET
                                        </Link>
                                    </div>

                                    <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
                                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                            <thead className="bg-gray-50 dark:bg-gray-900/50">
                                                <tr>
                                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">Equipment ID</th>
                                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">Station Name</th>
                                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">Fault Type</th>
                                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">Priority</th>
                                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">Status</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">
                                                {defects.length > 0 ? (
                                                    defects.map((defect: any) => (
                                                        <tr key={defect.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/40">
                                                            <td className="px-4 py-4 text-sm font-bold">{defect.equipment_id}</td>
                                                            <td className="px-4 py-4 text-sm text-gray-600 dark:text-gray-400">{defect.station_name}</td>
                                                            <td className="px-4 py-4 text-sm uppercase">{defect.type}</td>
                                                            <td className="px-4 py-4 text-sm">
                                                                <span className={`px-2 py-1 rounded text-[11px] font-black uppercase ${defect.priority === 'critical' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-700'}`}>
                                                                    {defect.priority}
                                                                </span>
                                                            </td>
                                                            <td className="px-4 py-4 text-sm">
                                                                <span className="rounded-full bg-[#00853f] px-3 py-1 text-[11px] font-bold text-white uppercase">{defect.status}</span>
                                                            </td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr><td colSpan={5} className="px-4 py-10 text-center text-gray-500">No faults reported yet.</td></tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {/* ENGINEER & SUPERVISOR VIEWS */}
                            {role !== 'reporter' && (
                                <div className="space-y-6">
                                    
                                    {/* STEP 4: BIG DASHBOARD STATS CARDS */}
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 mb-8">
                                        <div className="rounded-xl border border-orange-200 bg-orange-50 p-5 dark:bg-orange-900/10 dark:border-orange-800">
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-orange-600">Pending</p>
                                            <p className="text-3xl font-black text-orange-700 dark:text-orange-300">{defects.filter((d: any) => d.status === 'pending').length}</p>
                                        </div>
                                        <div className="rounded-xl border border-blue-200 bg-blue-50 p-5 dark:bg-blue-900/10 dark:border-blue-800">
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-blue-600">In Progress</p>
                                            <p className="text-3xl font-black text-blue-700 dark:text-blue-300">{defects.filter((d: any) => d.status === 'assigned').length}</p>
                                        </div>
                                        <div className="rounded-xl border border-green-200 bg-green-50 p-5 dark:bg-green-900/10 dark:border-green-800">
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-[#00853f]">Resolved</p>
                                            <p className="text-3xl font-black text-[#00853f] dark:text-[#4ade80]">{defects.filter((d: any) => d.status === 'completed').length}</p>
                                        </div>
                                        <div className="rounded-xl border border-red-200 bg-red-50 p-5 dark:bg-red-900/10 dark:border-red-800">
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-red-600">Critical</p>
                                            <p className="text-3xl font-black text-red-700 dark:text-red-300">{defects.filter((d: any) => d.priority === 'critical').length}</p>
                                        </div>
                                    </div>

                                    <h4 className="text-lg font-semibold">Management Console: All Defects</h4>
                                    <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
                                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                            <thead className="bg-gray-50 dark:bg-gray-900/50">
                                                <tr>
                                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">Equipment</th>
                                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">Station</th>
                                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">Priority</th>
                                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">Status</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">
                                                {defects.length > 0 ? (
                                                    defects.map((defect: any) => (
                                                        <tr key={defect.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/40">
                                                            <td className="px-4 py-4 text-sm font-bold text-blue-600 cursor-pointer hover:underline" onClick={() => setSelectedDefect(defect)}>
                                                                {defect.equipment_id}
                                                            </td>
                                                            <td className="px-4 py-4 text-sm">{defect.station_name}</td>
                                                            <td className="px-4 py-4 text-sm">
                                                                <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${defect.priority === 'critical' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-700'}`}>
                                                                    {defect.priority}
                                                                </span>
                                                            </td>
                                                            <td className="px-4 py-4 text-sm text-blue-700 font-bold uppercase">{defect.status}</td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr><td colSpan={4} className="py-10 text-center">No defects found.</td></tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* MODAL SECTION */}
                    {selectedDefect && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                            <div className="w-full max-w-2xl rounded-xl bg-white p-6 shadow-2xl dark:bg-gray-800 border dark:border-gray-700">
                                <div className="flex justify-between border-b pb-4 dark:border-gray-700">
                                    <h3 className="text-xl font-bold text-[#00853f] dark:text-[#4ade80]">Fault Report Details</h3>
                                    <button onClick={() => setSelectedDefect(null)} className="text-gray-500 hover:text-red-500 transition-colors">Close ✕</button>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-6 py-6 text-sm">
                                    <div className="col-span-2 bg-gray-50 p-4 rounded-lg dark:bg-gray-900 border dark:border-gray-700">
                                        <p className="font-semibold text-gray-500 uppercase text-[10px]">Description</p>
                                        <p className="mt-1 text-gray-900 dark:text-gray-100">{selectedDefect.description}</p>
                                    </div>
                                </div>

                                {role === 'supervisor' && (
                                    <div className="mt-4 border-t pt-6 dark:border-gray-700">
                                        <label className="block text-sm font-bold mb-3">Assign Engineer</label>
                                        <div className="flex gap-2">
                                            <select id="engineerSelect" className="flex-1 rounded-lg border-gray-300 dark:bg-gray-900" defaultValue={selectedDefect.assigned_to || ""}>
                                                <option value="">Select Engineer...</option>
                                                {engineers.map((eng: any) => (<option key={eng.id} value={eng.id}>{eng.name}</option>))}
                                            </select>
                                            <button onClick={() => {
                                                const val = (document.getElementById('engineerSelect') as HTMLSelectElement).value;
                                                if (val) { handleAssign(selectedDefect.id, val); setSelectedDefect(null); }
                                            }} className="bg-[#00853f] text-white px-6 py-2 rounded-lg font-bold">CONFIRM</button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}