import MainLayout from "../../layouts/MainLayout";

import Section1 from "./components/Section1";
import Section2 from "./components/Section2";

const Checkout = () => {
  return (
    <MainLayout>

      <section className="min-h-screen bg-gray-50 px-6 py-32">

        <div className="mx-auto max-w-7xl">

          <h1 className="text-5xl font-bold">
            Checkout
          </h1>

          <div className="mt-12 grid gap-10 lg:grid-cols-2">
            <Section1 />
            <Section2 />
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Checkout;