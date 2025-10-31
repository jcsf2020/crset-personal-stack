import mascotes from '@/data/mascotes';
import MascoteCard from './MascoteCard';

export default function MascotesSection() {
  return (
    <section id="mascotes" className="py-16 md:py-20 bg-[rgb(var(--bg))]">
      <div className="container-pro">
        <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-2">Conheça as Nossas Mascotes</h2>
        <p className="text-center text-blue-200 mb-8 md:mb-10">Boris • Laya • Irina</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {mascotes.map((m) => (<MascoteCard key={m.id} m={m} />))}
        </div>
      </div>
    </section>
  );
}
