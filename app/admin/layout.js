import '@/app/globals.css'

export const metadata = {
    title: "Admin Dashboard",
}

export default function RootLayout({
    children,
}) {
    return (
        <>
            {children}
        </>
    )
}
