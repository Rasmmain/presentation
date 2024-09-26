const Modal = ({ title, setTitle, createPresentation, closeModal }) => {
  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-lg w-1/3">
        <h2 className="text-2xl mb-4">Create New Presentation</h2>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter presentation title"
          className="border p-2 mb-4 w-full"
        />
        <div className="flex justify-end space-x-2">
          <button
            onClick={closeModal}
            className="bg-gray-500 text-white p-2 rounded hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={createPresentation}
            className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
