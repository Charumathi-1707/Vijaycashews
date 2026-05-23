import MainLayout from "../../layouts/MainLayout";
import Section1 from "./components/Section1";
import Section2 from "./components/Section2";

const Contact = () => {
  return (
    <MainLayout>
      <section className="bg-gray-50 px-6 py-24">
        <div className="mx-auto max-w-7xl grid gap-10 lg:grid-cols-2">
          <Section1 />
          <Section2 />
        </div>
      </section>
    </MainLayout>
  );
};

export default Contact;
