import AppLayout from "../../Layout/AppLayout"
import ProtectedRoute from '../../auth/ProtectedRoute';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedRoute>
    <AppLayout>
      {children}
    </AppLayout>
    </ProtectedRoute>
  )
}