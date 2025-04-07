export default function PostGuideline() {
  return (
    <div className="grid gap-1 rounded-lg bg-textBorderLight px-4 py-2 font-medium text-text">
      <p className="text-sm font-bold">📌 File Upload Guidelines</p>
      <p className="font-s text-xs">
        ・Maximum file size: <span className="font-bold">8MB</span> per file
        <br />
        ・Maximum number of files: <span className="font-bold">20</span>
      </p>
    </div>
  );
}
