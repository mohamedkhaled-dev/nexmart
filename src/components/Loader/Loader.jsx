import { ClipLoader } from "react-spinners";

export default function Loader({
  size = 35,
  color = "#000",
}) {
  return (
    <>
      <div className="text-center">
        <ClipLoader color={color} size={size} className="mx-auto mb-4" />
      </div>
    </>
  );
}
