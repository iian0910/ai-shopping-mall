import HeartIcon from "@/components/HeartIcon";

export default function Footer() {
  return (
    <footer className="py-8">
      <div className="mx-auto flex w-full max-w-[1120px] flex-col items-center gap-1 px-4 text-center text-xs text-slate-500 sm:px-6 lg:px-8">
        <span className="flex items-center gap-1">
          © {new Date().getFullYear()} 心靈療癒小窩 · Made with
          <HeartIcon className="h-3 w-3 text-accent" />
        </span>
      </div>
    </footer>
  );
}
