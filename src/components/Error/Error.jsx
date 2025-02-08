export default function Error() {
  return (
    <div className="text-center">
      <div className="mb-4">
        <i className="fas fa-exclamation-circle text-4xl"></i>
      </div>
      <h2 className="text-2xl font-bold mb-2">Something went wrong</h2>
      <p className="text-gray-600">Please try again later</p>
    </div>
  );
}
