const MobileMenu = ({
  navigation,
  open,
}) => {
  if (!open) return null;

  return (
    <div className="border-t bg-white px-6 py-6 md:hidden">

      <div className="space-y-5">

        {navigation.map((item) => (
          <a
            key={item.label}
            href={item.href}
            className="block text-lg font-medium text-gray-700"
          >
            {item.label}
          </a>
        ))}
      </div>
    </div>
  );
};

export default MobileMenu;