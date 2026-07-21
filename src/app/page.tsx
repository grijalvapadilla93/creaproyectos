import dynamic from 'next/dynamic';

const SkyClinicsHero = dynamic(() => import('@/components/SkyClinicsHero'), {
  ssr: false,
  loading: () => (
    <div className="fixed inset-0 flex items-center justify-center bg-[#F7F6F2] z-50">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 rounded-full border-2 border-[#3C6E80] border-t-transparent animate-spin" />
        <p className="text-[#3C6E80] text-[10px] tracking-[0.2em] font-medium">CARGANDO</p>
      </div>
    </div>
  ),
});

export default function Home() {
  return <SkyClinicsHero />;
}
