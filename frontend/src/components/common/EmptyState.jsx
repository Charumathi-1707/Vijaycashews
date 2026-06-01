import { Link } from "react-router-dom";

const EmptyState = ({ title, description, actionText, actionLink }) => {
  return (
    <div className="rounded-3xl bg-white p-12 text-center shadow-lg">
      <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
      <p className="mt-4 text-gray-600">{description}</p>
      <Link
        to={actionLink}
        className="mt-8 inline-flex rounded-full bg-yellow-700 px-8 py-4 text-white transition hover:bg-yellow-800"
      >
        {actionText}
      </Link>
    </div>
  );
};

export default EmptyState;
