import { PropsWithChildren } from "react"
// import { ReactNode } from "react"
// type ErrorMesaggeProps = {
//     children: ReactNode
// }

export default function ErrorMessage({children}: PropsWithChildren) {
  return (
    <p
        className="bg-red-500 p-2 text-white font-bold text-sm text-center rounded-xl"
    >
        {children}
    </p>
  )
}
