import MainLayout from "../../layouts/MainLayout";
import useAuth from "../../hooks/useAuth";

const Profile = () => {
  const { user } = useAuth();

  return (
    <MainLayout>
      <section className="min-h-[calc(100vh-6rem)] bg-gray-50 py-24 px-6">
        <div className="mx-auto max-w-3xl rounded-3xl bg-white p-10 shadow-md">
          <h1 className="text-4xl font-bold text-gray-900">My Profile</h1>
          <p className="mt-3 text-gray-600">Manage your account details and view your role information.</p>

          <div className="mt-10 space-y-6 rounded-3xl bg-yellow-50 p-8">
            <div>
              <p className="text-sm uppercase tracking-wide text-gray-600">Name</p>
              <p className="mt-2 text-xl font-semibold text-gray-900">{user.name}</p>
            </div>
            <div>
              <p className="text-sm uppercase tracking-wide text-gray-600">Email</p>
              <p className="mt-2 text-xl font-semibold text-gray-900">{user.email}</p>
            </div>
            <div>
              <p className="text-sm uppercase tracking-wide text-gray-600">Role</p>
              <p className="mt-2 rounded-3xl bg-white p-4 text-xl font-semibold text-yellow-800">{user.role}</p>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Profile;
