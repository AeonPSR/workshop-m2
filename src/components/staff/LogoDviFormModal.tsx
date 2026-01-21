import { useState, useEffect } from "react";
import { getThumbnailURL } from "@/lib/utils/methods";
type LogoDivData = {
  name: string;
  image: string;
  initials: string;
};

type LogoDivFormModalProps = {
  open: boolean;
  onClose: () => void;
  onAddOrUpdate: (logoDivision: LogoDivData) => void;
  initialValues?: Partial<LogoDivData>;

};



export default function LogoDviFormModal({
  open,
  onClose,
  onAddOrUpdate,
  initialValues ,
}: LogoDivFormModalProps) {
  const [name, setName] = useState(initialValues?.name || "");
  const [image, setImage] = useState(initialValues?.image || "");
  const [initials, setInitials] = useState(initialValues?.initials || "");


    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = await getThumbnailURL(file)
      setImage(imageUrl); 
    }
  };
  
  useEffect(() => {
  setName(initialValues?.name || "");
  setImage(initialValues?.image || "");
  setInitials(initialValues?.initials || "");
}, [initialValues]);

  const handleSubmit = () => {
    if (!name || !image || !initials) return alert("Veuillez remplir tous les champs");
    onAddOrUpdate({ name, image, initials });
    setName("");
    setImage("");
    setInitials("");
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl">
        <h2 className="text-lg font-bold text-gray-900 mb-4">{initialValues ? "Modifier" : "Ajouter"} un logo de division </h2>

        <div className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Nom"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <input
            type="text"
            placeholder="Initials"
            value={initials}
            onChange={(e) => setInitials(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            Annuler
          </button>
          <button
            onClick={handleSubmit}
            className="rounded-lg px-4 py-2 bg-[#ff9228] text-white font-medium hover:bg-orange-600"
          >

            

              {initialValues ? "Modifier" : "Ajouter"}

          </button>
        </div>
      </div>
    </div>
  );
}
