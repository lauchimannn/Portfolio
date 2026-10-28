interface ResumeModalProps {
  onClose: () => void;
}

export default function ResumeModal({ onClose }: ResumeModalProps) {
  return (
    <div className="resume-modal-overlay" onClick={onClose}>
      <div
        className="resume-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="resume-modal-close"
          onClick={onClose}
          aria-label="Close resume"
        >
          ✕
        </button>

        <iframe
          src="/Choco-Lau_CV.pdf"
          title="Choco Lau Resume"
          className="resume-pdf"
        />
      </div>
    </div>
  );
}