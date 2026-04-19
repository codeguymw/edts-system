import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';

export default function AssetIndex({ auth, assets }: any) {
    const { data, setData, post, processing, reset } = useForm({
        asset_code: '',
        name: '',
        type: 'Transformer',
        location: '',
    });

    const submit = (e: any) => {
        e.preventDefault();
        post(route('assets.store'), { 
            onSuccess: () => reset(),
            preserveScroll: true 
        });
    };

    return (
        // Removed user={auth.user} to fix the TypeScript mismatch
        <AuthenticatedLayout>
            <Head title="Asset Management" />

            <div className="py-12 px-6">
                <div className="max-w-7xl mx-auto">
                    
                    {/* 1. Add Asset Form (Only for Supervisors/Managers) */}
                    {(auth.user.role === 'supervisor' || auth.user.role === 'manager') && (
                        <div className="bg-white p-6 rounded-lg shadow mb-6 border-l-4 border-green-600">
                            <h2 className="text-lg font-bold mb-4">Register New Asset</h2>
                            <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <input 
                                    placeholder="Code (TX-01)" 
                                    className="border p-2 rounded focus:ring-2 focus:ring-green-500" 
                                    onChange={e => setData('asset_code', e.target.value)} 
                                    value={data.asset_code} 
                                    required
                                />
                                <input 
                                    placeholder="Name" 
                                    className="border p-2 rounded focus:ring-2 focus:ring-green-500" 
                                    onChange={e => setData('name', e.target.value)} 
                                    value={data.name} 
                                    required
                                />
                                <select 
                                    className="border p-2 rounded focus:ring-2 focus:ring-green-500" 
                                    onChange={e => setData('type', e.target.value)}
                                    value={data.type}
                                >
                                    <option value="Transformer">Transformer</option>
                                    <option value="Breaker">Breaker</option>
                                    <option value="Line">Line</option>
                                </select>
                                <input 
                                    placeholder="Location" 
                                    className="border p-2 rounded focus:ring-2 focus:ring-green-500" 
                                    onChange={e => setData('location', e.target.value)} 
                                    value={data.location} 
                                    required
                                />
                                <button 
                                    type="submit" 
                                    disabled={processing} 
                                    className="bg-green-600 hover:bg-green-700 text-white p-2 rounded transition-colors font-semibold"
                                >
                                    {processing ? 'Saving...' : 'Add Asset'}
                                </button>
                            </form>
                        </div>
                    )}

                    {/* 2. Asset Table with Predictive Insights */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg border border-gray-200">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="p-4 font-semibold text-gray-700">Code</th>
                                    <th className="p-4 font-semibold text-gray-700">Name</th>
                                    <th className="p-4 font-semibold text-gray-700">Failures (30d)</th>
                                    <th className="p-4 font-semibold text-gray-700">Current Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {assets.length > 0 ? (
                                    assets.map((asset: any) => (
                                        <tr key={asset.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="p-4 font-mono text-sm font-bold text-gray-900">{asset.asset_code}</td>
                                            <td className="p-4 text-gray-600">{asset.name}</td>
                                            <td className="p-4 text-gray-600">{asset.failures_count || 0}</td>
                                            <td className="p-4">
                                                {asset.failures_count >= 3 ? (
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 animate-pulse">
                                                        🔴 High Risk: Replacement Predicted
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                        ✅ Stable
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="p-8 text-center text-gray-500 italic">
                                            No assets registered yet.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}