import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Dashboard({ auth, defects, engineers }: any) {
    // 1. Safely grab the flash message
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
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    
                    {/* SUCCESS FLASH MESSAGE */}
                    {flash?.message && (
                        <div className="mb-6 rounded-lg bg-green-50 p-4 text-sm font-medium text-green-800 border border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800">
                            ✅ {flash.message}
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
                                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">Description</th>
                                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">Priority</th>
                                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">Status</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">
                                                {defects && defects.length > 0 ? (
                                                    defects.map((defect: any) => (
                                                        <tr key={defect.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/40">
                                                            {/* 1. Equipment ID */}
                                                            <td className="px-4 py-4 text-sm font-bold text-gray-900 dark:text-gray-100">
                                                                {defect.equipment_id}
                                                            </td>
                                                            
                                                            {/* 2. Station Name */}
                                                            <td className="px-4 py-4 text-sm text-gray-600 dark:text-gray-400">
                                                                {defect.station_name}
                                                            </td>

                                                            {/* 3. Fault Type */}
                                                            <td className="px-4 py-4 text-sm text-gray-600 dark:text-gray-400 uppercase">
                                                                {defect.type}
                                                            </td>

                                                            <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-400 max-w-xs truncate">
                                                                {defect.description}
                                                            </td>

                                                            {/* 4. Priority (On its own) */}
                                                            <td className="px-4 py-4 text-sm">
                                                                <span className={`px-2 py-1 rounded text-[11px] font-black uppercase ${
                                                                    defect.priority === 'critical' ? 'bg-red-600 text-white' :
                                                                    defect.priority === 'high' ? 'bg-orange-500 text-white' :
                                                                    'bg-gray-200 text-gray-700'
                                                                }`}>
                                                                    {defect.priority}
                                                                </span>
                                                            </td>

                                                            {/* 5. Status (On its own) */}
                                                            <td className="px-4 py-4 text-sm">
                                                                <span className="rounded-full bg-[#00853f] px-3 py-1 text-[11px] font-bold text-white uppercase">
                                                                    {defect.status}
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan={5} className="px-4 py-10 text-center text-gray-500">
                                                            No faults reported yet.
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {/* ENGINEER & SUPERVISOR VIEWS */}
                            {/* ENGINEER & SUPERVISOR VIEWS */}
                            {role !== 'reporter' && (
                                <div className="space-y-8">

                                    {/* SHARED STATS: Both see high-level numbers */}
                                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                                        {/* PENDING CARD */}
                                        <div className="relative overflow-hidden rounded-2xl border border-amber-200 bg-white p-6 shadow-sm dark:bg-gray-800">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-[11px] font-black uppercase tracking-widest text-amber-600">New / Unassigned</p>
                                                    <p className="mt-2 text-4xl font-black text-gray-900 dark:text-white">
                                                        {defects.filter((d: any) => d.status === 'pending').length}
                                                    </p>
                                                </div>
                                                <div className="rounded-full bg-amber-100 p-3 text-amber-600 dark:bg-amber-900/30">
                                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                                                </div>
                                            </div>
                                        </div>

                                        {/* ACTIVE CARD */}
                                        <div className="relative overflow-hidden rounded-2xl border border-blue-200 bg-white p-6 shadow-sm dark:bg-gray-800">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-[11px] font-black uppercase tracking-widest text-blue-600">In Progress</p>
                                                    <p className="mt-2 text-4xl font-black text-gray-900 dark:text-white">
                                                        {defects.filter((d: any) => d.status === 'assigned' || d.status === 'working').length}
                                                    </p>
                                                </div>
                                                <div className="rounded-full bg-blue-100 p-3 text-blue-600">
                                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                                                </div>
                                            </div>
                                        </div>

                                        {/* CRITICAL CARD */}
                                        <div className="relative overflow-hidden rounded-2xl border border-red-200 bg-white p-6 shadow-sm dark:bg-gray-800">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-[11px] font-black uppercase tracking-widest text-red-600">Critical Faults</p>
                                                    <p className="mt-2 text-4xl font-black text-gray-900 dark:text-white">
                                                        {defects.filter((d: any) => d.priority === 'critical').length}
                                                    </p>
                                                </div>
                                                <div className="rounded-full bg-red-100 p-3 text-red-600">
                                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                                </div>
                                            </div>
                                        </div>

                                        {/* COMPLETED CARD */}
                                        <div className="relative overflow-hidden rounded-2xl border border-[#00853f]/20 bg-white p-6 shadow-sm dark:bg-gray-800">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-[11px] font-black uppercase tracking-widest text-[#00853f]">Resolved</p>
                                                    <p className="mt-2 text-4xl font-black text-gray-900 dark:text-white">
                                                        {defects.filter((d: any) => d.status === 'completed').length}
                                                    </p>
                                                </div>
                                                <div className="rounded-full bg-green-100 p-3 text-[#00853f]">
                                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* SUPERVISOR ONLY: Engineer Workload List */}
                                    {role === 'supervisor' && (
                                        <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
                                            <h3 className="text-lg font-bold mb-4">Field Engineer Availability</h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                {engineers.map((eng: any) => (
                                                    <div key={eng.id} className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-900/50">
                                                        <div className="flex items-center gap-3">
                                                            <div className="h-8 w-8 rounded-full bg-[#00853f] text-white flex items-center justify-center font-bold text-xs">{eng.name.charAt(0)}</div>
                                                            <p className="text-sm font-bold">{eng.name}</p>
                                                        </div>
                                                        <span className="text-xs font-black text-gray-400">
                                                            {defects.filter((d: any) => d.assigned_to == eng.id && d.status !== 'completed').length} TASKS
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* ENGINEER ONLY: Action-Focused Maintenance Queue */}
                                    {role === 'engineer' && (
                                        <div className="space-y-4">
                                            <h3 className="text-xl font-black uppercase tracking-tight text-[#00853f]">My Maintenance Queue</h3>
                                            {defects.length === 0 ? (
                                                <div className="p-10 text-center border-2 border-dashed border-gray-200 rounded-2xl">No tasks assigned.</div>
                                            ) : (
                                                defects.map((defect: any) => (
                                                    <div key={defect.id} className="bg-white dark:bg-gray-800 rounded-2xl border p-5 flex flex-col md:flex-row justify-between items-center gap-4">
                                                        <div>
                                                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${defect.priority === 'critical' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                                                                {defect.priority}
                                                            </span>
                                                            <h4 className="font-bold text-lg">{defect.title || defect.equipment_id}</h4>
                                                            <p className="text-sm text-gray-500">{defect.description}</p>
                                                        </div>
                                                        <div className="flex gap-2">
                                                            {defect.status === 'assigned' && (
                                                                <button 
                                                                    onClick={() => router.patch(route('defects.update-status', defect.id), { status: 'working' })}
                                                                    className="px-6 py-2 bg-blue-600 text-white text-sm font-bold rounded-xl"
                                                                >🚀 Start Repair</button>
                                                            )}
                                                            {defect.status === 'working' && (
                                                                <button 
                                                                    onClick={() => router.patch(route('defects.update-status', defect.id), { status: 'completed' })}
                                                                    className="px-6 py-2 bg-[#00853f] text-white text-sm font-bold rounded-xl"
                                                                >✅ Mark Resolved</button>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    )}

                                    {/* SUPERVISOR ONLY: The Master Table */}
                                    {role === 'supervisor' && (
                                        <div className="space-y-4 pt-4">
                                            <h4 className="text-lg font-semibold">Management Console: All Defects</h4>
                                            <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
                                                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                                    <thead className="bg-gray-50 dark:bg-gray-900/50">
                                                        <tr>
                                                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Equipment ID</th>
                                                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Station</th>
                                                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Description</th>
                                                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">Status</th>
                                                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">Assign To</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">
                                                        {defects.map((defect: any) => (
                                                            <tr key={defect.id}>
                                                                <td className="px-4 py-4 text-sm font-bold text-blue-600" onClick={() => setSelectedDefect(defect)}>{defect.equipment_id}</td>
                                                                <td className="px-4 py-4 text-sm">{defect.station_name}</td>
                                                                <td className="px-4 py-4 text-sm">{defect.description}</td>
                                                                <td className="px-4 py-4 text-sm">
                                                                    <span className="rounded-full bg-blue-100 px-3 py-1 text-[10px] font-bold text-blue-700 uppercase">
                                                                        {defect.status}
                                                                    </span>
                                                                </td>
                                                                <td className="px-4 py-4 text-sm">
                                                                    <select 
                                                                        className="rounded border-gray-300 text-xs dark:bg-gray-900"
                                                                        onChange={(e) => handleAssign(defect.id, e.target.value)}
                                                                        defaultValue={defect.assigned_to || ""}
                                                                    >
                                                                        <option value="">Choose Engineer</option>
                                                                        {engineers.map((eng: any) => (
                                                                            <option key={eng.id} value={eng.id}>{eng.name}</option>
                                                                        ))}
                                                                    </select>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                        </div>
                    </div>

                    {selectedDefect && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                            <div className="w-full max-w-2xl rounded-xl bg-white p-6 shadow-2xl dark:bg-gray-800 border dark:border-gray-700">
                                {/* HEADER */}
                                <div className="flex justify-between border-b pb-4 dark:border-gray-700">
                                    <h3 className="text-xl font-bold text-[#00853f] dark:text-[#4ade80]">
                                        Fault Report Details
                                    </h3>
                                    <button 
                                        onClick={() => setSelectedDefect(null)} 
                                        className="text-gray-500 hover:text-red-500 transition-colors"
                                    >
                                        Close ✕
                                    </button>
                                </div>
                                
                                {/* CONTENT GRID */}
                                <div className="grid grid-cols-2 gap-6 py-6 text-sm">
                                    <div>
                                        <p className="font-semibold text-gray-500 dark:text-gray-400 uppercase text-[10px] tracking-wider">Reported By</p>
                                        <p className="mt-1 font-medium text-gray-900 dark:text-gray-100">{selectedDefect.user?.name || 'System User'}</p>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-500 dark:text-gray-400 uppercase text-[10px] tracking-wider">Date/Time</p>
                                        <p className="mt-1 font-medium text-gray-900 dark:text-gray-100">{new Date(selectedDefect.created_at).toLocaleString()}</p>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-500 dark:text-gray-400 uppercase text-[10px] tracking-wider">Equipment ID</p>
                                        <p className="mt-1 font-mono font-bold text-gray-900 dark:text-gray-100">{selectedDefect.equipment_id}</p>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-500 dark:text-gray-400 uppercase text-[10px] tracking-wider">Station</p>
                                        <p className="mt-1 font-medium text-gray-900 dark:text-gray-100">{selectedDefect.station_name}</p>
                                    </div>
                                    <div className="col-span-2">
                                        <p className="font-semibold text-gray-500 dark:text-gray-400 uppercase text-[10px] tracking-wider">Description</p>
                                        <p className="mt-2 bg-gray-50 p-4 rounded-lg text-gray-800 dark:bg-gray-900 dark:text-gray-200 border dark:border-gray-700 leading-relaxed">
                                            {selectedDefect.description}
                                        </p>
                                    </div>
                                </div>

                                {/* ASSIGNMENT SECTION (For Supervisors) */}
                                {auth.user.role === 'supervisor' && (
                                    <div className="mt-4 border-t pt-6 dark:border-gray-700">
                                        <label className="block text-sm font-bold mb-3 text-gray-700 dark:text-gray-300">
                                            Assign Engineer to this Task
                                        </label>
                                        <div className="flex gap-2">
                                            <select 
                                                id="engineerSelect"
                                                className="flex-1 rounded-lg border-gray-300 shadow-sm focus:border-[#00853f] focus:ring-[#00853f] dark:bg-gray-900 dark:border-gray-700 dark:text-gray-200"
                                                defaultValue={selectedDefect.assigned_to || ""}
                                            >
                                                <option value="">Select an available Engineer...</option>
                                                {engineers.map((eng: any) => (
                                                    <option key={eng.id} value={eng.id}>{eng.name}</option>
                                                ))}
                                            </select>
                                            
                                            {/* THE ASSIGN BUTTON */}
                                            <button
                                                onClick={() => {
                                                    const select = document.getElementById('engineerSelect') as HTMLSelectElement;
                                                    if (select.value) {
                                                        handleAssign(selectedDefect.id, select.value);
                                                        setSelectedDefect(null); // Close modal after success
                                                    } else {
                                                        alert("Please select an engineer first");
                                                    }
                                                }}
                                                className="bg-[#00853f] hover:bg-[#006430] text-white px-6 py-2 rounded-lg font-bold transition-colors shadow-lg shadow-green-900/20"
                                            >
                                                CONFIRM ASSIGNMENT
                                            </button>
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