import DashboardCard from "../components/DashBoardCard";

function AdminPage() {
  return (
    <div>
      <DashboardCard
        title={"add admin"}
        icon={"😎"}
        color={"Lightgreen"}
        route="/"
      />
    </div>
  );
}

export default AdminPage;
