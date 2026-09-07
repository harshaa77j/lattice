import {
    CheckCircle2,
    Clock3,
    Cpu,
    ExternalLink,
    FileClock,
    Server,
    XCircle
} from 'lucide-react'

import { Link } from 'react-router-dom'

const leases = [
    {
        id: 'lease_001',
        deploymentId: 'dep_001',
        deployment: 'retinal-detection-v1',
        node: 'Lattice Node 01',
        nodeId: 'node_001',
        status: 'ACTIVE',
        allocatedCores: 8,
        started: 'Today, 10:42 AM',
        expires: 'Today, 12:42 PM',
        credits: 2
    },
    {
        id: 'lease_002',
        deploymentId: 'dep_001',
        deployment: 'retinal-detection-v1',
        node: 'Lattice Node 02',
        nodeId: 'node_002',
        status: 'ACTIVE',
        allocatedCores: 8,
        started: 'Today, 10:42 AM',
        expires: 'Today, 12:42 PM',
        credits: 2
    },
    {
        id: 'lease_003',
        deploymentId: 'dep_001',
        deployment: 'retinal-detection-v1',
        node: 'Lattice Node 03',
        nodeId: 'node_003',
        status: 'ACTIVE',
        allocatedCores: 8,
        started: 'Today, 10:42 AM',
        expires: 'Today, 12:42 PM',
        credits: 1
    },
    {
        id: 'lease_004',
        deploymentId: 'dep_002',
        deployment: 'sentiment-classifier',
        node: 'Lattice Node 01',
        nodeId: 'node_001',
        status: 'COMPLETED',
        allocatedCores: 4,
        started: 'Yesterday, 2:15 PM',
        expires: 'Yesterday, 4:20 PM',
        credits: 4
    }
]

function getLeaseStatus(status)
{
    const statusMap = {
        ACTIVE: {
            icon: CheckCircle2,
            className: 'bg-emerald-50 text-emerald-700'
        },
        COMPLETED: {
            icon: CheckCircle2,
            className: 'bg-blue-50 text-blue-700'
        },
        EXPIRED: {
            icon: Clock3,
            className: 'bg-amber-50 text-amber-700'
        },
        FAILED: {
            icon: XCircle,
            className: 'bg-rose-50 text-rose-700'
        }
    }

    return statusMap[status]
}

function Leases()
{
    const activeLeases = leases.filter(
        (lease) => lease.status === 'ACTIVE'
    )

    const totalAllocatedCores = activeLeases.reduce(
        (total, lease) => total + lease.allocatedCores,
        0
    )

    const totalCredits = activeLeases.reduce(
        (total, lease) => total + lease.credits,
        0
    )

    return (
        <div className="p-8">
            <div className="mb-8">
                <p className="mb-2 text-sm font-medium text-indigo-600">
                    RESOURCE ALLOCATION
                </p>

                <h1 className="text-3xl font-bold text-slate-900">
                    Leases
                </h1>

                <p className="mt-2 text-slate-500">
                    Track compute resources allocated across the Lattice network.
                </p>
            </div>

            <div className="mb-6 grid grid-cols-1 gap-5 md:grid-cols-3">
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <p className="text-sm text-slate-500">
                        Active Leases
                    </p>

                    <p className="mt-2 text-3xl font-bold text-slate-900">
                        {activeLeases.length}
                    </p>

                    <p className="mt-2 text-xs font-medium text-emerald-600">
                        Currently allocated
                    </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <p className="text-sm text-slate-500">
                        Allocated Compute
                    </p>

                    <p className="mt-2 text-3xl font-bold text-slate-900">
                        {totalAllocatedCores}
                        <span className="ml-1 text-lg text-slate-400">
                            cores
                        </span>
                    </p>

                    <p className="mt-2 text-xs text-slate-500">
                        Across active leases
                    </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <p className="text-sm text-slate-500">
                        Current Cost
                    </p>

                    <p className="mt-2 text-3xl font-bold text-slate-900">
                        {totalCredits}
                        <span className="ml-1 text-lg text-slate-400">
                            credits/hr
                        </span>
                    </p>

                    <p className="mt-2 text-xs text-slate-500">
                        Active resource allocation
                    </p>
                </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
                    <div>
                        <h2 className="font-semibold text-slate-900">
                            All Leases
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            Resource agreements between deployments and volunteer nodes.
                        </p>
                    </div>

                    <FileClock className="text-indigo-600" size={22} />
                </div>

                <div className="divide-y divide-slate-100">
                    {leases.map((lease) =>
                    {
                        const status = getLeaseStatus(lease.status)
                        const StatusIcon = status.icon

                        return (
                            <div
                                key={lease.id}
                                className="p-6 transition hover:bg-slate-50"
                            >
                                <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
                                    <div className="flex flex-col gap-5 lg:flex-row lg:items-center">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                                            <Server size={21} />
                                        </div>

                                        <div>
                                            <div className="flex flex-wrap items-center gap-3">
                                                <h3 className="font-semibold text-slate-900">
                                                    {lease.id}
                                                </h3>

                                                <span
                                                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${status.className}`}
                                                >
                                                    <StatusIcon size={13} />

                                                    {lease.status}
                                                </span>
                                            </div>

                                            <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-slate-500">
                                                <Link
                                                    to={`/deployments/${lease.deploymentId}`}
                                                    className="font-medium text-indigo-600 hover:text-indigo-700"
                                                >
                                                    {lease.deployment}
                                                </Link>

                                                <span>→</span>

                                                <span>
                                                    {lease.node}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-6 sm:grid-cols-4 xl:min-w-[520px]">
                                        <div>
                                            <p className="text-xs uppercase tracking-wide text-slate-400">
                                                Compute
                                            </p>

                                            <div className="mt-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                                                <Cpu size={15} />

                                                {lease.allocatedCores} cores
                                            </div>
                                        </div>

                                        <div>
                                            <p className="text-xs uppercase tracking-wide text-slate-400">
                                                Started
                                            </p>

                                            <p className="mt-2 text-sm font-medium text-slate-700">
                                                {lease.started}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-xs uppercase tracking-wide text-slate-400">
                                                Expires
                                            </p>

                                            <p className="mt-2 text-sm font-medium text-slate-700">
                                                {lease.expires}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-xs uppercase tracking-wide text-slate-400">
                                                Cost
                                            </p>

                                            <p className="mt-2 text-sm font-semibold text-slate-700">
                                                {lease.credits} credits/hr
                                            </p>
                                        </div>
                                    </div>

                                    <Link
                                        to={`/deployments/${lease.deploymentId}`}
                                        className="inline-flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-700"
                                    >
                                        View

                                        <ExternalLink size={15} />
                                    </Link>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default Leases