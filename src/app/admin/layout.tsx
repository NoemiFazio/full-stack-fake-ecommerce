import { Nav, NavLink } from "@/components/Nav/Nav";

// this code doesn't let caching of the admin page data, so that it will always be up to date whenever the page is loaded
export const dynamic = "force-dynamic";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Nav>
        <NavLink href="/admin">Dashboard</NavLink>
        <NavLink href="/admin/products">Products</NavLink>
        <NavLink href="/admin/users">Customers</NavLink>
        <NavLink href="/admin/products">Sales</NavLink>
      </Nav>
      <div className="container my-6">{children}</div>
    </>
  );
}
