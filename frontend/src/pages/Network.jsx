import {
    Activity,
    CheckCircle2,
    Cpu,
    HardDrive,
    Monitor,
    Network as NetworkIcon,
    Wifi
} from 'lucide-react'

const nodes = [
    {
        id: 'node_001',
        name: 'Lattice Node 01',
        hostname: 'researcher-laptop',
        status: 'ONLINE',
        cpu: 8,
        ram: 16,
        reliability: 98,
        heartbeat: 'Just now',
        activeLease: true
    },
    {
        id: 'node_002',
        name: 'Lattice Node 02',
        hostname: 'volunteer-laptop-01',
        status: 'ONLINE',
        cpu: 8,
        ram: 16,
        reliability: 94,
        heartbeat: 'Just now',
        activeLease: true
    },
    {
        id: 'node_003',
        name: 'Lattice Node 03',
        hostname: 'volunteer-laptop-02',
        status: 'ONLINE',
        cpu: 8,
        ram: 8,
        reliability: 91,
        heartbeat: 'Just now',
        activeLease: true
    }
]

function Network()
{
    const onlineNodes = nodes.filter(
        (node) => node.status === 'ONLINE'
    ).length

    const totalCores = nodes.reduce(
        (total, node) => total + node.cpu,
        0
    )

    const averageReliability = Math.round(
        nodes.reduce(
            (total, node) => total + node.reliability,
            0
        ) / nodes.length
    )

    return (
        <div className="p-8">
            <div className="mb-8">
                <p className="mb-2 text-sm font-medium text-indigo-600">
                    LATTICE NETWORK
                </p>

                <h1 className="text-3xl font-bold text-slate-900">
                    Network
                </h1>

                <p className="mt-2 text-slate-500">
                    Monitor volunteer laptops connected to the network.
                </p>
            </div>

            <div className="mb-6 grid grid-cols-1 gap-5 md:grid-cols-3">
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="mb-4 flex items-center justify-between">
                        <div className="rounded-xl bg-indigo-50 p-2.5 text-indigo-600">
                            <NetworkIcon size={20} />
                        </div>

                        <span className="text-xs font-medium text-emerald-600">
                            Healthy
                        </span>
                    </div>

                    <p className="text-sm text-slate-500">
                        Online Nodes
                    </p>

                    <p className="mt-1 text-3xl font-bold text-slate-900">
                        {onlineNodes}
                        <span className="text-lg text-slate-400">
                            /{nodes.length}
                        </span>
                    </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="mb-4 flex items-center justify-between">
                        <div className="rounded-xl bg-indigo-50 p-2.5 text-indigo-600">
                            <Cpu size={20} />
                        </div>
                    </div>

                    <p className="text-sm text-slate-500">
                        Total Compute
                    </p>

                    <p className="mt-1 text-3xl font-bold text-slate-900">
                        {totalCores}
                        <span className="ml-1 text-lg text-slate-400">
                            cores
                        </span>
                    </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="mb-4 flex items-center justify-between">
                        <div className="rounded-xl bg-indigo-50 p-2.5 text-indigo-600">
                            <Activity size={20} />
                        </div>
                    </div>

                    <p className="text-sm text-slate-500">
                        Average Reliability
                    </p>

                    <p className="mt-1 text-3xl font-bold text-slate-900">
                        {averageReliability}%
                    </p>
                </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-100 px-6 py-5">
                    <h2 className="font-semibold text-slate-900">
                        Connected Nodes
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                        Live status from volunteer node heartbeats.
                    </p>
                </div>

                <div className="divide-y divide-slate-100">
                    {nodes.map((node) => (
                        <div
                            key={node.id}
                            className="p-6"
                        >
                            <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
                                <div className="flex items-start gap-4">
                                    <div className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                                        <Monitor size={21} />

                                        <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full border-2 border-white bg-emerald-500" />
                                    </div>

                                    <div>
                                        <div className="flex flex-wrap items-center gap-3">
                                            <h3 className="font-semibold text-slate-900">
                                                {node.name}
                                            </h3>

                                            <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                                                {node.status}
                                            </span>

                                            {node.activeLease && (
                                                <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
                                                    ACTIVE LEASE
                                                </span>
                                            )}
                                        </div>

                                        <p className="mt-2 text-sm text-slate-500">
                                            {node.hostname}
                                        </p>

                                        <div className="mt-4 flex flex-wrap gap-5 text-sm text-slate-500">
                                            <span className="flex items-center gap-2">
                                                <Cpu size={15} />
                                                {node.cpu} CPU cores
                                            </span>

                                            <span className="flex items-center gap-2">
                                                <HardDrive size={15} />
                                                {node.ram} GB RAM
                                            </span>

                                            <span className="flex items-center gap-2">
                                                <Wifi size={15} />
                                                Last heartbeat: {node.heartbeat}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-8 text-right">
                                    <div>
                                        <p className="text-xs uppercase tracking-wide text-slate-400">
                                            Reliability
                                        </p>

                                        <p className="mt-1 text-2xl font-bold text-slate-900">
                                            {node.reliability}%
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-xs uppercase tracking-wide text-slate-400">
                                            Status
                                        </p>

                                        <div className="mt-2 flex items-center justify-end gap-2 text-sm font-medium text-emerald-600">
                                            <CheckCircle2 size={16} />
                                            Healthy
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Network