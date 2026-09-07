import {
    LayoutDashboard,
    Rocket,
    Store,
    Network,
    FileStack,
    Wallet,
    MonitorCog
} from 'lucide-react'

import { NavLink } from 'react-router-dom'

const navigation = [
    {
        name: 'Overview',
        path: '/dashboard',
        icon: LayoutDashboard
    },
    {
        name: 'Deployments',
        path: '/deployments',
        icon: Rocket
    },
    {
        name: 'Marketplace',
        path: '/marketplace',
        icon: Store
    },
    {
        name: 'Network',
        path: '/network',
        icon: Network
    },
    {
        name: 'Leases',
        path: '/leases',
        icon: FileStack
    },
    {
        name: 'Credits',
        path: '/credits',
        icon: Wallet
    }
]

function Sidebar()
{
    return (
        <aside className="fixed left-0 top-0 flex h-screen w-64 flex-col border-r border-slate-200 bg-white">
            <div className="flex h-20 items-center gap-3 border-b border-slate-100 px-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 font-bold text-white">
                    L
                </div>

                <div>
                    <h1 className="text-lg font-semibold text-slate-900">
                        Lattice
                    </h1>

                    <p className="text-xs text-slate-500">
                        Volunteer Compute
                    </p>
                </div>
            </div>

            <nav className="flex-1 space-y-1 px-4 py-6">
                {navigation.map((item) =>
                {
                    const Icon = item.icon

                    return (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                `flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition ${
                                    isActive
                                        ? 'bg-indigo-50 text-indigo-700'
                                        : 'text-slate-600 hover:bg-slate-100'
                                }`
                            }
                        >
                            <Icon size={19} />

                            {item.name}
                        </NavLink>
                    )
                })}
            </nav>

            <div className="border-t border-slate-100 p-4">
                <NavLink
                    to="/node-dashboard"
                    className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
                >
                    <MonitorCog size={19} />

                    My Node
                </NavLink>
            </div>
        </aside>
    )
}

export default Sidebar