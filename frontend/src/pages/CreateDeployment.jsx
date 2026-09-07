import {
    ArrowLeft,
    Box,
    Cpu,
    Database,
    HardDrive,
    ShieldCheck,
    SlidersHorizontal,
    Upload,
    Zap
} from 'lucide-react'

import { Link, useNavigate } from 'react-router-dom'

function CreateDeployment()
{
    const navigate = useNavigate()

    function handleSubmit(event)
    {
        event.preventDefault()

        navigate('/deployments')
    }

    return (
        <div className="p-8">
            <div className="mb-8">
                <Link
                    to="/deployments"
                    className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-indigo-600"
                >
                    <ArrowLeft size={16} />

                    Back to deployments
                </Link>

                <p className="mb-2 text-sm font-medium text-indigo-600">
                    NEW WORKLOAD
                </p>

                <h1 className="text-3xl font-bold text-slate-900">
                    Create Deployment
                </h1>

                <p className="mt-2 text-slate-500">
                    Define the compute requirements for your distributed workload.
                </p>
            </div>

            <form
                onSubmit={handleSubmit}
                className="mx-auto max-w-6xl"
            >
                <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
                    <div className="space-y-6 xl:col-span-2">
                        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                            <div className="mb-6 flex items-start gap-3">
                                <div className="rounded-xl bg-indigo-50 p-2.5 text-indigo-600">
                                    <Box size={20} />
                                </div>

                                <div>
                                    <h2 className="font-semibold text-slate-900">
                                        Deployment Details
                                    </h2>

                                    <p className="mt-1 text-sm text-slate-500">
                                        Basic information about your workload.
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                                <div className="md:col-span-2">
                                    <label className="mb-2 block text-sm font-medium text-slate-700">
                                        Deployment Name
                                    </label>

                                    <input
                                        required
                                        type="text"
                                        placeholder="e.g. retinal-detection-v1"
                                        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-700">
                                        Framework
                                    </label>

                                    <select className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50">
                                        <option>PyTorch</option>
                                        <option>TensorFlow</option>
                                        <option>Python</option>
                                        <option>Custom Container</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-700">
                                        Workload Type
                                    </label>

                                    <select className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50">
                                        <option>Machine Learning Training</option>
                                        <option>Federated Learning</option>
                                        <option>Data Processing</option>
                                        <option>Custom Compute Task</option>
                                    </select>
                                </div>
                            </div>
                        </section>

                        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                            <div className="mb-6 flex items-start gap-3">
                                <div className="rounded-xl bg-indigo-50 p-2.5 text-indigo-600">
                                    <Upload size={20} />
                                </div>

                                <div>
                                    <h2 className="font-semibold text-slate-900">
                                        Workload Source
                                    </h2>

                                    <p className="mt-1 text-sm text-slate-500">
                                        Provide the code or container for execution.
                                    </p>
                                </div>
                            </div>

                            <div className="rounded-xl border-2 border-dashed border-slate-200 p-8 text-center transition hover:border-indigo-300 hover:bg-indigo-50/30">
                                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                                    <Upload size={20} />
                                </div>

                                <p className="font-medium text-slate-700">
                                    Upload your workload
                                </p>

                                <p className="mt-2 text-sm text-slate-500">
                                    Python project, model files, or Docker configuration
                                </p>

                                <button
                                    type="button"
                                    className="mt-5 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-indigo-300 hover:text-indigo-600"
                                >
                                    Select Files
                                </button>
                            </div>
                        </section>

                        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                            <div className="mb-6 flex items-start gap-3">
                                <div className="rounded-xl bg-indigo-50 p-2.5 text-indigo-600">
                                    <Cpu size={20} />
                                </div>

                                <div>
                                    <h2 className="font-semibold text-slate-900">
                                        Compute Requirements
                                    </h2>

                                    <p className="mt-1 text-sm text-slate-500">
                                        Minimum resources required for each node.
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                                <div>
                                    <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
                                        <Cpu size={15} />

                                        CPU Cores
                                    </label>

                                    <input
                                        type="number"
                                        min="1"
                                        defaultValue="2"
                                        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
                                        <HardDrive size={15} />

                                        RAM (GB)
                                    </label>

                                    <input
                                        type="number"
                                        min="1"
                                        defaultValue="4"
                                        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
                                        <Zap size={15} />

                                        GPU
                                    </label>

                                    <select className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50">
                                        <option>Not Required</option>
                                        <option>Optional</option>
                                        <option>Required</option>
                                    </select>
                                </div>
                            </div>
                        </section>

                        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                            <div className="mb-6 flex items-start gap-3">
                                <div className="rounded-xl bg-indigo-50 p-2.5 text-indigo-600">
                                    <SlidersHorizontal size={20} />
                                </div>

                                <div>
                                    <h2 className="font-semibold text-slate-900">
                                        Training Configuration
                                    </h2>

                                    <p className="mt-1 text-sm text-slate-500">
                                        Configure the distributed training workload.
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-700">
                                        Epochs
                                    </label>

                                    <input
                                        type="number"
                                        defaultValue="10"
                                        min="1"
                                        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-700">
                                        Batch Size
                                    </label>

                                    <input
                                        type="number"
                                        defaultValue="32"
                                        min="1"
                                        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-700">
                                        Maximum Nodes
                                    </label>

                                    <input
                                        type="number"
                                        defaultValue="3"
                                        min="1"
                                        max="10"
                                        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
                                    />
                                </div>
                            </div>
                        </section>
                    </div>

                    <div>
                        <div className="sticky top-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                            <div className="mb-6 flex items-start gap-3">
                                <div className="rounded-xl bg-indigo-50 p-2.5 text-indigo-600">
                                    <ShieldCheck size={20} />
                                </div>

                                <div>
                                    <h2 className="font-semibold text-slate-900">
                                        Deployment Policy
                                    </h2>

                                    <p className="mt-1 text-sm text-slate-500">
                                        Define how Lattice selects nodes.
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-5">
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-700">
                                        Minimum Reliability
                                    </label>

                                    <select className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-500">
                                        <option>70%</option>
                                        <option>80%</option>
                                        <option>90%</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-700">
                                        Maximum Credits
                                    </label>

                                    <input
                                        type="number"
                                        defaultValue="10"
                                        min="1"
                                        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-500"
                                    />
                                </div>

                                <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 p-4 transition hover:border-indigo-200">
                                    <input
                                        type="checkbox"
                                        defaultChecked
                                        className="mt-1 h-4 w-4 accent-indigo-600"
                                    />

                                    <span>
                                        <span className="block text-sm font-medium text-slate-800">
                                            Automatic Node Selection
                                        </span>

                                        <span className="mt-1 block text-xs leading-relaxed text-slate-500">
                                            Let the scheduler select the best available volunteer nodes.
                                        </span>
                                    </span>
                                </label>

                                <div className="rounded-xl bg-slate-50 p-4">
                                    <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                                        <Database size={16} />

                                        MVP Network
                                    </div>

                                    <p className="mt-2 text-xs leading-relaxed text-slate-500">
                                        This deployment can currently use up to 3 connected laptops in the Lattice network.
                                    </p>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="mt-8 w-full rounded-xl bg-indigo-600 px-5 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
                            >
                                Create Deployment
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default CreateDeployment