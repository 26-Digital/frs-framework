
// import { ChartAreaInteractive } from "@/components/chart-area-interactive"
// import { DataTable } from "@/components/data-table"
// import { SectionCards } from "@/components/section-cards"

// import data from "./data.json"
import AdminPanel from "@/components/admin/AdminPanel"
import CustomerPanel from "@/components/customer/CustomerPanel"
import { getUserData } from "@/lib/get-user-data"
console.log("User Data:", getUserData())
export default function Page() {
  const user = getUserData()
  const userRole = user?.role || "customer"
  if (userRole !== "admin") {
    return <AdminPanel/>
  } else if (userRole === "customer") {
    return <CustomerPanel />
  }
}
