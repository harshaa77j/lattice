import {
    Activity,
    CheckCircle2,
    Clock3,
    MoreHorizontal,
    Plus,
    Search,
    Server
} from 'lucide-react'

import { Link } from 'react-router-dom'

const deployments = [
    {
        id: 'dep_001',
        name: 'retinal-detection-v1',
        framework: 'PyTorch',
        status: 'RUNNING',
        nodes: 3,
        progress: 67,
        created: 'Today, 10:42 AM',
        color: 'blue'
    },
    {
        id: 'dep_002',
        name: 'sentiment-classifier',
        framework: 'PyTorch',
        status: 'COMPLETED',
        nodes: 2,
        progress: 100,
        created: 'Yesterday, 4:20 PM',
        color: 'green'
    },
    {
        id: 'dep_003',
        name: 'image-classification-test',
        framework: 'TensorFlow',
        status: 'PENDING',
        nodes: 0,
        progress: 0,
        created: 'Aug 26, 11:10 AM',
        color: 'amber'
    }
]

function getStatusStyles(status)
{
    const styles = {
        RUNNING: {
            icon: Activity,
            className: 'bg-blue-50 text-blue-700'
        },
        COMPLETED: {
            icon: CheckCircle2,
            className: 'bg-emerald-50 text-emerald-700'
        },
        PENDING: {
            icon: Clock3,
            className: 'bg-amber-50 text-amber-700'
        }
    }

    return styles[status]
}

function Deployments()
{
    return (
        <div className="p-8">
            <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                <div>
                    <p className="mb-2 text-sm font-medium text-indigo-600">
                        YOUR WORKLOADS
                    </p>

                    <h1 className="text-3xl font-bold text-slate-900">
                        Deployments
                    </h1>

                    <p className="mt-2 text-slate-500">
                        Create, monitor, and manage distributed workloads.
                    </p>
                </div>

                <Link
                    to="/deployments/new"
                    className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
                >
                    <Plus size={18} />

                    New Deployment
                </Link>
            </div>

            <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <p className="text-sm text-slate-500">
                        Total Deployments
                    </p>

                    <p className="mt-2 text-3xl font-bold text-slate-900">
                        3
                    </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <p className="text-sm text-slate-500">
                        Currently Running
                    </p>

                    <p className="mt-2 text-3xl font-bold text-indigo-600">
                        1
                    </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <p className="text-sm text-slate-500">
                        Completed
                    </p>

                    <p className="mt-2 text-3xl font-bold text-emerald-600">
                        1
                    </p>
                </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="flex flex-col gap-4 border-b border-slate-100 p-6 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h2 className="font-semibold text-slate-900">
                            All Deployments
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            Distributed workloads in your account.
                        </p>
                    </div>

                    <div className="relative w-full md:w-72">
                        <Search
                            size={18}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                        />

                        <input
                            type="text"
                            placeholder="Search deployments..."
                            className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full min-w-[850px]">
                        <thead className="border-b border-slate-100 bg-slate-50">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                    Deployment
                                </th>

                                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                    Status
                                </th>

                                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                    Nodes
                                </th>

                                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                    Progress
                                </th>

                                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                    Created
                                </th>

                                <th className="px-6 py-4" />
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-slate-100">
                            {deployments.map((deployment) =>
                            {
                                const status = getStatusStyles(
                                    deployment.status
                                )

                                const StatusIcon = status.icon

                                return (
                                    <tr
                                        key={deployment.id}
                                        className="transition hover:bg-slate-50"
                                    >
                                        <td className="px-6 py-5">
                                            <Link
                                                to={`/deployments/${deployment.id}`}
                                                className="flex items-center gap-3"
                                            >
                                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                                                    <Server size={19} />
                                                </div>

                                                <div>
                                                    <p className="font-semibold text-slate-900">
                                                        {deployment.name}
                                                    </p>

                                                    <p className="mt-1 text-xs text-slate-500">
                                                        {deployment.framework}
                                                    </p>
                                                </div>
                                            </Link>
                                        </td>

                                        <td className="px-6 py-5">
                                            <span
                                                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${status.className}`}
                                            >
                                                <StatusIcon size={13} />

                                                {deployment.status}
                                            </span>
                                        </td>

                                        <td className="px-6 py-5">
                                            <span className="text-sm font-medium text-slate-700">
                                                {deployment.nodes}
                                            </span>
                                        </td>

                                        <td className="px-6 py-5">
                                            <div className="flex min-w-40 items-center gap-3">
                                                <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                                                    <div
                                                        className="h-full rounded-full bg-indigo-600"
                                                        style={{
                                                            width: `${deployment.progress}%`
                                                        }}
                                                    />
                                                </div>

                                                <span className="text-xs font-semibold text-slate-600">
                                                    {deployment.progress}%
                                                </span>
                                            </div>
                                        </td>

                                        <td className="px-6 py-5 text-sm text-slate-500">
                                            {deployment.created}
                                        </td>

                                        <td className="px-6 py-5 text-right">
                                            <button
                                                type="button"
                                                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                                            >
                                                <MoreHorizontal size={19} />
                                            </button>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default Deployments