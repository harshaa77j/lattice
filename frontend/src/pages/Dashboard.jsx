import {
    Activity,
    Cpu,
    Network,
    Wallet,
    ArrowUpRight,
    Plus
} from 'lucide-react'

import { Link } from 'react-router-dom'

const stats = [
    {
        label: 'Active Deployments',
        value: '2',
        icon: Activity,
        change: '1 running'
    },
    {
        label: 'Available Nodes',
        value: '3',
        icon: Network,
        change: 'All online'
    },
    {
        label: 'Network Compute',
        value: '24',
        suffix: ' cores',
        icon: Cpu,
        change: 'Available now'
    },
    {
        label: 'Credits',
        value: '128',
        icon: Wallet,
        change: 'Estimated balance'
    }
]

const deployments = [
    {
        id: 'dep_001',
        name: 'retinal-detection-v1',
        status: 'RUNNING',
        nodes: 3,
        progress: 67
    },
    {
        id: 'dep_002',
        name: 'sentiment-classifier',
        status: 'COMPLETED',
        nodes: 2,
        progress: 100
    }
]

function Dashboard()
{
    return (
        <div className="p-8">
            <div className="mb-8 flex items-start justify-between">
                <div>
                    <p className="mb-2 text-sm font-medium text-indigo-600">
                        LATTICE NETWORK
                    </p>

                    <h1 className="text-3xl font-bold text-slate-900">
                        Researcher Overview
                    </h1>

                    <p className="mt-2 text-slate-500">
                        Monitor your distributed compute deployments.
                    </p>
                </div>

                <Link
                    to="/deployments/new"
                    className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
                >
                    <Plus size={18} />

                    New Deployment
                </Link>
            </div>

            <div className="mb-8 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
                {stats.map((stat) =>
                {
                    const Icon = stat.icon

                    return (
                        <div
                            key={stat.label}
                            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                        >
                            <div className="mb-4 flex items-center justify-between">
                                <div className="rounded-xl bg-indigo-50 p-2.5 text-indigo-600">
                                    <Icon size={20} />
                                </div>

                                <ArrowUpRight
                                    size={18}
                                    className="text-slate-400"
                                />
                            </div>

                            <p className="text-sm text-slate-500">
                                {stat.label}
                            </p>

                            <p className="mt-1 text-3xl font-bold text-slate-900">
                                {stat.value}

                                {stat.suffix && (
                                    <span className="text-lg text-slate-500">
                                        {stat.suffix}
                                    </span>
                                )}
                            </p>

                            <p className="mt-3 text-xs font-medium text-emerald-600">
                                {stat.change}
                            </p>
                        </div>
                    )
                })}
            </div>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
                <div className="xl:col-span-2">
                    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
                            <div>
                                <h2 className="font-semibold text-slate-900">
                                    Recent Deployments
                                </h2>

                                <p className="mt-1 text-sm text-slate-500">
                                    Your latest distributed workloads
                                </p>
                            </div>

                            <Link
                                to="/deployments"
                                className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
                            >
                                View all
                            </Link>
                        </div>

                        <div className="divide-y divide-slate-100">
                            {deployments.map((deployment) => (
                                <Link
                                    key={deployment.id}
                                    to={`/deployments/${deployment.id}`}
                                    className="block p-6 transition hover:bg-slate-50"
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="flex items-center gap-3">
                                                <h3 className="font-semibold text-slate-900">
                                                    {deployment.name}
                                                </h3>

                                                <span
                                                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                                                        deployment.status === 'RUNNING'
                                                            ? 'bg-blue-50 text-blue-700'
                                                            : 'bg-emerald-50 text-emerald-700'
                                                    }`}
                                                >
                                                    {deployment.status}
                                                </span>
                                            </div>

                                            <p className="mt-2 text-sm text-slate-500">
                                                {deployment.nodes} volunteer nodes
                                            </p>
                                        </div>

                                        <div className="text-right">
                                            <p className="text-lg font-bold text-slate-900">
                                                {deployment.progress}%
                                            </p>

                                            <p className="text-xs text-slate-500">
                                                complete
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
                                        <div
                                            className="h-full rounded-full bg-indigo-600"
                                            style={{
                                                width: `${deployment.progress}%`
                                            }}
                                        />
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-900 p-6 text-white shadow-sm">
                    <div className="mb-8 flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-400">
                                Network Status
                            </p>

                            <h2 className="mt-1 text-xl font-semibold">
                                Healthy
                            </h2>
                        </div>

                        <div className="h-3 w-3 rounded-full bg-emerald-400" />
                    </div>

                    <div className="space-y-6">
                        <div>
                            <div className="mb-2 flex justify-between text-sm">
                                <span className="text-slate-400">
                                    Online Nodes
                                </span>

                                <span>3 / 3</span>
                            </div>

                            <div className="h-2 rounded-full bg-slate-700">
                                <div className="h-full w-full rounded-full bg-emerald-400" />
                            </div>
                        </div>

                        <div>
                            <div className="mb-2 flex justify-between text-sm">
                                <span className="text-slate-400">
                                    Network Reliability
                                </span>

                                <span>94%</span>
                            </div>

                            <div className="h-2 rounded-full bg-slate-700">
                                <div className="h-full w-[94%] rounded-full bg-indigo-400" />
                            </div>
                        </div>

                        <div className="border-t border-slate-700 pt-5">
                            <p className="text-xs text-slate-400">
                                TOTAL NETWORK CAPACITY
                            </p>

                            <p className="mt-2 text-3xl font-bold">
                                24 CPU cores
                            </p>

                            <p className="mt-1 text-sm text-slate-400">
                                Across 3 connected laptops
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard