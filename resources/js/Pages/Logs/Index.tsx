import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Index({ logs }: any) {
    return (
        <AuthenticatedLayout header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200">System Activity Audit</h2>}>
            <div className="py-12 mx-auto max-w-7xl sm:px-6 lg:px-8">
                <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                    <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                        {logs.data.map((log: any) => (
                            <li key={log.id} className="py-4 flex justify-between">
                                <div>
                                    <span className="font-bold text-[#00853f]">{log.user.name}</span>
                                    <span className="mx-2 text-gray-500">—</span>
                                    <span className="dark:text-white">{log.action}</span>
                                    <p className="text-xs text-gray-400">{log.details}</p>
                                </div>
                                <span className="text-xs text-gray-400">{new Date(log.created_at).toLocaleString()}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}