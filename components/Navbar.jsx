import Link from "next/link";

export const Navbar = () => {
  return (
    <div className="p-4 bg-sky-300 flex justify-between items-center">
      <span className="text-xl font-semibold">Home Security</span>
      <div className="space-x-4">
        <Link href="/" className="text-white hover:text-gray-200">
          Home
        </Link>
        <Link href="/facecapture" className="text-white hover:text-gray-200">
          Save Faces
        </Link>
        <Link href="/facecapture2" className="text-white hover:text-gray-200">
          Save Faces 2
        </Link>
      </div>
    </div>
  );
};
