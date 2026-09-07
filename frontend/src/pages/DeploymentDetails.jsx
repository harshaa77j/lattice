import {
    ArrowLeft,
    CheckCircle2,
    CircleDot,
    Clock3,
    Cpu,
    HardDrive,
    Network,
    Pause,
    Play,
    RotateCcw,
    Server,
    Square,
    Terminal,
    Wifi
} from 'lucide-react'

import { Link, useParams } from 'react-router-dom'

const nodes = [
    {
        id: 'node_001',
        name: 'Lattice Node 01',
        hostname: 'researcher-laptop',
        status: 'RUNNING',
        progress: 67,
        cpu: '8 cores',
        ram: '16 GB',
        latency: '12 ms'
    },
    {
        id: 'node_002',
        name: 'Lattice Node 02',
        hostname: 'volunteer-laptop-01',
        status: 'RUNNING',
        progress: 65,
        cpu: '8 cores',
        ram: '16 GB',
        latency: '18 ms'
    },
    {
        id: 'node_003',
        name: 'Lattice Node 03',
        hostname: 'volunteer-laptop-02',
        status: 'RUNNING',
        progress: 68,
        cpu: '8 cores',
        ram: '8 GB',
        latency: '21 ms'
    }
]

function DeploymentDetails()
{
    const { id } = useParams()

    return (
        <div className="p-8">
            <Link
                to="/deployments"
                className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-indigo-600"
            >
                <ArrowLeft size={16} />

                Back to deployments
            </Link>

            <div className="mb-8 flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                <div>
                    <div className="mb-3 flex items-center gap-3">
                        <p className="text-sm font-medium text-indigo-600">
                            DEPLOYMENT
                        </p>

                        <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
                            RUNNING
                        </span>
                    </div>

                    <h1 className="text-3xl font-bold text-slate-900">
                        retinal-detection-v1
                    </h1>

                    <p className="mt-2 text-slate-500">
                        Deployment ID: {id}
                    </p>
                </div>

                <div className="flex flex-wrap gap-3">
                    <button
                        type="button"
                        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                    >
                        <Pause size={17} />

                        Pause
                    </button>

                    <button
                        type="button"
                        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                    >
                        <RotateCcw size={17} />

                        Restart
                    </button>

                    <button
                        type="button"
                        className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-700"
                    >
                        <Square size={16} />

                        Stop Deployment
                    </button>
                </div>
            </div>

            <div className="mb-6 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <p className="text-sm text-slate-500">
                        Overall Progress
                    </p>

                    <p className="mt-2 text-3xl font-bold text-slate-900">
                        67%
                    </p>

                    <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
                        <div className="h-full w-[67%] rounded-full bg-indigo-600" />
                    </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <p className="text-sm text-slate-500">
                        Active Nodes
                    </p>

                    <p className="mt-2 text-3xl font-bold text-slate-900">
                        3
                    </p>

                    <p className="mt-3 text-xs font-medium text-emerald-600">
                        All nodes online
                    </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <p className="text-sm text-slate-500">
                        Epoch
                    </p>

                    <p className="mt-2 text-3xl font-bold text-slate-900">
                        7 <span className="text-lg text-slate-400">/ 10</span>
                    </p>

                    <p className="mt-3 text-xs text-slate-500">
                        Distributed training
                    </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <p className="text-sm text-slate-500">
                        Network Capacity
                    </p>

                    <p className="mt-2 text-3xl font-bold text-slate-900">
                        24
                        <span className="ml-1 text-lg text-slate-400">
                            cores
                        </span>
                    </p>

                    <p className="mt-3 text-xs text-slate-500">
                        Across active nodes
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
                <div className="xl:col-span-2">
                    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <div className="border-b border-slate-100 px-6 py-5">
                            <div className="flex items-center gap-3">
                                <div className="rounded-xl bg-indigo-50 p-2.5 text-indigo-600">
                                    <Network size={20} />
                                </div>

                                <div>
                                    <h2 className="font-semibold text-slate-900">
                                        Active Volunteer Nodes
                                    </h2>

                                    <p className="mt-1 text-sm text-slate-500">
                                        Laptops currently contributing compute.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="divide-y divide-slate-100">
                            {nodes.map((node) => (
                                <div
                                    key={node.id}
                                    className="p-6"
                                >
                                    <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                                                <Server size={20} />

                                                <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full border-2 border-white bg-emerald-500" />
                                            </div>

                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <h3 className="font-semibold text-slate-900">
                                                        {node.name}
                                                    </h3>

                                                    <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-700">
                                                        {node.status}
                                                    </span>
                                                </div>

                                                <p className="mt-1 text-sm text-slate-500">
                                                    {node.hostname}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="text-left md:text-right">
                                            <p className="text-2xl font-bold text-slate-900">
                                                {node.progress}%
                                            </p>

                                            <p className="text-xs text-slate-500">
                                                task progress
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mb-5 h-2 overflow-hidden rounded-full bg-slate-100">
                                        <div
                                            className="h-full rounded-full bg-indigo-600"
                                            style={{
                                                width: `${node.progress}%`
                                            }}
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
                                        <div className="flex items-center gap-2 text-slate-500">
                                            <Cpu
                                                size={15}
                                                className="text-slate-400"
                                            />

                                            {node.cpu}
                                        </div>

                                        <div className="flex items-center gap-2 text-slate-500">
                                            <HardDrive
                                                size={15}
                                                className="text-slate-400"
                                            />

                                            {node.ram}
                                        </div>

                                        <div className="flex items-center gap-2 text-slate-500">
                                            <Wifi
                                                size={15}
                                                className="text-slate-400"
                                            />

                                            {node.latency}
                                        </div>

                                        <div className="flex items-center gap-2 text-emerald-600">
                                            <CheckCircle2 size={15} />

                                            Connected
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="mb-5 flex items-center gap-3">
                            <div className="rounded-xl bg-indigo-50 p-2.5 text-indigo-600">
                                <CircleDot size={19} />
                            </div>

                            <div>
                                <h2 className="font-semibold text-slate-900">
                                    Live Status
                                </h2>

                                <p className="text-sm text-slate-500">
                                    Current workload activity
                                </p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between border-b border-slate-100 pb-3">
                                <span className="text-sm text-slate-500">
                                    Framework
                                </span>

                                <span className="text-sm font-medium text-slate-800">
                                    PyTorch
                                </span>
                            </div>

                            <div className="flex justify-between border-b border-slate-100 pb-3">
                                <span className="text-sm text-slate-500">
                                    Workload
                                </span>

                                <span className="text-sm font-medium text-slate-800">
                                    ML Training
                                </span>
                            </div>

                            <div className="flex justify-between border-b border-slate-100 pb-3">
                                <span className="text-sm text-slate-500">
                                    Started
                                </span>

                                <span className="text-sm font-medium text-slate-800">
                                    10:42 AM
                                </span>
                            </div>

                            <div className="flex justify-between">
                                <span className="text-sm text-slate-500">
                                    Est. Remaining
                                </span>

                                <span className="text-sm font-medium text-slate-800">
                                    ~18 min
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="overflow-hidden rounded-2xl bg-slate-900 shadow-sm">
                        <div className="flex items-center gap-3 border-b border-slate-700 px-6 py-5">
                            <Terminal
                                size={19}
                                className="text-emerald-400"
                            />

                            <div>
                                <h2 className="font-semibold text-white">
                                    Deployment Logs
                                </h2>

                                <p className="text-xs text-slate-400">
                                    Live coordinator events
                                </p>
                            </div>
                        </div>

                        <div className="space-y-3 p-5 font-mono text-xs leading-relaxed">
                            <p className="text-slate-400">
                                <span className="text-emerald-400">
                                    [10:42:03]
                                </span>{' '}
                                Deployment created
                            </p>

                            <p className="text-slate-400">
                                <span className="text-indigo-400">
                                    [10:42:05]
                                </span>{' '}
                                Scheduler selecting volunteer nodes
                            </p>

                            <p className="text-slate-400">
                                <span className="text-emerald-400">
                                    [10:42:09]
                                </span>{' '}
                                node_001 lease accepted
                            </p>

                            <p className="text-slate-400">
                                <span className="text-emerald-400">
                                    [10:42:11]
                                </span>{' '}
                                node_002 lease accepted
                            </p>

                            <p className="text-slate-400">
                                <span className="text-emerald-400">
                                    [10:42:14]
                                </span>{' '}
                                node_003 lease accepted
                            </p>

                            <p className="text-slate-400">
                                <span className="text-amber-400">
                                    [10:43:02]
                                </span>{' '}
                                Distributed training started
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DeploymentDetails