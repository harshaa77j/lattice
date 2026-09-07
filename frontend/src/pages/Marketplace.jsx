import {
    CheckCircle2,
    Cpu,
    HardDrive,
    MapPin,
    Monitor,
    Search,
    ShieldCheck,
    SlidersHorizontal,
    Wifi
} from 'lucide-react'

const providers = [
    {
        id: 'node_001',
        name: 'Lattice Node 01',
        location: 'Bangalore, India',
        hostname: 'researcher-laptop',
        cpu: 8,
        ram: 16,
        gpu: 'Not Available',
        reliability: 98,
        latency: 12,
        creditsPerHour: 2,
        status: 'AVAILABLE'
    },
    {
        id: 'node_002',
        name: 'Lattice Node 02',
        location: 'Bangalore, India',
        hostname: 'volunteer-laptop-01',
        cpu: 8,
        ram: 16,
        gpu: 'Not Available',
        reliability: 94,
        latency: 18,
        creditsPerHour: 2,
        status: 'AVAILABLE'
    },
    {
        id: 'node_003',
        name: 'Lattice Node 03',
        location: 'Bangalore, India',
        hostname: 'volunteer-laptop-02',
        cpu: 8,
        ram: 8,
        gpu: 'Not Available',
        reliability: 91,
        latency: 21,
        creditsPerHour: 1,
        status: 'AVAILABLE'
    }
]

function Marketplace()
{
    return (
        <div className="p-8">
            <div className="mb-8">
                <p className="mb-2 text-sm font-medium text-indigo-600">
                    COMPUTE MARKETPLACE
                </p>

                <h1 className="text-3xl font-bold text-slate-900">
                    Marketplace
                </h1>

                <p className="mt-2 text-slate-500">
                    Browse available volunteer compute resources on the Lattice network.
                </p>
            </div>

            <div className="mb-6 grid grid-cols-1 gap-5 md:grid-cols-3">
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <p className="text-sm text-slate-500">
                        Available Nodes
                    </p>

                    <p className="mt-2 text-3xl font-bold text-slate-900">
                        3
                    </p>

                    <p className="mt-2 text-xs font-medium text-emerald-600">
                        Ready to accept workloads
                    </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <p className="text-sm text-slate-500">
                        Available Compute
                    </p>

                    <p className="mt-2 text-3xl font-bold text-slate-900">
                        24
                        <span className="ml-1 text-lg text-slate-400">
                            cores
                        </span>
                    </p>

                    <p className="mt-2 text-xs text-slate-500">
                        Across connected laptops
                    </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <p className="text-sm text-slate-500">
                        Average Reliability
                    </p>

                    <p className="mt-2 text-3xl font-bold text-slate-900">
                        94%
                    </p>

                    <p className="mt-2 text-xs text-slate-500">
                        Based on node availability
                    </p>
                </div>
            </div>

            <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="relative w-full lg:max-w-md">
                        <Search
                            size={18}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                        />

                        <input
                            type="text"
                            placeholder="Search available nodes..."
                            className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
                        />
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <button
                            type="button"
                            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                        >
                            <SlidersHorizontal size={17} />

                            Filters
                        </button>

                        <button
                            type="button"
                            className="rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-3 text-sm font-medium text-indigo-600 transition hover:bg-indigo-100"
                        >
                            Sort by Reliability
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
                {providers.map((provider) => (
                    <div
                        key={provider.id}
                        className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-indigo-200 hover:shadow-md"
                    >
                        <div className="mb-6 flex items-start justify-between">
                            <div className="flex items-center gap-3">
                                <div className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                                    <Monitor size={21} />

                                    <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full border-2 border-white bg-emerald-500" />
                                </div>

                                <div>
                                    <h2 className="font-semibold text-slate-900">
                                        {provider.name}
                                    </h2>

                                    <p className="mt-1 text-sm text-slate-500">
                                        {provider.hostname}
                                    </p>
                                </div>
                            </div>

                            <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                                AVAILABLE
                            </span>
                        </div>

                        <div className="mb-6 flex items-center gap-2 text-sm text-slate-500">
                            <MapPin size={15} />

                            {provider.location}
                        </div>

                        <div className="mb-6 grid grid-cols-2 gap-4">
                            <div className="rounded-xl bg-slate-50 p-4">
                                <div className="flex items-center gap-2 text-slate-500">
                                    <Cpu size={15} />

                                    <span className="text-xs">
                                        CPU
                                    </span>
                                </div>

                                <p className="mt-2 text-lg font-bold text-slate-900">
                                    {provider.cpu} cores
                                </p>
                            </div>

                            <div className="rounded-xl bg-slate-50 p-4">
                                <div className="flex items-center gap-2 text-slate-500">
                                    <HardDrive size={15} />

                                    <span className="text-xs">
                                        Memory
                                    </span>
                                </div>

                                <p className="mt-2 text-lg font-bold text-slate-900">
                                    {provider.ram} GB
                                </p>
                            </div>
                        </div>

                        <div className="mb-6 space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-slate-500">
                                    Reliability
                                </span>

                                <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                                    <ShieldCheck
                                        size={16}
                                        className="text-emerald-500"
                                    />

                                    {provider.reliability}%
                                </div>
                            </div>

                            <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                                <div
                                    className="h-full rounded-full bg-emerald-500"
                                    style={{
                                        width: `${provider.reliability}%`
                                    }}
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="flex items-center gap-2 text-sm text-slate-500">
                                    <Wifi size={15} />

                                    Network latency
                                </span>

                                <span className="text-sm font-medium text-slate-700">
                                    {provider.latency} ms
                                </span>
                            </div>
                        </div>

                        <div className="border-t border-slate-100 pt-5">
                            <div className="mb-5 flex items-end justify-between">
                                <div>
                                    <p className="text-xs uppercase tracking-wide text-slate-400">
                                        Compute Price
                                    </p>

                                    <p className="mt-1 text-xl font-bold text-slate-900">
                                        {provider.creditsPerHour}
                                        <span className="ml-1 text-sm font-normal text-slate-500">
                                            credits/hr
                                        </span>
                                    </p>
                                </div>

                                <div className="flex items-center gap-1 text-xs font-medium text-emerald-600">
                                    <CheckCircle2 size={14} />

                                    Verified
                                </div>
                            </div>

                            <button
                                type="button"
                                className="w-full rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
                            >
                                Select Node
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Marketplace