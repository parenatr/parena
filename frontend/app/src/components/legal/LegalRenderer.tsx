import type { LegalDocument } from "@/data/legal/types";

interface LegalRendererProps {
  document: LegalDocument;
}

export function LegalRenderer({ document }: LegalRendererProps) {
  return (
    <div className="space-y-8">

      
        <h2 className="text-2xl font-bold text-deep">
          {document.title}
        </h2>

        {document.description && (
          <p className="text-sm text-muted-foreground">
            {document.description}
          </p>
        )}
      
      {document.sections.map((section, index) => (
        <section
          key={index}
          className="space-y-3"
        >
          {section.heading && (
            <h3 className="text-lg font-semibold text-deep">
              {section.heading}
            </h3>
          )}

          {section.paragraphs?.map((paragraph) => (
            <p
              key={paragraph}
              className="leading-7 text-muted-foreground"
            >
              {paragraph}
            </p>
          ))}

          {section.items && (
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              {section.items.map((item) => (
                <li key={item}>
                  {item}
                </li>
              ))}
            </ul>
          )}

          {section.highlight && (
            <div className="rounded-lg border-l-4 border-deep bg-surface p-4 italic text-muted-foreground">
              {section.highlight}
            </div>
          )}

          {section.table && (
            <div className="overflow-x-auto rounded-lg border border-divider">
              <table className="w-full border-collapse">

                <thead className="bg-surface">
                  <tr>
                    {section.table.headers.map((header) => (
                      <th
                        key={header}
                        className="border-b border-divider px-4 py-3 text-left font-semibold"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {section.table.rows.map((row, rowIndex) => (
                    <tr
                      key={rowIndex}
                      className="border-b border-divider last:border-none"
                    >
                      {row.map((cell, cellIndex) => (
                        <td
                          key={cellIndex}
                          className="px-4 py-3 align-top"
                        >
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>

              </table>
            </div>
          )}
        </section>
      ))}
    </div>
  );
}