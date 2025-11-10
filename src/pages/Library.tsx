import { useState, useEffect, useRef } from "react";
import { ArrowLeft, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";

interface Disease {
  id: number;
  name: string;
  image: string;
  description: string;
  symptoms: string;
  treatment: string;
}

const diseases: Disease[] = [
  {
    id: 1,
    name: "Tomato Late Blight",
    image: "https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=600",
    description:
      "Late blight is a devastating disease affecting tomato plants, caused by the pathogen Phytophthora infestans.",
    symptoms: "Dark brown spots on leaves, white mold on undersides, rapid plant death",
    treatment: "Remove infected plants, apply copper-based fungicides, improve air circulation",
  },
  {
    id: 2,
    name: "Rice Blast",
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600",
    description: "Rice blast is one of the most serious diseases of rice worldwide.",
    symptoms: "Diamond-shaped lesions on leaves, neck rot, panicle blast",
    treatment: "Use resistant varieties, proper water management, fungicide application",
  },
  {
    id: 3,
    name: "Wheat Rust",
    image: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=600",
    description: "Rust diseases are among the most destructive diseases of wheat.",
    symptoms: "Orange-red pustules on leaves and stems, yellowing of plant tissue",
    treatment: "Plant resistant varieties, timely fungicide application, crop rotation",
  },
  {
    id: 4,
    name: "Potato Blight",
    image: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=600",
    description: "Potato blight rapidly destroys potato crops during wet weather.",
    symptoms: "Dark spots on leaves, white fungal growth, tuber rot",
    treatment: "Preventive fungicide sprays, destroy infected plants, proper spacing",
  },
  {
    id: 5,
    name: "Cotton Wilt",
    image: "https://images.unsplash.com/photo-1615811361523-6bd03d7748e7?w=600",
    description: "Fusarium wilt is a soil-borne disease affecting cotton plants.",
    symptoms: "Yellowing of leaves, wilting of plants, vascular discoloration",
    treatment: "Use resistant varieties, soil solarization, crop rotation",
  },
  {
    id: 6,
    name: "Mango Anthracnose",
    image: "https://images.unsplash.com/photo-1605027990121-cbae9d0c3d86?w=600",
    description: "Anthracnose is a major fungal disease of mango fruits and flowers.",
    symptoms: "Black spots on fruits, flower blight, premature fruit drop",
    treatment: "Prune infected parts, apply fungicides, improve orchard hygiene",
  },
  {
    id: 7,
    name: "Onion Purple Blotch",
    image: "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=600",
    description: "Purple blotch causes significant yield losses in onion crops.",
    symptoms: "Purple-brown lesions on leaves, concentric rings, leaf blight",
    treatment: "Fungicide application, crop rotation, remove crop debris",
  },
  {
    id: 8,
    name: "Sugarcane Red Rot",
    image: "https://images.unsplash.com/photo-1542601098-3adb3b6c4f8f?w=600",
    description: "Red rot is one of the most destructive diseases of sugarcane.",
    symptoms: "Reddening of internal tissues, white fungal patches, stalk hollowing",
    treatment: "Plant disease-free sets, use resistant varieties, proper drainage",
  },
  {
    id: 9,
    name: "Banana Panama Disease",
    image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=600",
    description: "Panama disease is a soil-borne fungal disease affecting banana plantations.",
    symptoms: "Yellowing of older leaves, splitting of pseudostem, plant death",
    treatment: "Use resistant varieties, practice quarantine, soil sterilization",
  },
  {
    id: 10,
    name: "Grape Downy Mildew",
    image: "https://images.unsplash.com/photo-1599819177818-c28e1f4d6a0b?w=600",
    description: "Downy mildew is a serious disease of grapevines in humid regions.",
    symptoms: "Oil spots on leaves, white downy growth on undersides, fruit rot",
    treatment: "Fungicide sprays, improve air circulation, remove infected leaves",
  },
];

// Reusable Modal with bulletproof centering, escape-to-close, a11y, and nice motion
function Modal({
  open,
  onClose,
  title,
  children,
  blur = true,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  blur?: boolean;
}) {
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);

    // lock background scroll
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";

    // focus the close button when modal mounts
    const id = requestAnimationFrame(() => closeBtnRef.current?.focus());

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
      cancelAnimationFrame(id);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Overlay */}
          <motion.button
            aria-hidden
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={
              `fixed inset-0 z-50 w-full h-full ${
                blur ? "backdrop-blur-sm bg-black/30" : "bg-black/50"
              }`
            }
          />

          {/* Centered modal container */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            className="fixed inset-0 z-50 flex items-center justify-center"
          >
            <div
              className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 overflow-hidden"
            >
              <div className="relative">
                {children}
                <Button
                  ref={closeBtnRef}
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  aria-label="Close"
                  className="absolute top-3 right-3 bg-white/90 hover:bg-white"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default function Library() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [selectedDisease, setSelectedDisease] = useState<Disease | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-b from-muted/30 to-background">
      {/* Header */}
      <div className="bg-primary text-white p-4 shadow-lg sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/")}
            className="text-white hover:bg-white/20"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">{t.library.title}</h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {diseases.map((disease, index) => (
            <motion.div
              key={disease.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => setSelectedDisease(disease)}
              className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl cursor-pointer"
            >
              <img
                src={disease.image}
                alt={disease.name}
                loading="lazy"
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-xl font-bold text-primary">{disease.name}</h3>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Modal */}
      <Modal
        open={!!selectedDisease}
        onClose={() => setSelectedDisease(null)}
        title={selectedDisease?.name ?? ""}
        blur
      >
        {selectedDisease && (
          <>
            <img
              src={selectedDisease.image}
              alt={selectedDisease.name}
              className="w-full h-64 object-cover"
            />
            <div className="p-6 max-h-[60vh] overflow-y-auto">
              <h2 id="modal-title" className="text-3xl font-bold text-primary mb-4">
                {selectedDisease.name}
              </h2>
              <div className="space-y-4">
                <section>
                  <h3 className="text-xl font-bold text-secondary mb-2">Description</h3>
                  <p className="text-muted-foreground">{selectedDisease.description}</p>
                </section>
                <section>
                  <h3 className="text-xl font-bold text-secondary mb-2">Symptoms</h3>
                  <p className="text-muted-foreground">{selectedDisease.symptoms}</p>
                </section>
                <section>
                  <h3 className="text-xl font-bold text-secondary mb-2">Treatment</h3>
                  <p className="text-muted-foreground">{selectedDisease.treatment}</p>
                </section>
              </div>
            </div>
          </>
        )}
      </Modal>
    </div>
  );
}
