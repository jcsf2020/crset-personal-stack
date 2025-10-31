type Props = { title:string; children:React.ReactNode };
export default function Hint({title, children}:Props){
  return (
    <div className="rounded-xl border p-4 bg-white/60">
      <div className="text-sm font-semibold">{title}</div>
      <div className="text-sm opacity-80 mt-1">{children}</div>
    </div>
  );
}
