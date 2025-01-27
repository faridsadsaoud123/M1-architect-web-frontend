import { ReactNode } from "react"

type Props<TData extends Record<string, any>> = {
  data?: TData[]
  columns: {
    // keyof TData signifie que l'on sait que ça 
    // les clés possibles proviennent de l'objet
    // l'ajout de | string permet d'informer que n'importe
    // quel string est possible.
    // L'ajout de & {} permet de garder l'auto-complétion, petit hack TS.
    key: keyof TData | (string & {})
    label: string
    render?: (data: TData) => ReactNode
  }[]
  onRowClick?: (row: TData) => void
}

export const Table = <T extends Record<string, any>>({
  data,
  columns,
  onRowClick,
}: Props<T>) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-200">
          <tr>
            {columns.map((column) => (
              <th
                key={String(column.key)}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase "
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data?.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className="bg-gray-50 hover:bg-gray-100 cursor-pointer"
              onClick={() => onRowClick && onRowClick(row)}
            >
              {columns.map((column) => (
                <td
                  key={String(column.key)}
                  className="px-6 py-4 whitespace-nowrap"
                >
                  {column.render ? column.render(row) : row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
