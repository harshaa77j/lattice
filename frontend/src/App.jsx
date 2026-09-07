import { Routes, Route, Navigate } from 'react-router-dom'
import AppLayout from './components/layout/AppLayout'

import Dashboard from './pages/Dashboard'
import Deployments from './pages/Deployments'
import CreateDeployment from './pages/CreateDeployment'
import DeploymentDetails from './pages/DeploymentDetails'
import Marketplace from './pages/Marketplace'
import Network from './pages/Network'
import Leases from './pages/Leases'
import Credits from './pages/Credits'
import NodeDashboard from './pages/NodeDashboard'

function App()
{
    return (
        <Routes>
            <Route element={<AppLayout />}>
                <Route
                    path="/dashboard"
                    element={<Dashboard />}
                />

                <Route
                    path="/deployments"
                    element={<Deployments />}
                />

                <Route
                    path="/deployments/new"
                    element={<CreateDeployment />}
                />

                <Route
                    path="/deployments/:id"
                    element={<DeploymentDetails />}
                />

                <Route
                    path="/marketplace"
                    element={<Marketplace />}
                />

                <Route
                    path="/network"
                    element={<Network />}
                />

                <Route
                    path="/leases"
                    element={<Leases />}
                />

                <Route
                    path="/credits"
                    element={<Credits />}
                />

                <Route
                    path="/node-dashboard"
                    element={<NodeDashboard />}
                />
            </Route>

            <Route
                path="/"
                element={
                    <Navigate
                        to="/dashboard"
                        replace
                    />
                }
            />
        </Routes>
    )
}

export default App