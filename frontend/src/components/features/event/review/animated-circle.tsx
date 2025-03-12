export default function AnimatedCircle() {
  return (
    <div
      style={{
        borderRadius: "55% 45% 74% 26% / 66% 32% 68% 34%",
        backgroundImage: "radial-gradient(#fff 0%, #B9DFDB 100%)",
      }}
      className="animate-corners h-[480px] w-[480px] transform rounded-full bg-gradient-to-r from-accentGreenLight to-accentGreen opacity-50"
    ></div>
  );
}
