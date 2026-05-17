const REFERENCES = [
  { label: "AP", description: "Apariciones" },
  { label: "SUB", description: "Suplencias" },
  { label: "G", description: "Goles" },
  { label: "A", description: "Asistencias" },
  { label: "TT", description: "Tiros totales" },
  { label: "TM", description: "Tiros al arco" },
  { label: "FC", description: "Faltas cometidas" },
  { label: "FS", description: "Faltas sufridas" },
  { label: "TA", description: "Tarjetas amarillas" },
  { label: "TR", description: "Tarjetas rojas" },
  { label: "AT", description: "Atajadas" },
  { label: "GA", description: "Goles concedidos" },
  { label: "Est", description: "Estatura" },
  { label: "P", description: "Peso" },
  { label: "Pos", description: "Posición" },
  { label: "Nac", description: "Nacionalidad" },
];

export function PlantelReferences() {
  return (
    <div className="rounded-3xl border border-sky-100 bg-gradient-to-br from-sky-50 via-white to-cyan-50 p-4 shadow-sm">
      <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-slate-700 ml-2">
        Referencias
      </p>

      <div className="ml-2 grid grid-cols-2 gap-2 text-xs font-medium text-slate-600 md:grid-cols-3 xl:grid-cols-4">
        {REFERENCES.map((item) => (
          <div key={item.label}>
            <span className="font-semibold text-slate-800">{item.label}</span>{" "}
            = {item.description}
          </div>
        ))}
      </div>
    </div>
  );
}
